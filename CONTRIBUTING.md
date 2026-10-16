# Contributing to PromptForge

PromptForge is a git repo as its own database. Adding a prompt = adding one markdown
file + opening a pull request. No forms, no accounts beyond GitHub, no paid tools.

## Adding a prompt

1. Fork the repository.
2. Create a new file at `src/content/prompts/<slug>.md` (slug = kebab-case, e.g.
   `code-review-expert.md`).
3. Copy the template below and fill it in.
4. Run `pnpm run validate` — it must pass.
5. Commit and open a pull request.

### Template

````markdown
---
title: "My amazing prompt"
description: "One sentence describing what it does (10–320 chars)."
category: "coding"           # see categories below
tags: ["coding", "review"]
difficulty: "intermediate"   # beginner | intermediate | advanced
model: "any"
author: "your-github-handle"
created: "2025-04-01"
updated: "2025-04-01"
upvotes: 0
downvotes: 0
version: 1
---

## The prompt

```text
Your prompt here. Use {{variable}} placeholders for inputs the user fills in.
```

## When to use it

Explain when this prompt is useful and how to get the most out of it.
````

> ⚠️ Keep the first fenced code block as the copyable/runnable prompt. Do **not** nest
> code fences inside it — the Run feature extracts the first fence verbatim.

### Categories

`writing` · `coding` · `productivity` · `analysis` · `creative` · `learning` ·
`marketing` · `automation`

### Rules

- `title` 3–140 chars, `description` 10–320 chars.
- `tags` 1–8 items, each 2–40 chars.
- Dates must be `YYYY-MM-DD` and `created <= updated`.
- `upvotes`/`downvotes` start at 0 for new submissions (never self-bump).

## What CI does for you

1. **Validate** — `.github/workflows/validate.yml` checks your frontmatter against the
   Zod schema and builds the site.
2. **Auto-tag** — `.github/workflows/auto-tag.yml` infers a category from your
   title/description/body and posts a comment + a `category:*` label. You can override
   it by setting `category` explicitly.

## Running locally

```bash
pnpm install
pnpm dev            # http://localhost:4321
pnpm run validate   # Zod schema check on all content
pnpm test           # core-logic tests (trending, markdown, auto-tag)
pnpm build          # production build
```

## Adding a learning path

Add `src/content/paths/<slug>.md` with frontmatter:

```yaml
---
title: "Your path"
description: "What this track teaches."
level: "start"      # start | advance | master
order: 2
prompts:            # list of prompt slugs (filenames without .md)
  - explain-like-im-12
  - socratic-tutor
---
```

## Adding a tool

Add `src/content/tools/<slug>.md`:

```yaml
---
title: "Provider name"
description: "What it is."
category: "coding"
kind: "free-api"    # free-api | local | platform | utility
url: "https://example.com"
free: true
---
```

## Code of conduct

Be kind, attribute what you borrow, and keep everything free. 🎉
