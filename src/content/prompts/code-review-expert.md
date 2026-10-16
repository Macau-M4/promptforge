---
title: "Code Review Expert"
description: "Get a structured, severity-ranked code review that catches bugs, security issues and smells."
category: "coding"
tags: ["code-review", "security", "best-practices"]
difficulty: "intermediate"
model: "any"
author: "community"
created: "2024-10-01"
updated: "2025-03-02"
upvotes: 132
downvotes: 5
version: 2
---

## The prompt

```text
Act as a senior {{language}} engineer doing a thorough code review.

Review this code ({{language}}):
{{code}}

Report issues grouped by severity:
- 🔴 BLOCKER — bug or security issue that must be fixed
- 🟠 MAJOR — correctness or maintainability risk
- 🟡 MINOR — style, naming, or nitpick
- 🟢 NIT — optional polish

For each issue give: the area, what is wrong, why it matters, and a concrete fix (show the corrected snippet).

End with a short "Would I approve?" verdict and the top 3 improvements.
```

## When to use it

Paste a PR diff or a single file into `{{code}}` before merging. Works best on focused chunks (under ~300 lines) so the model doesn't lose the plot.

## Pro tip

Pair it with a linter; the model catches semantic issues and security holes a linter can't, while the linter catches the mechanical stuff for free.
