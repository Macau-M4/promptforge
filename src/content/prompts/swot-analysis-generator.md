---
title: "SWOT Analysis Generator"
description: "Build a structured SWOT for a product, idea, or company, with an action plan for each quadrant."
category: "analysis"
tags: ["strategy", "swot", "planning"]
difficulty: "beginner"
model: "any"
author: "community"
created: "2024-03-14"
updated: "2025-01-30"
upvotes: 47
downvotes: 2
version: 1
---

## The prompt

```text
Run a SWOT analysis for the following subject.

Subject:
{{subject}}

Context / market:
{{context}}

Output four quadrants:
- STRENGTHS — internal advantages (what we control).
- WEAKNESSES — internal gaps.
- OPPORTUNITIES — external tailwinds.
- THREATS — external risks.

For each quadrant, give 3-5 specific, non-generic points. Then add:
- TOWS ACTIONS — one concrete move per pairing: S×O, W×O, S×T, W×T.

Avoid vague filler like "strong brand" without evidence.
```

## When to use it

Use it at the start of a project or when evaluating a new idea. The TOWS cross-pairings are the part that actually turns analysis into action.

## Pro tip

Provide real context in `{{context}}` — a SWOT without context produces generic business-school fluff.
