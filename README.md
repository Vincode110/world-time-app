# Time & Date Tools

A modern, production-ready suite of time and date utilities inspired by timeanddate.com. Built with Next.js (App Router), React, TypeScript, Tailwind, shadcn/ui, Luxon, and @vvo/tzdb. No external API keys.

## Tech Stack
- Next.js 15 (App Router), React 19, TypeScript 5
- Tailwind CSS 4 + shadcn/ui (Radix)
- Luxon + @vvo/tzdb (bundled IANA timezone data)
- Prisma ORM (+ SQLite for local dev, Postgres in prod)
- Jest + Testing Library, Playwright, axe

## Getting Started
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Build & Start
```bash
npm run build
npm start
```

## Dynamic Pages & Seeding
- City time pages: `city/[zone]` (1000+ from @vvo/tzdb)
- Country holiday pages: `holiday/[country]/[year]`
- Sitemap: `/sitemap.xml` (static + dynamic)
- RSS: `/rss.xml`

Warm ISR caches / enumerate pages:
```bash
curl -X POST $SITE_URL/api/seed
```
Set `NEXT_PUBLIC_SITE_URL` in env for absolute URLs.

## Updating IANA tzdb and Holidays
- Update tzdb:
```bash
npm update @vvo/tzdb
```
- Holidays are embedded in `src/components/calendar-tools.tsx`. Extend by moving to a JSON dataset and referencing it in components.

## Tests
- Unit: timezone utilities, calculators, moon phases, calendars
- E2E: Playwright flows (World Clock, Converter, Calendar export, Timers)
- Accessibility: axe checks

Run:
```bash
npm test
npx playwright test
```

## Accessibility (WCAG AA)
- ARIA roles and keyboard flows in mega menu & interactive tools
- Fix any axe violations before merging

## Deployment
- Set `NEXT_PUBLIC_SITE_URL`
- Deploy on a Next.js-compatible host with ISR
- After deploy, POST to `/api/seed` to enumerate pages and warm caches
