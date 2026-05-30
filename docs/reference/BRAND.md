# BRAND.md

This document defines the brand identity for TinyKomainu.

## Core Idea

**TinyKomainu** is a small guardian for indie hackers' tech stacks.

The metaphor is komainu — Japanese guardian lion-dogs that protect Shinto shrines. They come in pairs (one with mouth open saying "ah", one closed saying "un"), they're small but vigilant, and they've been doing the same job reliably for over a thousand years.

That's the brand. Loyal, watchful, small, and quietly capable.

## Brand Personality

If TinyKomainu were a person, it would be:

- **A skilled craftsperson, not a corporate vendor.** Talks plainly. Builds carefully.
- **A friend to indie hackers, not a salesperson.** Doesn't oversell. Admits limitations.
- **Quietly proud of being small.** Doesn't apologize for not being enterprise. That's the point.
- **Japanese-influenced but globally fluent.** Doesn't lean on kawaii cliché. Doesn't hide its origin.

What it is NOT:

- Not corporate, not "synergy"-speak
- Not aggressive growth-hacker tone
- Not anime-style mascot cuteness
- Not Silicon Valley hype

## Voice & Tone

### General Voice
- Direct, warm, slightly understated
- Confident but never boastful
- Technical when needed, plain otherwise
- Uses "we" sparingly; speaks as a peer to the user

### Tonal Variations by Context

| Context | Tone | Example |
|---|---|---|
| Marketing copy | Confident, clear | "Know when an API your stack depends on goes down. Nothing more, nothing less." |
| Onboarding | Friendly, guiding | "Pick the APIs you actually use. We'll watch them. You can change this anytime." |
| Error messages | Honest, calm | "We couldn't reach OpenAI's status page. We'll try again in 5 minutes." |
| Notifications | Urgent but not alarming | "Stripe is degraded. Started 4 minutes ago. Source: status.stripe.com" |
| Empty states | Encouraging | "No incidents in the last 90 days. Boring is good." |
| Pricing | Plain, unembarrassed | "$9/month. Cancel anytime. That's it." |

### Words We Use
- watch, guard, notify, alert
- indie, small, focused
- reliable, quiet, careful

### Words We Avoid
- "platform", "solution", "leverage", "synergy", "empower"
- "revolutionary", "game-changing", "next-gen"
- Excessive emoji
- "AI-powered" (when it's not the point)

## Naming Conventions

### Brand Hierarchy
- **TinyKomainu** — the umbrella brand
- **Watch by TinyKomainu** — formal product reference
- **Watch** — short product name in casual contexts
- Future: **Hooks**, **Helpdesk**, **Pen**, **Hunt**

### Domain Conventions
- Root: `tinykomainu.com`
- Products: `{product}.tinykomainu.com` (e.g., `watch.tinykomainu.com`)
- Documentation: `docs.tinykomainu.com` (future)

### Capitalization
- Brand: **TinyKomainu** (one word, two capitals)
- Products: **Watch**, **Hooks** (proper nouns, capitalized)
- Generic terms: lowercase ("dashboard", "settings", "incident")

### Pronunciation
- TinyKomainu: "TIE-nee koh-MY-noo"
- The Japanese pronunciation "koh-MAH-ee-noo" is also acceptable
- We don't insist either way; just provide a hint when needed

## Visual Identity

### Color Palette

Primary palette is restrained and slightly traditional Japanese in feel.

| Name | Hex | Use |
|---|---|---|
| Sumi (墨) | `#1A1A1A` | Primary text, dark backgrounds |
| Shu (朱) | `#D94D38` | Brand accent, CTAs, alerts |
| Aijiro (藍白) | `#EBF6F7` | Light backgrounds, surface |
| Kinari (生成り) | `#F5F0E6` | Warm neutral background |
| Sanshoiro (山吹色) | `#F0B73E` | Warning, degraded state |
| Matcha (抹茶) | `#7BA05B` | Operational, success |

Status colors specifically:
- **Operational**: Matcha (`#7BA05B`)
- **Degraded**: Sanshoiro (`#F0B73E`)
- **Outage**: Shu (`#D94D38`)
- **Unknown / Maintenance**: Sumi 60% (`#1A1A1A` at 60% opacity)

### Typography

- **Headings**: Inter (variable weight)
- **Body**: Inter
- **Code/Mono**: JetBrains Mono

Both fonts are free, open source, and load fast. We don't need a custom display face for v1.

### Logo Concept

The logo is a stylized komainu silhouette — minimal, geometric, immediately readable at 16px favicon scale.

Implementation guidance for designer or AI image tool:
- Single komainu (not a pair) for the brand mark
- Sitting upright, alert posture
- Silhouette in Sumi (`#1A1A1A`) on light backgrounds
- White silhouette on dark backgrounds
- Wordmark "TinyKomainu" in Inter Semibold, set to the right of the icon
- Product names ("Watch") set below or beside in lighter weight

For MVP, an emoji-style placeholder (🦁 or a simple SVG) is acceptable. Don't block launch on logo polish.

### UI Principles

1. **Whitespace over density.** Indie hackers stare at dashboards all day. Ours should feel like a relief.
2. **Mono for data, sans for everything else.** Timestamps, IDs, status codes in JetBrains Mono.
3. **Status colors used sparingly.** Green dot = operational. Don't drown the dashboard in green.
4. **Cards over tables for the main dashboard.** Tables are for detail views.
5. **No animations on critical state.** Outage red doesn't pulse or wiggle. Calm is reassuring.

## Copywriting Examples

These are reference points for tone, not literal copy to reuse.

### Hero (Watch landing page)

> Watch.
> Status monitoring for indie SaaS.
>
> Know when an API your stack depends on breaks. Get notified in the channel you actually check. $9/month.

### Empty State (Dashboard with no APIs watched)

> Nothing to watch yet.
>
> Pick the APIs your SaaS depends on. We'll handle the rest.
> [Browse the catalog]

### Outage Notification (Email)

> Subject: [Watch] Stripe is degraded
>
> Stripe started reporting degraded performance 4 minutes ago.
>
> Affected components: API, Dashboard
> Source: https://status.stripe.com/incidents/abc123
>
> We'll let you know when it resolves.

### Resolution Notification (Email)

> Subject: [Watch] Stripe is back to operational
>
> The incident lasted 23 minutes.
>
> If this affected your service, you can add a private note from your dashboard for next time.
> [View incident]

### Upgrade Prompt (in-app, hit free-tier limit)

> You're watching 5 APIs — that's the Free plan limit.
>
> Pro is $9/month. 20 APIs, Slack, Discord, webhook delivery.
> No annual lock-in. Cancel anytime in two clicks.
>
> [See Pro] [Maybe later]

## Brand Promises

These are commitments. Don't break them.

1. **No surprise pricing.** No upsells, no credit-card-required trials, no auto-charging hidden tiers.
2. **No tracking we wouldn't want done to us.** We use Plausible or self-hosted PostHog. No Google Analytics, no Facebook Pixel.
3. **No AI hype.** We use AI when it helps. We don't mention it when it doesn't matter.
4. **No fake urgency.** No "limited time offer", no countdown timers, no "10 spots left".
5. **No dark patterns.** Cancellation is two clicks. Data export is one click. We mean it.

## Communication Channels

- Twitter/X: `@tinykomainu` (founder builds in public)
- GitHub: public showcase repo with example integrations (private monorepo for production)
- Indie Hackers: regular journey posts
- Email: `hello@tinykomainu.com` (real human reply within 24 hours)
- No Discord community in v1 (high maintenance, low signal until critical mass)

## When in Doubt

If you're writing copy and not sure if it's on brand, ask:

1. Would I send this to a friend who's also building an indie SaaS?
2. Does it sound like a person, not a company?
3. Does it respect the reader's time?

If yes to all three, ship it.