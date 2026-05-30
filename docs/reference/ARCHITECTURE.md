# ARCHITECTURE.md

This document defines the technical architecture for TinyKomainu.

## Guiding Principles

1. **Boring tech, modern flavor** — Use proven, well-documented tools. No experimental frameworks.
2. **Free tier first** — Every service must have a usable free tier. We pay only when usage demands it.
3. **One person operable** — A solo developer must be able to run, debug, and deploy everything.
4. **Shared infrastructure across products** — All 5 products share auth, billing, DB, and deployment.
5. **Reversible decisions** — Avoid lock-in. Prefer standard interfaces (Postgres, REST) over proprietary ones.

## Tech Stack (Locked)

### Frontend
- **Framework**: Next.js 15 (App Router, Server Components)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 4
- **Component Library**: shadcn/ui (copied into `packages/ui`, not installed as a dependency)
- **Form**: react-hook-form + zod
- **Data Fetching**: Server Components + native fetch; React Query only when client-side caching is essential

### Backend
- **API Layer**: Next.js Route Handlers (App Router)
- **Background Jobs**: Vercel Cron Jobs (initially), migrate to Cloudflare Workers if scale demands
- **Database**: Supabase (PostgreSQL 15+)
- **Auth**: Supabase Auth (Google + GitHub OAuth, magic link as fallback)
- **ORM**: Supabase JS client + auto-generated TypeScript types. No Prisma initially.

### Payments
- **Provider**: Stripe
- **Model**: Stripe Subscriptions with metered billing where applicable
- **Webhook Handling**: Next.js Route Handler at `/api/webhooks/stripe`

### Notifications
- **Email**: Resend
- **Slack/Discord**: Native webhooks
- **SMS**: Twilio (Pro+ tier only)
- **Custom Webhooks**: Direct HTTP POST

### Infrastructure
- **Hosting**: Vercel (Pro plan when free tier exceeded)
- **DNS / CDN / WAF**: Cloudflare
- **Domain**: tinykomainu.com (root + subdomains per product)
- **Monitoring**: Sentry (errors), Vercel Analytics (performance), Plausible or PostHog (product analytics)

### Development
- **Monorepo**: Turborepo + pnpm
- **Package Manager**: pnpm (faster, disk-efficient, monorepo-friendly)
- **Node Version**: 20 LTS
- **CI/CD**: GitHub Actions for tests + lint, Vercel auto-deploy on push to `main`
- **Code Quality**: ESLint + Prettier + TypeScript strict

## Repository Structure

```
tinykomainu/
├── apps/
│   ├── web/                  # Marketing site → tinykomainu.com
│   │   ├── app/
│   │   ├── public/
│   │   └── package.json
│   ├── watch/                # Watch app → watch.tinykomainu.com
│   │   ├── app/
│   │   │   ├── (marketing)/  # Public LP
│   │   │   ├── (auth)/       # Login, signup
│   │   │   ├── (app)/        # Authenticated dashboard
│   │   │   └── api/          # Route Handlers
│   │   └── package.json
│   └── workers/              # Polling jobs (Vercel Cron-deployed Next.js routes initially)
│       └── ...
├── packages/
│   ├── ui/                   # Shared components (shadcn-based)
│   ├── auth/                 # Supabase Auth helpers
│   ├── db/                   # Supabase client + DB types
│   ├── stripe/               # Stripe wrapper
│   ├── notifications/        # Email/Slack/Discord/Webhook delivery
│   ├── config/               # Shared ESLint, TS, Tailwind configs
│   └── types/                # Shared domain types
├── docs/                     # Source-of-truth documents
├── supabase/                 # Migrations, seeds
│   └── migrations/
├── .github/
│   └── workflows/            # CI workflows
├── CLAUDE.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Subdomain Strategy

| Subdomain | Purpose | App |
|---|---|---|
| tinykomainu.com | Marketing, brand hub | apps/web |
| watch.tinykomainu.com | Watch product app | apps/watch |
| hooks.tinykomainu.com | Hooks (future) | apps/hooks |
| docs.tinykomainu.com | Public documentation | (future, may be on apps/web) |

Each app is deployed as an independent Vercel project for isolation, but shares the same database and auth.

## Authentication Flow

1. User signs up via `watch.tinykomainu.com/signup` using Google, GitHub, or magic link
2. Supabase Auth creates a row in `auth.users`
3. Our app trigger creates a corresponding row in `public.profiles` with default settings
4. Session token (JWT) is stored in HTTP-only cookies via `@supabase/ssr`
5. The same Supabase project is used across all subdomains, so a user logged into Watch is also logged into other future products

## Background Job Strategy

### Phase 1: Vercel Cron (Free)
- Vercel Cron triggers `apps/watch/app/api/cron/poll-statuses/route.ts` every 5 minutes
- The route handler iterates through all `api_definitions`, polls their status sources, writes to `status_checks`, and triggers notifications for state changes
- Free Vercel plan supports cron jobs up to once per hour. **Hobby plan supports up to 1/hour, Pro plan supports any frequency.** We will start on Pro plan ($20/mo) immediately for Watch.

### Phase 2: Cloudflare Workers (When Scale Demands)
- If we exceed Vercel function limits or need sub-minute polling, migrate the polling logic to Cloudflare Workers + Durable Objects
- Trigger via Cloudflare Cron Triggers (1-minute granularity available)
- This is a future migration. Start with Vercel Cron.

### Decision Log
- **2026-04: Start with Vercel Cron on Pro plan.** Reasoning: simpler deployment, single language (TypeScript), no separate auth between Workers and DB. Migrate when polling volume exceeds 10,000 checks/day or sub-5-minute granularity is needed.

## Data Flow Diagrams

### Status Check Flow
```
Vercel Cron (every 5 min)
  → POST /api/cron/poll-statuses
    → For each api_definition:
        → fetch(status_url)
        → parse(response, parser_config)
        → INSERT INTO status_checks
        → Compare with previous status:
            → If state change (operational ↔ degraded/outage):
                → INSERT INTO incidents (or UPDATE end_time)
                → For each user watching this api:
                    → For each enabled notification channel:
                        → Send notification
```

### Subscription Lifecycle
```
User clicks "Upgrade" 
  → Redirect to Stripe Checkout
    → Payment success webhook → /api/webhooks/stripe
      → UPDATE subscriptions SET status = 'active'
      → User immediately sees Pro features

User cancels in Stripe Customer Portal
  → Webhook → /api/webhooks/stripe
    → UPDATE subscriptions SET cancel_at_period_end = true
    → User retains Pro access until period_end, then auto-downgrades
```

## Environment Variables

All services use `.env.local` for development and Vercel environment variables in production.

### Required for Watch (apps/watch)

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server-only, never expose to client

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID_PRO=
STRIPE_PRICE_ID_TEAM=

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM_EMAIL=alerts@tinykomainu.com

# Twilio (later, for SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

# Sentry
SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# App
NEXT_PUBLIC_APP_URL=https://watch.tinykomainu.com
CRON_SECRET=                         # used to authenticate cron requests
```

## Security Model

1. **Row Level Security (RLS)** is enabled on every Supabase table. Users can only read/write their own data.
2. **Service role key** is used only on the server, never sent to the client.
3. **Stripe webhook signatures** are verified on every webhook request.
4. **Cron endpoints** require `CRON_SECRET` in the Authorization header.
5. **All third-party API keys** are stored in Vercel environment variables, never in code.
6. **Database backups** rely on Supabase's automatic daily backups (Pro plan required for point-in-time recovery; we'll add when revenue justifies).

## Performance Targets

- API status check polling: complete all 30+ checks within 60 seconds (well under the 5-minute interval)
- Dashboard page load: under 1 second on a good connection
- Notification delivery: state-change to user notification within 60 seconds
- Stripe webhook processing: respond with 200 within 5 seconds

## Cost Projection (First 6 months)

Assuming ~500 users by Month 6 with ~30 paying:

| Service | Free Tier | Expected Cost |
|---|---|---|
| Vercel | Hobby plan free; **Pro plan $20/mo** required for cron flexibility | $20/mo |
| Supabase | Free tier (500MB DB, 50K MAU) | $0–25/mo |
| Stripe | Pay per transaction (2.9% + 30¢) | ~$10/mo on $300 MRR |
| Resend | 3,000 emails/mo free | $0 |
| Cloudflare | Free | $0 |
| Sentry | Free tier | $0 |
| Domain | tinykomainu.com | ~$15/year |
| **Total** | | **~$30-55/mo** |

Break-even point: ~5-7 paying customers at $9/mo. Achievable in Month 2-3.

## Migration Paths (Future)

- If Vercel becomes too expensive at scale: migrate to self-hosted Next.js on Fly.io or Railway
- If Supabase becomes too restrictive: migrate to managed Postgres (Neon, Render) — Supabase Auth can be replaced with Auth.js
- If Stripe is wrong for some markets: add Paddle as Merchant of Record

These are explicitly **not** decisions for now. Documented to acknowledge they exist.