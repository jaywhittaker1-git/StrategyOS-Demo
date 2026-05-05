# Claude Operating Spec — StrategyOS

## Project

StrategyOS is an AI-powered strategy operating system for professional
teams. It lets organisations build and maintain a connected set of
strategy assets (Wardley Maps, OKR Cascades, Systems Maps, Decision
Stacks, Stakeholder Architectures, Problem Statements) in a single
workspace. An intelligence pipeline runs across those assets
continuously, detecting signals, generating insights, and synthesising
them into tiered briefings. The graph view shows how assets relate
through a shared entity layer — connections are discovered automatically
as assets are completed, not drawn by hand.

---

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5.7
- **Database:** Supabase (PostgreSQL)
- **AI:** `@anthropic-ai/sdk` — default `claude-haiku-4-5-20251001`;
  synthesis `claude-sonnet-4-6` (see `src/ai/client.ts`)
- **Validation:** Zod v4 (`^4.x`) — API differs from v3; do not rely
  on v3 examples
- **State:** Zustand — workspace nav (`activeStrategyId`,
  `activeWorkspaceView`, `strategyEditModalOpen`)
- **Graph:** `@xyflow/react` v12
- **Icons:** `lucide-react` only
- **Styling:** Tailwind CSS + `styles/tokens.ts` (single source of
  truth for all design values)
- **Testing:** Vitest (unit + integration), Playwright
- **Storybook:** `src/stories/`
- **Package manager:** pnpm (root `pnpm@10.32.1`;
  app `--legacy-peer-deps`)
- **Deployment:** Vercel (builds from `app/` as root)
- **Main branch:** `StrategyOS-app-main`

---

## Architecture

These decisions are final. Do not reverse without updating
`docs/architecture-decisions.md` first.

- **Capabilities never call each other.** Multi-step flows are
  coordinated by `src/ai/orchestrator.ts` only (D-17).
- **Capabilities never fetch data.** `src/ai/context-assembler.ts`
  builds all prompt context from workspace state.
- **All LLM calls go through `src/ai/client.ts`.** Never instantiate
  `Anthropic` directly elsewhere.
- **Structured output via `src/ai/structured-output.ts`.** Pass a Zod
  schema; do not parse JSON manually.
- **Zod schemas mirror types exactly.** Every field in
  `strategy.types.ts` must have a matching field in
  `strategy.schema.ts`.
- **Repository layer owns snake_case ↔ camelCase mapping.**
  TypeScript fields are camelCase; Supabase columns are snake_case.
- **`nodeTypes` defined at module scope.** Not inside a component —
  causes React Flow to remount the entire graph on every render.
  Hard rule, not style preference. (§11.2)
- **Entity layer is invisible infrastructure.** The word "entity"
  never appears in the UI. Asset-to-asset graph connections are the
  only visible output. (D-11, §11.3)
- **Three-tier edge model:** Tier 1 = structural backbone (hardcoded).
  Tier 2 = derived from entity overlap. Tier 3 = user-defined explicit
  links (deferred indefinitely). (§11.3)
- **Tiered intelligence feed.** `AssetInsightResponse` is the universal
  schema. `what_to_watch` is a required top-level field. `AssetInsight`
  carries `tier` (`urgent` / `cross_layer` / `noted`), type, severity,
  confidence.
- **Use path aliases for all cross-layer imports.** `@/core`, `@/ai`,
  `@/api`, `@/data` — never `../../` across layer boundaries.
- **App Router routes must be in `app/app/api/`.** Not `app/api/` —
  files outside `app/app/` are not served.
- **Vercel builds from `app/` only.** Any package used by `src/` must
  be in `app/package.json` and have a `paths` redirect in
  `app/tsconfig.json`.
- **AI and external API calls are never passive.** No GET endpoint,
  useEffect, polling loop, or component mount may trigger an LLM call,
  external API request, or other metered operation. All metered calls
  must be behind explicit POST actions requiring user intent (button
  click, form submit). Cached reads of previously-generated results
  are always safe.
- **Every API route calls `requireUser()`.** No exceptions without an
  explicit, documented decision. `requireUser()` also binds the
  authenticated Supabase client in AsyncLocalStorage — all downstream
  `getDb()` calls carry the user's JWT and are subject to Row Level
  Security policies (`src/data/migrations/016_rls.sql` +
  `051_rls_completeness.sql`). Error handling uses `apiErrorResponse()`
  from `app/lib/api/errors.ts` to avoid leaking stack traces.
- **New tables get RLS policies.** Every CREATE TABLE must ship with
  SELECT/INSERT/UPDATE/DELETE policies in the same migration. Pattern:
  `strategy_id IN (SELECT id FROM strategies WHERE owner_id = auth.uid())`
  for strategy-scoped tables; `workspace_id IN (...)` for
  workspace-scoped tables. Never `ALTER TABLE x ENABLE ROW LEVEL
  SECURITY` without also adding policies — that silently blocks every
  query.
- **Long-running background work uses `withServiceRoleDb()`.** The
  lock-time intelligence pipeline, context-entry preprocessing, and
  capability auto-promote can outlive the HTTP response. Wrap them in
  `withServiceRoleDb()` (from `src/data/db.ts`) so they run under the
  service-role client instead of depending on a user JWT that may
  expire mid-run. Synchronous route work (before the response) inherits
  the authenticated client automatically via AsyncLocalStorage.
- **AI-expensive routes call `checkRateLimit()`.** Every POST route
  that triggers an LLM call or expensive external API call must call
  `checkRateLimit(user.id, <routeKey>)` immediately after
  `requireUser()`. Returns early with `rateLimitResponse()` on 429.
  Fails open on Upstash outage. Route keys and cost classes are
  configured in `app/lib/ratelimit/limits.ts`. Currently protects:
  `intelligence.generate`, `journeys.generate`, `coherence.evaluate`,
  `component.evaluate`, `conversation.send`.

---

## Key files

| Path | Governs |
|------|---------|
| `CLAUDE.md` | This file — operating spec for every session |
| `docs/product-spec.md` | Product requirements — highest authority |
| `docs/implementation-plan.md` | Implementation plan — retain in priority stack |
| `docs/flows/` | Screen specs — human-authored, Claude reads only |
| `docs/architecture-decisions.md` | All ADRs (D-1 … D-23+) |
| `docs/architecture-overview.md` | System structure |
| `docs/execution-context.md` | Execution context — read before capability work |
| `docs/ui-style-guide.md` | Design tokens, component rules — read before any UI change |
| `docs/ux-refactor-notes.md` | UX decisions, §9 icon system, §11.2 graph, §11.3 entity layer |
| `docs/ai-workflows.md` | Capability inventory and trigger mappings |
| `docs/inference-map.md` | How AI inference flows through the system |
| `docs/interfaces/api-schema.yaml` | API contract — update when endpoints change |
| `docs/interfaces/data-models.md` | Domain model — update when types change |
| `styles/tokens.ts` | All design tokens — no inline hex values anywhere |
| `app/lib/asset-type-maps.ts` | Single source of truth for DB ↔ UI asset type mappings |
| `src/core/strategy/strategy.types.ts` | TypeScript interfaces |
| `src/core/strategy/strategy.schema.ts` | Zod schemas |
| `src/core/strategy/strategy.service.ts` | Business logic |
| `src/ai/intelligence/types.ts` | `AssetInsightResponse` schema — all intelligence output |
| `src/ai/intelligence/assembler.ts` | Intelligence assembly — briefing synthesis, tier classification |
| `src/ai/capabilities/` | Capability modules (`strategy/`, `assets/`, `coherence/`, `ingestion/`, `narratives/`, `ontology/`, `register/`) |
| `src/ai/capability-registry.ts` | Capability registration with typed I/O schemas |
| `src/ai/orchestrator.ts` | Multi-step flow coordination |
| `src/ai/context-assembler.ts` | Prompt context assembly |
| `src/ai/prose-style.ts` | Prose style rules |
| `src/data/migrations/` | SQL migrations — check existing numbering before adding |
| `app/tsconfig.json` | Path redirects for Vercel build (critical) |
| `src/stories/` | Storybook stories |

**Source of truth priority:**
`product-spec.md` > `implementation-plan.md` > `docs/flows/` >
`architecture-overview.md` > `ui-style-guide.md`

---

## Never do without explicit instruction

- Add a new API endpoint
- Remove or rename an exported symbol
- Change an existing exported type signature (add optional fields only)
- Create a new screen not defined in `docs/flows/`
- Write migrations without checking the next available number in
  `src/data/migrations/`
- Use `as any` — Vercel ESLint rejects it; use proper type narrowing
- Write inline hex values in component files — import from
  `styles/tokens.ts`
- Edit `CLAUDE.md`, `tailwind.config`, `tsconfig`, `next.config`, or
  `.claude/` files without showing the full proposed diff and waiting
  for explicit approval
- Change any type in `src/ai/intelligence/types.ts` or any Zod schema
  in `strategy.schema.ts` without first running a grep for all
  consumers and listing them for review
- Import icons from any library other than `lucide-react`
- Apply grey fills to card or surface backgrounds — white cards only
- Read or diff `package-lock.json` — ignore unless debugging a
  dependency conflict
- Branch from a local `StrategyOS-app-main` that hasn't been synced
  (`git fetch origin && git merge --ff-only origin/StrategyOS-app-main`)
- Run any test or script that calls the real Anthropic API (integration
  tests, validation scripts) without explicit user instruction. These
  tests require `RUN_EXPENSIVE_INTEGRATION_TESTS=1` and incur real cost.
  Use mocked unit tests for validation during development.

---

## Design system

Non-negotiable. **All UI design constraints and tokens have been moved to `docs/ui-style-guide.md`.**
You must read `docs/ui-style-guide.md` and `docs/ux-refactor-notes.md` §9 before making any UI, layout, or styling changes. 

Do not write hardcoded hex values, guess token names, add undocumented drop shadows, or implement new components without strictly consulting the style guide first.

---

## Session hygiene

### Before acting
- Read `docs/execution-context.md` before any capability work.
- Read the relevant `docs/flows/` spec before any screen or
  component work.
- For UI changes: read `docs/ui-style-guide.md` and
  `docs/ux-refactor-notes.md` §9, §11.
- For intelligence/schema work: read `src/ai/intelligence/types.ts`
  and `assembler.ts`.
- **Ambiguous UI target:** if a change request could apply to more
  than one element (e.g. "the header", "the card", "the label"),
  state the specific component and file you intend to edit before
  making any change. Do not ask for confirmation on clearly
  unambiguous requests — one sentence is enough.

### Writing discipline
- Show the full diff before every write. Do not write without explicit
  approval.
- One logical change per write. Do not batch unrelated edits into a
  single Write call.
- After writing, read the file back and confirm the result matches the
  approved diff.

### Pre-deploy (run before every push)
The `.githooks/pre-push` hook runs these automatically once activated
(`git config core.hooksPath .githooks` — one-time per clone).

1. `npx tsc --noEmit --project app/tsconfig.json 2>&1 | grep -v
   "^app/.next" | grep "error TS"` — must be empty
2. `npm --prefix app run lint` — must have no errors
3. `node scripts/check-tsconfig-paths.mjs` — every `src/` package in
   `app/tsconfig.json` paths (Vercel build fails silently without this)
4. `npm exec --prefix app -- pnpm install --frozen-lockfile` — lockfile
   must match `package.json` (Vercel CI uses `--frozen-lockfile`)

### Git & worktrees
1. Main branch is `StrategyOS-app-main`. Sync before branching.
2. Before resolving any merge conflict, check for renamed/moved files
   first: `git log --diff-filter=R --name-status origin/StrategyOS-app-main..HEAD`
   A conflict that looks unresolvable is often a rename.
3. When asked to commit or create a PR — do it immediately, no
   preamble.
4. After resolving merge conflicts, run typecheck + lint before marking
   complete.
5. Never delete a worktree you're currently in — change to repo root
   first.
6. Commit after every completed phase. Never accumulate multiple phases
   of uncommitted work.
7. Limit active worktrees to 2–3. Clean up immediately after merging.

### Common commands

| Command | Purpose |
|---------|---------|
| `npm test` | Vitest unit + integration — from repo root |
| `npm run typecheck` | `tsc --noEmit` — from repo root |
| `npm run lint` | ESLint — from repo root |
| `npm --prefix app run dev` | Next.js dev server |
| `npm exec --prefix app -- pnpm install && npm --prefix app run dev` | New worktree: install + start (pnpm workspace handles root + app) |
| `npm --prefix app run storybook` | Storybook (port 6006) |

### Test route
Browser testing:
`/workspace/a0000000-0000-4000-8000-000000000001/strategy/a0000000-0000-4000-8000-000000000010`
(Aurelius workspace — seeded with all asset types. Never use
`/strategies` list page.)

### Gotchas
- `@/` in `src/` resolves via root `tsconfig.json`; in `app/` via
  `app/tsconfig.json` — same syntax, different roots.
- **`styles/tokens.ts` is at repo root.** Inside `app/components/`,
  import via relative path (`../../../styles/tokens`), NOT
  `@/styles/tokens` — the `@/` alias resolves to `app/` not repo
  root. This breaks the Next.js build silently. When dispatching
  subagents, include this in the prompt explicitly.
- **Never run write API calls (POST/PATCH/DELETE) against the dev
  server during debugging.** GET-only for inspection. If you need
  to test a write, tell the user and let them do it from the
  browser. Accidental PATCHes have wiped live asset data.
- **`npm --prefix app run build` fails locally** without UPSTASH
  creds in `app/.env.local` (they live only in root `.env.local`).
  Skip `next build` from the PR verification checklist — rely on
  typecheck + lint + tests; Vercel preview is the authoritative
  build gate.
- New `src/` dependency? Three steps — all required, all cause Vercel
  failures if skipped:
  1. `npm install --prefix app <package>` — installs AND updates lockfile
  2. Add `"<pkg>": ["./node_modules/<pkg>"]` + `"<pkg>/*": [...]` to
     `app/tsconfig.json` paths (local tsc passes without this; Vercel fails)
  3. Add `<pkg>` to `serverExternalPackages` in `next.config.mjs` if it
     uses dynamic imports or native addons (pdfjs, sharp, etc.)
- Turbopack (Next.js 15.3+): top-level `turbopack` key, not
  `experimental.turbo`. Set `turbopack.root` to repo root.
- **Turbopack is stricter than local tsc on type assertions.** Direct
  casts between structurally unrelated types (e.g.
  `Record<string, unknown> as MyType`) pass locally but fail on
  Vercel. Always cast via `unknown` first: `data as unknown as MyType`.
  Prefer Zod validation at component boundaries over assertion casts.
- Missing module on worktree start: run the combined install command.

### Adding a capability — checklist
- [ ] Read spec fully; identify all affected files
- [ ] Read `docs/execution-context.md` before scoping
- [ ] API contract: every endpoint (method, path, request/response
      as TS types)
- [ ] Data model: type changes + schema changes + SQL migration if
      needed
- [ ] Implementation: backend first, then UI if a `docs/flows/` spec
      exists
- [ ] Example request/response (JSON, happy path)
- [ ] Update `docs/interfaces/api-schema.yaml` and
      `docs/interfaces/data-models.md`
- [ ] Log decision in `docs/decisions/`
- [ ] Cost review: identify all metered calls (LLM, external API).
      Confirm each is POST-only, user-initiated, never triggered by
      GET/mount/polling/useEffect
- [ ] Blast radius: if a component fetches on mount, confirm the
      endpoint is a cached read (no generation, no side effects). If
      it polls, confirm the interval and the endpoint is free of
      metered calls
- [ ] Guard rails: any AI-calling endpoint must have a staleness/cache
      guard to avoid redundant generation
- [ ] AI schema: every `completeStructured` call has an `outputTemplate`
      in its prompt with exact field names. Enforced by pre-push hook —
      verify before the hook catches you at push time
- [ ] Update `docs/ai-capabilities-reference.md` — add to inventory
      table, update capability count, update trigger map if applicable
- [ ] Update `docs/asset-capability-reference.md` — add/update the
      relevant section in Part 3 (Core System Capabilities)

### Adding an asset type — checklist
- [ ] `src/core/assets/asset.types.ts` — add to `StrategyAssetType` union
- [ ] `src/core/assets/asset.schema.ts` — add to `StrategyAssetTypeSchema`
  enum
- [ ] `app/lib/store.ts` — add to `AssetType` union
- [ ] `app/lib/asset-type-maps.ts` — add to `DB_TYPE_TO_ASSET_TYPE`
  (single source of truth; reverse map is derived automatically)
- [ ] `app/lib/navigator/sequence.ts` — add `SequenceEntry` with phase,
  upstream deps, and downstream effects
- [ ] `app/lib/navigator/compute.ts` — add `case` in `computeSummary()`
- [ ] `app/lib/objectColours.ts` — add entry with container, icon, label,
  letter, description
- [ ] `styles/tokens.ts` — add to `objectColors` and `objectColorStates`
- [ ] `app/components/workspace/WorkspaceNav.tsx` — add to
  `ASSET_ICONS`, `ASSET_COLOR_KEY`, `CORE_ASSET_ITEMS`; if the asset
  uses a workspace view, add redirect in `handleAssetSelect` and
  active-detection in the template
- [ ] `app/components/strategy/graph/StrategyGraphCanvas.tsx` — add to
  `DB_TYPE_TO_NODE_ID`; if the asset uses a workspace view, add
  redirect in `handleNodeClick`
- [ ] `app/components/strategy/graph/constellationData.ts` — add node
  to `CONSTELLATION_NODES` and edge entries
- [ ] `app/components/assets/AssetEditor.tsx` — add to
  `ASSET_TYPE_DESCRIPTIONS`
- [ ] `app/components/intelligence/AssetAbout.tsx` — add to type mapping
  and `ABOUT` content
- [ ] `src/ai/orchestrator.ts` — add detector and intelligence capability
  mappings
- [ ] `src/data/migrations/` — migration to add type to DB CHECK
  constraint (+ RLS if new table)
- [ ] Update `docs/ai-capabilities-reference.md` — add generation
  capability, signal detectors, Phase 3 capabilities; update count
- [ ] Update `docs/asset-capability-reference.md` — add complete
  asset data card in Part 2 (all 7 dimensions)

### Work Practices

- **Strict Package Manager Enforcement**: Use `pnpm` exclusively via monorepo workspaces. A `preinstall` script enforces this. Never use `npm install` or `yarn`.
- **Database Type Generation**: Use automated Supabase type generation instead of manually mapping snake_case to camelCase when schemas update.
- **Tracer/Snapshot Testing**: For complex context assembly (`src/ai/context-assembler.ts`), maintain snapshot tests in Vitest to ensure the context string structure remains stable across refactors.
- **Changelogs**: Session logs go in `docs/updates/session-changelog.md`. `CHANGELOG.md` at the root is strictly for major semantic feature releases.

- **Documentation maintenance**: After any substantial enhancement,
  update the living reference docs before closing the session or
  creating a PR.

  | Change | Files to update |
  |--------|----------------|
  | New capability added | `docs/ai-capabilities-reference.md` (inventory, count, trigger map) · `docs/asset-capability-reference.md` (Part 3) |
  | Capability materially changed | Same as above |
  | New signal type added | `docs/ai-capabilities-reference.md` (Signal Types Reference) · `docs/asset-capability-reference.md` (Signal System section) |
  | New content serialiser added | `docs/asset-capability-reference.md` (asset data card + Content Serialisers section) |
  | Intelligence pipeline phase changed | `docs/intelligence-deep-dive.md` · `docs/asset-capability-reference.md` (Part 3 pipeline section) |
  | New GCE pattern added | `docs/intelligence-deep-dive.md` · `docs/asset-capability-reference.md` (GCE section) |
  | Build phase marked complete | `docs/plans/build-spec-v2.md` (mark ✅) · update relevant doc entries |
  | New ontology concept types | `docs/asset-capability-reference.md` (Ontology Layer + Roadmap sections) |

  **Does not apply to:** bug fixes with no schema change, UI-only
  styling/refactoring, test additions, migration-only changes with
  no type or capability change.

### Required env vars

```
ANTHROPIC_API_KEY
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (required — used for background work, seeds, dev)
UPSTASH_REDIS_REST_URL   (required — rate limiter backend)
UPSTASH_REDIS_REST_TOKEN (required — rate limiter auth)
APP_URL                  (optional — MCP server CORS allow-origin; default http://localhost:3000)
ADMIN_USER_ID            (optional — gates AI usage HUD + kill switch)
AI_COST_ALERT_THRESHOLD  (optional — default $1.00, console warning threshold)
DISABLE_RATE_LIMIT       (optional — set to '1' to bypass rate limits; for prod load tests and incident debugging)
CONVERSATION_SERVER_URL   (optional — Python MCP server URL for /api/conversation proxy; conversation disabled when absent)
CONVERSATION_SHARED_SECRET (optional — shared secret between proxy and Python server; no auth when empty)
```

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **StrategyOS** (18668 symbols, 26007 relationships, 300 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/StrategyOS/context` | Codebase overview, check index freshness |
| `gitnexus://repo/StrategyOS/clusters` | All functional areas |
| `gitnexus://repo/StrategyOS/processes` | All execution flows |
| `gitnexus://repo/StrategyOS/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
