# StrategyOS AI Capabilities Reference

**Audience:** Team members and collaborators
**Purpose:** A plain-English guide to what the AI does in StrategyOS, when it runs, and what it produces. This is not a technical spec — it's the answer to "what's actually happening under the covers?"

---

## How the AI Works

StrategyOS uses AI in two modes:

**Lock-time (automatic, cached).** When a strategy asset is locked, a pipeline runs automatically. It extracts entities from the asset, detects strategic signals, and synthesises briefings. This happens once per lock and the results are stored. Nothing runs again until the asset is locked again or a new asset is added.

**User-initiated (on demand).** Certain AI features only run when you explicitly ask for them — generating a new asset, producing a narrative, or creating a Capability Register. These always require a deliberate action.

**Nothing runs passively.** StrategyOS never calls the AI on page load, on navigation, or in the background. Every metered AI call is behind an explicit user action or an asset lock event.

### Why this matters

The core problem AI is solving here is **recontextualization tax** — the cost of repeatedly re-explaining your strategy to different people, tools, and meetings. Every briefing, every new team member, every quarterly review requires someone to re-absorb context that already exists somewhere. StrategyOS makes that context persistent, structured, and queryable so it doesn't need to be re-derived.

---

## The Lock-Time Pipeline

When you lock a strategy asset, four stages run in sequence:

```
Asset locked
  ↓
Stage 1 — Entity extraction
  Reads the raw asset content.
  Extracts entities: actors, systems, processes, capabilities, data, artifacts.
  Persists them to the ontology graph.

  ↓
Stage 2 — Signal detection
  Reads the ontology graph (not the raw asset).
  Detects strategic issues: gaps, risks, tensions, misalignments.
  Persists signals to the signal store.

  ↓
Stage 3 — Coverage analysis
  Reads the capability register + ontology.
  Assesses which capability areas have strategic coverage.
  Feeds into signal detection for coverage gap signals.

  ↓
Stage 4 — Briefing synthesis
  Reads signals + coverage analysis (not the raw asset).
  Synthesises a headline briefing, key signal, and what-to-watch triggers.
  Persists to the briefing store.
```

**Important:** Raw asset content is only touched at Stage 1. Every downstream stage reads from persisted, computed outputs. This means adding more analysis capabilities doesn't multiply the cost of reading your assets — it reads from the structured outputs instead.

---

## Capability Inventory

52 capabilities across 11 categories.

---

### Asset Generation (15)

These capabilities generate complete strategy assets — either from scratch using strategy context, from uploaded documents or images, or inferred from other existing assets.

| Capability | What it does |
|---|---|
| **decision-stack-generation** | Synthesises a complete 5-layer Decision Stack (vision, strategy, objectives, opportunities, principles) from free-text business context. The foundational asset — most other generation capabilities use it as input when available. |
| **wardley-map-generation** | Generates a Wardley Map with actors, needs, components positioned on the evolution axis (genesis → custom → product → commodity), and dependencies. Includes an assumption log. |
| **okr-cascade-generation** | Generates a full OKR Cascade: North Star Metric, objectives, key results, and interventions. Aligned to Decision Stack when available. |
| **systems-map-generation** | Generates a Causal Loop Diagram with variables, causal connections (polarities), feedback loops (with archetype labels), leverage points, and a system narrative. |
| **stakeholder-arch-generation** | Generates a Stakeholder Architecture with 4–8 profiled stakeholders, influence/interest mapping, stance classification, and an engagement strategy. |
| **problem-frame-generation** | Synthesises a structured Problem Frame: problem statement, current reality, desired outcome, key constraints, assumptions, and out-of-scope boundaries. |
| **strategic-bets-generation** | Generates 3–6 Strategic Bets — the irreversible, high-consequence commitments in the strategy — with rationale, time horizon, confidence, and assumptions. |
| **capability-map-generation** | Generates a Capability Map with 3–5 domains and maturity-rated capabilities (developing / established / optimised). |
| **operating-model-conditions** | Generates condition-based readiness assessment for the Operating Model v2. Parallel Haiku calls across 7 dimensions (structure_teams, governance_decisions, ways_of_working, people_culture, technology_data, performance_learning, commercial_incentives). Includes dedup pass and cost guards. Each condition carries state (missing / emerging / operational / embedded) and criticality (critical / important / watch). |
| **operating-model-synthesis** | Produces a structural verdict from the OM assessment: verdict sentence, top change items (highest criticality×gap score), and leverage items (high readiness×criticality). Runs in Phase 3 pipeline for `operating_model` assets. Model: Sonnet. |
| **enterprise-arch-generation** | Generates an Enterprise Architecture with systems organised by layer (presentation / application / data / infrastructure) and an integration map. |
| **competitive-landscape-generation** | Generates a Competitive Landscape analysis: competitor profiles with strengths/weaknesses/evolution stage, your positioning, and differentiation moats. |
| **financial-model-generation** | Structures a Financial Model from strategy context and initiative data. AI suggests benchmark ranges for revenue drivers and cost lines. All arithmetic (NPV, ROI, cost rollups, sensitivity scenarios) is handled by a deterministic calculation engine — AI never performs the maths. Model: Haiku. (Phase 19) |
| **customer-journey-generation** | Generates a stage-based Customer Journey map with touchpoints, pain points, and capability coverage per stage. Integrates Stakeholder Architecture (customer profiles) and Wardley Map (touchpoint components) when available. Model: Haiku. (Phase 18) |

---

### Signal Detection (7)

These capabilities run at asset lock time. They scan the strategy for specific categories of strategic issue and produce typed signals. Each signal has a severity (high / medium / low), a confidence score, and an optional suggested action.

| Capability | Signal type | What it detects |
|---|---|---|
| **strategic-bet-detector** | `strategic_bet` | Identifies the primary irreversible commitments in the strategy — the conviction-layer bets that foreclose options and shape all downstream choices. Informational, not a warning. |
| **capability-gap-detector** | `capability_gap` | Capabilities required by strategy goals that are absent from all locked assets. Uses causal loop vocabulary (leverage point, capacity constraint). |
| **efficiency-gap-detector** | `efficiency_gap` | Activities where the strategy invests in custom-building capabilities that evolution theory places in the commodity or product zone. Flags build-vs-buy mismatches. |
| **execution-risk-detector** | `execution_risk` | Concrete execution risks: ownership vacuums, North Star misalignment, resource contention, OKR confidence gaps, delivery risks. |
| **fragile-dependency-detector** | `fragile_dependency` | Critical-path components in early evolution stages (genesis or custom-built). These are high-risk dependencies that could stall the entire strategy. Always high severity. |
| **misaligned-objective-detector** | `misaligned_objective` | Objectives that contradict the North Star, violate principles, or are untraceable to strategic intent. Covers both direct contradictions (high) and weak alignment (medium). |
| **structural-tension-detector** | `structural_tension` | Reinforcing negative loops, "fixes that fail" archetypes, and balancing loops within the strategy that create irresolvable structural tensions. Uses CLD methodology. |

---

### Coherence Analysis (1)

| Capability | Signal types | What it does |
|---|---|---|
| **coherence-check** | `cross_asset_conflict`, `cross_asset_gap`, `cross_asset_amplification` | Runs a global coherence pass across all locked assets. Detects conflicts between assets (contradictory claims), gaps (something one asset implies that another asset is missing), and amplifications (positive reinforcing relationships between assets). Also computes a strategy health score (0–1). |

---

### Cross-Asset Inference (5)

These capabilities derive one asset from another, allowing the strategy to grow without starting from scratch each time.

| Capability | From → To | What it does |
|---|---|---|
| **wardley-to-capability** | Wardley Map → Capability Map | Groups Wardley components into capability domains to produce a Capability Map draft. |
| **decision-to-bets** | Decision Stack → Strategic Bets | Infers 3–5 Strategic Bets from the strategy and opportunities layers of a Decision Stack. |
| **bets-to-okr** | Strategic Bets → OKR Cascade | Each bet drives ≥1 Objective and 2–3 Key Results, producing an OKR Cascade draft aligned to strategic commitments. |
| **capability-to-operating-model** | Capability Map → Operating Model | Maps capability domains to teams and governance structures, producing an Operating Model draft. |
| **stakeholder-to-systems** | Stakeholder Architecture → Systems inference | Infers system relationships and dependencies from stakeholder profiles and engagement patterns. |

---

### Ingestion & Parsing (5)

These capabilities convert external inputs — images, documents, structured text — into asset drafts. They run when a user uploads something.

| Capability | Input | Output |
|---|---|---|
| **wardley-image-parser** | Wardley Map image (PNG/JPEG) | WardleyMapData draft. Preserves precise evolution positions from the image. |
| **wardley-dsl-parser** | Wardley DSL text or free-form description | WardleyMapData draft. Auto-detects structured vs free-form input. |
| **systems-image-parser** | Systems Map / CLD image | SystemsMapData draft with variables, connections, and loops. |
| **strategy-brief-extractor** | Strategy document (any format) | Extracts intake fields (title, domain, context) for pre-filling the strategy creation form. Returns confidence level and parse warnings. |
| **wardley-to-systems-map** | Existing Wardley Map asset | Systems Map (CLD) draft — converts component dependencies and evolution positions into causal variables and loops. |

---

### Ontology & Graph Building (3)

These capabilities build and maintain the semantic knowledge layer that connects everything else.

| Capability | What it does | When it runs |
|---|---|---|
| **asset-concept-extractor** | Extracts enterprise-grade entities from any asset type: actors, systems, processes, capabilities, data entities, artifacts. Uses AI rather than regex for richer extraction. Checks against existing concepts to avoid duplicates. | Lock time (Stage 1) |
| **domain-ontology-generator** | Takes the extracted concept set and generates semantic business capability domains — clusters that reflect how the enterprise actually organises its capabilities, not generic templates. Validates for completeness and non-overlap. | Post-extraction; ontology generation workflow |
| **register:capability-inference** | Selects reference capabilities from the APQC-inspired taxonomy and infers strategy-specific additions. Links ontology concept IDs to register capabilities. Keeps AI output small (IDs only) to avoid truncation risk. | Capability Register creation |

---

### Narratives & Synthesis (4)

These capabilities produce human-readable strategic communication from structured strategy data.

| Capability | What it does |
|---|---|
| **narrative-construction** | Converts locked strategy assets into a structured strategic narrative. Produces base text for a target audience (executive / investor / product / market) and focus (full strategy / product / market / execution). Pre-tone — ToneAlignment shapes it next. |
| **tone-alignment** | Rewrites a pre-tone narrative to match a target tone profile: analytical, persuasive, inspirational, or neutral. Preserves structure while changing voice. |
| **synthesis-aggregator** | Aggregates strategy signals into thematic clusters for a synthesis report. Identifies the major themes emerging from the signal set with supporting findings cards. |
| **recommendations-generator** | Generates prioritised, actionable recommendations from a synthesis report. Produces specific actions with rationale, not generic advice. |

---

### Landscape & Component Analysis (5)

These capabilities provide deep analysis on specific assets on demand.

| Capability | What it does |
|---|---|
| **component-intelligence** | Analyses individual Wardley Map components for maturity, direction of change, drivers, and industry behaviour. Only analyses components marked as strategically central or with low confidence — avoids re-analysing known stable components. |
| **landscape-synthesis** | Analyses a Wardley Map or Competitive Landscape to produce a structured synthesis: value creation logic, landscape forces, investment assessment, risk landscape, and opportunity spaces. Surfaces the landscape as-is without prescribing strategy. |
| **insight-extraction** | Generates structured business domain insights from strategy context — observations, patterns, opportunities, constraints. Persists results to the insights table, replacing any previous batch. |
| **strategic-opportunity-generator** | Generates 3–5 plausible strategic opportunities with evidence and confidence scores. Produces options only — does not evaluate or rank them. |
| **movement-analysis** | Analyses a Wardley Map to identify component movements needed (current vs target state), capability gaps, sequencing of changes, and transformation risks. |

---

### Evaluative Intelligence (2)

These capabilities assess structural quality — whether the strategy is well-formed against established principles and whether intent chains are connected across assets. They produce findings-grade output that enters the intelligence feed directly (no signal consolidation). Lifecycle-gated: draft assets are skipped.

| Capability | What it does |
|---|---|
| **doctrine-assessment** | Per-asset evaluation against curated strategic principles. Each asset type has tailored principles assessing what the asset evidences about strategic maturity — not what it implements. Active assets get Phase 1–2 principles (know your users, systematic learning). Confirmed assets get all 4 phases. Max 2–3 findings per asset. All output in business language — no framework terminology. |
| **traceability-gap-detection** | Hybrid deterministic + AI capability. Step 1 (zero cost): pure TypeScript traversal of entity references to detect broken intent chains — Decision Stack → OKR, OKR → Wardley Map, Strategic Bets → OKR, Wardley → Systems Map, Stakeholder → Decision Stack. Step 2 (Haiku, only if gaps found): narrative synthesis of the 2–3 most impactful gaps. Distinct from coverage signals: traceability detects missing connections within existing assets, not missing asset types. |

A deduplication pass in the assembler suppresses evaluative findings that overlap with existing signals and enforces a combined cap of 3 evaluative findings per asset across both capabilities.

---

### Competitive Intelligence (2)

These capabilities run as part of the per-competitor analysis pipeline in the Competitive Landscape asset. Phase 1 complete (2026-04-27). Phase 2 (cross-competitor theme synthesis) not yet wired to any route.

| Capability | What it does |
|---|---|
| **competitor-evidence-extraction** | Extracts `ExtractedClaim[]` from a single piece of competitor evidence (URL, note, or uploaded content). Runs per evidence item. Max 1,500 tokens. Model: Haiku. |
| **competitor-findings-synthesis** | Synthesises extracted claims from all evidence items for one competitor into typed `CompetitorFinding[]` (threat / opportunity / assumption). Explicit system prompt locks JSON schema to prevent field collision (`confidence → evidenceStrength`). Max 2,000 tokens. Model: Sonnet. Writes `findings + lastAnalysedAt` to `strategy_competitors`. |

Phase 2 capability (`competitive-cross-reference`) exists in the codebase but is not called from any route. `competitor-profile-synthesis` is dormant — candidate for deletion.

---

### Impact Analysis (2)

These capabilities run when a user requests analysis of an external context entry (uploaded article, note, or document) against existing strategy assets.

| Capability | What it does |
|---|---|
| **impact-analysis** | Cross-asset comparison between an external context entry and all locked strategy assets. Produces per-asset impact severity and specific strategic questions. Max cost ~$0.015–0.035/run. Model: Sonnet. Persists results to `context_entries.impact_assessment` JSONB field. Rate-limited (`impact.analyze` route key). (Phase 9A) |
| **impact-suggest** | Generates a suggested field value for a specific strategy field based on the content of a context entry. Triggered inline in the ImpactContextCard UI. Model: Haiku. (Phase 9A.2) |

---

## Signal Types Reference

Signals are the AI's way of flagging things that need attention. Each signal has:
- **Type** — what category of issue it is
- **Severity** — high / medium / low
- **Status** — open → acknowledged → resolved
- **Confidence** — 0–1 score
- **Lifecycle relevance** — which stages of strategy work it's most actionable in

### Analysis Signals (7)

Generated by detector capabilities scanning individual assets.

| Signal | Plain English | Severity range | Most relevant when |
|---|---|---|---|
| `strategic_bet` | "Your strategy is making a significant, hard-to-reverse commitment here." Informational — not a warning. Helps teams see what they're actually betting on. | medium | Asset just locked |
| `capability_gap` | "Your strategy requires this capability to succeed, but it doesn't exist anywhere in your current asset set." | high / medium | Asset locked, register confirmed, journey generated |
| `efficiency_gap` | "You're planning to build something custom that the market has already commoditised. Consider buying or renting instead." | medium (advisory) | Asset locked, financial model |
| `execution_risk` | "There's a concrete risk that this won't get delivered — missing owner, unclear accountability, resource conflict, or confidence problem." | high / medium | Building initiatives |
| `fragile_dependency` | "A critical part of your strategy depends on something early-stage or custom-built. If this breaks, a lot breaks with it." | high (always) | Asset locked, journey generated |
| `misaligned_objective` | "This goal contradicts your North Star, violates a stated principle, or can't be traced back to your strategic intent." | high / medium | Asset locked, building initiatives |
| `structural_tension` | "The way your system is structured creates a self-reinforcing problem that can't be resolved by doing more of the same thing." | high / medium | Asset locked |

### Coherence Signals (3)

Generated by the coherence check across pairs of assets.

| Signal | Plain English | Most relevant when |
|---|---|---|
| `cross_asset_conflict` | "Two assets are saying contradictory things. Your Wardley Map and your OKRs are pulling in different directions." | Asset locked (any) |
| `cross_asset_gap` | "One asset implies something that another asset is missing. Your Decision Stack mentions a capability that doesn't appear in your Wardley Map." | Asset locked, register confirmed |
| `cross_asset_amplification` | "These two assets are reinforcing each other positively — the strategy is stronger because of this alignment." (Good news signal.) | Asset locked |

### Roll-Up Trap Signals (3, added in Phase 17)

Generated when the initiative portfolio reveals structural gaps in how strategy connects to execution.

| Signal | Plain English | Most relevant when |
|---|---|---|
| `empty_bucket` | "This Opportunity has no Initiatives attached to it. It's a strategic theme with no execution path." | Building initiatives |
| `orphaned_initiative` | "This Initiative isn't linked to any Opportunity or OKR. It's execution without strategic grounding." | Building initiatives |
| `thin_execution` | "Your strategy has multiple Opportunities but very few Initiatives across all of them. Coverage is too thin to deliver." | Building initiatives |

### Coverage Signals (2, added in Phase 17/19)

Generated when the capability register and financial model reveal strategic blind spots.

| Signal | Plain English | Most relevant when |
|---|---|---|
| `unstrateted_spend` | "This capability area has confirmed cost allocation but zero strategic coverage. You're spending here but not thinking strategically about it." | Register confirmed, financial model |
| `strategy_execution_gap` | "Your OKRs target outcomes in a capability area where no Initiatives exist. The goals are set; the work isn't." | Building initiatives, financial model |

---

## Object Type Classification

Not all objects in StrategyOS work the same way. Understanding the distinction prevents confusion about what should be managed vs. what is just a grouping label.

### Managed Entity

Has a clear owner, defined edges (start/end), regular reviews, and an investment thesis. You can ask "where are we with this?" You ship managed entities.

**In StrategyOS:** Wardley Map, Decision Stack, OKR Cascade, Systems Map, Stakeholder Architecture, Problem Frame, Initiatives (Phase 17), OKR Key Results.

### Context Tree

A durable structure describing how the organisation understands itself. Tree-like, actively maintained, not time-bound. Persists until reality changes — not until a planning cycle ends.

**In StrategyOS:** Capability Register, Ontology Graph. These are foundational singletons — not assets with multiple instances or version history.

### Bucket / Category

An aggregation scheme, narrative grouping, or roll-up label. Useful for storytelling and reporting. Buckets don't move — the things inside them move. Never treat a bucket as a managed entity.

**In StrategyOS:** Opportunities (Decision Stack), OKR Objectives, Financial Model roll-up views, strategic themes/pillars.

**The Roll-Up Trap:** When a bucket accumulates a "sponsor," gets added to a hierarchy, and starts being asked "is this on track?" — it's being treated as a managed entity when it isn't. The intelligence layer detects this pattern.

---

## Trigger Map

What event causes what AI to run and what it produces.

| Event | Capabilities triggered | Output produced | Where it surfaces |
|---|---|---|---|
| Asset locked | asset-concept-extractor, signal detectors (7), coherence-check | Ontology concepts, 15 signal types, briefing, health score | Enterprise Map, Signals feed, Asset briefing panel |
| Register created | register:capability-inference | Capability hierarchy (L1 → L2 → L3) with concept links | Capability Register view |
| User generates asset | Relevant asset generation capability | Complete asset draft | Asset builder |
| User uploads image | wardley-image-parser or systems-image-parser | Asset draft pre-filled from image | Asset builder |
| User uploads document | strategy-brief-extractor or wardley-dsl-parser | Pre-filled intake fields or asset draft | Intake form / asset builder |
| User infers asset | Cross-asset inference capability (5 types) | Asset draft derived from source asset | Asset builder |
| User requests narrative | narrative-construction + tone-alignment | Structured narrative in chosen tone/audience | Narratives view |
| User requests synthesis | synthesis-aggregator + recommendations-generator | Synthesis report + prioritised recommendations | Synthesis view |
| Initiative portfolio built | empty_bucket, orphaned_initiative, thin_execution detectors | Roll-Up Trap signals | Initiatives portfolio view, Signals feed |
| Register confirmed + Financial Model | unstrateted_spend, strategy_execution_gap detectors | Coverage signals | Capability Register view, Financial Model view |
| User analyses competitor evidence | competitor-evidence-extraction + competitor-findings-synthesis | `CompetitorFinding[]` per competitor | Competitive Landscape competitor detail panel |
| User analyses context entry (external signal) | impact-analysis | Per-asset impact severity + strategic questions | Inputs panel, Intelligence Panel (Context tab) |

---

## What AI Does Not Do

- **Calculate.** NPV, ROI, cost rollups, and sensitivity analysis use a deterministic calculation engine. The AI structures the model and suggests benchmark ranges; maths is done mechanically.
- **Look up archetypes.** When a known system type (CRM, ERP, HRIS) appears in the ontology, data entity inference uses a lookup table — not a model call.
- **Traverse the graph.** Relationship queries, concept lookups, and cross-reference checks run as database queries against persisted state.
- **Run passively.** Nothing in StrategyOS triggers an AI call on page load, navigation, hover, or background polling.

---

---

## Forthcoming Capabilities

These are designed and specified but not yet implemented. See `docs/plans/intelligence-layer-and-ontology-brief.md` for full specs.

| Capability | What it will do | Phase |
|---|---|---|
| Ontology concept type extension | 8 new concept types (cadence, routine, practice, business_rule, policy, interaction_pattern, cultural_norm, rollup_logic) added to extractor schema and prompt. No migration. | Part 1 |
| `external_dependency_risk` detector | New signal detector — fires when a stakeholder has `boundary_class: external` AND `interaction_patterns` includes `dependency`. Severity: high. Requires Stakeholder Boundary Model data migration. | Part 2 |
| Intelligence Map (Strategy Pulse tab 4) | Force-directed graph: concept nodes (centre), risk nodes (top-right zone), coherence finding nodes (bottom-right zone), asset fallback nodes (periphery). No new API endpoints. | Part 3 |

---

*Last updated: 2026-05-04*
*52 capabilities across 11 categories | 15 signal types (16 forthcoming with external_dependency_risk)*
