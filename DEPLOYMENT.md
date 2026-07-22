# Production release runbook

This repository deploys `main` to the existing Vercel production project serving `https://www.jancarlossosa.com`. Merging to `main` is therefore a production action and requires explicit owner approval.

## Owner-only prerequisites

### Vercel project

- Production branch: `main`
- Node.js runtime: `22.x` (also pinned in `package.json` and `.nvmrc`)
- The public custom domain must not be protected by Vercel Authentication.
- Preserve the existing `jancarlossosa.com` and `www.jancarlossosa.com` assignments; no DNS cutover is expected.

### Contact delivery

Create these **Production** environment variables after verifying the sender domain in Resend:

- `RESEND_API_KEY`
- `FROM_EMAIL`
- `TO_EMAIL`

`FROM_EMAIL` must use the verified sender domain. Never commit any values.

Create a Vercel Firewall rate-limit rule:

- Request path equals `/api/send`
- Method equals `POST`
- Key: client IP
- Window: 10 minutes
- Limit: 3 requests
- Action/status: deny with `429`

The route also has same-origin validation, an 8 KiB request limit, a honeypot, strict field validation, a provider timeout, and a per-instance fallback limiter. The WAF rule is still required because serverless instances do not share memory.

### Sentry

Runtime error reporting uses the existing Sentry project. Session Replay is disabled, default PII collection is disabled, HTTP bodies are excluded, and tracing is sampled at 5% only when Vercel identifies the deployment as `production`. Preview events use the `preview` environment with tracing disabled.

Set these Production variables for runtime reporting and readable source maps:

- `NEXT_PUBLIC_SENTRY_DSN` — public client DSN; configure through Vercel rather than source control
- `SENTRY_AUTH_TOKEN` — private; never commit it
- `SENTRY_ORG=jancarlos-sosa` — optional because the repository has this default
- `SENTRY_PROJECT=javascript-nextjs` — optional because the repository has this default

If `NEXT_PUBLIC_SENTRY_DSN` is absent, Sentry is disabled. If only `SENTRY_AUTH_TOKEN` is absent, runtime event capture continues but stack traces will not have uploaded source maps.
The CSP permits the existing US-region Sentry ingestion hostname (`*.ingest.us.sentry.io`). Recheck the CSP before moving the project to a different Sentry region.

### Dependency security overrides

`package.json` overrides PostCSS and Sharp because the framework's declared transitive versions were covered by active advisories. The production build, local optimizer probe, and CI Linux optimizer probe must all remain green when either override changes.

### GitHub

Protect `main` before release:

- Require a pull request.
- Require the `verify` job from the `CI` workflow.
- Require the branch to be up to date before merging.
- Block force pushes and deletion.
- Keep administrator bypass available only for incident recovery.

## Pre-approval verification

Run on the exact release commit:

```bash
npm ci
npm test
npm run lint
npx tsc --noEmit
npm run build
npm audit --omit=dev --audit-level=high
```

Then verify the protected Vercel preview at desktop, tablet, and mobile widths. Confirm the portrait cutout, full Observe → Reason → Approve → Act diagram, navigation with and without JavaScript, reduced motion, social image, and no horizontal overflow.

Do not merge until the owner explicitly approves production deployment.

## Production release

After explicit approval only:

1. Merge the reviewed PR to `main` without bypassing required checks.
2. Wait for the Vercel production deployment to succeed.
3. Verify `/`, `/about`, `/work`, each project case study, `/blog`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, and a deliberate 404.
4. Verify title/canonical/Open Graph/Twitter metadata and security headers.
5. Submit one controlled contact message and confirm receipt, Sentry remains free of unexpected errors, and a fourth rapid POST is blocked by the WAF with `429`.
6. Check mobile navigation, keyboard focus, reduced motion, tablet diagram, and console/network errors.

## Rollback

Known previous production deployment:

`https://portfolio-8omxeamdw-sosa-iqs-projects.vercel.app`

If the release is unhealthy:

1. Use Vercel **Instant Rollback** to restore that deployment.
2. Confirm `https://www.jancarlossosa.com` serves the prior site.
3. Revert the release merge through a new pull request so Git and production converge.
4. Run all checks and merge the revert.

Do not force-push `main`, rewrite repository history, delete deployments, or delete the release branch during an incident.
