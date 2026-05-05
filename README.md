# StrategyOS

### An AI-powered strategy operating system.

## The Big Picture: Beyond Static Planning

Strategy has long been trapped in slide decks and static documents — disconnected from the logic that defines an organization. StrategyOS is an **operating system for organizational logic**, designed to shift strategy from a narrative exercise into a dynamic, interconnected **Strategy Knowledge Graph**.

### Why This is Different

StrategyOS is fundamentally different from traditional planning tools:

*   **Connected vs. Isolated**: In most tools, a Wardley Map and an OKR tracker are separate documents. In StrategyOS, they are nodes in a single graph. A change in your competitive landscape (Wardley Map) automatically ripples through to flag risks in your strategic bets.
*   **The Two-Surface Model**: We separate spatial reasoning from deep inquiry. The web application handles spatial mapping and structure (showing what things *are*), while the conversational surface acts as an active coaching partner (explaining what things *mean*).
*   **Intelligent vs. Static**: Traditional plans are obsolete the moment they are printed. StrategyOS continuously audits your strategy workspace — detecting structural tensions, capability gaps, and misaligned objectives without waiting for your quarterly review.
*   **Structural vs. Narrative**: We focus on the *causality* and *logic* of strategy. By using rigorous frameworks like Wardley Maps and causal systems maps, StrategyOS detects logical fallacies and strategic weaknesses that prose alone would hide.

## Intelligence Assembly & Conversational Coaching

Every strategic asset generates a focused intelligence briefing — a one-sentence headline, tiered insights (urgent / cross-layer / noted), and the single most urgent signal requiring attention.

With our new **Conversational Surface**, this intelligence is deeply interactive:
- **Chat to Web App**: You can explore gaps, stress-test assumptions, and make decisions via chat. The system extracts structured data and writes it back to the asset graph with proper provenance. 
- **Enrichment Loop**: The AI (powered by Claude Sonnet) proactively asks questions to calibrate your confidence or fill out missing falsification conditions without a complex form.
- **Signal Coverage**: Detects diagnostic categories (like fragile dependencies, capability gaps, efficiency gaps) and allows you to converse directly about each signal to resolve conflicts.

## Enterprise Map

StrategyOS builds a **semantic map of your business** from your strategic assets — automatically. It extracts concepts (actors, systems, processes, capabilities, data stores, artifacts), classifies them into AI-generated business domains, and maps relationships between them.

-   **Domain columns**: Concepts organised into semantic business domains (Customer, Product, Operations, Platform, etc.) — derived from meaning, not graph topology.
-   **Capability clusters**: Within each domain, concepts group into abstract business capabilities.
-   **Relationship threading**: Hover any concept to reveal dashed connector threads to related concepts in other domains. The rest of the graph dims to reduce noise.
-   **Explorer view**: A data-dense hierarchical list (Domain → Cluster → Concept) with sortable columns, bulk selection, search filtering, and inline editing.
-   **Hybrid overrides**: User edits (domain reassignment, rename) persist as a patch layer on top of AI-generated structure. Regenerate domains and your manual assignments survive.

## The Strategy Lifecycle

StrategyOS enforces a rigorous approach to building organizational logic:

1.  **Orient**: Anchor the strategy in the specific domain and problem space.
2.  **Gather**: Capture signals and context through guided AI-assisted flows or natural language queries.
3.  **Confirm**: The AI pre-fills models (Wardley, OKRs, etc.) based on upstream context; the human validates the reasoning.
4.  **Lock & Audit**: Once locked, assets enter the intelligence layer where they are cross-calibrated for coherence and become available for conversational deep-dives via our MCP tools.

## Strategic Asset Inventory

-   **Decision Stacks**: The "Why" — Mapping vision to principles and trade-offs.
-   **Wardley Maps**: The "Where" — Visualizing value chains and evolutionary pressure.
-   **OKR Cascades**: The "What" — Aligning metrics to strategic intent.
-   **Systems Maps (CLDs)**: The "How" — Modeling causal feedback loops.
-   **Stakeholder Architectures**: The "Who" — Highlighting influence vs. interest.
-   **Problem Frames**: Synthesises structured problem statements mapping current reality to desired outcomes.
-   **Strategic Bets**: Identifying irreversible, high-consequence commitments shaping downstream choices.
-   **Capability Maps**: Evaluates required capabilities aligned to strategic domains by operational maturity.
-   **Operating Models**: Connects strategic capabilities to accountable teams, processes, and governance rhythms.
-   **Enterprise Architectures**: Structures presentation, application, data, and infrastructure integrations.
-   **Competitive Landscapes**: Assesses competitor profiles, moats, and strategic positioning.
-   **Technology & Data Map**: Maps the full tech estate across five layers (Engagement, Application, Integration, Data, Infrastructure) using a catalogue of 83 categories grounded in TBM v5.0.1. Generated from multi-signal business context (Wardley, OKR, Financial, Problem Statement). Category co-occurrence patterns self-improve over time as more maps are generated in production.

## MCP Capabilities

The Conversational Surface uses the Model Context Protocol (MCP) to provide interactive capabilities to the Next.js panel and to external hosts like Claude Desktop. 

**Entry-Point Tools (Conversational Analysis):**
- `strategy_briefing`: Provides an intelligence dashboard covering active signals, coherence status, and recent insights.
- `inspect_asset`: Retrieves a detailed breakdown of a single asset, including tiered insights and layered comparisons.
- `ask_strategy`: Interprets natural language questions, classifies the intent, and composes synthetic analytical responses.
- `strategy_overview`: Evaluates overall strategy health, surfacing both existing and missing assets to drive recommended actions.

**Helper Tools (Data Enrichment & Curation):**
- `capture_assumption`: Parses unstructured notes and conversationally writes new assumptions back to the asset.
- `update_confidence`: Updates confidence scores based on conversational calibration dialogue.
- `create_asset_link`: Discovers and creates physical links for cross-references between domains.
- `run_coherence_check`: Triggers the coherence pipeline explicitly for active asset relationships.
- `search_assets`, `get_signal_detail`, `get_asset_detail`: Precision lookups extracting explicit contextual nodes for AI routing.

## Technical Architecture

StrategyOS operates as a **capability-routed orchestrator** across two shared interaction surfaces:

### 1. Web Application (Next.js)
Built for spatial canvases and structure.
-   **Capability Registry**: 40+ registered AI capabilities across strategy analysis, asset generation, signal detection, ontology mapping, and coherence synthesis. Each is a pure function with Zod-validated input/output schemas.
-   **Orchestrator & Context Assembler**: Coordinates multi-step AI workflows building high-fidelity prompts from live workspace state.

### 2. Conversational Model Context Protocol (MCP) Server
A standalone Python FastMCP server delivering the conversational surface.
-   **Two-Tier Model Routing**: Uses Claude Haiku for question classification/routing, and Claude Sonnet for deep analytical evaluation and coaching responses.
-   **Dynamic Response Composer**: Turns structured intelligence data into native Prefab UI component trees based on the user's inquiry (e.g., comparison grids, gap analysis cards). 
-   **Dual Hosting Models**: 
    - Exposes a `/conversation` endpoint serving the Next.js app's embedded 440px Side Panel and full-page Intelligence Screen.
    - Exposes MCP tools directly to Claude Desktop and external hosts via `stdio`.

## Development

### Web App Setup

1.  **Environment**: `cp .env.example .env.local`
2.  **Install**: `pnpm install`
3.  **Run**: `pnpm -C app run dev`

### MCP Server Setup

Requires Python 3.11+ and [uv](https://docs.astral.sh/uv/).

1.  **Environment**: The server automatically reads from the repo root `.env.local`. If you need standalone specific variables for the Python server, use `mcp-server/.env`.
2.  **Verify Data Layer**: `cd mcp-server && uv run python test_queries.py`
3.  **Run with Claude Desktop**: Add the MCP server configuration pointing to `mcp-server/server.py` to your Claude Desktop config.

### Verification

```bash
npm run typecheck
npm --prefix app run lint
npm test
```

### Technology & Data Map — taxonomy refresh

The TDM generator uses category co-occurrence signals to surface implied systems (e.g. if a map includes `agri_management`, also consider `scm_planning`, `external_data_apis`, `grc_compliance`). These signals self-improve over time:

Once ~5 maps have been generated in production, run:

```bash
npx tsx scripts/refresh-taxonomy-cooccurrence.ts
```

This queries the DB, computes real co-occurrence frequencies (P(B|A) ≥ 0.40, min support 5 maps), and overwrites `src/ai/capabilities/assets/taxonomy-cooccurrence.generated.ts`. Commit the diff — it's reviewable as a PR. Re-run monthly or whenever patterns shift.

### Stack

Next.js · Supabase · TypeScript · Python · FastMCP · Claude (Anthropic)

---

## Operating Protocols

-   See [`docs/implementation-plan.md`](./docs/implementation-plan.md) for the active roadmap.
-   See [`CLAUDE.md`](./CLAUDE.md) for contribution rules.
-   See [`docs/product-spec.md`](./docs/product-spec.md) for the product vision.
-   See [`docs/plans/conversational-surface-spec.md`](./docs/plans/conversational-surface-spec.md) for detailed MCP and Conversational Surface specifications.
