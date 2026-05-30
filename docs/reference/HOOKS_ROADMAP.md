# HOOKS_ROADMAP.md

This document defines the 6-week implementation plan for **Hooks by TinyKomainu**.

## Philosophy

Hooks is the second product. We've already shipped Watch in 6 weeks, so we know the rhythm works. But Hooks is technically more complex than Watch (event-driven receivers vs scheduled pollers, payload storage, signature verification, template engine), so we use the time saved on infrastructure (auth, billing, notifications already built) to invest in product polish.

The goal of this 6-week plan is to ship a launchable Hooks MVP at `hooks.tinykomainu.com` with three sources (Stripe, Shopify, GitHub) and four output channels, including the replay feature.

## Pre-Week 1: Setup (1-2 days, before formal Week 1 starts)

This is housekeeping that should happen before formal development begins.

- Create new Vercel project `tinykomainu-hooks` linked to the same `tinykomainu` GitHub repo
- Configure custom domain `hooks.tinykomainu.com` in Vercel + Cloudflare DNS
- Configure Vercel project root directory to `apps/hooks`
- Add Hooks env vars in Vercel (encryption key, base URL, future Stripe price IDs)
- Generate `HOOKS_SECRET_ENCRYPTION_KEY` with `openssl rand -base64 32`
- Confirm Stripe sandbox account is ready (Hooks Pro/Team products will be created in Week 5)
- Update `turbo.json` to include Hooks-specific env vars in `globalEnv`
- Update `CLAUDE.md` with Hooks development phase notes (current focus changed from Watch to Hooks)

This is parallelizable with Week 1 Day 1 if needed.

## Week 1: Foundation

Goal: A new Next.js app at `hooks.tinykomainu.com` that compiles, deploys, runs database migrations, and lets users sign in.

### Day 1: App Scaffold

- Create `apps/hooks/` as a new Next.js 16 app within the existing Turborepo
- Set up `package.json` with workspace dependencies (`@tinykomainu/auth`, `@tinykomainu/ui`, `@tinykomainu/db`, etc.)
- Mirror Watch's `next.config.js`, `tsconfig.json`, `tailwind.config.ts` structure
- Create initial route structure: `(marketing)`, `(auth)`, `(app)`, `api/`
- Verify local dev: `pnpm dev --filter=@tinykomainu/hooks` opens at `localhost:3001`

### Day 2: Database Migrations (Shared Tables)

Pre-flight check completed: `subscriptions.product` and `UNIQUE(user_id, product)` already exist in Watch's initial schema. Only one migration is needed for shared tables.

- Write migration file `add_product_scope_to_notification_channels.sql` for the `notification_channels` table (add `product_scope text[]` column with default `['watch', 'hooks']`, check constraint, GIN index)
- Apply locally and verify existing Watch tables/data are intact
- Confirm: existing `notification_channels` rows now have `product_scope = ['watch','hooks']`
- Run `supabase db diff` to confirm clean diffs
- Update `packages/db` types by regenerating Supabase types

### Day 3: New Hooks Tables

- Write migrations for all four new tables: `hooks_endpoints`, `hooks_events`, `hooks_routes`, `hooks_deliveries`
- Add helper functions (`hooks_events_used_this_month`, `hooks_purge_expired_events`)
- Configure RLS policies for all new tables
- Apply locally and run smoke queries
- Regenerate Supabase types

### Day 4: Auth Integration

- Implement OAuth callback handler at `apps/hooks/app/auth/callback/route.ts`
- Do NOT extend `handle_new_user` — Hooks uses the same lazy subscription creation pattern as Watch (`getUserSubscription()` returns `'free'` when no row exists)
- Verify Google OAuth login works on `hooks.tinykomainu.com`
- Confirm: a Watch user logging in to Hooks sees the same `auth.uid()`; Hooks subscription row is created lazily on first billing page visit or Stripe Checkout

### Day 5: Marketing Page Skeleton

- Build a single-page LP at `apps/hooks/app/(marketing)/page.tsx` (no copy yet, just structure)
- Hero, features (3-4 cards), pricing table, FAQ, footer
- Reuse `@tinykomainu/ui` components
- Add navigation between Watch and Hooks (mention sister product on each LP)

### Day 6-7: Empty Dashboard

- Build authenticated `(app)/dashboard/page.tsx` with the empty state ("No webhooks yet")
- Build top-level `AppNav` for Hooks (Endpoints, Events, Settings)
- Implement protected routing (redirect unauthenticated users to `/login`)
- Deploy to Vercel preview, verify the production deploy reaches `hooks.tinykomainu.com`

### Week 1 Done When

- `hooks.tinykomainu.com` is live and serves a marketing page
- Login works via Google OAuth
- An authenticated user lands on `/dashboard` with an empty state
- All migrations applied to staging Supabase
- No errors in Vercel runtime logs

## Week 2: Webhook Receiver

Goal: A working `/in/{source}/{token}` endpoint that verifies signatures and persists events for all three sources.

### Day 1: Endpoint Creation Flow

The endpoint creation flow differs by source because each source manages signing secrets differently. Build a shared scaffold + per-source variant.

**Shared part (all sources):**

- Build `(app)/endpoints/new/page.tsx` — source picker (Stripe / Shopify / GitHub cards)
- After picking a source, generate a token (`crypto.randomBytes(24).toString('base64url')`)
- Show the user the full URL `hooks.tinykomainu.com/in/{source}/<token>` with a copy-to-clipboard button
- Insert the row into `hooks_endpoints` with hashed token (signing secret saved later per-source)

**Stripe variant:**

- Step 1: User copies the URL
- Step 2: Instructions: "Go to your Stripe Dashboard → Developers → Webhooks → Add endpoint, paste this URL, select the events you want, save."
- Step 3: "Stripe gave you a Signing secret starting with `whsec`_. Paste it here."
- User pastes the secret → we encrypt it with AES-256-GCM and update `signing_secret_enc`

**GitHub variant:**

- Step 1: User copies the URL
- Step 2: We generate a random 32-byte secret on the Hooks side and show it to the user with copy-to-clipboard ("This is your webhook secret. Save it now — we won't show it again.")
- Step 3: Instructions: "In your GitHub repo, go to Settings → Webhooks → Add webhook. Paste the URL as Payload URL, paste the secret as Secret, set Content type to application/json, choose events, save."
- We encrypt the generated secret with AES-256-GCM and store in `signing_secret_enc`

**Shopify variant (MVP: Private App approach):**

- Step 1: User copies the URL
- Step 2: Instructions: "In your Shopify Admin, go to Settings → Apps and sales channels → Develop apps → Create an app → Configure Admin API access → Webhooks. Paste the URL, choose API version and events, save."
- Step 3: "Shopify will sign webhooks using your app's API secret key. Find it in App credentials. Paste it here."
- User pastes the API secret key → we encrypt and store in `signing_secret_enc`

**Common ending:**

- After secret is saved, redirect to the endpoint detail page with a "Send test event" CTA
- The per-source instruction screens need real screenshots (taken in Week 6, placeholder text for now)

### Day 2: Signature Verification — Stripe

- Implement `apps/hooks/lib/verify/stripe.ts` using `stripe.webhooks.constructEvent`
- Implement `apps/hooks/lib/extract/stripe.ts` to pull `event.id`, `event.type`
- Write unit tests with sample Stripe webhook payloads (use `stripe-mock` or fixtures)

### Day 3: Signature Verification — Shopify and GitHub

- Implement `apps/hooks/lib/verify/shopify.ts` (HMAC-SHA256, base64)
- Implement `apps/hooks/lib/verify/github.ts` (HMAC-SHA256, hex with `sha256=` prefix)
- Implement extractors for both
- Unit tests for each

### Day 4: Receiver Endpoint

- Build `apps/hooks/app/in/[source]/[token]/route.ts`
- Flow: lookup endpoint by token hash → read raw body → verify signature → check idempotency → persist event → ack 200
- Reject unknown sources with 404
- Reject invalid signatures with 401
- Time the entire flow; assert p99 < 1.5s
- Add structured logging for `webhook.received`, `webhook.signature_failed`, `webhook.duplicate`

### Day 5: Idempotency and Quota ✅ 2026-05-04

- Idempotency via `(endpoint_id, event_id)` unique constraint + 23505 handler — done in Day 4
- Quota enforcement added in `lib/receive/check-quota.ts`:
  - `computeQuotaDecision(used, tier)` — pure function, 14 unit tests pass
  - `checkQuota(userId)` — queries subscription + `hooks_events_used_this_month()` RPC
  - Fails open on RPC error (drops quota accuracy to preserve availability)
- Free tier at/over limit: persisted with `processing_status = 'quota_dropped'`, returns 200
- Pro/team at 10% overage (`< limit * 1.1`): insert as pending, structured warn log for Week 5 billing
- Pro/team over 10%: insert as pending, structured warn log (`quota.overage_billable`)
- IEEE 754 boundary fixed with `Math.floor(limit * 1.1)` (50000 * 1.1 floats to 55000.00...01)

### Day 6: End-to-End Test with Real Source

- Sign up a test account
- Create a Stripe endpoint
- In Stripe sandbox dashboard, paste the URL and signing secret
- Trigger a test event from Stripe (`stripe trigger checkout.session.completed`)
- Verify the event arrives, signature passes, row is in `hooks_events`
- Repeat for Shopify (use a dev store) and GitHub (use a test repo)

### Day 7: Endpoint Management UI

- Build `(app)/endpoints/[id]/page.tsx` showing: source, label, URL fingerprint, status, recent events
- Pause/resume endpoint (toggle `status` column)
- Archive endpoint (sets `status = 'archived'`, hides from active list but retains data)
- Add empty state for no events: "Waiting for your first webhook"

### Week 2 Done When

- All three sources can post webhooks and have them stored
- Signature verification works for all three
- Idempotency prevents duplicate processing
- Quota check prevents free-tier abuse
- Receiver p99 latency < 1.5 seconds
- User can create, pause, and archive endpoints

## Week 3: Translation Engine

Goal: Filters and templates work end-to-end. An incoming event can be filtered, rendered, and dispatched to a channel.

### Day 1: Filter Evaluator

- Implement `apps/hooks/lib/translate/filter.ts` with all 10 operators
- `getByPath` helper for dot-notation field access (handle missing fields gracefully)
- Unit tests covering each operator and edge cases (null, nested arrays, missing fields)

### Day 2: Template Renderer

- Implement `apps/hooks/lib/translate/template.ts` with variable substitution
- Implement pipes: `default`, `date`, `div`, `mul`
- Unit tests covering each pipe and edge cases (missing fields, type mismatches)

### Day 3: Process Orchestrator

- Implement `apps/hooks/lib/translate/process.ts`
- For each route on the endpoint: evaluate filter → render template → call `dispatchToChannel` from `@tinykomainu/notifications`
- Log to `hooks_deliveries` with status (`delivered` | `filter_blocked` | `channel_failed` | `template_error`)
- Update event's `processing_status` based on aggregate result

### Day 4: Receiver → Process Wiring

- After persisting an event in the receiver, fire-and-forget `POST /api/process/{event_id}`
- Implement `/api/process/[event_id]/route.ts` with `CRON_SECRET`-style internal auth
- Confirm: webhook arrives → event row inserted → process route runs → deliveries logged

### Day 5: Pre-Built Templates

- Curate 3-5 templates per source × channel combination (3 sources × 4 channels × ~3 templates = ~36 templates)
- Store in a static TypeScript file `apps/hooks/lib/templates/library.ts`
- Each template has: name, description, source, channel, filter (optional), template body
- Examples:
  - Stripe → Slack: "💰 New ${data.object.amount_total | div: 100} ${data.object.currency} payment from ${data.object.customer_email}"
  - Shopify → Discord: "🛍️ Order #${order_number} placed by ${customer.first_name} ${customer.last_name}"
  - GitHub → Email: "New issue opened: ${issue.title} by ${issue.user.login}"

### Day 6: Route Configuration UI

- Build `(app)/endpoints/[id]/routes/page.tsx`
- Add route flow: pick a pre-built template → pick a channel → tweak filter (no-code form) → save
- List existing routes with reorder, edit, disable, delete
- Show a live preview of what the rendered message will look like (using a stored sample event from this endpoint, if any)

### Day 7: Filter UI Polish

- Build the no-code filter UI: dropdown for field, dropdown for operator, input for value, AND chips
- Provide field suggestions per source (top 20 most useful fields for Stripe events, etc.)
- Add a "JSON" tab for power users to edit raw filter JSON
- Validate filter JSON before save (malformed JSON, unknown operators, invalid field paths)

### Week 3 Done When

- An event arrives → filter evaluates → template renders → message reaches Slack/Discord/Email/Webhook
- Pre-built templates work for all 12 source × channel combinations
- Users can configure filters via a no-code UI
- Failed deliveries are logged with error details

## Week 4: Event Log + Replay

Goal: Users can see what came in, what got delivered, and replay past events.

### Day 1: Per-Endpoint Event Log

- Build `(app)/endpoints/[id]/logs/page.tsx`
- Table: time, event type, processing status, delivery summary
- Pagination (50 per page, infinite scroll)
- Filter by status (delivered / filter blocked / failed)

### Day 2: Cross-Endpoint Event Log

- Build `(app)/events/page.tsx` showing events across all endpoints for the user
- Filter by source, status, time range
- Search by event_id (Stripe `evt_xxx`, Shopify webhook ID, GitHub delivery ID)

### Day 3: Event Detail Page

- Build `(app)/events/[id]/page.tsx`
- Show: full payload (collapsible JSON viewer), headers, processing status, retry count
- Show all `hooks_deliveries` rows for this event (one per route)
- For each delivery: status, channel, rendered message, error (if any)
- Action: "Replay" button (Pro+ feature)

### Day 4: Replay Endpoint

- Implement `/api/events/[id]/replay/route.ts`
- Verify ownership, check rate limit (100/hour per user)
- Insert a new event row with `replayed_from_id` set
- Process synchronously (so user sees result on the page reload)
- Show success/error toast

### Day 5: Retry Cron Job

- Implement `/api/cron/retry-failed-events/route.ts`
- Query `hooks_events WHERE processing_status = 'pending_retry' AND next_retry_at <= now()`
- Process each, increment `retry_count`, calculate next backoff
- After 5 retries, mark `failed`
- Configure Vercel Cron for every 5 minutes
- Test by manually setting an event to `pending_retry` and verifying retry happens

### Day 6: Purge Cron Job

- Implement `/api/cron/purge-expired-events/route.ts`
- Call `hooks_purge_expired_events()` in a loop (until 0 returned or 50s elapsed)
- Configure Vercel Cron for daily at 03:00 UTC
- Test on staging with a few expired events

### Day 7: Polish

- Empty states for event log ("No events yet — paste your URL into Stripe to test")
- Error toasts for failed replays ("Rate limit reached. Try again in an hour.")
- Keyboard shortcuts: `?` to show shortcuts, `r` to replay focused event, `/` to focus search

### Week 4 Done When

- Users can browse events per endpoint and across endpoints
- Event detail shows full payload and per-route delivery status
- Replay works and is rate-limited
- Failed events retry with exponential backoff
- Expired events are purged daily

## Week 5: Billing

Goal: Free → Pro → Team upgrades work via Stripe Checkout. Customer Portal handles cancellation. Quota enforcement is live.

### Day 1: Stripe Products

- In Stripe dashboard (sandbox), create:
  - Product "Hooks Pro" with monthly price $9 USD
  - Product "Hooks Team" with monthly price $29 USD
  - Optional: metered overage product at $0.001/event
- Save price IDs in `STRIPE_PRICE_HOOKS_PRO_MONTHLY` and `STRIPE_PRICE_HOOKS_TEAM_MONTHLY` env vars

### Day 2: Checkout Flow

- Implement `apps/hooks/app/api/billing/checkout/route.ts` (mirrors Watch's pattern)
- Pass `metadata: { product: 'hooks', tier: 'pro' | 'team' }` to Stripe Checkout
- Build `(app)/billing/page.tsx` with current plan card and upgrade buttons
- Test: free user clicks Pro → Stripe Checkout → success page → returns to app with Pro tier

### Day 3: Webhook Integration

- Extend `apps/hooks/app/api/webhooks/stripe/route.ts` (separate from Watch's)
- Handle `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- On success, upsert `subscriptions` with `product = 'hooks'`
- Verify with Stripe CLI: `stripe trigger checkout.session.completed`

### Day 4: Customer Portal

- Implement `apps/hooks/app/api/billing/portal/route.ts`
- "Manage subscription" button on billing page → redirects to Stripe Portal
- Configure portal in Stripe to allow plan changes between Pro and Team
- Configure return URL to `hooks.tinykomainu.com/billing`

### Day 5: Quota Enforcement

- Confirm receiver's quota check correctly reads `subscriptions` for `product = 'hooks'`
- Build a "Usage" widget on the dashboard showing X / Y events used this month
- Show banner at 80% used ("Approaching your monthly limit") and 100% used ("Limit reached. Upgrade to keep receiving events.")

### Day 6: Channel Tier Gating

- Free tier: only email channel allowed for routes
- Pro/Team: all four channels
- Update route creation UI to disable Slack/Discord/Webhook with a "Pro" lock badge for free users
- Existing routes from before downgrade are paused, not deleted

### Day 7: Edge Cases

- Test: user upgrades mid-month → existing events count toward new tier's quota
- Test: user downgrades from Pro to Free → existing endpoints continue receiving but Pro routes disabled
- Test: subscription canceled at period end → behaves like Pro until period_end, then auto-downgrades
- Test: failed payment → user enters `past_due` state, gets a banner, has 7 days to update payment

### Week 5 Done When

- Free → Pro → Team upgrades work end-to-end
- Customer Portal handles cancellation and plan changes
- Quota is enforced at the receiver
- Channel access is tier-gated correctly
- Test mode subscriptions can be created with Stripe test cards

## Week 6: Launch Prep + Soft Launch

Goal: Public, polished, launchable. First 10 paying customers acquired.

### Day 1: Marketing Site Copy

- Write LP copy for `hooks.tinykomainu.com` (hero, features, pricing, FAQ)
- Apply BRAND.md voice consistently
- Add a "How it works" section with a 3-step diagram (Receive → Translate → Deliver)
- Add testimonial placeholder (real testimonials added post-launch as quotes come in)
- Update `tinykomainu.com` (the umbrella site) to mention Hooks alongside Watch

### Day 2: Onboarding Flow

- Build a multi-step welcome sequence for first-time users
- Step 1: "Pick your first source" (Stripe / Shopify / GitHub)
- Step 2: "We've generated your URL — paste it here in [Source]" with screenshots
- Step 3: "Let's wait for your first event" (with a pulse animation)
- Step 4: "Pick a channel" (defaults to email if no Slack/Discord set up)
- Step 5: "Pick a template"
- Step 6: "You're all set"
- Save progress so users can resume if they leave mid-flow

### Day 3: Documentation

- Create `docs.tinykomainu.com/hooks` (or a `/docs` route on the Hooks app)
- Setup guide per source (Stripe with screenshots, Shopify with screenshots, GitHub with screenshots)
- Filter syntax reference
- Template syntax reference (variables, pipes, examples)
- FAQ: "What happens if I exceed my quota?", "How do replays work?", "Can I migrate from Zapier?"

### Day 4: Legal and Trust

- Update `tinykomainu.com/legal/terms` to cover Hooks
- Update `tinykomainu.com/legal/privacy` to mention payload storage and retention
- Add a Hooks-specific section to the privacy policy: "We store your webhook payloads encrypted on Supabase (Tokyo region) for the duration matching your tier."
- Add a "Trust" page explaining encryption, RLS, and retention

### Day 5: Pre-Launch Testing

- Run through the full user journey from signup to first delivered event
- Test signup with new email → create endpoint → paste URL into real Stripe sandbox → trigger test event → see message arrive in Slack
- Test billing: upgrade to Pro, verify channel unlock, downgrade, verify gating
- Test replay end-to-end
- Run `pnpm typecheck`, `pnpm lint`, `pnpm test` across the monorepo

### Day 6: Soft Launch — Indie Hackers

- Post to Indie Hackers in the morning (US/EU active hours)
- Title: "I built Hooks — webhook translator for non-engineers (it's the indie alternative to Hookdeck)"
- Body: the journey of building Watch → Hooks, why webhooks are painful for non-engineers, the differentiator (filter + template + replay)
- Tweet from your real account; brand account follows once traction starts
- Respond to every comment within 1 hour for first 24 hours

### Day 7: Iterate

- Fix top 3 issues based on Day 6 feedback
- Reach out personally to first 10 paying customers
- Post a Day-1 retrospective on Indie Hackers
- Plan Week 7+ priorities based on real user demand

### Week 6 Done When

- Hooks is launched publicly with at least 50 sign-ups in 48 hours
- At least 3 paying customers (not counting yourself)
- At least one piece of public coverage (IH front page, tweet with traction, etc.)
- Direct user feedback collected and Week 7+ priority list drafted

## Post-Launch (Week 7+)

This is intentionally vague. Real priorities will emerge from real users.

Likely Week 7-12 themes:

- **Adding more sources**: SendGrid, Resend, Calendly, Tally, Typeform — based on user requests
- **OR-logic and grouped filters**: Most-requested feature post-launch is almost certainly "I want event A OR event B"
- **PII redaction**: Users with sensitive payloads will want field-level redaction
- **Outbound webhooks**: Forward translated messages to a user-specified URL with retry semantics (we already have generic webhook channel; this is the productized version)
- **CLI tool**: Pro feature for engineers — `tk-hooks tail` to stream events to terminal
- **Slack app**: Native Slack app instead of Incoming Webhook for richer formatting and easier setup
- **Bulk replay**: Replay 100 events at once for incident recovery
- **Webhook signing for outbound**: When forwarding to user webhook, sign the request so they can verify it's from Hooks
- **Marketing**: Hooks-specific blog posts, comparison content vs Hookdeck/Zapier, case studies

Update this document at the end of each phase.

## Cross-Product Considerations

These items affect both Watch and Hooks. Address as needed during Hooks development.

- **Shared signup flow**: Currently Watch's signup creates only Watch subscription. Decide: when a user signs up at `hooks.tinykomainu.com`, do we automatically give them a Free tier on Watch too? Probably yes — costs us nothing and increases cross-sell visibility.
- **Unified dashboard hint**: On `tinykomainu.com` (the umbrella), show users their plan status across both products if they're logged in.
- **Combined billing**: Stripe customer is shared, but each product is billed separately. Users see one card on file and two subscription lines on their Stripe portal — keep this clean.
- **Single sign-on between subdomains**: Already handled by Supabase Auth + cookie scope. Verify it still works after Hooks launch.

## Decision Log

- **2026-04**: Decided to launch Hooks 6 weeks after Watch's launch. Reasoning: Watch validated the platform; Hooks reuses 70% of infrastructure; the team has fresh learnings from Watch shipping.
- **2026-04**: Three sources at MVP (Stripe, Shopify, GitHub). Each represents a different user persona and exercises different parts of the receiver. More sources defer to Week 7+ based on user requests.
- **2026-04**: Replay is in MVP, not Week 7+. Reasoning: it's the strongest differentiator and is technically simple once events are stored. Cutting it would weaken the launch narrative.
- **2026-04**: Per-product subscriptions (separate Stripe subscriptions for Watch and Hooks) instead of bundling. Reasoning: cleaner accounting, simpler upgrade/downgrade logic, lets users buy only what they need. Bundling can come later as a discount product.

