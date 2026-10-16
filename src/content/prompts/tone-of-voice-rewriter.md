---
title: "Tone-of-Voice Rewriter"
description: "Rewrite any text to match a described brand voice while keeping the meaning intact."
category: "writing"
tags: ["rewrite", "brand-voice", "editing"]
difficulty: "beginner"
model: "any"
author: "community"
created: "2024-08-02"
updated: "2025-02-05"
upvotes: 96
downvotes: 3
version: 1
---

## The prompt

```text
Rewrite the text below to match the target voice.

Target voice: {{voice}}
(e.g. "warm and confident, like a helpful mentor", or "short and punchy, like a Twitter thread")

Rules:
- Keep all facts and numbers exactly the same.
- Do not add claims that are not in the original.
- Match the vocabulary, sentence length, and rhythm of the voice.
- Output the rewritten text only, then a one-line note explaining your main changes.

Text to rewrite:
"""
{{text}}
"""
```

## When to use it

Use it when a draft is technically correct but sounds off-brand. Great for turning a dry changelog into a friendly announcement.

## Pro tip

Keep a small library of voice descriptions and reuse the exact same string for consistency across a whole site.
