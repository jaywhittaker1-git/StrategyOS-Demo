# Competitive Intelligence Architecture: Sandbox & Promotion Model
## StrategyOS Competitive Landscape Implementation Spec v2.0

**Date:** 2025-04-26  
**Status:** Implementation Required  
**Priority:** High - Enables core competitive intelligence capability  
**Supersedes:** competitive-intelligence-refactor-spec.md v1.0

---

## Executive Summary

### Core Architectural Principle

**The Competitive Landscape asset is a walled research sandbox.** 

- All competitor intelligence lives inside the landscape
- Signals attach to the landscape (asset-level or per-competitor via sub-entity)
- Intelligence generation happens within landscape scope
- **Nothing pollutes the strategy graph unless explicitly promoted**
- User controls what competitive intelligence becomes strategic intelligence

### Why This Matters

**Prevents intelligence pollution:**
- Strategy briefings don't drown in competitor noise
- Coherence checking doesn't confuse their assumptions with ours
- Entity graph stays clean (no auto-linking competitor capabilities to our components)
- Intelligence feed shows strategic signals, not every competitor tweet

**Gives users control:**
- User decides which competitive signals affect our strategy
- Explicit promotion workflow with reasoning capture
- Clear provenance: "This risk originated from Startmate's funding announcement"

---

## Phase 0: Core Data Model Extensions

### 1. Signal Model Extension

**File:** Signal model definition

**Add these fields:**

```python
class Signal(BaseModel):
    id: str
    strategy_id: str
    asset_id: Optional[str]  # None = strategy-level signal
    
    # Sub-entity scoping (for competitor-specific signals)
    sub_entity_id: Optional[str] = None
    """
    Identifier for sub-entity within an asset.
    Example: "Startmate" (competitor name in Competitive Landscape)
    """
    
    sub_entity_type: Optional[str] = None
    """
    Type of sub-entity.
    Example: "competitor", "stakeholder", "journey_stage"
    """
    
    # NEW: Signal containment
    scope: str = "competitive"
    """
    Signal scope determines where it appears:
    - "competitive": Lives in Competitive Landscape only
    - "strategy": Appears in strategy-level briefings and feeds
    - "execution": Initiative/OKR execution signals
    
    Default is "competitive" for landscape signals.
    """
    
    # NEW: Promotion tracking
    promoted_to_strategy: bool = False
    """Whether this signal has been promoted to strategy level."""
    
    promotion_note: Optional[str] = None
    """User's explanation of why this matters strategically."""
    
    source_signal_id: Optional[str] = None
    """
    If this is a promoted signal, links back to the original competitive signal.
    Allows navigation: strategy signal → original competitive context.
    """
    
    # Existing fields
    title: str
    description: str
    signal_type: str  # "competitive", "risk", "opportunity", "validation", "falsification"
    severity: str
    created_at: datetime
```

**Migration:**

```sql
-- Add new columns (all nullable for backward compatibility)
ALTER TABLE signals 
ADD COLUMN sub_entity_id VARCHAR(255) NULL,
ADD COLUMN sub_entity_type VARCHAR(50) NULL,
ADD COLUMN scope VARCHAR(50) DEFAULT 'competitive',
ADD COLUMN promoted_to_strategy BOOLEAN DEFAULT FALSE,
ADD COLUMN promotion_note TEXT NULL,
ADD COLUMN source_signal_id VARCHAR(255) NULL;

-- Add indexes
CREATE INDEX idx_signals_sub_entity ON signals(asset_id, sub_entity_id, sub_entity_type);
CREATE INDEX idx_signals_scope ON signals(strategy_id, scope);
CREATE INDEX idx_signals_promoted ON signals(promoted_to_strategy, source_signal_id);

-- Existing signals get default scope based on asset type
UPDATE signals 
SET scope = 'strategy' 
WHERE asset_id IN (
    SELECT id FROM assets WHERE asset_type != 'competitive_landscape'
);

UPDATE signals 
SET scope = 'competitive' 
WHERE asset_id IN (
    SELECT id FROM assets WHERE asset_type = 'competitive_landscape'
);
```

### 2. Entity Model Extension (For Future Cross-Asset Intelligence)

**File:** Entity model definition

```python
class Entity(BaseModel):
    id: str
    name: str
    entity_type: str  # "capability", "component", "assumption", etc.
    
    # NEW: Scope containment
    scope: str = "strategy"
    """
    Entity scope determines linking behavior:
    - "strategy": Our strategy entities (can link to each other)
    - "competitive": Competitor entities (stay in landscape)
    - "market": Market-level entities (shared context)
    
    Tier 2 edges only created between entities with matching scope.
    Cross-scope links require explicit promotion.
    """
    
    source_asset_id: str
    source_sub_entity_id: Optional[str] = None
    """If entity came from a competitor, track which one."""
```

---

## Phase 1: Competitive Landscape Data Model

### Competitor Model Extensions

**Keep existing structure, add new fields:**

```python
class CompetitiveLandscapeData(BaseModel):
    competitors: List[Competitor]
    market_trends: List[str] = []
    collective_assumptions: List[str] = []
    """Market-wide beliefs (e.g., 'AI will commoditize content creation')"""


class Competitor(BaseModel):
    name: str  # This is the sub_entity_id for signals
    core_bet: str
    
    # Split dependencies from assumptions
    dependencies: List[str] = []
    """
    Structural requirements for their strategy to work.
    Example: "Corporate partnerships", "Alumni network effects"
    Not testable - just requirements.
    """
    
    assumptions: List[Assumption] = []
    """
    Beliefs that could be wrong (testable/falsifiable).
    Example: "Founders value brand over ROI", "Cohort model scales profitably"
    These can be validated or falsified by signals.
    """
    
    capability_gaps: List[CapabilityGap] = []
    """
    What they structurally cannot do.
    Used for response prediction.
    """
    
    movement_trajectory: Optional[MovementTrajectory] = None
    """Where they were → are → heading with evidence."""
    
    # Existing fields
    differentiation_areas: List[str] = []
    standard_areas: List[str] = []
    strategic_direction: str = "Unknown"
    knowledge_gaps: str = ""


class Assumption(BaseModel):
    text: str
    confidence: str = "inferred"  # "provided", "inferred", "generated"
    evidence_signal_ids: List[str] = []
    """Signals that support or challenge this assumption."""
    
    falsification_conditions: List[str] = []
    """What would prove this assumption wrong."""
    
    status: str = "active"  # "active", "validated", "falsified"


class CapabilityGap(BaseModel):
    capability: str
    """What they lack (e.g., "Enterprise sales team", "AI infrastructure")"""
    
    constraint_type: str
    """
    Why they lack it:
    - "structural": Organizational/business model constraint
    - "resource": Money/people constraint
    - "time": Would take too long to build
    - "strategic_choice": Deliberately not building
    """
    
    mitigation_strategy: Optional[str] = None
    """How they might close the gap: "building", "acquiring", "partnering", "ignoring""""
    
    response_capacity: str = "unknown"
    """
    Can they respond to our moves in this area?
    Values: "high", "medium", "low", "none"
    """


class MovementTrajectory(BaseModel):
    previous_position: str
    current_position: str
    direction: str
    confidence: str = "inferred"
    last_updated: datetime
    evidence_signal_ids: List[str] = []
    """Signals that informed this trajectory assessment."""
```

---

## Phase 2: Signal Promotion Workflow

### Core Promotion Function

```python
def promote_signal_to_strategy(
    signal_id: str,
    promotion_note: str,
    strategic_signal_type: str = "risk"
) -> Signal:
    """
    Elevate a competitive signal to strategy-level.
    
    Creates a new strategy-scoped signal that references the original.
    The original competitive signal stays in the landscape (for context)
    but is marked as promoted.
    
    Args:
        signal_id: The competitive signal to promote
        promotion_note: User's explanation of strategic relevance
        strategic_signal_type: "risk", "opportunity", "validation", "falsification"
    
    Returns:
        The new strategy-level signal
    
    Example:
        Original: "Startmate partnered with Google Cloud" (competitive signal)
        Promoted: "Strategic validation: Cloud partnerships are table stakes"
                  (strategy signal, links back to original)
    """
    original_signal = get_signal(signal_id)
    
    # Validation
    if original_signal.scope != "competitive":
        raise ValueError("Only competitive signals can be promoted")
    
    if original_signal.promoted_to_strategy:
        raise ValueError("Signal already promoted")
    
    # Create strategy-level signal
    strategy_signal = create_signal(
        strategy_id=original_signal.strategy_id,
        asset_id=None,  # Strategy-level, not asset-specific
        title=f"Strategic {strategic_signal_type}: {promotion_note}",
        description=f"Promoted from competitive signal: {original_signal.title}\n\n"
                   f"Original context: {original_signal.description}",
        signal_type=strategic_signal_type,
        severity="high",  # Promoted signals are important by definition
        scope="strategy",  # This signal now affects strategy briefings
        source_signal_id=signal_id
    )
    
    # Mark original as promoted
    original_signal.promoted_to_strategy = True
    original_signal.promotion_note = promotion_note
    update_signal(original_signal)
    
    return strategy_signal


def unpromote_signal(strategy_signal_id: str):
    """
    Remove a promoted signal from strategy level.
    
    Deletes the strategy signal and unmarks the original competitive signal.
    Used when user realizes a competitive signal isn't strategically relevant.
    """
    strategy_signal = get_signal(strategy_signal_id)
    
    if not strategy_signal.source_signal_id:
        raise ValueError("This is not a promoted signal")
    
    # Unmark original
    original_signal = get_signal(strategy_signal.source_signal_id)
    original_signal.promoted_to_strategy = False
    original_signal.promotion_note = None
    update_signal(original_signal)
    
    # Delete strategy signal
    delete_signal(strategy_signal_id)
```

### Query Functions

```python
def get_promoted_signals(landscape_asset_id: str) -> List[Signal]:
    """Get all competitive signals that have been promoted to strategy."""
    return db.query(Signal).filter(
        Signal.asset_id == landscape_asset_id,
        Signal.promoted_to_strategy == True
    ).all()


def get_strategy_level_signals(strategy_id: str) -> List[Signal]:
    """
    Get all signals that appear in strategy-level briefings.
    
    Includes:
    - Signals with scope="strategy" (promoted competitive signals)
    - Signals with scope="execution" (initiative updates, OKR progress)
    
    Excludes:
    - Signals with scope="competitive" (unless promoted)
    """
    return db.query(Signal).filter(
        Signal.strategy_id == strategy_id,
        Signal.scope.in_(["strategy", "execution"])
    ).all()


def get_competitive_signals(
    landscape_asset_id: str,
    competitor_name: Optional[str] = None,
    include_promoted: bool = True
) -> List[Signal]:
    """
    Get competitive signals from the landscape.
    
    Args:
        landscape_asset_id: The competitive landscape asset
        competitor_name: Filter to specific competitor (sub_entity_id)
        include_promoted: Include signals that have been promoted to strategy
    
    Returns:
        List of competitive signals
    """
    query = db.query(Signal).filter(
        Signal.asset_id == landscape_asset_id,
        Signal.scope == "competitive"
    )
    
    if competitor_name:
        query = query.filter(Signal.sub_entity_id == competitor_name)
    
    if not include_promoted:
        query = query.filter(Signal.promoted_to_strategy == False)
    
    return query.order_by(Signal.created_at.desc()).all()
```

---

## Phase 3: Briefing Scoping & Generation

### Strategy-Level Briefing (Clean, No Pollution)

```python
def generate_strategy_briefing(strategy_id: str) -> str:
    """
    Generate strategy briefing using only strategy-scoped signals.
    
    Competitive landscape is mentioned in summary form only.
    Individual competitive signals don't appear unless promoted.
    """
    # Get our strategy assets (excluding landscape)
    our_assets = get_strategy_assets(
        strategy_id=strategy_id,
        exclude_types=["competitive_landscape"]
    )
    
    # Get strategy-level signals (includes promoted competitive signals)
    signals = get_strategy_level_signals(strategy_id)
    
    # Get competitive landscape summary (not full detail)
    landscape = get_landscape_asset(strategy_id)
    landscape_summary = generate_landscape_summary(landscape)
    
    # Build LLM context
    context = f"""
# Strategy Briefing Context

## Our Strategy Assets
{format_assets(our_assets)}

## Strategy-Level Signals
{format_signals(signals)}

## Competitive Context (Summary)
{landscape_summary}

---

Generate a strategic intelligence briefing focused on OUR strategy state.

Include:
1. Strategic health assessment (coherence, execution, risks)
2. Key signals and their implications for our strategy
3. Initiative progress and blockers
4. Strategic risks requiring attention

The competitive landscape is background context. Focus on our strategic position,
execution quality, and what we need to decide or act on.

If any signals were promoted from competitive landscape, note their strategic
implication clearly.
"""
    
    briefing = call_llm_for_briefing(context)
    return briefing


def generate_landscape_summary(landscape_asset: Asset) -> str:
    """
    Generate a brief competitive context summary for strategy briefing.
    
    NOT a full competitive briefing - just key facts.
    """
    competitors_count = len(landscape_asset.data.competitors)
    promoted_count = count_promoted_signals(landscape_asset.id)
    
    summary = f"""
Competitive Landscape Overview:
- {competitors_count} competitors tracked
- {promoted_count} competitive signals elevated to strategic importance
- Landscape last updated: {landscape_asset.updated_at}

For detailed competitive intelligence, see the Competitive Landscape asset.
"""
    return summary
```

### Competitive Landscape Briefing (All Competitive Intelligence)

```python
def generate_landscape_briefing(landscape_asset_id: str) -> str:
    """
    Generate competitive intelligence briefing within landscape scope.
    
    This is the full competitive analysis - all signals, all competitors,
    all market dynamics. Lives inside the landscape asset.
    """
    landscape = get_asset(landscape_asset_id)
    
    # Get ALL competitive signals (promoted or not)
    all_signals = get_competitive_signals(
        landscape_asset_id,
        include_promoted=True
    )
    
    # Get signal counts per competitor
    signal_counts = get_signal_counts_by_competitor(landscape_asset_id)
    
    # Get promoted signals (for highlighting)
    promoted = get_promoted_signals(landscape_asset_id)
    
    context = f"""
# Competitive Intelligence Briefing

## Competitive Landscape
Total Competitors: {len(landscape.data.competitors)}

{format_competitors_detail(landscape.data.competitors)}

## Market Trends
{format_market_trends(landscape.data.market_trends)}

## Collective Market Assumptions
{format_collective_assumptions(landscape.data.collective_assumptions)}

## Competitive Signals
Total Signals: {len(all_signals)}
Promoted to Strategy: {len(promoted)}

{format_signals_by_competitor(all_signals, signal_counts)}

## Recent Activity
{format_recent_signals(all_signals, days=7)}

---

Generate a competitive intelligence briefing.

Include:
1. Market structure and competitive clusters
2. Competitor momentum (who's accelerating vs stagnating)
3. Strategic vulnerabilities across competitors
4. White space opportunities
5. Threats to monitor
6. Signals that should be considered for promotion to strategy level

Flag any competitive developments that have strategic implications we should
consider promoting to our strategy briefing.
"""
    
    briefing = call_llm_for_briefing(context)
    return briefing


def get_signal_counts_by_competitor(landscape_asset_id: str) -> Dict[str, int]:
    """Count signals per competitor for roster badges."""
    counts = db.query(
        Signal.sub_entity_id,
        func.count(Signal.id).label("count")
    ).filter(
        Signal.asset_id == landscape_asset_id,
        Signal.sub_entity_type == "competitor",
        Signal.sub_entity_id.isnot(None)
    ).group_by(Signal.sub_entity_id).all()
    
    return {competitor: count for competitor, count in counts}
```

---

## Phase 4: Coherence & Cross-Asset Intelligence

### Coherence Checking (Excludes Landscape)

```python
def run_coherence_check(strategy_id: str) -> List[Conflict]:
    """
    Check coherence between our strategy assets.
    
    EXCLUDES competitive landscape - that's not part of our strategy,
    it's our intelligence about the market.
    """
    our_assets = get_strategy_assets(
        strategy_id=strategy_id,
        exclude_types=["competitive_landscape"]
    )
    
    conflicts = []
    
    # Check our Decision Stack against our Wardley Map
    conflicts.extend(check_decision_wardley_coherence(our_assets))
    
    # Check our OKRs against our Capabilities
    conflicts.extend(check_okr_capability_coherence(our_assets))
    
    # Check our Stakeholder Architecture against our Initiatives
    conflicts.extend(check_stakeholder_initiative_coherence(our_assets))
    
    # DON'T check our strategy against competitor assumptions
    # That's handled by competitive positioning analysis (separate)
    
    return conflicts
```

### Competitive Positioning Analysis (Separate from Coherence)

```python
def analyze_competitive_positioning(strategy_id: str) -> Dict:
    """
    Analyze how our strategy positions us relative to competitors.
    
    This is NOT coherence checking - it's a different type of analysis.
    Shows where we're contrarian, convergent, or in white space.
    """
    # Extract our strategic position
    our_position = extract_our_position(strategy_id)
    
    # Extract competitor positions
    landscape = get_landscape_asset(strategy_id)
    competitor_positions = extract_competitor_positions(landscape)
    
    # Analyze positioning
    analysis = {
        "contrarian_bets": analyze_contrarian_positioning(
            our_position,
            competitor_positions
        ),
        "convergent_areas": analyze_convergence(
            our_position,
            competitor_positions
        ),
        "white_space_opportunities": identify_white_space(
            our_position,
            competitor_positions
        ),
        "collision_zones": identify_direct_competition(
            our_position,
            competitor_positions
        ),
        "market_consensus": identify_market_assumptions(
            competitor_positions
        )
    }
    
    return analysis


def analyze_contrarian_positioning(
    our_position: Dict,
    competitor_positions: List[Dict]
) -> List[Dict]:
    """
    Find where our assumptions/strategy contradict the market.
    
    Returns list of contrarian bets with:
    - Our assumption
    - Market consensus (what competitors assume)
    - Risk if market is right
    - Advantage if we're right
    """
    contrarian_bets = []
    
    # Extract our assumptions
    our_assumptions = our_position.get("assumptions", [])
    
    # Extract market assumptions
    market_assumptions = extract_collective_assumptions(competitor_positions)
    
    # Find contradictions
    for our_assumption in our_assumptions:
        for market_assumption in market_assumptions:
            if assumptions_contradict(our_assumption, market_assumption):
                contrarian_bets.append({
                    "our_bet": our_assumption,
                    "market_consensus": market_assumption,
                    "competitors_aligned": count_competitors_with_assumption(
                        market_assumption,
                        competitor_positions
                    ),
                    "risk_if_market_right": assess_downside(our_assumption),
                    "advantage_if_we_right": assess_upside(our_assumption)
                })
    
    return contrarian_bets
```

### Response Prediction

```python
def predict_competitor_responses(
    our_planned_move: str,
    affected_component: str,
    landscape_asset_id: str
) -> List[Dict]:
    """
    Predict which competitors can/will respond to our strategic move.
    
    Based on:
    1. Their capability gaps (can they structurally respond?)
    2. Their strategic direction (will they prioritize responding?)
    3. Their current signals (do they have bandwidth?)
    
    Returns:
        List of competitor response predictions
    """
    landscape = get_asset(landscape_asset_id)
    predictions = []
    
    for competitor in landscape.data.competitors:
        # Assess capability to respond
        can_respond = not has_blocking_capability_gap(
            competitor,
            required_for=our_planned_move
        )
        
        # Assess strategic priority
        will_respond = threatens_their_core_bet(
            our_planned_move,
            competitor.core_bet
        )
        
        # Estimate response time
        if can_respond and will_respond:
            response_time = estimate_response_time(competitor, our_planned_move)
        else:
            response_time = "unlikely" if not will_respond else "12+ months (capability gap)"
        
        predictions.append({
            "competitor": competitor.name,
            "can_respond": can_respond,
            "will_respond": will_respond,
            "response_time": response_time,
            "response_capacity": competitor.capability_gaps[0].response_capacity if competitor.capability_gaps else "unknown",
            "reasoning": generate_prediction_reasoning(
                competitor,
                our_planned_move,
                can_respond,
                will_respond
            ),
            "confidence": "medium"
        })
    
    return sorted(predictions, key=lambda x: (x["will_respond"], x["can_respond"]), reverse=True)
```

---

## Phase 5: API Endpoints

### Signal Management Endpoints

```python
# Create competitive signal (stays in landscape)
POST /api/strategies/{strategy_id}/assets/{asset_id}/signals
{
    "title": "Startmate raised $10M Series A",
    "description": "Led by Blackbird, focus on AI startups",
    "signal_type": "competitive",
    "severity": "medium",
    "sub_entity_id": "Startmate",  # Optional: attach to specific competitor
    "sub_entity_type": "competitor"
}
# Returns signal with scope="competitive"


# Promote competitive signal to strategy level
POST /api/strategies/{strategy_id}/signals/{signal_id}/promote
{
    "promotion_note": "Validates our assumption that AI infrastructure is table stakes",
    "strategic_signal_type": "validation"  # "risk", "opportunity", "validation", "falsification"
}
# Returns new strategy-scoped signal


# Unpromote (remove from strategy level)
DELETE /api/strategies/{strategy_id}/signals/{strategy_signal_id}/unpromote
# Deletes strategy signal, unmarks original


# Get strategy-level signals (for strategy briefing)
GET /api/strategies/{strategy_id}/signals?scope=strategy
# Returns only promoted + execution signals


# Get competitive signals (for landscape briefing)
GET /api/strategies/{strategy_id}/assets/{asset_id}/signals?scope=competitive
# Returns all competitive signals

# Optional: filter to specific competitor
GET /api/strategies/{strategy_id}/assets/{asset_id}/signals?scope=competitive&sub_entity_id=Startmate


# Get promoted signals for landscape
GET /api/strategies/{strategy_id}/assets/{asset_id}/signals/promoted
# Returns competitive signals that have been promoted
```

### Briefing Endpoints

```python
# Strategy briefing (excludes unpromoted competitive signals)
GET /api/strategies/{strategy_id}/briefing
# Returns strategy-focused briefing


# Competitive landscape briefing (all competitive intelligence)
GET /api/strategies/{strategy_id}/assets/{landscape_id}/briefing
# Returns competitive intelligence briefing


# Competitor-specific briefing
GET /api/strategies/{strategy_id}/assets/{landscape_id}/competitors/{competitor_name}/briefing
# Returns briefing focused on one competitor
```

### Analysis Endpoints

```python
# Coherence check (excludes landscape)
GET /api/strategies/{strategy_id}/coherence
# Returns conflicts between our strategy assets


# Competitive positioning analysis (separate from coherence)
GET /api/strategies/{strategy_id}/competitive-positioning
# Returns contrarian bets, white space, collision zones


# Response prediction
POST /api/strategies/{strategy_id}/predict-responses
{
    "our_planned_move": "Launch free tier with 10GB storage",
    "affected_component": "Pricing Model"
}
# Returns competitor response predictions
```

---

## Phase 6: Frontend Implementation

### Competitive Landscape Views

#### Roster View (with Signal Badges)

```tsx
interface RosterViewProps {
  competitors: Competitor[];
  signalCounts: Record<string, int>;
  promotedCounts: Record<string, int>;
  onSelectCompetitor: (name: string) => void;
}

export function RosterView({ 
  competitors, 
  signalCounts, 
  promotedCounts,
  onSelectCompetitor 
}: RosterViewProps) {
  return (
    <div className="space-y-2">
      {competitors.map(competitor => (
        <CompetitorCard
          key={competitor.name}
          name={competitor.name}
          coreBet={competitor.core_bet}
          onClick={() => onSelectCompetitor(competitor.name)}
        >
          <CardBadges>
            {signalCounts[competitor.name] > 0 && (
              <Badge variant="blue">
                {signalCounts[competitor.name]} signals
              </Badge>
            )}
            
            {promotedCounts[competitor.name] > 0 && (
              <Badge variant="success">
                {promotedCounts[competitor.name]} promoted
              </Badge>
            )}
          </CardBadges>
        </CompetitorCard>
      ))}
    </div>
  );
}
```

#### Signals Tab (with Promotion Actions)

```tsx
export function CompetitiveLandscapeSignals({ 
  assetId, 
  selectedCompetitor 
}: SignalsTabProps) {
  const { signals } = useCompetitiveSignals(assetId, selectedCompetitor);
  const [promotionDialog, setPromotionDialog] = useState<Signal | null>(null);
  
  return (
    <div>
      <SignalFilters>
        <Select 
          value={selectedCompetitor} 
          onChange={setSelectedCompetitor}
        >
          <option value="">All competitors</option>
          {competitors.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </Select>
        
        <Toggle 
          label="Show promoted only" 
          value={showPromotedOnly}
          onChange={setShowPromotedOnly}
        />
      </SignalFilters>
      
      <SignalList>
        {signals.map(signal => (
          <SignalCard key={signal.id} signal={signal}>
            <SignalHeader>
              <h4>{signal.title}</h4>
              {signal.promoted_to_strategy && (
                <Badge variant="success">
                  ✓ Promoted: {signal.promotion_note}
                </Badge>
              )}
            </SignalHeader>
            
            <SignalBody>{signal.description}</SignalBody>
            
            <SignalActions>
              {!signal.promoted_to_strategy ? (
                <Button 
                  variant="outline"
                  onClick={() => setPromotionDialog(signal)}
                >
                  ↑ Promote to Strategy
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost"
                    onClick={() => navigateToStrategicSignal(signal)}
                  >
                    View strategic signal →
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => unpromoteSignal(signal.id)}
                  >
                    Unpromote
                  </Button>
                </>
              )}
            </SignalActions>
          </SignalCard>
        ))}
      </SignalList>
      
      {promotionDialog && (
        <PromotionDialog
          signal={promotionDialog}
          onPromote={handlePromote}
          onCancel={() => setPromotionDialog(null)}
        />
      )}
    </div>
  );
}
```

#### Promotion Dialog

```tsx
interface PromotionDialogProps {
  signal: Signal;
  onPromote: (note: string, type: string) => void;
  onCancel: () => void;
}

export function PromotionDialog({ 
  signal, 
  onPromote, 
  onCancel 
}: PromotionDialogProps) {
  const [note, setNote] = useState("");
  const [type, setType] = useState<StrategicSignalType>("risk");
  
  return (
    <Dialog title="Promote Signal to Strategy Level">
      <DialogBody>
        <div className="mb-4">
          <strong>Competitive signal:</strong>
          <p className="text-sm text-gray-600 mt-1">"{signal.title}"</p>
        </div>
        
        <Input
          label="Why does this matter to our strategy?"
          placeholder="e.g., Validates our pricing assumption, Threatens our core offering"
          value={note}
          onChange={setNote}
          multiline
          rows={3}
          required
        />
        
        <Select 
          label="Strategic signal type"
          value={type}
          onChange={setType}
        >
          <option value="risk">Risk to our strategy</option>
          <option value="validation">Validates our assumption</option>
          <option value="opportunity">Strategic opportunity</option>
          <option value="falsification">Falsifies our assumption</option>
        </Select>
        
        <Alert variant="info">
          This will create a strategy-level signal that appears in your 
          strategy briefing and intelligence feed. The original competitive 
          signal will remain in the landscape for context.
        </Alert>
      </DialogBody>
      
      <DialogActions>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={() => onPromote(note, type)}
          disabled={!note.trim()}
        >
          Promote to Strategy
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

### Strategy-Level Views (Clean, No Pollution)

#### Strategy Briefing

```tsx
export function StrategyBriefing({ strategyId }: BriefingProps) {
  const { briefing } = useStrategyBriefing(strategyId);
  const { signals } = useStrategySignals(strategyId);  // Only scope="strategy"
  
  // Separate promoted competitive signals for highlighting
  const promotedSignals = signals.filter(s => s.source_signal_id !== null);
  
  return (
    <div>
      <BriefingHeader>
        <h2>Strategy Intelligence Briefing</h2>
        <p className="text-sm text-gray-600">
          {new Date().toLocaleDateString()} • Focused on our strategy state
        </p>
      </BriefingHeader>
      
      {promotedSignals.length > 0 && (
        <Alert variant="info">
          {promotedSignals.length} competitive signal(s) promoted to 
          strategic importance. See details below.
        </Alert>
      )}
      
      <BriefingContent>
        <ReactMarkdown>{briefing}</ReactMarkdown>
      </BriefingContent>
      
      <SignalsSummary>
        <h3>Active Strategic Signals</h3>
        <SignalList signals={signals} />
      </SignalsSummary>
      
      <QuickActions>
        <Button onClick={() => navigateToLandscape()}>
          View Competitive Landscape →
        </Button>
      </QuickActions>
    </div>
  );
}
```

#### Intelligence Feed

```tsx
export function IntelligenceFeed({ strategyId }: FeedProps) {
  // Only shows strategy-scoped signals (promoted + execution)
  const { signals } = useStrategySignals(strategyId);
  
  return (
    <Feed>
      {signals.map(signal => (
        <FeedItem key={signal.id}>
          <FeedIcon type={signal.signal_type} />
          
          <FeedContent>
            <h4>{signal.title}</h4>
            <p>{signal.description}</p>
            
            {signal.source_signal_id && (
              <FeedMeta>
                Promoted from competitive landscape •
                <Link to={`/signals/${signal.source_signal_id}`}>
                  View original context
                </Link>
              </FeedMeta>
            )}
          </FeedContent>
          
          <FeedTimestamp>{formatRelativeTime(signal.created_at)}</FeedTimestamp>
        </FeedItem>
      ))}
    </Feed>
  );
}
```

---

## Testing Strategy

### Unit Tests

```python
def test_signal_promotion():
    """Competitive signal can be promoted to strategy level."""
    # Create landscape with signal
    landscape = create_test_landscape()
    competitive_signal = create_signal(
        asset_id=landscape.id,
        sub_entity_id="Startmate",
        title="Raised funding",
        scope="competitive"
    )
    
    # Promote signal
    strategy_signal = promote_signal_to_strategy(
        signal_id=competitive_signal.id,
        promotion_note="Validates our funding timeline assumption",
        strategic_signal_type="validation"
    )
    
    # Verify promotion
    assert strategy_signal.scope == "strategy"
    assert strategy_signal.source_signal_id == competitive_signal.id
    assert "Validates our funding" in strategy_signal.title
    
    # Verify original marked
    competitive_signal = get_signal(competitive_signal.id)
    assert competitive_signal.promoted_to_strategy == True
    assert competitive_signal.promotion_note is not None


def test_unpromote_signal():
    """Promoted signal can be unpromoted."""
    # Setup
    landscape = create_test_landscape()
    competitive_signal = create_signal(
        asset_id=landscape.id,
        title="Competitor move",
        scope="competitive"
    )
    strategy_signal = promote_signal_to_strategy(
        competitive_signal.id,
        "Test promotion"
    )
    
    # Unpromote
    unpromote_signal(strategy_signal.id)
    
    # Verify strategy signal deleted
    assert get_signal(strategy_signal.id) is None
    
    # Verify original unmarked
    competitive_signal = get_signal(competitive_signal.id)
    assert competitive_signal.promoted_to_strategy == False


def test_strategy_briefing_excludes_unpromoted_competitive():
    """Strategy briefing only sees promoted competitive signals."""
    strategy = create_test_strategy()
    landscape = create_competitive_landscape(strategy.id)
    
    # Create unpromoted competitive signal
    unpromoted = create_signal(
        asset_id=landscape.id,
        title="Unpromoted signal",
        scope="competitive"
    )
    
    # Create promoted competitive signal
    promoted_competitive = create_signal(
        asset_id=landscape.id,
        title="Important competitor move",
        scope="competitive"
    )
    promoted_strategy = promote_signal_to_strategy(
        promoted_competitive.id,
        "This threatens us"
    )
    
    # Get strategy-level signals
    strategy_signals = get_strategy_level_signals(strategy.id)
    
    # Verify only promoted appears
    assert len(strategy_signals) == 1
    assert strategy_signals[0].id == promoted_strategy.id
    assert unpromoted.id not in [s.id for s in strategy_signals]


def test_coherence_excludes_landscape():
    """Coherence check doesn't include competitive landscape."""
    strategy = create_test_strategy()
    
    # Create our strategy assets
    decision_stack = create_decision_stack(strategy.id)
    wardley_map = create_wardley_map(strategy.id)
    
    # Create competitive landscape
    landscape = create_competitive_landscape(strategy.id)
    
    # Run coherence check
    conflicts = run_coherence_check(strategy.id)
    
    # Verify landscape not in checked assets
    checked_asset_ids = [c.asset_id for c in conflicts]
    assert landscape.id not in checked_asset_ids


def test_entity_scoping():
    """Competitive entities don't auto-link to strategy entities."""
    strategy = create_test_strategy()
    
    # Our Wardley Map has "Mentor Network" component
    wardley = create_wardley_map(strategy.id, components=[
        {"name": "Mentor Network", "evolution": 0.3}
    ])
    
    # Competitor also has "Mentor Network" in their data
    landscape = create_competitive_landscape(strategy.id, competitors=[
        {"name": "Startmate", "core_bet": "Mentor network creates deal flow"}
    ])
    
    # Extract entities
    extract_entities_from_all_assets(strategy.id)
    
    # Verify entities are scoped separately
    strategy_entities = get_entities(scope="strategy")
    competitive_entities = get_entities(scope="competitive")
    
    assert any(e.name == "Mentor Network" and e.scope == "strategy" for e in strategy_entities)
    assert any(e.name == "Mentor Network" and e.scope == "competitive" for e in competitive_entities)
    
    # Verify no auto-link between them
    tier2_edges = get_tier2_edges()
    cross_scope_edges = [
        e for e in tier2_edges 
        if (get_entity(e.source).scope == "strategy" and 
            get_entity(e.target).scope == "competitive")
    ]
    assert len(cross_scope_edges) == 0
```

### Integration Tests

```python
def test_competitive_intelligence_workflow():
    """End-to-end: Create landscape → Add signals → Promote → Verify briefing."""
    # 1. Create strategy and landscape
    strategy = create_test_strategy()
    landscape = create_competitive_landscape(
        strategy.id,
        competitors=[
            {"name": "Startmate", "core_bet": "Cohort model"}
        ]
    )
    
    # 2. Add competitive signals
    signal1 = create_signal(
        asset_id=landscape.id,
        sub_entity_id="Startmate",
        title="Raised $10M",
        scope="competitive"
    )
    
    signal2 = create_signal(
        asset_id=landscape.id,
        sub_entity_id="Startmate",
        title="Launched enterprise tier",
        scope="competitive"
    )
    
    # 3. Promote one signal
    promoted = promote_signal_to_strategy(
        signal1.id,
        "Validates that our market is attracting capital"
    )
    
    # 4. Generate briefings
    landscape_briefing = generate_landscape_briefing(landscape.id)
    strategy_briefing = generate_strategy_briefing(strategy.id)
    
    # 5. Verify landscape briefing has both signals
    assert "Raised $10M" in landscape_briefing
    assert "Launched enterprise tier" in landscape_briefing
    
    # 6. Verify strategy briefing only mentions promoted signal
    assert "Validates that our market" in strategy_briefing
    assert "Launched enterprise tier" not in strategy_briefing
    
    # 7. Verify intelligence feed
    feed_signals = get_strategy_level_signals(strategy.id)
    assert len(feed_signals) == 1
    assert feed_signals[0].id == promoted.id
```

---

## Migration Plan

### Step 1: Database Schema (No Data Migration Needed)

```sql
-- Add new columns to signals table
ALTER TABLE signals 
ADD COLUMN sub_entity_id VARCHAR(255) NULL,
ADD COLUMN sub_entity_type VARCHAR(50) NULL,
ADD COLUMN scope VARCHAR(50) DEFAULT 'competitive',
ADD COLUMN promoted_to_strategy BOOLEAN DEFAULT FALSE,
ADD COLUMN promotion_note TEXT NULL,
ADD COLUMN source_signal_id VARCHAR(255) NULL;

-- Add indexes for performance
CREATE INDEX idx_signals_sub_entity 
ON signals(asset_id, sub_entity_id, sub_entity_type);

CREATE INDEX idx_signals_scope 
ON signals(strategy_id, scope);

CREATE INDEX idx_signals_promoted 
ON signals(promoted_to_strategy, source_signal_id);

-- Set scope for existing signals based on asset type
UPDATE signals 
SET scope = 'strategy' 
WHERE asset_id IN (
    SELECT id FROM assets WHERE asset_type != 'competitive_landscape'
) OR asset_id IS NULL;

UPDATE signals 
SET scope = 'competitive' 
WHERE asset_id IN (
    SELECT id FROM assets WHERE asset_type = 'competitive_landscape'
);
```

### Step 2: Backend Implementation Order

1. ✅ Add signal model fields (sub_entity, scope, promotion tracking)
2. ✅ Implement promotion functions (promote_signal_to_strategy, unpromote_signal)
3. ✅ Update query functions to filter by scope
4. ✅ Update briefing generators to respect scope
5. ✅ Add API endpoints for promotion workflow
6. ✅ Update coherence checker to exclude landscape
7. ✅ Write unit tests for promotion workflow
8. ✅ Write integration tests for end-to-end flow

### Step 3: Frontend Implementation Order

9. ✅ Add promotion button to signal cards in landscape
10. ✅ Create promotion dialog component
11. ✅ Add promoted badge to signal cards
12. ✅ Add "view original context" link for promoted signals
13. ✅ Update intelligence feed to show only strategy-scoped signals
14. ✅ Update strategy briefing to exclude unpromoted competitive signals
15. ✅ Add unpromote action for promoted signals

### Step 4: Testing & Validation

16. ✅ Test promotion workflow end-to-end
17. ✅ Verify briefing scoping works correctly
18. ✅ Verify coherence excludes landscape
19. ✅ Test unpromote workflow
20. ✅ Validate intelligence feed shows correct signals

---

## Success Criteria

### Phase 0-2 Complete When:
- ✅ Signals have sub_entity_id, scope, promotion tracking fields
- ✅ Can attach signals to specific competitors
- ✅ Can promote competitive signals to strategy level
- ✅ Can unpromote signals
- ✅ Promoted signals create new strategy-scoped signals

### Phase 3 Complete When:
- ✅ Strategy briefing only includes strategy-scoped signals
- ✅ Landscape briefing includes all competitive signals
- ✅ Briefings clearly separated in scope and focus

### Phase 4 Complete When:
- ✅ Coherence check excludes competitive landscape
- ✅ Entity extraction scopes entities correctly
- ✅ No auto-linking between competitive and strategy entities

### Phase 5-6 Complete When:
- ✅ API supports promotion workflow
- ✅ Frontend shows promotion UI
- ✅ Intelligence feed shows only promoted competitive signals
- ✅ Users can navigate from promoted signal to original context

---

## Key Architectural Principles

### 1. Walled Garden
Competitive Landscape is a contained intelligence workspace. Nothing escapes unless explicitly promoted by the user.

### 2. User Control
System doesn't guess which competitive signals matter strategically. User decides through explicit promotion action with reasoning.

### 3. Clean Separation
Strategy briefing = our state. Landscape briefing = market intelligence. Never mixed.

### 4. Provenance
Promoted signals always link back to original competitive context. User can navigate: strategy signal → original competitive signal → competitor detail → full landscape.

### 5. Reversibility
All promotions can be undone. User can experiment with promoting signals without permanent consequences.

---

## Questions for Implementation

1. **Auto-promotion suggestions:** Should the landscape briefing suggest signals for promotion, or leave discovery entirely to the user?

2. **Promotion threshold:** Should there be a limit on promoted signals (e.g., max 10 promoted at a time) to prevent feed pollution?

3. **Batch promotion:** Should users be able to promote multiple signals at once, or always one-by-one?

4. **Promotion types:** Are the four types (risk, opportunity, validation, falsification) sufficient, or do we need more granular categories?

5. **Unpromote confirmation:** Should unpromote require confirmation, or be instant (with undo)?

---

## Files to Change

```
backend/
  models/
    signal.py              # Add scope, promotion fields
    entity.py              # Add scope field
  services/
    intelligence.py        # Update briefing scoping
    signals.py             # Add promotion functions
    coherence.py           # Exclude landscape from checks
  api/
    signals.py             # Add promotion endpoints
    
frontend/
  components/
    CompetitiveLandscape/
      SignalsTab.tsx       # Add promotion UI
      PromotionDialog.tsx  # NEW
    Strategy/
      Briefing.tsx         # Filter to strategy-scoped signals
      IntelligenceFeed.tsx # Filter to strategy-scoped signals
  hooks/
    useSignalPromotion.ts  # NEW
```

---

## Summary

**The competitive landscape is a sandbox for exploration.** Users research competitors, attach signals, build intelligence — all contained within the landscape asset.

**When competitive intelligence becomes strategically relevant, users promote it.** Promotion creates a strategy-level signal with explicit reasoning about why it matters.

**Strategy briefings stay clean.** They see our strategy assets + promoted competitive signals. Unpromoted competitive noise stays in the landscape.

**This architecture gives users control, prevents pollution, and maintains clear separation between "what's happening in the market" and "what matters to our strategy."**
