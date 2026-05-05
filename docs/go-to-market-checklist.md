# StrategyOS — Go-to-Market Checklist

Items required before any public/market launch. Update status as items complete.

---

## Infrastructure

- [ ] **Switch conversation server Cloud Run → Railway** — always-on, no cold starts, $5/month Hobby plan. Update `CONVERSATION_SERVER_URL` in Vercel. (During build/testing: Cloud Run free tier is fine.)
- [ ] **Production CORS** — set `APP_URL` env var on the conversation server to the production domain (not a Vercel preview URL).
- [ ] **Secrets rotation** — generate fresh `CONVERSATION_SHARED_SECRET` for production; rotate Supabase service role key.
- [ ] **Custom domain** — point production domain to Vercel; configure in Vercel project settings.

---

## Auth & Users

- [ ] **User management** — invite flow, team/org scoping, role model (owner / editor / viewer). Currently single-user per workspace; multi-user needs a design pass before building.
- [ ] **Auth hardening** — audit all RLS policies against multi-tenant access patterns. Migration 051 is the baseline completeness pass; re-audit after multi-user design is finalised.
- [ ] **User onboarding flow** — first-run experience, strategy creation wizard, empty-state guidance.

---

## Billing & Subscriptions

- [ ] **Subscription management** — billing integration (Stripe or similar), plan tiers, usage limits per plan tier.
- [ ] **AI cost pass-through model** — decide: absorb AI costs in subscription price vs. usage-based add-on. Cost estimates in `build-spec-v2.md` §2 Track 2 are the baseline ($0.01–$0.50 per interaction depending on pattern).
- [ ] **Rate limiting by plan** — extend `app/lib/ratelimit/limits.ts` with per-plan limits (currently flat limits across all users).
- [ ] **Spend cap by workspace** — extend `mcp-server/conversation/cost_tracker.py` circuit breaker to scope by workspace/user rather than global.
- [ ] **BYOK (Bring Your Own Key)** — allows external testers / self-serve customers to supply their own Anthropic API key, avoiding shared key costs. Near-term unblocker for external testers.

---

## Product Readiness

- [ ] **Session persistence for conversation** — conversation sessions are currently held in Python process memory. Survives Cloud Run cold starts poorly; migrate to DB-backed sessions (Supabase) before production launch.
- [ ] **Error / degraded state UX** — when conversation server is unreachable, the panel currently silently returns a 503. Needs a user-facing error state with retry affordance.
- [ ] **Data export** — users need to own their data (GDPR/CCPA requirement). At minimum: JSON export of all strategy assets and signals.
- [ ] **ToS / Privacy Policy** — legal prerequisite for any public launch. Needs legal review.
- [ ] **Accessibility audit** — keyboard navigation, screen reader labels, colour contrast (11px text floor already enforced; audit interactive elements).

---

## Notes

- **Subscription + user management** were explicitly called out as GTM requirements (2026-04-19). Neither has a design yet — plan a design session before starting implementation.
- The in-memory conversation session model was always a known limitation (see `project_panel_resilience.md`). DB-backed sessions should be scoped into P13 or P14 work to avoid a separate migration sprint at launch.
