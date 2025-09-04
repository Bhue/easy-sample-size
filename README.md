# Easy Sample Size

Client-side, production-ready power and sample-size calculators (G*Power-style) built with Next.js + TypeScript + Tailwind.

Features:

- Two means (a priori N, post hoc power), paired means, two proportions, correlation, one-way ANOVA (noncentral F), log-rank survival, cluster DEFF.
- Effect size helper, power curves, simple export buttons.
- Modular design to add calculators fast.

## Install

1) Node.js ≥ 18
2) Install deps:

   npm install

3) Run dev:

   npm run dev

4) Tests:

   npm test

## Validation Examples

- Two means: d=0.5, α=0.05 two-sided, power=0.8 → n1≈63, n2≈63 (z-approx; G*Power t-test gives 64 each). Achieved power ~0.802 with 63 each.
- Two proportions: p1=0.50, p2=0.60, α=0.05 two-sided, power=0.8 → n≈385 per group.
- Correlation: |r|=0.30, α=0.05 two-sided, power=0.8 → n≈85.
- One-way ANOVA: k=3, f=0.25, α=0.05, power=0.8 → N≈159 total (matches standard references/G*Power).
- Log-rank: HR=0.7, α=0.05 two-sided, power=0.8, equal allocation, event fraction e=0.6 → events≈247, total N≈412 (about half per arm).

See docs/methods.md for formulas and assumptions.

## Telemetry (optional, privacy-friendly)

- The app includes an optional, consent-based telemetry system to log anonymous calculator inputs and wizard answers to improve UX.
- Users are prompted to opt in. If declined, no data is sent.
- To persist events in a database, set `DATABASE_URL` to a Postgres instance (Vercel Postgres, Neon, Supabase). Prisma is configured.
- To enable server-side forwarding, set `TELEMETRY_WEBHOOK_URL` (optional).
- Events are posted as JSON to `/api/telemetry` and forwarded to the webhook. No IP addresses are stored by the app; user agent is included.

Example environment:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
TELEMETRY_WEBHOOK_URL=https://your-ingestion-endpoint.example.com/collect
```

### Database setup (Prisma)

1) Provision a Postgres database (Vercel Postgres/Neon/Supabase) and set `DATABASE_URL` locally and in Vercel.
2) Create tables via Prisma:
   - Locally: `npx prisma migrate dev --name init` (requires a running DB)
   - Production: `npx prisma migrate deploy` (e.g., `vercel exec -- npx prisma migrate deploy`)
3) Generate client (done automatically on install): `npx prisma generate`

Events are stored in table `Event` with columns: `id`, `ts` (BigInt), `type`, `slug`, `page`, `sessionId`, `ua`, `payload` (JSONB), `createdAt`.
