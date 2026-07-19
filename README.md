# Jancarlos Sosa — Portfolio

A technical-editorial portfolio built with Next.js, React, TypeScript, Motion, and local MDX content.

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
draft: true
tags: [Agent systems]
---
```

- `draft: true` posts are excluded from the public index, detail routes, sitemap, RSS feed, and production static params.
- Set `draft: false` only when a post is ready to publish.
- Draft filtering and path traversal protection are covered by automated tests.

## Contact delivery

The contact endpoint requires:

- `RESEND_API_KEY`
- `FROM_EMAIL`
- `TO_EMAIL`

The endpoint initializes Resend only at request time, so local and production builds succeed without secrets. Without configuration it returns a safe `503` response.

## Deployment

The production site is currently hosted at `https://www.jancarlossosa.com`. Do not deploy or merge the redesign branch without explicit approval.
