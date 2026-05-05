# StrategyOS — Under the Surface

**Audience:** Technical stakeholders, investors, and collaborators who want to understand what the system is actually doing — not just what it shows.

This document covers the intelligence pipeline, the signal system, the Global Coherence Engine, and the ontology layer. It assumes you've read the README and want to go deeper.

---

## The Core Idea

Most strategy tools are document editors with a chat window bolted on. StrategyOS is built around a different premise: that a strategy is a **structured knowledge graph**, and that AI should work on that graph — not on free text.

When you lock an asset, you're not saving a document. You're committing a set of structured claims about your organisation — its capabilities, its bets, its dependencies, its stakeholders — into a typed schema. Everything the AI does downstream reads from that schema, not from the prose you typed.

This distinction matters because it means the AI can reason about relationships between assets, detect structural contradictions, and produce analysis that is specific to your actual content — not generic advice dressed up with your company name.

---

## The Four-Phase Intelligence Pipeline

Every asset lock triggers a four-phase pipeline. The phases run sequentially. Each phase reads from the outputs of the previous one — raw asset content is only touched once.

```
Asset locked
     │
     ▼
Phase 1 — Signal Detection (Haiku)
     Reads: raw asset content + strategy context
     Writes: signals table (category: 'analysis')

     ▼
Phase 2 — Insight Generation (Haiku)
     Reads: strategy + focus asset
     Writes: insights table (scoped to asset)

     ▼
Phase 3 — Intelligence Capabilities (Haiku, parallel)
     Reads: strategy + assets
     Writes: asset_intelligence table (per capability)

     ▼
Phase 4 — Briefing Assembly (Haiku + Sonnet)
     Reads: signals + insights + asset_intelligence rows
     Writes: asset_briefings table
```

**Why this architecture?** Because adding more analysis capabilities doesn't multiply the cost of reading your assets. Phase 3 can run five capabilities in parallel — each reads from the same persisted context, not from the raw asset. Phase 4 synthesises everything into a single briefing. The cost of the pipeline scales with the number of capabilities, not with the size of your assets.

### Phase 1 — Signal Detection

A single Haiku call runs all relevant detection patterns for the asset type in one pass. This is the `strategic-signal-batch` capability. Instead of dispatching seven separate detector calls (each sending overlapping context), one call scans for all patterns and returns a typed signal array.

Detection patterns are defined per asset type. A Wardley Map gets scanned for fragile dependencies, efficiency gaps, and structural tensions. A Decision Stack gets scanned for strategic bets and misaligned objectives. An OKR Cascade gets scanned for capability gaps and execution risks.

If the batch call fails, the orchestrator falls back to individual detector capabilities — one per signal type. This fallback path is slower and more expensive but produces the same output.

Signals are persisted with `category: 'analysis'` and scoped to the source asset. The replace-by-asset-and-category pattern means each lock produces a fresh set of signals for that asset without touching signals from other assets or signals the user has already acknowledged.

### Phase 2 — Insight Generation

A separate Haiku call generates business domain insights — observations, patterns, opportunities, and constraints — from the strategy and focus asset. These are higher-level than signals: where a signal says "this specific component is fragile," an insight says "the strategy is making a pattern of early-stage bets in areas where the market has already moved."

Insights are persisted scoped to the asset and replace the previous batch on each run.

### Phase 3 — Intelligence Capabilities

Multiple capabilities run in parallel, each writing to the `asset_intelligence` table:

**Content serialisation.** Before any capability processes an asset, the context assembler transforms raw JSONB content into readable prose. Each asset type with a registered serialiser (`operating_model`, `decision_stack`, `okr_cascade`) receives a `contentText` field alongside its raw `content`. Serialisers are editorial transforms — they prioritise by signal strength (for OM: criticality × gap score descending), lead with a summary line, and produce compact labelled blocks. Capabilities use `contentText ?? content`, so they receive signal rather than structure. This improvement cascades through every capability that processes the asset, including strategy-wide detectors.

- **component-intelligence** — analyses individual Wardley Map components for maturity, direction of change, and industry behaviour. Only runs on Wardley Maps.
- **landscape-synthesis** — produces a structured synthesis of the competitive landscape: value creation logic, landscape forces, investment assessment, risk landscape, opportunity spaces.
- **movement-analysis** — identifies component movements needed (current vs target state), capability gaps, sequencing of changes, and transformation risks.
- **strategic-opportunity-generator** — generates 3–5 plausible strategic opportunities with evidence and confidence scores. Produces options only — does not evaluate or rank them.
- **doctrine-assessment** — evaluates what an asset evidences about strategic maturity against curated principles. Lifecycle-gated: draft assets are skipped, active assets get a light assessment, confirmed assets get a full evaluation. Outputs 2–3 findings per asset.
- **traceability-gap-detection** — hybrid deterministic + AI capability. Step 1: pure TypeScript traversal of entity references to find broken intent chains between assets (zero LLM cost). Step 2: Haiku narrative synthesis of the 2–3 most impactful gaps, only if gaps are found. Detects missing connections within a set of existing assets — distinct from coverage signals which detect missing asset types.
- **operating-model-synthesis** (`assets/operating-model-synthesis.ts`) — produces a structural verdict from the OM assessment: verdict sentence, top change items (highest criticality×gap), and leverage items (high readiness×criticality). Only runs on operating_model assets.

The last two capabilities represent **evaluative intelligence** — a third analytical mode alongside observational (what's happening in this asset?) and relational (do your assets agree?). Evaluative intelligence asks: is your strategy well-formed against known strategic principles? Findings are produced at findings-grade from birth — they skip signal consolidation and enter the tier classification step directly.

A deduplication pass runs before tier classification: evaluative findings that overlap with existing signals are suppressed (keeping whichever is more specific), and a combined cap of 3 evaluative findings per asset prevents the feed from inflating.

Each capability writes its output as a typed JSONB blob keyed by capability ID. Phase 4 reads all of these together.

### Phase 4 — Briefing Assembly

This is where everything comes together. The assembler reads the outputs from Phases 1–3 and runs two AI calls:

**Step 1 — Haiku tier classification.** Takes the raw signals and insights and classifies each into a tier:
- `urgent` — requires immediate attention
- `cross_layer` — involves multiple strategic assets
- `noted` — worth knowing but not time-critical

It also rewrites titles and bodies into plain business language (stripping framework jargon), and selects the single most urgent actionable signal as the `key_signal` — the one thing pinned at the top of the intelligence panel.

**Step 2 — Sonnet briefing synthesis.** Takes the classified insights, signals, and capability outputs and produces a structured briefing with three sections:
- **Headline** — the single most important thing this asset reveals. Not a strategy summary. A specific insight from reading this asset's content.
- **Summary** — 3–5 specific observations derived from the actual asset content. Each item must be traceable to something the user created.
- **Implications** — 2–3 paragraphs interpreting the evidence in light of signals, insights, and strategy context.

Plus a `what_to_watch` list: 2–4 concrete, time-bound triggers that would confirm or invalidate the analysis.

The briefing is validated against a Zod schema before persistence. If it fails validation, the last valid briefing is preserved in the database.

---

## The Signal System

Signals are the AI's primary output format. They are typed, severity-rated, lifecycle-managed, and scoped to assets.

### Signal anatomy

```typescript
interface Signal {
  id: string
  strategyId: string
  type: SignalType          // one of 15 types
  category: 'analysis' | 'coherence'
  title: string             // active statement, max 12 words
  description: string       // 3 sentences: fact / tension / trigger
  severity: 'high' | 'medium' | 'low'
  sourceAssetId?: string    // asset that generated this signal
  targetAssetId?: string    // asset this signal points at (cross-asset)
  synthesisSuggestion?: string
  findingsCardRequired: boolean  // true for high-severity signals
  status: 'open' | 'acknowledged' | 'resolved'
  confidence: number        // 0–1
  concernType?: ConcernType | null  // strategic concern classification
  entityRefs?: string[]             // ontology concept IDs
  createdAt: string
}
```

### Signal types

**Analysis signals** (7) — generated by scanning individual assets:

| Type | What it means |
|---|---|
| `strategic_bet` | An irreversible, high-consequence commitment. Informational — not a warning. |
| `capability_gap` | A capability required by strategy goals that doesn't exist in any asset. |
| `efficiency_gap` | Custom-building something the market has commoditised. |
| `execution_risk` | Missing ownership, unclear accountability, resource conflict, or confidence problem. |
| `fragile_dependency` | A critical-path component in early evolution stages. If this breaks, a lot breaks. |
| `misaligned_objective` | A goal that contradicts the North Star, violates a principle, or can't be traced to strategic intent. |
| `structural_tension` | A self-reinforcing problem that can't be resolved by doing more of the same thing. |

**Coherence signals** (3) — generated by the Global Coherence Engine across pairs of assets:

| Type | What it means |
|---|---|
| `cross_asset_conflict` | Two assets are making contradictory strategic claims. |
| `cross_asset_gap` | One asset implies something that another asset is missing. |
| `cross_asset_amplification` | Two assets are reinforcing each other positively. (Good news.) |

Each signal also carries a `concernType` that classifies the strategic problem independent of how it was detected. Two signals of different types — one from a Wardley scan, one from a coherence check — can share the same concern type if they're pointing at the same class of strategic problem. See [The Concern Taxonomy](#the-concern-taxonomy) below.

### Signal lifecycle

Signals follow a state machine: `open` → `acknowledged` → `resolved`. The replace-by-asset-and-category pattern only deletes `open` signals — acknowledged and resolved signals are never touched by the pipeline. This means a user who has acknowledged a signal won't see it re-appear on the next lock.

When a user adds a response to a signal (context, challenge, or action item), the signal automatically transitions to `acknowledged`. Action items carry their own status: `open` → `in_progress` → `done`.

### The FindingsCard interrupt

High-severity signals (`findingsCardRequired: true`) trigger a FindingsCard — a non-blocking slide-in panel that surfaces the finding immediately after lock. The FindingsCard includes an AI-generated hypothesis (shown with an amber border to indicate it's inferred, not confirmed) and three actions: accept, correct, or dismiss.

---

## The Concern Taxonomy

### The problem

Signal types describe how a signal was detected, not what strategic problem it represents. A `fragile_dependency` and a `cross_asset_gap` can both be pointing at the same underlying concern — a precondition that isn't in place — but they look like different issues because different detectors found them. At scale, this produces noise: the same problem surfaces multiple times under different labels, and synthesis has to work harder to group related findings.

### The three-layer model

The taxonomy adds a layer between the ontology and the signal:

- **Layer 1 — Ontology** identifies the concepts involved: the systems, capabilities, actors, and processes your strategy references.
- **Layer 2 — Universal Concerns** classifies what kind of problem exists across those concepts. There are 8 root concern types, independent of asset type or detector. The same 8 types apply whether the signal came from a Wardley scan, a coherence check, or a GCE pattern.
- **Layer 3 — Signals** are specific instances: a concern type applied to a particular entity in a particular asset.

This means two signals from different detectors can be recognised as the same concern if they share the same type and point at overlapping entities — which is the basis for the improved consolidation described below.

### The 8 root concern types

| Concern type | What it asks | Failure mode |
|---|---|---|
| Dependency integrity | Are preconditions valid? | "This can't happen because something it needs isn't in place." |
| Allocation & commitment | Do resources match priorities? | "We're not resourced for what we say matters." |
| Internal consistency | Do parts agree? | "Two things can't both be true." |
| Causal validity | Does the logic work? | "Even if we do this, it won't produce the result." |
| Coverage & completeness | Are critical elements present? | "Something essential is undefined." |
| Stakeholder alignment | Are actors incentive-aligned? | "The people needed aren't motivated." |
| Uncertainty & fragility | How exposed to unknowns? | "This breaks if a few things go wrong." |
| Temporal viability | Does timing work? | "The timing makes this unworkable." |

### Entity anchoring

Signals now carry an `entityRefs` field: an array of ontology concept IDs from the signals' source assets. When a signal is classified, detectors resolve the entities it's about — not just the asset, but the specific concepts within it. This makes deduplication structurally exact: two signals that share the same `concernType` and reference overlapping entity IDs are merge candidates before any LLM comparison runs. The consolidation phase pre-filters on this basis, reducing the number of LLM calls required and improving merge accuracy.

### How concern types flow through the system

- Detectors classify each signal into one concern type at generation time.
- Consolidation pre-filters by concern type and entity overlap before the LLM dedup pass, eliminating false merges between same-type signals pointing at different entities.
- Synthesis groups themes by concern type, with pattern type derived deterministically from the dominant concern type in a cluster rather than inferred by the model.
- Signal rows in the UI show a grey concern type chip alongside the signal type badge.

---

## The Global Coherence Engine

The GCE is the most architecturally distinctive part of StrategyOS. It runs entirely without AI — it's a deterministic graph analysis engine that detects structural problems in the strategy.

### How it works

When an asset is locked, the GCE:

1. **Builds a strategic graph** from the strategy and all locked assets. Nodes are: strategy, goals, initiatives, metrics, and assets. Links are: `goal_of`, `measured_by`, `supports`, `references`.

2. **Runs 18 pattern detection functions** over the graph. Each function is a pure, deterministic rule — no AI, no randomness. They return typed `Conflict` objects.

3. **Computes a health score** using a weighted formula: 30% asset completeness, 30% link density, 40% conflict-free ratio. The conflict-free ratio applies severity weights (critical×4, high×2, medium×1, low×0.5).

4. **Filters promotable conflicts** — those that map to cross-asset signal types — and passes them to a Haiku call for enrichment into signal language.

### The 18 patterns

The patterns cover three categories:

**Structural patterns** (P1–P12) — problems in how the strategy is assembled:
- `resource_mirage` — an owner assigned to 3+ initiatives with no capacity constraint recorded
- `timeline_trap` — active initiatives against a goal whose due date has passed
- `phantom_differentiator` — a strategy with no locked assets
- `ownership_vacuum` — initiatives with no assigned owner
- `vision_drift` — all goals marked low priority (no directional tension)
- `reinforcing_trap` — multiple initiatives sharing the same metric as their primary measure
- `orphaned_bet` — initiatives not linked to any goal
- `principle_violation` — one person spanning two competing high-priority goals
- `silent_constraint` — constraints recorded but no initiative addresses them
- `cascade_gap` — a goal with no child initiatives
- `dependency_shadow` — an initiative measured by a metric belonging to a different goal
- `stakeholder_blindspot` — no stakeholder architecture asset exists

**Health signals** (P13–P15) — quality of the strategy's evidence base:
- `missing_assumption` — goals with forward-looking language but no explicit constraints recorded
- `evidence_gap` — goals not linked to any analytical asset
- `capability_gap` — initiatives referencing capabilities not found in any asset

**Financial model patterns** (P16–P18) — only fire when a locked financial model with sufficient data exists:
- `capital_concentration` — a single goal absorbs ≥60% of total initiative investment
- `build_vs_buy_mismatch` — committed investment in a commodity/product-stage Wardley component
- `allocation_vs_ambition` — investment posture (committed vs recurring ratio) contradicts strategic intent

### Why deterministic?

The GCE is deterministic because structural problems in a strategy graph don't require AI to detect. Whether an initiative has an owner is a fact. Whether a goal has a due date in the past is a fact. Whether two assets are making contradictory claims requires interpretation — that's where the AI enrichment step comes in, translating the GCE's structural findings into signal language.

This separation means the GCE is fast, cheap, and testable. The AI enrichment step is the only metered call in the coherence pipeline.

---

## The Ontology Layer

The ontology layer is the semantic knowledge graph that sits beneath the asset layer. It extracts business concepts from locked assets, merges duplicates across assets, builds typed relationships between them, and organises them into business activity domains.

### What it is

The ontology graph is not a document. It's a live, computed view of the concepts embedded in your strategy — the systems, capabilities, actors, processes, and data entities that your assets reference. It's rebuilt on demand from the current state of locked assets.

### Concept extraction pipeline

The pipeline runs in eight stages:

**Stage 1 — Extraction.** Each locked asset type has a dedicated extractor:
- Wardley Map components → `system` (commodity/product stage) or `capability` (custom/genesis stage)
- Wardley Map actors → `actor` nodes with needs as context metadata
- Decision Stack objectives → scanned for entity references (system/capability keywords); objectives themselves become context metadata, not nodes
- Systems Map → forces, variables, and interventions
- Stakeholder Architecture → stakeholder profiles and needs

OKR Cascades produce no concept nodes directly — the inference engine derives them from key result text.

When AI extraction is explicitly requested (POST-only path), a Haiku call runs per eligible asset to extract additional concepts that regex misses — particularly from free-text fields in Decision Stacks and Problem Frames.

**Stage 2 — Normalisation.** Abstract terms are rejected (concepts that are sentences rather than noun phrases, generic terms like "strategy" or "approach"). Types are resolved. Canonical names are assigned. Internal/external boundary is classified: internal = capabilities, processes, systems, teams; external = stakeholders, needs, forces, opportunities.

**Stage 3 — Merging.** Duplicate concepts across assets are merged when they share the same entity reference, objective reference match, or normalised name match. The merger produces a single concept node with multiple source attributions — so you can see that "Data Platform" appears in both your Wardley Map and your Decision Stack.

**Stage 4 — Label compression.** Labels are shortened for graph display using pattern-based compression (max 18 characters).

**Stage 5 — Edge building.** Typed relationships are built between concepts:
- Structural edges: `contains`, `depends_on`, `enables`, `measures`, `constrains`, `realised_by`
- Causal edges: `causes` (with polarity), `has_need`, `acts_on`, `drives`, `influences`
- Inferred edges: `inferred_link`, `signal_link`

Dynamics edges (causal) are never treated as structural — they carry a `layer` field that separates them.

**Stage 6 — Domain assignment.** Each concept is assigned to one of 10 business activity domains: customer, product, growth, sales, operations, delivery, data, platform, risk, finance. Assignment uses a two-pass approach: keyword heuristic first, AI classifier (Haiku) as fallback. Domain assignment drives spatial clustering in the force-directed layout.

**Stage 7 — Inference.** The inference engine derives business objects from concepts using heuristic rules. It also runs archetype-based data entity inference: when a system concept matches a known system archetype (CRM, ERP, HRIS, etc.), it suggests the data entities that system typically manages — at `speculative` confidence. These appear as pending inferred objects that users can confirm or dismiss.

**Stage 8 — Gap detection.** The gap detector identifies concepts that are referenced by edges but have no corresponding node, concepts that appear in only one asset when they should appear in multiple, and capability areas with no strategic coverage.

### Confidence tiers

Every concept carries a confidence level:
- `declared` — explicitly stated in an asset by the user
- `inferred` — derived from cross-asset matching or AI extraction
- `speculative` — AI-suggested with no direct evidence

The UI provides a confidence lens toggle (All / Confirmed only) so users can filter to only what they've explicitly committed to.

### Domain navigation

The graph supports three levels of navigation:
- Level 1 — all domains, primary nodes only (high-degree or cross-facet concepts)
- Level 2 — domain drill-down, all nodes visible
- Level 3 — node focus (2-hop neighbourhood from selected concept)

### Wikidata enrichment

When ontology domains are regenerated (explicit user action), a non-blocking Wikidata enrichment pass runs. It matches concept labels against Wikidata entities to add canonical descriptions, aliases, and external identifiers. This enrichment is best-effort — if it fails, the graph builds without it.

### User overrides

Users can rename domains, rename capability clusters, add new domains, add new clusters, and pin concepts to specific domains. Overrides persist across regeneration — they patch the AI-generated base layer rather than replacing it. This means regenerating the ontology doesn't lose user customisations.

---

## Cross-Asset Inference

The inference map describes how assets can be derived from each other. This is not just pre-fill — it's a typed dependency graph that the system uses to suggest what to build next and what context to pass.

The high-confidence paths:
- Decision Stack → OKR Cascade (objectives + NSM confirmed)
- Decision Stack → Problem Structuring (vision + top objectives)

The medium-confidence paths:
- Decision Stack → Wardley Map (vision + objectives)
- Decision Stack → Stakeholder Architecture (objective owners → stakeholder identification)

The low-confidence paths:
- OKR Cascade → Wardley Map (key results feed partial components)
- Wardley Map → Systems Map (components → variables/loops)
- Wardley Map → Stakeholder Architecture (actors → stakeholder profiles)

Each inference path has a dedicated capability that reads the source asset and produces a typed draft of the target asset. Pre-filled values display with amber/dashed borders — the user must confirm before locking.

---

## Prose Quality as a System Property

Every AI-generated string in StrategyOS passes through a shared prose style module (`src/ai/prose-style.ts`). This is not a style guide — it's a set of composable prompt fragments appended to every system prompt.

The core rules:
- One job per sentence. Never pack multiple facts into one sentence.
- Let facts carry weight. No editorial emphasis ("significant risk", "critical threat").
- Never use system language as a subject ("the asset identifies"). State findings directly.
- Signal headlines: active statement, subject + verb + consequence, max 12 words.
- Briefing structure: LEAD / EVIDENCE / IMPLICATIONS / WHAT TO WATCH.

This means the quality of AI-generated text is a system property, not a per-capability concern. Changing the prose rules in one place propagates to all 42 capabilities automatically.

---

## The Conversational Surface

The conversational surface is the second interaction mode in StrategyOS. The web app handles spatial reasoning and persistent structure; conversation handles inquiry, analysis, and decision-making.

### Architecture

A Python MCP server (`mcp-server/`) serves both an embedded 440px panel in the web app and external hosts (Claude Desktop, Claude.ai). The conversation endpoint manages multi-turn sessions with model routing (Haiku for simple turns, Sonnet for analytical), prompt caching, and sliding-window history. 18 MCP tools provide read, write, analytical, and coaching capabilities.

The panel uses a Context/Thread tab model. The Context tab shows ambient intelligence (briefing, signals, findings, coverage). The Thread tab hosts all conversation — including three adaptive stances.

### Three Stances

The conversation adapts via stance, not UI mode:

| Stance | Trigger | What it does |
|---|---|---|
| **Query** | User types (default) | Open-ended. Responds to what's asked. |
| **Challenge** | User expresses adversarial intent | Surfaces 2–3 meaningful weaknesses from real data. `challenge_brief` card type with per-point "Address this" actions. |
| **Assist** | Entry point on a field or section | Helps articulate judgements (expressive) or suggests missing items (suggestive). `assist_proposal` and `assist_item` card types with Apply/Add actions. |

Challenge and Assist are triggered by user action, not by system inference. Challenge requires the user to express intent; Assist requires clicking an `AssistAffordance` pill on a specific field.

### Proactive Delivery

The proactive delivery layer surfaces indicators when intelligence data warrants attention — **without firing any AI calls**. All indicators read existing cached data from the database.

Four urgency tiers, in increasing intrusiveness:

| Tier | When | Example |
|---|---|---|
| **Badge** | Always-on ambient | Count pill on intelligence icon — amber for medium conditions, red for critical/high. |
| **Inline asset nudge** | Asset visible in graph | Amber "N signals" text on graph node cards for assets with open high/medium signals. |
| **Toast** | Genuinely strategic condition | Fixed bottom-right notification (8s auto-dismiss) for critical coherence conflicts or unmitigated high-impact risks. |
| **Interruptive card** | Panel open + Thread tab active | Amber-bordered card injected at bottom of thread for conditions directly relevant to the current conversation. |

The evaluator is a pure function (`proactive-evaluator.ts`) that takes ambient data and risk records as input and returns a list of conditions with urgency tiers. No store subscriptions, no side effects. A React hook (`useProactiveConditions`) wraps the evaluator, manages session-scoped dismissals (cleared when intelligence data refreshes), and derives the badge count, toast condition, and interruptive card.

Design constraints: the panel is never force-opened. Toast is the most intrusive external signal. Dismissed conditions don't resurface until the next intelligence run. The visual language is amber/warm — distinct from challenge (red, adversarial) and assist (violet, generative).

### Risk Layer in Conversation

Three MCP tools (`track_risk`, `add_risk`, `list_risks`) allow the conversation to create and query strategy risks. Evaluative findings (from doctrine assessment and traceability gap detection) can be promoted to tracked risks via a "Track as Risk" action in the refinement widget. Risks appear in the Health tab (RiskSummaryCard with 3×3 likelihood×impact matrix) and the Actions tab (kanban board with Open/Mitigating/Closed columns).

---

## What the AI Does Not Do

- **Calculate.** NPV, ROI, cost rollups, and sensitivity analysis use a deterministic calculation engine. The AI structures the model and suggests benchmark ranges; arithmetic is done mechanically.
- **Look up archetypes.** When a known system type (CRM, ERP, HRIS) appears in the ontology, data entity inference uses a lookup table — not a model call.
- **Traverse the graph.** Relationship queries, concept lookups, and cross-reference checks run as database queries against persisted state.
- **Run passively.** Nothing in StrategyOS triggers an AI call on page load, navigation, hover, or background polling. Every metered call is behind an explicit user action or an asset lock event.
- **Detect structural conflicts.** The GCE's 18 pattern detectors are pure deterministic functions. AI only enters the coherence pipeline to translate structural findings into signal language.

---

## Cost Architecture

Every AI call carries a `caller` tag that flows through the usage tracker. The tracker records model, caller, input tokens, output tokens, and estimated cost per call. An in-app HUD shows real-time usage with a kill switch for emergencies.

The two models in use:
- `claude-sonnet-4-6` — synthesis, briefing generation, coherence enrichment
- `claude-haiku-4-5-20251001` — signal detection, tier classification, component analysis, inference

Haiku handles the high-frequency, structured-output work. Sonnet handles the synthesis work where output quality matters most. System prompts use prompt caching (`cache_control: ephemeral`) on repeated capability calls — saving approximately 90% on input tokens for calls with the same system prompt.

Staleness guards prevent redundant generation: if existing intelligence is fresh (asset unchanged since last run), Phases 1–3 are skipped. Phase 4 (assembly) always runs to ensure the briefing reflects the current state of signals and insights.

---

## The Operating Model Taxonomy

The operating model asset assesses organisational readiness across six dimensions and five archetypes.

### The six dimensions

| Dimension | ID | What it covers |
|---|---|---|
| Structure & Teams | `structure_teams` | How teams are arranged and what they own — team size, responsibility division, functional vs product organisation |
| Governance & Decisions | `governance_decisions` | Who decides what, how fast, and at what level — decision rights, approval layers, cross-functional decisions |
| Ways of Working | `ways_of_working` | How work moves through the organisation — team rhythms, discovery and delivery cadence, cross-functional handoffs |
| People & Culture | `people_culture` | Skills, behaviours, incentives, and norms — whether capabilities exist and culture supports strategic intent |
| Technology & Data | `technology_data` | Systems, platforms, and information flows — whether technology enables or constrains operations |
| Performance & Learning | `performance_learning` | How outcomes are tracked and how the organisation responds — feedback loops, metrics, adaptation capacity |

### The five archetypes

| Archetype | Label | Strategic framing |
|---|---|---|
| `product_led` | Product-led | Small teams owning products end-to-end. Speed and outcomes over process. |
| `enterprise` | Enterprise | Functional depth at scale. Governance, coordination, and process rigour. |
| `platform` | Platform | Internal teams building shared capabilities others build on. |
| `professional_services` | Professional services | Expertise-led delivery organised around clients or engagements. |
| `founder_led` | Founder-led | Moving fast with limited structure. Building process as you scale. |

### Scoring and gap badges

Each dimension is scored on a three-point readiness scale crossed with a three-level criticality weight:

| Score | Criticality | Gap badge | Meaning |
|---|---|---|---|
| `not_ready` | `critical` | Critical gap | Highest priority — blocking |
| `not_ready` or `partway` | `critical` or `important` | Gap | High priority — needs attention |
| `not_ready` or `partway` | `important` or `watch` | Developing | Medium priority |
| `ready` | any | Strength | Healthy — potential leverage point |

The intelligence serialiser sorts dimensions by `(readiness gap) × criticality weight` descending, so the highest-risk dimensions always appear first in AI prompts. This matches the ordering used in the VerdictRollup UI.

---

## The Technology & Data Map Generator

The TDM asset is generated in a single Sonnet call that assembles signals from multiple strategy assets and infers the technology estate the company needs.

### Signal sources

The generator reads all locked assets for the strategy and extracts:

| Source asset | Extracted signals |
|---|---|
| Problem statement | Regulatory constraints (APRA, CDR, etc.) and explicit exclusions (`notDoing`) |
| Wardley map | Components with evolution stage and value-chain depth; named dependencies |
| Financial model | Capability build/buy decisions and confirmed vendor names from notes |
| OKR cascade | Key result texts (imply measurement, compliance, and scaling requirements) |

All extraction is defensive — each asset's `data` field is typed as `Record<string, unknown>` and every field read falls back gracefully if absent. A strategy with only a description and no other assets still produces a useful map.

### Business model and operating model inference

The generator passes `businessModel` and `operationalModel` from the org profile into the prompt. The system prompt carries explicit inference rules per model type:

- **SaaS platforms** → `cicd_devops`, `apm_monitoring`, `feature_flags`, `product_analytics`
- **Marketplaces** → `payment_gateway`, `search_discovery`, `fraud_detection`
- **AI service companies** → `llm_observability`, `ai_gateway`, `vector_db`
- **Consulting / services** → `project_management`, `document_management`; skip `payment_gateway` unless billing is noted
- **Platform operating model** → `api_management`, developer portal consideration
- **Product operating model** → `product_analytics`, `apm_monitoring`

If `businessModel` or `operationalModel` is `unknown` (the default when not captured in the problem statement), the model infers from the company description.

### Catalogue and categoryId contract

The full taxonomy catalogue (`tech-categories.ts`) is passed to the prompt as a compact `id:label:layer` list. The model is required to use catalogue IDs exactly — invented IDs are silently dropped by `mapToSystems()` on the way out. This prevents hallucinated categories from reaching the canvas.

The catalogue currently covers 72 categories across five layers: engagement, application, integration, data, and infrastructure. `TAXONOMY_VERSION` is bumped when categories are added or removed.

### Target size and stage filter

The prompt targets **10–18 systems**. The stage/size filter instructs the model to exclude heavyweight enterprise categories (`erp`, `hris`, `mainframe`, `scada`, `data_warehouse`, `legal_clm`, `data_catalog`, `backup_dr`) for companies with ≤50 people unless explicitly signalled. This prevents seed-stage maps from filling up with irrelevant enterprise tooling.

### Minimum coverage guarantee

The system prompt includes a coverage requirement: every company must have at least one system covering identity/auth (`iam` or `secrets_management`), cloud hosting (`cloud_platform`), and build/deploy if building software (`cicd_devops`). This is a completeness floor, not a ceiling — the goal is precision, not exhaustion.

### Confirmed vs suggested vendors

A `confirmedVendor` is set only when a specific product name appears in the input signals (e.g. "AWS" from a financial model note, "Datadog" from a Wardley component). The model is instructed not to set an empty string — the field must be omitted if no vendor is confirmed. On the canvas, confirmed systems display the vendor name; unconfirmed systems display the category label with suggested vendors in the side panel.

### Token budget

The call uses `claude-sonnet-4-6` with `maxTokens: 4500`. This supports up to 25 systems (schema hard cap) with connections and compact reasons comfortably within budget. The schema limits `reason` to ~12 words to keep output tight. Increasing to 5000+ is the correct lever if the catalogue grows significantly.

### Wardley evolution → strategic role mapping

| Wardley evolution stage | TDM strategic role |
|---|---|
| genesis / custom-built | differentiating |
| product | enabling |
| commodity | commodity |

The model may override this mapping where business context warrants — e.g. a commodity-stage component that is the company's core product would be marked differentiating.

---

*This document covers the intelligence pipeline, signal system, Global Coherence Engine, and ontology layer as implemented. For the capability inventory, see `docs/ai-capabilities-reference.md`. For the inference dependency map, see `docs/inference-map.md`. For architectural decisions, see `docs/architecture-decisions.md`.*
