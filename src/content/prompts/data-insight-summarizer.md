---
title: "Data Insight Summarizer"
description: "Turn a raw table, CSV, or numbers dump into plain-language insights and a recommended next step."
category: "analysis"
tags: ["data", "insights", "summarization"]
difficulty: "intermediate"
model: "any"
author: "community"
created: "2024-08-21"
updated: "2025-03-10"
upvotes: 79
downvotes: 4
version: 1
---

## The prompt

```text
Analyze this dataset and surface insights for a non-technical audience.

Data:
"""
{{data}}
"""

Context (what this data is, and what decision I'm trying to make):
{{context}}

Output:
1. HEADLINE — the single most important takeaway in one sentence.
2. KEY FINDINGS — 3-5 bullet points, each with the number and what it means in plain English.
3. SURPRISES — anything unusual, missing, or worth double-checking.
4. RECOMMENDATION — one clear next step, and one question you'd need answered to go further.

Do not overstate confidence. If a conclusion is weak given the data, say so.
```

## When to use it

Paste a CSV or a pasted spreadsheet range plus a sentence about what decision you're making. It turns "here are numbers" into "here is what to do".

## Pro tip

For large datasets, paste the summary statistics (totals, averages, top rows) rather than thousands of rows — the model reasons better with a clean slice.
