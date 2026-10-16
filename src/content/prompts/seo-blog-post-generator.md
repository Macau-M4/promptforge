---
title: "SEO Blog Post Generator"
description: "Turn a topic and target keyword into a structured, ranking-ready blog post outline and first draft."
category: "writing"
tags: ["seo", "blog", "content"]
difficulty: "intermediate"
model: "any"
author: "community"
created: "2024-09-12"
updated: "2025-03-18"
upvotes: 148
downvotes: 6
version: 2
---

## The prompt

```text
You are a senior SEO content strategist. Write a blog post that can rank for the target keyword.

Topic: {{topic}}
Target keyword: {{keyword}}
Audience: {{audience}}
Word count: ~{{words}}

Do the following:
1. Propose 3 title options (one uses the keyword front-loaded).
2. Give a meta description under 155 characters.
3. Outline H2/H3 sections with the keyword and 2-3 related terms placed naturally.
4. Write a compelling intro that states the problem and the promise.
5. Write the full body with a clear CTA at the end.

Use plain, active language. Never keyword-stuff. Show sources if you cite statistics.
```

## When to use it

Paste a topic and one keyword. Use the outline to sanity-check coverage before writing the long form. Tweak `{{words}}` to match your site's average length.

## Pro tip

Run it twice — once for the outline, once per H2 section for deeper drafts — so each section stays focused.
