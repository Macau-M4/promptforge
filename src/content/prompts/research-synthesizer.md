---
title: "Research Synthesizer"
description: "Merge multiple sources into a cited, balanced brief that highlights agreements and conflicts."
category: "analysis"
tags: ["research", "synthesis", "literature"]
difficulty: "advanced"
model: "any"
author: "community"
created: "2024-12-02"
updated: "2025-03-25"
upvotes: 58
downvotes: 5
version: 1
---

## The prompt

```text
Synthesize the following source material into a research brief.

Question I'm trying to answer:
{{question}}

Sources (label each with [S1], [S2], ...):
"""
{{sources}}
"""

Output:
1. ANSWER — a direct answer to the question in 2-3 sentences.
2. CONSENSUS — points where sources agree.
3. DISAGREEMENTS — points where they conflict, and what the disagreement is about.
4. GAPS — what none of the sources address.
5. CITATIONS — inline references like [S1], [S3] wherever you state a specific claim.

Never invent a source. If a claim has no supporting source, mark it as [inference].
```

## When to use it

Paste a few abstracts, articles, or notes you've already collected. It compresses hours of cross-referencing into one pass.

## Pro tip

Label your sources before pasting so the citations stay traceable back to what you actually read.
