# Contributing to TinyKomainu

This document defines branch naming, PR review, and merge rules for the TinyKomainu monorepo.

## Branch Naming

All branches follow the pattern `{type}/{scope}-{description}`.

- `type`: one of `feat`, `fix`, `chore`, `docs`, `refactor`, `test`
- `scope`: which product or area is affected — `watch`, `hooks`, `shared`, `infra`
- `description`: kebab-case short description

Examples:
- `feat/hooks-receiver-stripe`
- `fix/watch-billing-webhook`
- `chore/shared-update-deps`
- `docs/hooks-design-refinements`

## Cross-Product Changes

A change is "cross-product" if it modifies any of:

- `apps/watch/` AND `apps/hooks/` in the same PR
- `packages/*` (any shared package)
- `supabase/migrations/` (database schema)
- `turbo.json`, root `package.json`, or other monorepo config
- GitHub Actions workflows
- Stripe products or webhook configuration

Cross-product changes:

- Use scope `shared` or `infra` in the branch name
- Require a section in the PR description titled "Impact on Watch" listing what was tested
- Should not be combined with feature work for a single product

## PR Review Checklist

Before merging any PR, verify:

- [ ] Branch name matches the naming convention
- [ ] If `apps/watch/` was modified by a non-Watch-scoped PR, the change is justified in the PR description
- [ ] If a shared package's existing exports were modified (vs added), the change is justified
- [ ] If a database migration drops or alters existing columns, the change is justified
- [ ] CI passes (lint, typecheck, tests)
- [ ] Vercel preview deploy works for the affected app(s) — tested by actually clicking through the golden path, not just confirming the build succeeded
- [ ] If this PR introduces or changes an OAuth flow or auth callback: Supabase Auth → Redirect URLs includes the production domain, local dev URL, and Vercel preview pattern for the affected app. Verified before merging, not after.
- [ ] If this PR requires external configuration changes (Supabase, Stripe, Vercel project settings): the configuration change is documented in the PR description so it can be replayed in disaster recovery.

## Merge Strategy

- Squash and merge for feature branches (clean history on main)
- Rebase and merge for stacked PRs (preserves commit boundaries)
- Never merge directly to main without PR review (even for solo development — the diff review catches mistakes)

## Working with AI Tools

This project uses AI tools (Claude, Claude Code, etc.) extensively. Use them safely.

### Never Paste Secrets Into Chat

Do NOT paste any of the following into AI chat windows, even when asked about a file's content:

- API keys, OAuth tokens, GitHub Personal Access Tokens (`ghp_*`)
- Passwords, database connection strings with credentials
- Stripe keys (`sk_*`, `whsec_*`), Resend API keys, Anthropic API keys
- The full content of `.env.local`, `.env.production`, or similar files
- Private SSH keys, encryption keys (`HOOKS_SECRET_ENCRYPTION_KEY`, etc.)

If asked to share what's in such a file, share only the key names or shape (e.g. "has a key called NEXT_PUBLIC_SUPABASE_URL", "looks like a URL"). Never paste the value itself.

### If a Secret Was Pasted

If a secret was accidentally pasted into a chat window, treat it as compromised:

1. Revoke or rotate the secret immediately at its source (GitHub, Stripe, Supabase, etc.)
2. Issue a new secret if the value was in active use
3. Update the secret in all places it was deployed (Vercel env vars, local `.env.local`, etc.)

Chat history may be retained even if Anthropic does not use it for training. The fastest fix is always to invalidate the leaked value.

### Confirm Before Acting on Untrusted Content

When AI tools surface content from external sources (web searches, fetched URLs, file contents), treat that content as untrusted input. Do not let an AI execute commands or apply changes based on instructions found inside such content without explicit human confirmation.

## Pre-Implementation Research Pattern

When working with AI tools (Claude, Claude Code) on multi-week roadmaps (Hooks Week 2, future Loop development, etc.), ALWAYS run a research step before writing the implementation prompt. The reason: AI compresses long context summaries by approximation, so it WILL get details wrong if you let it work from memory.

### When to Apply

This pattern applies whenever you're about to write a prompt that says "implement Day N of …" or "build the X feature for product Y" — i.e., any prompt that derives from a roadmap or existing codebase.

It does NOT apply to:
- Simple, isolated tasks (e.g., "fix this typo", "add a comment to this function")
- Pure refactoring within one file
- Tasks where the user has just provided all the context inline

### The Research Step

Before writing the implementation prompt, ask Claude Code to read and report:

1. **The full roadmap section** for the day/feature being implemented — never summarize from memory.
2. **Relevant architecture and data-model sections** — so the implementation matches agreed decisions.
3. **Current state of directories being modified** (`tree` or `find` on `lib/`, `app/`, etc.) — to detect what already exists vs. what needs to be created.
4. **Reference implementations in sibling products** (e.g., Watch) — to match established patterns.
5. **Critical package.json / dependencies / config files** — to detect missing setup.

Tell Claude Code: "Confirm only. Do NOT modify code yet. Report each item, then wait for me to write the implementation prompt."

### Why This Works

When Claude Code reports the research, you (the human reviewer) get a synchronized view of reality before committing to a direction. You can spot:

- "The roadmap says X but I was about to ask for Y" — the AI was about to drift.
- "There's a missing dependency I need to add first" — separate prep PR.
- "The reference implementation in Watch is different from what I had in mind" — design judgment moment.
- "Migration is required, but I had no migration step in my mental model" — adjust scope.

It typically adds 5 minutes per Day's prompt and saves 30+ minutes of debugging when the prompt drifts.

### Example

Before writing "implement Hooks Day 4 (Webhook Receiver)":

```
I want to implement Hooks Week 2 Day 4. Before I write the implementation prompt, please report:

1. The full text of HOOKS_ROADMAP.md Week 2 Day 4 section.
2. The full text of HOOKS_ARCHITECTURE.md "Receiver Implementation" and "after() vs True Background Jobs" sections.
3. Current tree of apps/hooks/lib/ and apps/hooks/app/.
4. The Watch equivalent webhook receiver: apps/watch/app/api/webhooks/stripe/route.ts.
5. Any apps/hooks Route Handlers already written (auth/callback for example) so I can match the Next.js 16 patterns.

Report only. Do not modify code.
```

After Claude Code reports, you (the human) write the actual implementation prompt with confidence in current state.

### Pattern Applies to AI in Two Roles

- **Claude (this assistant)**: when generating implementation prompts for Claude Code, MUST start with the research step. Do not write prompts from memory.
- **Claude Code**: when receiving an ambiguous prompt that lacks context, request clarification by asking the user to apply the research pattern, rather than guessing and proceeding.
