# Jancarlos Sosa — Portfolio

A technical-editorial portfolio built with Next.js, React, TypeScript, authored CSS animation, and local MDX content.

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
npm run build
```

## Writing workflow

Published posts live in `content/blog/*.mdx`. Private starter drafts live locally in the gitignored `content/drafts/` directory; move a draft into `content/blog/` only after publication approval.

Published-post frontmatter:

```yaml
---
title: Post title
description: Search and index summary
date: 2026-07-19
published: true
tags: [Agent systems]
---
```

- Only an exact boolean `published: true` is public. Missing, quoted, malformed, or false publication states fail closed.
- Invalid required metadata or dates are excluded from routes and RSS.
- Publication filtering, metadata validation, XML safety, and path traversal protection are covered by automated tests.

## Contact delivery

The contact endpoint requires:

- `RESEND_API_KEY`
- `FROM_EMAIL`
- `TO_EMAIL`

The endpoint initializes Resend only at request time, so local and production builds succeed without secrets. Without configuration it returns a safe `503` response. It also enforces same-origin requests, a server-validated honeypot, and a per-instance three-message/ten-minute client-address limit. Configure an edge/WAF rate limit at deployment for distributed enforcement.

## Deployment

The production site is currently hosted at `https://www.jancarlossosa.com`. Do not deploy or merge the redesign branch without explicit approval.
