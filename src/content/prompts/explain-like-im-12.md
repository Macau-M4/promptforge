---
title: "Explain Like I'm 12"
description: "Break any hard concept into a simple explanation using an analogy a child would get."
category: "learning"
tags: ["explanation", "analogy", "simplify"]
difficulty: "beginner"
model: "any"
author: "community"
created: "2024-01-25"
updated: "2025-01-05"
upvotes: 92
downvotes: 3
version: 1
---

## The prompt

```text
Explain this concept so a smart 12-year-old would understand it.

Concept: {{concept}}
What the listener already knows: {{background}}

Rules:
- Start with a one-sentence plain-English definition.
- Use ONE concrete analogy from everyday life.
- Explain the most important 2-3 details, no jargon (or define jargon inline).
- End with a "try this" mental check that proves understanding.
- Then, optionally, a one-paragraph "advanced version" for adults.

Keep it short — under 200 words for the simple part.
```

## When to use it

Use it when you (or someone you're teaching) hit a wall with a topic. If you can't explain it simply, you don't understand it yet — this prompt is also a great self-test.

## Pro tip

Chain it: after the simple version, paste the "advanced version" into the same prompt with a higher `{{background}}` to climb the ladder.
