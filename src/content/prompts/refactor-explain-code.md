---
title: "Refactor & Explain Code"
description: "Rewrite messy code to be cleaner and simpler, then explain every change line by line."
category: "coding"
tags: ["refactoring", "explain", "clean-code"]
difficulty: "intermediate"
model: "any"
author: "community"
created: "2024-06-20"
updated: "2025-02-11"
upvotes: 88
downvotes: 4
version: 1
---

## The prompt

```text
Refactor the following {{language}} code for readability and simplicity WITHOUT changing its behavior.

Constraints:
- Keep the same public API / function signatures unless a change is clearly needed.
- Prefer clarity over cleverness.
- Do not add new dependencies.

Output:
1. REFACTORED — the improved code.
2. CHANGES — a list mapping each change to the reason (e.g. "extracted duplicated loop", "renamed flag for clarity").
3. RISKS — anything that could subtly differ in edge cases.

Code ({{language}}):
{{code}}
```

## When to use it

Use it on working-but-ugly code you inherited. The `RISKS` section is important — always skim it before trusting the refactor.

## Pro tip

Ask it to add type hints / JSDoc in the same pass if the codebase lacks them.
