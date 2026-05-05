# Way of Working — StrategyOS

This document covers the **meta-layer**: how we work in this repo — tooling, workflow conventions, the Claude Code automation harness, and the quality gates that enforce our architecture rules. It is not a product guide. For what StrategyOS does and why, read [`docs/product-spec.md`](product-spec.md). For the canonical operating spec that Claude Code reads every session, read [`CLAUDE.md`](../CLAUDE.md).

---

## 1. Repo anatomy

```
StrategyOS/
├── src/                    # Shared TypeScript backend (NOT served directly by Next.js)
│   ├── ai/                 # AI orchestration, capabilities, intelligence pipeline
│   ├── core/               # Business logic (strategy, assets, coherence, signals, …)
│   └── data/               # Repository layer, SQL migrations, seeds
│
├── app/                    # Next.js 16 App Router — Vercel builds from here only
│   ├── app/                # Route tree (App Router)
│   │   ├── (workspace)/    # Authenticated workspace pages
│   │   ├── api/            # API route handlers (must live here — not app/api/)
│   │   └── auth/           # Supabase auth callbacks
│   ├── components/         # React components, organised by feature domain
│   └── lib/                # Client utilities, Zustand store, services, hooks
│
├── mcp-server/             # Python MCP server — standalone conversation surface
│
├── docs/                   # Human-authored specs — Claude reads, never edits without instruction
│   ├── flows/              # Screen specs (source of truth for UI work)
│   ├── decisions/          # Architecture Decision Records
│   ├── plans/              # Planning documents and build specs
│   └── interfaces/         # API schema (api-schema.yaml) and data models
│
├── styles/
│   └── tokens.ts           # Single source of truth for ALL design values (colours, type, spacing)
│
├── scripts/                # Build utilities, tsconfig path checker, test harnesses
│
├── .claude/                # Claude Code harness — skills, hooks, settings, worktrees
│   ├── hooks/              # Shell scripts invoked by the hook events below
│   ├── skills/             # Slash-command workflows (/pre-deploy, /shipit, …)
│   ├── settings.json       # Hook wiring, project-level permissions
│   └── worktrees/          # Isolated git worktrees for parallel Claude sessions
│
└── .githooks/              # Git pre-push gate (runs on every push, not just Claude sessions)
    └── pre-push
```

**`src/` vs `app/`** — `src/` holds all AI and business logic as plain TypeScript. `app/` is the Next.js surface. Every package used by `src/` must be listed in `app/package.json` and mapped in `app/tsconfig.json` paths — the Vercel build resolves modules from `app/` as root, so a missing mapping is a silent build failure.

---

## 2. Stack at a glance

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| AI | `@anthropic-ai/sdk` — default `claude-haiku-4-5-20251001`; synthesis `claude-sonnet-4-6` |
| Validation | Zod v4 — API differs from v3; do not rely on v3 examples |
| State | Zustand 5 (`activeStrategyId`, `activeWorkspaceView`, `strategyEditModalOpen`) |
| Graph | `@xyflow/react` v12 |
| Icons | `lucide-react` only |
| Styling | Tailwind CSS + `styles/tokens.ts` |
| Testing | Vitest (unit + integration), Playwright (E2E) |
| Components | Storybook 10 (`src/stories/`) |
| Package manager | pnpm 10 via monorepo workspaces |
| Deployment | Vercel (Next.js app), Docker/Railway (Python MCP server) |

---

## 3. Key commands

| Task | Command |
|------|---------|
| Start dev server | `npm --prefix app run dev` |
| New worktree: install + start | `npm exec --prefix app -- pnpm install && npm --prefix app run dev` |
| Run all tests | `npm test` (from repo root) |
| Type-check | `npm run typecheck` |
| Lint | `npm run lint` |
| Storybook | `npm --prefix app run storybook` |

**Test route for browser verification:** `/workspace/a0000000-0000-4000-8000-000000000001/strategy/a0000000-0000-4000-8000-000000000010` (Aurelius workspace — seeded with all asset types). Never use the `/strategies` list page.

---

## 4. Development workflow

### 4.1 Package manager

This is a **pnpm monorepo** with two workspaces: the repo root and `app/`. A `preinstall` script enforces pnpm — running `npm install` or `yarn` at the root will fail. Use `npm exec --prefix app -- pnpm install` when setting up a new worktree.

After adding a package, the lockfile (`pnpm-lock.yaml`) must also be updated or Vercel CI will fail with a frozen-lockfile error. Run `npm install --prefix app <package>` to install and sync the lockfile in one step.

### 4.2 Worktree strategy

We use **git worktrees** to run parallel Claude Code sessions in isolation — each session gets its own working tree, branch, and dev server. Claude Code creates worktrees automatically under `.claude/worktrees/` with names like `trusting-moore-61b8df` (adjective-scientist-hex). Long-lived feature branches go in `.worktrees/`.

Keep active worktrees to 2–3 at most. Clean up immediately after a branch merges. Never delete a worktree from inside it — `cd` to the repo root first.

### 4.3 Branch and merge discipline

- Main branch: `StrategyOS-app-main`. Always run `git fetch origin && git merge --ff-only origin/StrategyOS-app-main` before branching.
- Before resolving a merge conflict, check for renames first: `git log --diff-filter=R --name-status origin/StrategyOS-app-main..HEAD`. A conflict that looks unresolvable is often a rename.
- After resolving conflicts: typecheck + lint before marking complete.
- Commit after every completed phase. Never accumulate multiple phases of uncommitted work.

---

## 5. The Claude Code harness

Claude Code is the primary development assistant. We've built an automation harness around it that enforces quality gates, cost discipline, and architecture rules — so you don't have to hold them all in your head at once.

The harness has four layers: **session lifecycle hooks**, an **auto code-review agent on commit**, a **pre-push gate**, and **slash-command skills**. Each layer is described below.

### 5.1 Session lifecycle hooks

Hooks are shell scripts or agent prompts wired to Claude Code lifecycle events in `.claude/settings.json`.

| Event | Trigger | What it does |
|-------|---------|-------------|
| `SessionStart` | Every new session | Runs `session-start.sh`: injects branch status (behind/ahead/uncommitted) and the session discipline checklist |
| `UserPromptSubmit` | Every user message | If the prompt mentions a bug or fix: reminds Claude to write an isolated repro test first. If it mentions UI/component work: reminds Claude to state the target component and file before touching anything. |
| `PreToolUse` (Write/Edit on AI files) | Before any write to `src/ai/`, `mcp-server/`, or intelligence paths | Runs `cost-optimisation-check.sh` — flags Opus overuse, missing prompt caching, GET/useEffect-triggered AI calls, unbounded conversation history, untrimmed tool results |
| `PreToolUse` (npm install) | Before any `npm install` command | Warns that the pnpm lockfile must also be synced for Vercel CI |
| `PreToolUse` (Write/Edit `.env`) | Before any write to `.env` or `.env.*` | Hard block — permission denied |
| `PostToolUse` (Write/Edit `.ts`/`.tsx`) | After any TypeScript file write | Async: runs `tsc --noEmit` and ESLint on the changed file |
| `Stop` | When Claude finishes a turn | Runs `pre-deploy-check.sh`; if TypeScript errors are found, `asyncRewake: true` re-wakes Claude to fix them |
| `PreCompact` | Before context compression | Injects the seven most critical architecture rules so they survive the compaction and are never forgotten mid-session |

### 5.2 Git commit auto-review

When Claude runs `git commit`, a **Sonnet 4.6 agent** reviews the staged diff before the commit proceeds. It checks for:

- Bugs and logic errors
- Security issues (XSS, injection, missing auth)
- TypeScript type errors and `as any` casts
- Broken or circular imports
- Hardcoded values that should come from `styles/tokens.ts`
- Architecture rule violations (from CLAUDE.md)

If issues are found, they're reported with `file:line` references before the commit is allowed. The review times out at 120 seconds.

### 5.3 Pre-push gate (`.githooks/pre-push`)

Four checks run automatically on every `git push` — not just in Claude sessions. Activate once per clone:

```bash
git config core.hooksPath .githooks
```

| Check | What fails it |
|-------|--------------|
| **1. pnpm lockfile sync** | `pnpm-lock.yaml` is out of date with `app/package.json` |
| **2. tsconfig paths coverage** | A package imported from `src/` is missing from `app/tsconfig.json` paths (silent Vercel build failure) |
| **3. TypeScript** | Any `error TS` in `app/tsconfig.json` compile (`.next` noise filtered out) |
| **4. AI output templates** | A new/modified capability file in `src/ai/capabilities/` calls `completeStructured` without an `outputTemplate` |

The `outputTemplate` check (check 4) prevents the model from inventing its own field names. Every `completeStructured` call must include an `outputTemplate` in its prompt that shows the exact expected JSON structure.

### 5.4 Skills

Skills are slash-command workflows — structured prompt sequences invoked with `/skill-name` in Claude Code. They encode discipline that would otherwise require the human to remember to ask.

**Project skills** (`.claude/skills/`):

| Skill | Purpose | When to use |
|-------|---------|------------|
| `/pre-deploy` | Runs `tsc --noEmit` + ESLint; reports errors | Before every push — also triggered automatically by the Stop hook |
| `/shipit` | End-of-session wrap-up: commit staged work, push, create PR, clean up worktree | When a feature branch is ready to merge |
| `/handoff` | Generates a next-session context document: completed work, deferred items, suggested next steps | At the end of a long session so context isn't lost |
| `/create-migration` | Scaffolds the next numbered SQL migration file in `src/data/migrations/` with the correct `NNN_` prefix | Any time you need a new migration |

**GitNexus skills** — code intelligence powered by a knowledge graph of 18 000+ symbols and 300 execution flows. Always use these before editing shared code:

| Skill | Purpose | When to use |
|-------|---------|------------|
| `/gitnexus-impact-analysis` | Blast radius: what breaks if you change this symbol? | Before modifying any function, class, or method |
| `/gitnexus-exploring` | Understand architecture; trace execution flows | When exploring unfamiliar code |
| `/gitnexus-debugging` | Trace a bug back through the call graph to its origin | When diagnosing a failure |
| `/gitnexus-refactoring` | Safe rename/extract/split/move with full impact tracking | Any structural refactor |
| `/gitnexus-guide` | Tool reference, schema, workflow | Quick reference for GitNexus tool syntax |
| `/gitnexus-cli` | Run GitNexus CLI commands (`analyze`, `index`, `status`, `wiki`) | When the index needs refreshing |

### 5.5 Permissions model

Permissions are split across two files:

- **`.claude/settings.json`** — project-level, committed to the repo. Contains hook wiring and a small set of always-safe allowlisted commands.
- **`.claude/settings.local.json`** — user-level, gitignored. Contains 248+ Bash patterns, 13 web domains, MCP tool allowances, and read-path expansions specific to the local machine.

To add a new permission pattern (e.g., a new Bash command that Claude needs to run without prompting), use the `/update-config` skill rather than editing JSON directly.

---

## 6. Architecture rules the harness enforces

These aren't just conventions — the hooks and commit-review agent enforce them automatically.

| Rule | Why | Enforced by |
|------|-----|------------|
| No inline hex values — import from `styles/tokens.ts` | Consistent design system; prevents 75-file sweep when a colour changes | PostToolUse hook (lint) |
| No `as any` casts | Vercel's ESLint config hard-fails on `as any` | Commit review agent |
| All LLM/AI calls must be POST-only, user-initiated — never GET/useEffect/mount | Metered cost control; a GET endpoint can trigger unbounded AI spend (ADR D-23) | Cost optimisation hook |
| Every API route calls `requireUser()` | Binds the user JWT and enforces Supabase RLS on all downstream DB calls | Commit review agent |
| New DB tables ship RLS policies in the same migration | A table with `ENABLE ROW LEVEL SECURITY` but no policies silently blocks every query | Code review; manual checklist |
| `nodeTypes` defined at module scope, never inside a component | React Flow remounts the entire graph on every render if `nodeTypes` is defined inline | Commit review agent |
| `completeStructured` calls require an `outputTemplate` | Without it the model invents its own key names and Zod validation fails | Pre-push hook (check 4) |
| Capabilities never call each other | Multi-step flows are coordinated by `src/ai/orchestrator.ts` only (ADR D-17) | Commit review agent |

---

## 7. AI cost and quality discipline

### 7.1 Model routing

Model choices live in `src/ai/client.ts`:

- **Default:** `claude-haiku-4-5-20251001` — fast, cheap, used for most capability calls
- **Synthesis:** `claude-sonnet-4-6` — used for multi-asset synthesis, OKR generation, systems/stakeholder intelligence
- **Never default to Opus** — the cost-optimisation hook flags Opus use immediately and requires proof that Sonnet is insufficient

### 7.2 Prompt caching

Every `completeStructured` call with a system prompt must set `cacheSystem: true`. This enables Anthropic prompt caching and reduces input token cost by ~90% on repeated calls. The cost hook flags missing caching on all AI caller files.

### 7.3 Rate limiting

Every API route that triggers an LLM call must call `checkRateLimit(user.id, routeKey)` immediately after `requireUser()`. Returns a 429 with `rateLimitResponse()` on limit breach. Configured in `app/lib/ratelimit/limits.ts`. Fails open if the Upstash backend is unreachable.

---

## 8. Documentation discipline

After any substantial change, update the relevant living reference doc before closing the session or creating a PR.

| Change | Files to update |
|--------|----------------|
| New capability added | `docs/ai-capabilities-reference.md` (inventory, count, trigger map) · `docs/asset-capability-reference.md` (Part 3) |
| New signal type | `docs/ai-capabilities-reference.md` (Signal Types Reference) · `docs/asset-capability-reference.md` (Signal System) |
| Intelligence pipeline phase changed | `docs/intelligence-deep-dive.md` · `docs/asset-capability-reference.md` (Part 3) |
| New asset type | `docs/asset-capability-reference.md` Parts 2 and 3 |
| Build phase marked complete | `docs/plans/build-spec-v2.md` |

**Source of truth priority:** `product-spec.md` > `implementation-plan.md` > `docs/flows/` > `architecture-overview.md` > `ui-style-guide.md`

---

## 9. What to read before starting

| Task type | Read first |
|-----------|-----------|
| Capability work (AI, orchestrator, pipeline) | `docs/execution-context.md` |
| Screen or component work | Relevant `docs/flows/` spec → `docs/ui-style-guide.md` → `docs/ux-refactor-notes.md` §9 |
| Intelligence or schema changes | `src/ai/intelligence/types.ts` → `src/ai/intelligence/assembler.ts` |
| New asset type | CLAUDE.md §Adding an asset type checklist |
| New API capability | CLAUDE.md §Adding a capability checklist |
| Any change to shared code | Run `/gitnexus-impact-analysis` first — always |
| New SQL migration | Check `src/data/migrations/` for the next available `NNN_` prefix before writing |
