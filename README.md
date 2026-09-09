# Northstar Reinsurance Tracker

Northstar Reinsurance Tracker is a broker operations dashboard for monitoring a reinsurance book, identifying renewal work, tracking premium collection, and capturing new policy placements.

## Demo user

The current demo workspace is presented for **Afaq Ahmad**, shown as **Senior Broker**. This is a demo profile label in the interface; authentication and multi-user permissions are not enabled yet.

## What the app does

- Shows active policy count, gross premium, upcoming renewals, and outstanding premium.
- Lists policies with policy number, cedant, premium, market fit, renewal date, and collection status.
- Searches the policy portfolio by policy number, cedant, class, or market.
- Opens a policy intake form for new placements.
- Suggests a target reinsurance market from the occupancy/class and sum insured.
- Persists new policies in the connected Neon Postgres database through `/api/policies`.
- Loads existing policy records from Neon when the dashboard opens.
- Provides reminder, report, settings, and help-centre navigation surfaces for the broker workspace.

## Completed in this version

- Professional responsive dashboard UI for desktop and mobile.
- Demo identity updated to Afaq Ahmad.
- Neon SQL `policies` table created and seeded with sample policy records.
- Drizzle ORM database schema and shared PostgreSQL pool in `lib/db.ts`.
- `GET /api/policies` for loading policies.
- `POST /api/policies` with required-field validation for creating policies.
- Client-side search and live portfolio calculations.
- Market-fit suggestion rules for mining, energy, hospitality, logistics, and general risks.
- Policy intake modal with premium, sum insured, occupancy, and expiry fields.

## Project structure

- `app/page.tsx` — main dashboard and policy intake experience.
- `app/api/policies/route.ts` — Neon-backed policy API.
- `lib/db.ts` — Drizzle schema and PostgreSQL connection.
- `app/layout.tsx` — application metadata and global shell.
- `app/globals.css` — global Tailwind theme styles.

## Database

The app uses Neon Postgres through the project-provided `DATABASE_URL`. The `policies` table contains:

- Policy identity: `id`, `policy_number`, `cedant`, `broker`.
- Financials: `premium`, `sum_insured`, `currency`.
- Risk and placement: `occupancy`, `market`, `status`.
- Dates and collection: `inception_date`, `expiry_date`, `premium_status`.
- Audit fields: `notes`, `created_at`, `updated_at`.

The current database has demo data for Atlas Mining PLC, Meridian Hospitality Group, and Coastal Energy Partners. The browser dashboard also supports creating additional records, which are written to Neon rather than only kept in browser memory.

## Running locally

Install dependencies with pnpm, then start the Next.js development server:

```bash
pnpm install
pnpm dev
```

The production check is:

```bash
pnpm build
```

## Current demo limitations

- Authentication, user invitations, and role-based access are not implemented.
- Reminder notifications are currently presented as dashboard actions; email/calendar delivery is not connected.
- Report cards are interface entry points and do not yet generate downloadable files.
- Policy editing, deletion, premium status updates, and audit history are not yet available.
- Market suggestions are deterministic rules, not a live carrier appetite feed.
- The seeded data is demo content and should be replaced or extended with the client’s real portfolio before production use.

## Recommended next production work

1. Add Better Auth email/password sign-in and per-user policy scoping.
2. Add policy detail, edit, archive, and premium receipt workflows.
3. Add reminders with email delivery and scheduled renewal notifications.
4. Build CSV/PDF production, renewal, and aged-premium reports.
5. Add role-based permissions for brokers, managers, and administrators.
6. Add validation, audit events, automated tests, and monitoring before launch.

Northstar Re is a demo operations workspace and is not a substitute for underwriting, compliance, accounting, or legal review.
