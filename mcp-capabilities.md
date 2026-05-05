# MCP Capabilities — StrategyOS

StrategyOS exposes a full **Model Context Protocol (MCP) server** that turns the platform into an externally-accessible strategic intelligence API. Any MCP-compatible AI agent — Claude Desktop, a custom agent, a third-party workflow — can connect to StrategyOS, read strategy data, reason over it, and write structured findings back with full provenance.

This document describes the MCP surface, what it can be used for, and how to build agentic workflows on top of it.

---

## 1. What the MCP server is

The MCP server (`mcp-server/`) is a standalone **Python FastMCP service** that runs alongside the Next.js web app. It connects directly to the same Supabase instance the web app uses, exposes 27 tools via the Model Context Protocol, and handles multi-turn conversations through a dedicated `/conversation` endpoint.

**Key characteristics:**

- **Read-write, not read-only.** External agents can capture signals, log decisions, link assets, track risks, and update confidence — with the same data layer the web app uses.
- **Dry-run by default.** Every write tool accepts a `confirm` parameter. At `confirm=false` (the default), the tool returns a preview of what would be written. At `confirm=true`, it commits. This prevents accidental writes in multi-turn conversations.
- **Provenance on every write.** All writes are tagged with `source="mcp_session"`, `session_id`, and `timestamp`. Writes land with `status="pending_review"` and can be promoted in the web app.
- **No synthesis-of-synthesis.** Analytical tools return assembled data for the host AI to reason over — they do not call an LLM to pre-synthesise a response. The host agent does the thinking; StrategyOS provides the data.

### Deployment modes

| Mode | Transport | How to connect |
|------|-----------|---------------|
| Claude Desktop | stdio | Add to `claude_desktop_config.json`; launch via `uv run python server.py` |
| Web app embedded | HTTP (port 8765) | Next.js app POSTs to `/conversation`; rendered in the Intelligence Panel |
| Third-party agent | HTTP | Any MCP client can connect to the HTTP transport with the shared secret |

---

## 2. Tool inventory

### Discovery tools

Start every session with these. They tell you what exists and how to navigate to it.

| Tool | Key parameters | Returns |
|------|---------------|---------|
| `list_strategies` | — | All strategies with IDs, titles, domains, status |
| `list_assets` | `strategy_id` | All assets with IDs, types, status, confidence, whether an intelligence briefing exists |
| `list_signals` | `strategy_id`, `severity` (filter), `asset_id` (filter), `limit` | Signals grouped by severity — observations, risks, opportunities, competitive signals |
| `search_assets` | `strategy_id`, `asset_type`, `query`, `has_signals`, `confidence`, `status` | Filtered asset list with one-line summaries and coverage stats |

### Entry-point tools

High-level tools that compose rich responses from multiple data sources. These are the best starting points for most agentic workflows.

| Tool | Key parameters | Returns |
|------|---------------|---------|
| `strategy_briefing` | `strategy_id` | Full intelligence dashboard: signal cards grouped by severity, asset briefings, coherence findings, coverage gaps, recommended next actions |
| `inspect_asset` | `asset_id` | Per-type structured serialisation of asset data (e.g., Decision Stack goals; Wardley Map components and dependencies; OKR objectives and key results) plus its intelligence briefing and linked signals |
| `ask_strategy` | `question`, `strategy_id` | Question-driven routing: classifies the question as status / inspection / gap / comparison / analytical, then composes the appropriate response. The general-purpose entry point. |
| `challenge_brief` | `strategy_id` | Adversarial stance — surfaces the strategy's weakest points: low-confidence assets, unresolved coherence conflicts, unacknowledged signals with no response |

### Analytical tools

Cross-asset synthesis and timeline access.

| Tool | Key parameters | Returns |
|------|---------------|---------|
| `run_coherence_check` | `strategy_id`, `confirm` | At `confirm=false`: cached coherence state. At `confirm=true`: triggers a fresh evaluation (deterministic graph checks + AI enrichment), persists results, returns conflict list with severity and affected assets. Metered — requires explicit confirmation. |
| `strategy_timeline` | `strategy_id`, `limit`, `event_type` (filter) | Chronological audit trail sorted most-recent-first: asset creation/update/activation, signals, coherence conflicts detected/resolved, journal entries, initiative changes |

### Detail retrieval tools

Drill-down from rendered results.

| Tool | Key parameters | Returns |
|------|---------------|---------|
| `get_asset_detail` | `asset_id` | Compact card: type, status, confidence, headline, key signal, signal count |
| `get_signal_detail` | `signal_id` | Full signal view including source/target asset context, synthesis suggestion, which detector found it |
| `get_asset_data` | `asset_id`, `format` (`"text"` or `"chart_data"`) | Raw `asset.data` payload; `chart_data` format returns visualisation-ready JSON (scatter / network / tree / matrix / hierarchy depending on asset type) |

### Write-back tools

All write tools default to `confirm=false` (preview mode). Pass `confirm=true` to commit.

**Signal and observation capture:**

| Tool | Key parameters | What it writes |
|------|---------------|---------------|
| `capture_signal` | `strategy_id`, `title`, `description`, `severity`, `source_asset_id`, `target_asset_id`, `signal_type` | A signal record (observation / risk / opportunity / competitive) with optional source/target asset links |
| `capture_assumption` | `asset_id`, `assumption_text`, `confidence` | A signal of type `assumption` linked to the asset; severity `medium` |
| `capture_contingency` | `asset_id`, `assumption_title`, `contingency_text` | A signal of type `contingency_plan` linked to the asset |
| `create_journal_entry` | `strategy_id`, `title`, `body`, `entry_type`, `linked_asset_ids` | A journal entry signal (decision / reflection / milestone) optionally linked to specific assets |

**Risk management:**

| Tool | Key parameters | What it writes |
|------|---------------|---------------|
| `track_risk` | `strategy_id`, `title`, `description`, `likelihood`, `impact`, `owner`, `source_finding_id` | A tracked risk record promoted from a coherence finding, with likelihood × impact matrix |
| `add_risk` | `strategy_id`, `title`, `description`, `likelihood`, `impact`, `owner` | A new tracked risk (not promoted from a finding) |
| `list_risks` | `strategy_id`, `status` filter | Table of tracked risks with likelihood × impact, owner, status |
| `resolve_finding` | `conflict_id`, `resolution_note` | Marks a coherence conflict as resolved; records a resolution signal with the documented reasoning |

**Confidence and metadata:**

| Tool | Key parameters | What it writes |
|------|---------------|---------------|
| `update_confidence` | `asset_id`, `field_path`, `new_confidence`, `reason` | Updates asset-level or field-level confidence; records the reason as a signal |

**Graph connections:**

| Tool | Key parameters | What it writes |
|------|---------------|---------------|
| `create_asset_link` | `source_asset_id`, `target_asset_id`, `relationship` | Creates a shared entity (Tier 2 edge), reference records on both assets, and a cross-reference signal. The connection becomes visible in the graph view. |

**Structural updates (asset-type-specific):**

| Tool | Key parameters | What it writes |
|------|---------------|---------------|
| `add_component` | `asset_id`, `name`, `evolution` (0–1), `visibility` (0–1), `depends_on` | Appends a component to a Wardley Map |
| `capture_okr` | `asset_id`, `okr_type` (objective / key_result / initiative), `title`, `parent_id`, `metric`, `target` | Appends an objective, key result, or initiative to an OKR Cascade |
| `capture_falsification` | `asset_id`, `goal_id`, `condition` | Sets a falsification criterion on a Decision Stack goal |
| `update_stakeholder` | `asset_id`, `stakeholder_name`, `field`, `new_value` | Updates a named stakeholder's position, influence, interest, or notes in a Stakeholder Architecture |

---

## 3. Agentic use cases

The following workflows are enabled by the MCP surface as of the current implementation. Each is a multi-tool sequence an agent can execute autonomously.

### Strategy intelligence briefing

Get a complete picture of a strategy's current state.

```
list_strategies()
→ strategy_briefing(strategy_id)
→ list_signals(strategy_id, severity="high")
→ get_signal_detail(signal_id) for each high-severity signal
```

Output: A structured briefing covering asset inventory, signal landscape, coherence findings, coverage gaps, and suggested next actions.

### Asset deep-dive

Understand a specific asset in full context.

```
search_assets(strategy_id, query="customer")
→ inspect_asset(asset_id)
→ get_signal_detail(signal_id) for linked signals
→ ask_strategy("how does this connect to our Wardley Map?")
```

### Assumption pressure-test

Challenge the strategy's assumptions systematically.

```
challenge_brief(strategy_id)
→ inspect_asset(decision_stack_id)  [examine stated assumptions]
→ capture_falsification(asset_id, goal_id, "if X happens", confirm=true) for each assumption
→ capture_assumption(asset_id, "we assume Y is stable", confirm=true) for undocumented assumptions
→ create_journal_entry(strategy_id, "Assumption review", "...", entry_type="decision", confirm=true)
```

### Coherence audit and resolution

Detect and resolve cross-asset misalignments.

```
run_coherence_check(strategy_id, confirm=true)
→ get_signal_detail(conflict_id) for each HIGH conflict
→ ask_strategy("what's the root cause of the conflict between X and Y?")
→ resolve_finding(conflict_id, "decision: standardise on X because...", confirm=true)
OR
→ create_asset_link(asset1, asset2, "tension: vision scope vs. map positioning", confirm=true)
→ track_risk(strategy_id, "unresolved positioning conflict", ..., source_finding_id=conflict_id, confirm=true)
```

### Competitive signal capture

Process a competitor announcement and route findings to the strategy.

```
ask_strategy("I just read that [competitor] announced X")
→ search_assets(strategy_id, asset_type="competitor_analysis")
→ capture_signal(strategy_id, "Competitor X announced Y", severity="high", signal_type="competitive", confirm=true)
→ capture_assumption(asset_id, "We assumed competitor X would not move on Y until Q3", confirm=true)
→ create_journal_entry(strategy_id, "Competitive update", "...", entry_type="reflection", linked_asset_ids=[...], confirm=true)
```

### Strategic decision log

Record a significant decision with full context.

```
ask_strategy("we've decided to prioritise the enterprise segment over SMB")
→ list_assets(strategy_id) [identify affected assets]
→ create_journal_entry(strategy_id, "Segment prioritisation decision", "body...", entry_type="decision", linked_asset_ids=[okr_id, wardley_id], confirm=true)
→ update_confidence(asset_id, "asset", "provided", "decision made 2026-05-05", confirm=true)
→ capture_signal(strategy_id, "SMB de-prioritised", severity="medium", signal_type="observation", confirm=true)
```

### Risk register population

Build a risk register from coherence findings and signals.

```
run_coherence_check(strategy_id, confirm=true)
→ list_signals(strategy_id, severity="high")
→ track_risk(strategy_id, title, description, likelihood="high", impact="high", owner="CEO", source_finding_id=conflict_id, confirm=true) for each finding
→ list_risks(strategy_id, status="open")
```

### Strategy evolution tracking

Build a structured view of how a strategy has changed over time.

```
strategy_timeline(strategy_id, event_type="journal")
→ strategy_timeline(strategy_id, event_type="conflict")
→ ask_strategy("what are the three biggest changes to this strategy in the last 90 days?")
```

---

## 4. Design principles

**Dry-run before commit.** Every write tool accepts a `confirm` parameter. The pattern is: call the tool once to see what would happen, then call it again with `confirm=true` to commit. This makes it safe for an AI agent to stage writes and confirm them with a human before committing, without requiring special logic in the agent itself.

**Provenance on every write.** MCP writes are distinguishable from web app writes. Every write is tagged with `source="mcp_session"`, `session_id`, and a timestamp. Writes land with `status="pending_review"` by default — visible in the web app as items awaiting human review.

**No double-synthesis.** The `ask_strategy()` analytical path and the `inspect_asset()` tool return assembled, structured data — not a pre-written LLM narrative. The host agent does the reasoning; StrategyOS provides the context. This means the agent's synthesis is always grounded in the same data the web app displays, and there's no risk of two AI layers contradicting each other.

**Entity graph, not a link table.** Cross-asset connections (`create_asset_link()`) work by creating a shared entity between two assets. This is the same mechanism the web app uses for automatic Tier 2 edge discovery — so an MCP-created link appears in the graph view immediately, with no special treatment required.

**Per-type serialisers.** When `inspect_asset()` or `get_asset_data()` returns asset data, it uses a type-specific serialiser rather than dumping raw JSON. A Decision Stack returns `vision / strategy / opportunities / objectives`. A Wardley Map returns `components with evolution and visibility scores / dependency list`. An OKR Cascade returns `objectives / key results / initiatives`. This means the agent receives structured, readable data regardless of how the underlying schema is stored.

**Coverage awareness.** Discovery tools include a coverage footer showing which asset types exist and which are absent. This gives an agent an immediate quality signal: a strategy missing a Problem Statement or a Stakeholder Architecture is incomplete in a specific, actionable way.

---

## 5. The conversation endpoint

The web app's Intelligence Panel (and full-screen Intelligence surface) connects to the MCP server's `/conversation` POST endpoint rather than the MCP tool protocol directly. This endpoint is optimised for the embedded multi-turn chat use case.

**What it does:**

1. Receives a `message`, `strategy_id`, `session_id`, and optional `assist_context` from the web app
2. Builds a dynamic system prompt from the strategy's current state (assets, signals, findings, initiatives)
3. Calls the Claude API with `tool_use` enabled — the model decides which MCP tools to call
4. Executes tool calls in-process and feeds results back to the model
5. Returns structured output: prose text + Prefab UI components (rendered in React) + coaching context

**Session management:** Conversation sessions are persisted server-side. The web app passes a `session_id` on each turn; the server reconstructs the conversation history with a sliding-window policy (5 full turns + summary) to prevent unbounded token growth.

**Cost controls:** Each conversation turn is metered against the user's rate limit. The Haiku model handles question classification; Sonnet handles analytical responses and coherence evaluation.

---

## 6. Connecting a third-party agent

### Claude Desktop

Add StrategyOS to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "strategyos": {
      "command": "uv",
      "args": ["run", "--project", "/path/to/StrategyOS/mcp-server", "python", "server.py"],
      "env": {
        "SUPABASE_URL": "...",
        "SUPABASE_SERVICE_ROLE_KEY": "...",
        "ANTHROPIC_API_KEY": "..."
      }
    }
  }
}
```

All 27 tools become available in Claude Desktop's tool menu immediately after restart.

### HTTP transport (deployed agent)

The HTTP transport requires the `CONVERSATION_SHARED_SECRET` environment variable to be set on both the server and the client. Any MCP-compatible agent can then connect:

```
POST http://<server>:8765/conversation
Authorization: Bearer <shared-secret>
Content-Type: application/json

{
  "strategy_id": "...",
  "message": "What are the highest-priority signals right now?",
  "session_id": "..."
}
```

### What a connected agent can and cannot do

**Can do:**
- Read any strategy, asset, signal, or risk in the workspace
- Run coherence checks (with explicit confirmation)
- Capture signals, assumptions, contingencies, and journal entries
- Link assets, update confidence, track risks
- Populate structural data in Wardley Maps, OKR Cascades, Decision Stacks, Stakeholder Architectures

**Cannot do (by design):**
- Create or delete strategy assets (the web app creation flows handle this; MCP is for enrichment)
- Bypass the dry-run confirmation on writes
- Access other users' workspaces (the service-role connection is scoped to workspace by the tool implementations)
- Trigger intelligence generation (the LLM capability pipeline is POST-only and user-initiated via the web app)

---

## 7. What third-party agents can build

The MCP surface is designed to support use cases beyond the web app's own interface. Some examples:

**Strategy review bot.** A scheduled agent that runs `strategy_briefing()` weekly, identifies the highest-severity unresolved signals, and posts a Slack summary with direct links to the affected assets.

**Meeting assistant.** An agent embedded in a meeting tool that listens to a strategy discussion, calls `capture_assumption()` and `create_journal_entry()` in real time, and surfaces relevant existing signals from `list_signals()` as the meeting progresses.

**Competitive monitoring agent.** An agent that watches a set of RSS feeds, matches new items against workspace entities, and calls `capture_signal()` for any significant competitive event — enriched with context from the relevant assets via `inspect_asset()`.

**Board report generator.** An agent that calls `strategy_briefing()`, `list_risks()`, and `strategy_timeline()`, then composes a structured board update grounded in the live strategy data rather than a manually-maintained slide deck.

**Onboarding coach.** An agent that uses `challenge_brief()` to surface the strategy's weakest areas, then walks a new team member through each asset via `ask_strategy()`, building their understanding of the strategy through conversation.

All of these are possible today with the current MCP surface, without any changes to the StrategyOS codebase.
