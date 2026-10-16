---
title: "Decision Matrix Helper"
description: "Score competing options against weighted criteria to make a defensible choice fast."
category: "productivity"
tags: ["decision-making", "scoring", "strategy"]
difficulty: "intermediate"
model: "any"
author: "community"
created: "2024-09-28"
updated: "2025-02-28"
upvotes: 43
downvotes: 3
version: 1
---

## The prompt

```text
Help me choose between these options using a weighted decision matrix.

Options:
{{options}}

Criteria that matter to me (with importance 1-10):
{{criteria}}

Do the following:
1. Build a scoring table (options as rows, criteria as columns).
2. Score each option 1-5 per criterion and explain the score in one phrase.
3. Multiply by the importance weight and show the total.
4. State the winner and the biggest risk/assumption behind it.
5. Flag any criterion where my options are basically tied, so I don't over-trust the math.

Be explicit about your assumptions.
```

## When to use it

Use it for "which framework / vendor / plan / offer" choices where you keep going in circles. The written scores force you to name what actually matters.

## Pro tip

Run it once with your gut instinct already named, then check whether the scores agree — a big mismatch usually reveals a hidden criterion.
