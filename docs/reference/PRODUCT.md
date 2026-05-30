# PRODUCT.md

This document defines the product specifications for TinyKomainu.

## Brand Overview

**TinyKomainu** is a suite of small, focused tools that guard indie hackers' tech stacks. The brand metaphor is komainu — Japanese guardian lion-dogs that traditionally protect shrines. Each product is one komainu with a specific role.

The brand voice is friendly, slightly playful, but technically credible. We are not enterprise software. We are the small, loyal companion that helps individual builders.

## Product Suite Vision

Five products will eventually live under TinyKomainu:

| Codename | Role | Status |
|---|---|---|
| Watch | API status monitoring for indie SaaS dependencies | **Building first** |
| Hooks | Webhook translator for non-engineers | Phase 2 |
| Helpdesk | Notion-based knowledge base sync | Phase 3 |
| Pen | AI email drafter for Japanese solo professionals | Phase 4 |
| Hunt | AI/ML focused job board for Japan | Phase 5 |

Each product is independently usable but shares authentication, billing, and infrastructure.

---

## Watch — Detailed Specification

### Concept

Indie hackers and small SaaS operators depend on 3-10 external APIs (OpenAI, Anthropic, Stripe, Twilio, Resend, Vercel, Cloudflare, Supabase, GitHub, etc.). When any one of these has an outage, their service breaks. Existing solutions (StatusGator, IsDown) are priced for enterprises ($29-99/month) and overbuilt.

Watch is the indie-priced, indie-designed alternative. Monitor only the APIs you actually use. Get notified only when something you depend on goes down.

### Target User

- Indie hackers running 1-3 SaaS products
- Solo developers and small teams (1-5 people)
- Bootstrappers who can't justify $30/month for status monitoring but lose money when their stack is silently broken

### Core Value Proposition

"Know within 1-3 minutes when an API your SaaS depends on goes down — and only those APIs, in only the channels you care about."

### Feature Scope (MVP)

#### 1. API Selection
- Curated catalog of 30-50 APIs commonly used by indie hackers
- User selects which APIs they depend on via simple checkboxes
- Initial catalog must include: OpenAI, Anthropic, Stripe, GitHub, Vercel, Supabase, Cloudflare, Twilio, Resend, Discord, Slack, Notion, Airtable, AWS S3, Google Cloud (Compute, Storage), Mailgun, Postmark, SendGrid, Plaid, Auth0, Clerk, PostHog, Sentry, Linear, Webflow, Shopify, Square, Algolia, Pusher, Pinecone

#### 2. Status Polling
- Each API's official status page is polled every 5 minutes
- Sources: RSS feeds, JSON status APIs, or HTML scraping (per API)
- Polling runs on Cloudflare Workers or Vercel Cron (decision in ARCHITECTURE.md)

#### 3. Dashboard
- Single-screen view: only APIs the user has selected
- Three-color status indicator: green (operational), yellow (degraded), red (outage)
- 90-day uptime history graph per API
- Click any API to see its incident history

#### 4. Notifications
- Triggered only when a watched API changes from operational to degraded/outage
- Channels: Email (always available), Slack, Discord, custom Webhook, SMS (Pro+ only)
- Deduplication: same incident does not re-notify within 30 minutes
- Resolution notifications when service is restored

#### 5. Incident History & Notes
- Each detected incident is logged with start time, end time, severity
- Users can add private notes to incidents (e.g., "this caused our checkout to fail for 12 minutes")
- Notes are searchable — this builds switching cost over time

### Pricing Tiers

| Tier | Price | API Limit | Channels | History |
|---|---|---|---|---|
| Free | $0/mo | 5 APIs | Email only | 7 days |
| Pro | $9/mo | 20 APIs | Email + Slack + Discord + Webhook | 90 days |
| Team | $29/mo | Unlimited | All + SMS, multi-user | 1 year |

Pricing rationale: Free tier removes friction. Pro tier is impulse-buy territory ($9/mo) for solo devs whose stack has more than 5 APIs. Team tier captures small companies and growing indie projects.

### Out of Scope (for MVP)

- Custom API monitoring (user provides their own URL)
- Synthetic monitoring (active health checks)
- Public status pages
- Mobile app
- API uptime SLA reporting
- Integrations beyond Slack/Discord/Webhook/Email/SMS

These may come later but are explicitly excluded from the first version.

### Success Metrics

- Week 6 post-launch: 100 free users, 5 paying users
- Week 12 post-launch: 500 free users, 30 paying users ($270 MRR)
- Week 24 post-launch: 2,000 free users, 150 paying users ($1,350 MRR)

These are baselines. The point is to validate the model with real paying users, not to maximize early revenue.

### Differentiation from Competitors

| Competitor | Their Position | Our Position |
|---|---|---|
| StatusGator | Enterprise, $40-200/mo | Indie, $9/mo |
| IsDown | $29-99/mo, broad SaaS focus | $9/mo, indie-stack focus |
| Down Detector | Free, crowdsourced, noisy | Paid, official sources, signal-only |
| Each API's own status page | Separate per service | Aggregated, only what you care about |

The wedge is **price + curated catalog of indie-relevant APIs + selection-based filtering**. We are not trying to monitor every API on the internet. We are the tool for someone whose SaaS depends on 7 specific services.

### Anti-Goals

- We will NOT become an enterprise observability platform
- We will NOT compete with Datadog, New Relic, or PagerDuty
- We will NOT add features that increase complexity without serving the indie hacker
- We will NOT raise prices to chase enterprise margins