# Jancarlos Sosa — Portfolio

A technical-editorial portfolio built with Next.js, React, TypeScript, authored scroll motion, and local MDX content.

## Development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npm audit --omit=dev --audit-level=high
```

## Owner-only writing workflow

There is no public editor, registration flow, or blog-writing API. Website visitors can only read published posts; publishing requires write access to this repository and its deployment.

### 1. Start a private draft

Create `content/drafts/my-post.mdx`. The `content/drafts/` directory is gitignored during normal Git use, so drafts are not included in commits unless someone deliberately force-adds them. Never use `git add -f` for drafts; the quality checks also verify that no draft file is tracked.

```yaml
---
title: Post title
description: Search and index summary
date: 2026-07-19
published: false
tags: [Agent systems]
---

Write the post in Markdown here.
```

### 2. Publish intentionally

When the post is approved:

1. Move it to `content/blog/my-post.mdx`.
2. Change `published` to the exact boolean `true`.
3. Run `npm test && npm run build`.
4. Commit and deploy the change.

Only an exact boolean `published: true` is public. Missing, quoted, malformed, or false publication states fail closed. Invalid required metadata or dates are excluded from public routes. Publication filtering, metadata validation, and path-traversal protection are covered by automated tests.

This file-based workflow is secure and version-controlled, but it is intended for authoring from the development machine. A phone-friendly workflow would use an authenticated CMS such as Sanity, which provides private drafts and an explicit Publish button without exposing authoring controls to visitors.

## Contact delivery

The contact endpoint requires:

- `RESEND_API_KEY`
- `FROM_EMAIL`
- `TO_EMAIL`

The endpoint initializes Resend only at request time, so local and production builds succeed without secrets. Without configuration it returns a safe `503` response. It supports enhanced JSON submission and a safe no-JavaScript form POST, enforces same-origin requests, rejects unsupported/oversized bodies, validates fields, times out stalled provider calls, uses a server-validated honeypot, and keeps a per-instance three-message/ten-minute fallback limit. A Vercel WAF rate limit is required for distributed enforcement.

## Monitoring

Sentry captures client, server, edge, request, and global render errors through the configured project. Session Replay and default PII collection are disabled; HTTP bodies are excluded, Vercel production traces are sampled at 5%, and preview tracing is disabled in a separate environment. Set `NEXT_PUBLIC_SENTRY_DSN` in Vercel for runtime reporting and `SENTRY_AUTH_TOKEN` to upload source maps. Without the private build token, runtime capture still works but stack traces will be less readable.

## Deployment

The production site is currently hosted at `https://www.jancarlossosa.com`. Do not deploy or merge the redesign branch without explicit approval. See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for owner-only prerequisites, verification, release steps, and rollback.
