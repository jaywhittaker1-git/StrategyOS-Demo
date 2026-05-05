# Integrations & External Data — StrategyOS

StrategyOS is built around a core insight: strategy without external context is fiction. The platform is designed to continuously enrich strategy assets with real-world signals — market movements, regulatory changes, technology evolution, competitive intelligence — so that a strategy stays alive rather than becoming a document that decays in a folder.

This document describes how external data flows into the system today, what integrations are planned, and how the integration architecture is structured to support new sources without disrupting the core workflow.

---

## 1. The enrichment model

External data enters StrategyOS through two distinct paths:

**Passive enrichment** happens automatically at key moments — when a Wardley Map is locked, when new competitor evidence is uploaded, when a context entry is added. The system queries relevant external sources in the background and surfaces calibration signals without requiring any action from the user.

**Active ingestion** is initiated by the user — uploading a document, pasting an article, adding a competitor, or triggering a coherence check. The system processes the content, extracts meaning, and links it to strategy assets.

In both cases, the output is always the same: a **signal** — a structured observation with a severity, confidence, source attribution, and links to the affected assets. Signals are the universal currency of the intelligence layer. External data never modifies a strategy asset directly; it surfaces a signal that a human then acts on.

---

## 2. Live integrations

### Anthropic Claude API

Every AI-powered operation in StrategyOS — capability execution, synthesis, coherence analysis, structured extraction — runs through the Anthropic API via `src/ai/client.ts`. No LLM calls happen outside this layer.

- **Models in use:** `claude-haiku-4-5-20251001` (default, fast, cheap) and `claude-sonnet-4-6` (synthesis, OKR generation, systems intelligence, MCP conversation)
- **Architecture rule:** All LLM calls are POST-only and user-initiated. No component mount or GET request may trigger an API call.
- **Cost controls:** Prompt caching on all system prompts (~90% input token reduction on repeated calls); rate limiting via Upstash on every AI-calling route; explicit `maxTokens` on large-output calls.

### Supabase

PostgreSQL-backed data store for all strategy assets, signals, intelligence output, entities, and user data. Auth is handled via Supabase Auth; all database access from the web app is subject to Row Level Security policies, ensuring data is scoped to the authenticated user's workspace.

The MCP server accesses the same Supabase instance via the service-role key (bypassing RLS intentionally — it has its own auth layer via a shared secret).

### Wikidata

When a Wardley Map or Systems Map is locked and the ontology extraction pipeline runs, extracted concepts are enriched against Wikidata at `https://www.wikidata.org/w/api.php`. Wikidata is free and requires no API key.

- **What it adds:** `canonicalDescription`, `wikidataId`, `industryClassification` fields on ontology concepts
- **Confidence level:** `inferred` — the user can override any enriched value
- **When it runs:** Once per ontology regeneration cycle (lock-time only, not on every edit)

### Upstash Redis

Rate limiting backend for AI-calling routes. Every POST route that triggers an LLM call checks a sliding-window counter in Upstash before proceeding. Fails open on Upstash outage (no user-visible impact if Redis is down).

### Miro (optional, Claude Code only)

Miro board content can be ingested into StrategyOS when a `MIRO_ACCESS_TOKEN` is configured in the Claude Code environment. This is an optional integration for teams who sketch strategy visually in Miro before formalising it in StrategyOS — not part of the production web app.

---

## 3. Planned integrations

Integrations are grouped by the type of strategic signal they produce and the phase in which they're planned to ship. All planned sources are already registered in the provider registry (`src/core/integrations/integration.types.ts`) with a `tier` of `coming_soon` or `planned`.

### Evolution signals — Wardley Map calibration (Phase 15A)

Wardley Maps require judgment calls about where a component sits on the evolution axis. These integrations provide objective calibration data to challenge or validate those placements.

**Semantic Scholar** — `https://api.semanticscholar.org/graph/v1` (free, no API key)

Research paper volume is a leading indicator of technology evolution — typically 2–4 years ahead of commercialisation. When a Wardley Map is locked, the system queries paper volume trends for Genesis and Custom-Built components and surfaces a calibration signal when paper volume has grown significantly. Example: *"Paper volume for [X] grew 3× in 24 months — this component may commercialise sooner than the current map suggests."*

**Patent Trends** — USPTO via PatentsView `https://search.rpatentsview.org/` (free, no API key)

Patent filing patterns are a more commercial, more lagging indicator than research papers — the sequence is: papers surge → patents follow → products trail. Patent data is most useful as a corroborating signal alongside Semantic Scholar, not as a primary source. Deferred to Phase 15A alongside the academic signal.

**Job Posting Signals**

Hiring patterns are a lagging indicator of competitor capability investment — a company hiring aggressively in an area signals a strategic bet already underway. Best used as corroborating evidence rather than a primary signal. Deferred with patents and papers to Phase 15A.

---

### Competitive intelligence (Phase 17)

**RSS Feeds** — user-configured subscriptions to competitor blogs, industry analyst feeds, regulatory news

The planned RSS integration is deliberately narrow: rather than ingesting the full stream of a feed, the system filters for mentions of workspace entities (competitors, systems, key actors, capabilities). A single mention is noise; three in 30 days is a weak signal; eight is worth surfacing. The integration supports:

- Custom subscription URLs per workspace
- Entity anchoring to reduce noise
- Signal type classification: product launch, regulatory change, leadership, funding, technology release
- Trend detection thresholds (configurable)

RSS signals link to the Competitor Analysis asset, not the general signals feed.

**Regulatory Feeds**

Curated government and regulator publications, structured as RSS. Low-volume by design — these are structurally important events (consultation closes, enforcement action, new guidance issued) rather than news. Initial seed sources are Australian-first: ASIC, ACCC, APRA, RBA, ATO. Regulatory signals link to the Decision Stack (as external constraints), not general signals.

**Crunchbase**

Funding rounds, acquisitions, headcount trends, and investor network data. Useful for inferring competitor capability investment priorities and M&A-driven acquisitions. Status: Crunchbase Basic API keys are no longer issued (as of 2026); existing keys continue to function. Alternatives under consideration: Dealroom, PitchBook (both paid), or Crunchbase public profile extraction.

---

### Financial benchmarking (Phase 19)

**Australian Bureau of Statistics (ABS)** — `https://api.data.abs.gov.au/` (free, SDMX JSON, no API key)

Calibration input for the Financial Model asset — answering the question *"are our cost assumptions reasonable given what the industry actually pays?"* Key series:
- Labour price index by industry (series 6345.0)
- Average weekly earnings (6302.0)
- Industry value added (5206.0)
- Business conditions sentiment (5676.0)

**Bureau of Labor Statistics (US)** — `https://api.bls.gov/publicAPI/v2/`

Parallel to ABS for multi-geography workspaces. Free with registration for higher rate limits.

---

### Industry data packs (Phase 19–20)

Read-only reference datasets that activate automatically when a workspace declares its industry. These packs provide sector-specific benchmarks without requiring manual configuration.

| Pack | Key sources |
|------|------------|
| Financial services | APRA quarterly (ADI balance sheet/income), ASIC market data (product register, enforcement), RBA publications (monetary policy, stability reviews) |
| Healthcare | AIHW datasets (hospital performance, chronic disease), TGA approvals & recalls, Hospital Benchmark Report |
| Energy | AEMO 5-minute dispatch data (generation mix), Clean Energy Regulator (emissions, renewable certificates), ARENA technology investment roadmap |
| Government & procurement | AusTender contract awards (who wins work, in which capability areas), Budget measures database, Agency corporate plans |

---

### Collaboration tools (timing TBD)

**Notion** and **Slack** are registered as integration providers in the current codebase with data tags for `Documents` and `Strategy context`. These would enable syncing meeting notes, decision logs, and working documents from existing team tools into the StrategyOS context entry system, without requiring manual copy-paste.

**GitHub**, **Linear**, and **Jira** are registered as execution signal providers — surfacing delivery metrics and initiative status as signals against OKR Cascade and Initiative tracking. These integrations are designed to close the loop between strategic intent and operational reality.

---

## 4. Signal ingestion from unstructured content

Beyond the structured integrations above, StrategyOS handles unstructured external content through the **context entry system**.

### Context entries

Users can upload or paste any external content — articles, earnings call transcripts, analyst reports, market analyses, competitor announcements — as a context entry. The system automatically extracts:
- Themes and key claims
- Named entities (companies, people, technologies, markets)
- Statistics and quantitative claims
- Sentiment and tone

This produces a structured representation that can be linked to strategy assets as signals.

### Context impact analysis (Phase 9A, Track 9)

A planned capability that takes a context entry and analyses how its content affects each asset in the current strategy. For each asset it produces:
- A severity rating (high / medium / low / none)
- A description of the specific impact
- A suggestion for how the strategy should respond

The analysis is **non-destructive**: it surfaces signals for human review without modifying any asset data. The user decides whether to act on each finding.

This enables a workflow where a user can paste a competitor announcement or regulatory update and immediately see which parts of their strategy are affected, without having to manually review each asset.

### What-if briefings (Phase 9B, Track 9)

An extension of context impact analysis: inject a piece of external context into the full briefing synthesis and compare the output against the baseline. Produces a before/after comparison per asset, letting a team pressure-test their strategy against a specific scenario. Estimated cost per run: $0.015–$0.035 (Sonnet, targeted context).

---

## 5. Integration infrastructure

### Connections page

Integrations are managed through a Connections page in the workspace settings. Each integration has:
- A status badge (`active`, `disabled`)
- A tier indicator (`available`, `coming_soon`, `planned`)
- Provider-specific configuration (API keys, subscription URLs, filters)
- A `lastSyncedAt` timestamp

New integrations can be enabled without code changes by registering a new provider in `src/core/integrations/integration.types.ts`.

### Provider registry and data tags

Every integration provider is tagged with the type of strategic data it supplies. These tags drive how signals from that source are classified and routed to assets.

| Tag | Sources |
|-----|---------|
| Documents | Notion, Slack, uploaded files |
| Strategy context | Notion, Slack, RSS |
| Financial benchmarks | ABS, BLS, Financial Model inputs |
| Market signals | RSS feeds, regulatory feeds |
| Execution signals | GitHub, Linear, Jira |
| Delivery metrics | GitHub, Linear, Jira |
| Competitive intelligence | Crunchbase, patents, job signals, competitor evidence |
| Evolution signals | Semantic Scholar, patents, job signals |
| Regulatory signals | Regulatory feeds |
| Ontology enrichment | Wikidata |

### API routes

Integration management is handled via `/api/integrations`:

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/integrations` | List all integrations for the workspace |
| POST | `/api/integrations` | Create a new integration (provider + config) |
| PATCH | `/api/integrations/:id` | Update status or `lastSyncedAt` |
| DELETE | `/api/integrations/:id` | Remove an integration |

---

## 6. What was deliberately not pursued

| Source | Why not |
|--------|---------|
| LinkedIn job postings | Terms of service prohibit scraping; Talent Insights is enterprise-priced with no viable API |
| Gartner / Forrester reports | Paywalled; free press releases have low signal density |
| Financial filings (direct scraping) | ASIC/SEC APIs exist but parsing requires significant ML investment; lower priority than Phase 19 benchmarks |
| General news APIs (NewsAPI, GDELT) | Too noisy without entity anchoring and type classification; curated RSS with filters is a better approach |

---

## 7. Integration roadmap

| Phase | Integrations | Status |
|-------|-------------|--------|
| Current | Anthropic Claude API, Supabase, Wikidata, Upstash | Live |
| Current (optional) | Miro (Claude Code only) | Available |
| Track 9 / Phase 9A | Context impact analysis | In design |
| Track 9 / Phase 9B | What-if briefings | Planned |
| Phase 15A | Semantic Scholar, Patent Trends, Job Signals | Planned |
| Phase 17 | RSS Feeds, Regulatory Feeds, Crunchbase | Planned |
| Phase 19 | ABS, BLS financial benchmarks | Planned |
| Phase 19–20 | Industry data packs (4 sectors) | Planned |
| TBD | Notion, Slack (context sync) | Registered |
| TBD | GitHub, Linear, Jira (execution signals) | Registered |
