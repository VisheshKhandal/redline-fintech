# Redline Fintech

Independent Next.js App Router application with Better Auth credentials/Google/GitHub login, Prisma 7 + Neon PostgreSQL, and Polar Sandbox subscriptions. Market data is illustrative demo data. Billing entitlements are verified on the server.

## Local development

Use Node.js 22 (22.12 or newer) and npm. Copy `.env.example` to `.env` and replace the placeholders before running the app.

```sh
npm ci
npm run dev
```

`postinstall` generates `src/generated/prisma` from the committed schema. Generated clients, real environment files, dependencies and build artifacts are not committed.

## Vercel readiness

Import this repository as a Next.js project. Root Directory is `.`; Node.js is 22.x; Install Command is `npm ci`; Build Command is `npm run build`; Output Directory stays at the Next.js default. Prisma's PostgreSQL adapter and billing handlers use the Node.js runtime.

Set server-side environment variables before building:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Existing Neon pooled PostgreSQL URL, with SSL |
| `BETTER_AUTH_SECRET` | Strong random secret, at least 32 characters |
| `BETTER_AUTH_URL` | Exact canonical deployed HTTPS origin, without `/api/auth` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | GitHub OAuth credentials |
| `POLAR_ACCESS_TOKEN` | Polar Sandbox organization access token |
| `POLAR_PRO_PRODUCT_ID` | Existing non-secret Pro product ID from `.env.example` |
| `POLAR_WEBHOOK_SECRET` | Real Sandbox endpoint signing secret; omit until configured |

Do not prefix secrets with `NEXT_PUBLIC_`. The entitled product is enforced by `REDLINE_PRO_PRODUCT_ID` in `src/lib/billing-core.mjs`; the environment product ID documents the existing Sandbox configuration. Keep the existing Neon database and Polar customer external IDs to retain paid subscriptions. Better Auth trusts its configured base URL by default. Use a stable canonical domain; avoid blanket trust of all preview domains.

No database migration runs during installation or build. Existing Neon migrations are already applied. For a new database, review the SQL before running `npx prisma migrate deploy` as an explicit maintenance step. Never run `migrate reset` on the existing database.

## OAuth production callbacks

For a canonical origin of `https://YOUR_DOMAIN`:

- Google: add that authorized JavaScript origin and the redirect URI `https://YOUR_DOMAIN/api/auth/callback/google`.
- GitHub: use that homepage and the callback URL `https://YOUR_DOMAIN/api/auth/callback/github`. A separate OAuth app preserves the local app's callback configuration.
- Set `BETTER_AUTH_URL` to the exact origin. Keep local and deployed environment values separate. Changing the auth secret invalidates session cookies; signing in again restores the persisted subscription.

## Polar Sandbox webhooks

The SDK environment is fixed to `sandbox`. In the Sandbox organization's webhook settings, add an enabled endpoint with Raw format:

```text
https://YOUR_DOMAIN/api/auth/polar/webhooks
```

Subscribe to `subscription.active`, `subscription.updated`, `subscription.canceled`, `subscription.revoked`, `subscription.past_due`, `subscription.uncanceled`, and `customer.state_changed`. Copy the real signing secret into Vercel's `POLAR_WEBHOOK_SECRET`, then redeploy. Verify a delivery/resend receives HTTP 200. Real delivery testing stays pending until configured. The endpoint fails closed without the secret. No CLI is required.

The official Better Auth plugin verifies signatures. Handlers fetch current Polar state and upsert subscriptions by unique Polar subscription ID inside a per-user database lock. Ownership uses authoritative external user IDs. API reconciliation also detects purchases made before webhook setup. Visiting a checkout success URL never grants Pro access.

## Checks

```sh
npm run build
node scripts/check-billing.mjs
```

`node --experimental-strip-types scripts/reconcile-billing.mjs` reads Sandbox state and persists it to the configured database. `scripts/check-billing-http.mjs` creates temporary local sessions/a Free user and Sandbox checkout URLs without submitting payments; review it before running. Webhook tests skip without the real secret. The older signup test also provisions a Polar customer; avoid running it casually.

## Publish to GitHub

Create a new private, empty `redline-fintech` repository without a README, license or .gitignore. Then, from this project:

```sh
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/redline-fintech.git
git push -u origin main
```

Authenticate through Git Credential Manager or a GitHub-supported credential when prompted. This repository has fresh history and no original remote. Nothing deploys automatically from these commands.
