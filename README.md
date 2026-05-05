# StrategyOS

A strategy intelligence platform that connects fourteen analytical 
frameworks into a single asset graph, runs a continuous coherence 
engine across them, and surfaces conflicts, assumptions, and signals 
through a conversational reasoning surface built on MCP.

Built solo. Live. Not a prototype.

---

## The problem

Strategy work is fragmented by design. A Wardley Map here, OKRs 
there, a financial model in a spreadsheet. AI knowledge systems make 
this worse — they return everything, including stale thinking and 
half-formed ideas, with no way to know what still holds.

StrategyOS treats a strategy as a connected graph of analytical 
assets, not a collection of documents. The intelligence layer runs 
across all of them continuously — not on demand, not after a prompt.

---

## What it does

**Coherence engine** — 18 deterministic pattern detection functions 
run at lock-time across the asset graph. No AI involved. Pure logic. 
Surfaces conflicts like: an OKR assuming market leadership in a 
segment the Wardley Map shows as commodity. Flags it, classifies it, 
attaches it to the affected assets.

**Intelligence pipeline** — AI-generated briefings, signal 
classification, and assumption extraction run per-asset using Claude 
Haiku (routing/classification) and Claude Sonnet (synthesis). Prompt 
caching on all system prompts (~90% input token reduction). Every AI 
call is POST-only, user-initiated — no GET or mount triggers.

**MCP conversational surface** — A standalone Python FastMCP server 
exposes 27 tools via the Model Context Protocol. External agents 
(Claude Desktop, third-party workflows) can read the asset graph, 
reason over it, and write structured findings back with full 
provenance. Dry-run by default — every write previews before it 
commits. All writes tagged with source, session ID, and timestamp.

**External enrichment** — Live integrations: Wikidata (ontology 
enrichment at lock-time), Upstash (rate limiting on all AI routes). 
Planned: Semantic Scholar (evolution signals for Wardley components), 
regulatory feeds (ASIC, APRA, RBA), RSS with entity anchoring, ABS 
financial benchmarks. External data never modifies an asset directly 
— it always surfaces a signal for human review.

---

## Asset graph

14 connected frameworks: Problem Statement · Decision Stack · 
Competitive Landscape · Stakeholder Architecture · Wardley Map · 
Capabilities · Dynamics Map · Customer Journeys · Bet Portfolio · 
OKR Cascade · Operating Model · Initiatives · Financial Model · 
Technology & Data Map

Plus: Strategy Pulse · Input parsing · Ontology · External 
integrations

---

## Development harness

Development runs through a Claude Code harness with four layers:

- **Session lifecycle hooks** — branch status injection, cost 
  optimisation checks on AI file writes, architecture rule injection 
  before context compaction
- **Auto code-review agent** — Sonnet reviews every staged diff 
  before commit: bugs, security, type errors, architecture violations
- **Pre-push gate** — four checks: lockfile sync, tsconfig path 
  coverage, TypeScript, outputTemplate enforcement on all structured 
  AI calls
- **GitNexus skills** — code intelligence across 18,000+ symbols and 
  300 execution flows for impact analysis before any shared code edit

---

## Stack

Next.js 16 · React 19 · TypeScript 5 · Supabase · React Flow · 
Zustand · Python · FastMCP · Claude (Anthropic) · Vitest · Playwright

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
