---
title: "Meeting Notes → Action Items"
description: "Convert raw, messy meeting notes into a clean summary with owners and next actions."
category: "productivity"
tags: ["meetings", "notes", "summary"]
difficulty: "beginner"
model: "any"
author: "community"
created: "2024-05-30"
updated: "2025-01-14"
upvotes: 57
downvotes: 1
version: 1
---

## The prompt

```text
Turn these raw meeting notes into a professional summary.

Output:
1. TL;DR — 2-3 sentence summary.
2. DECISIONS — what was decided, with a one-line rationale if stated.
3. ACTION ITEMS — a table: Task | Owner | Due (or "TBD"). If no owner is stated, write "unassigned".
4. OPEN QUESTIONS — things still unresolved.
5. NEXT MEETING — suggested agenda if notes imply one.

Rules:
- Do not invent owners, dates, or decisions. Mark uncertainty as [unclear].

Notes:
"""
{{notes}}
"""
```

## When to use it

Dump your raw transcript or bullet jottings right after a call. It turns 10 minutes of clean-up into 30 seconds.

## Pro tip

Ask it to format ACTION ITEMS as a markdown checklist so you can paste straight into a task tracker.
