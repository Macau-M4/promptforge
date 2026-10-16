---
title: "Terminal Command Generator"
description: "Describe what you want in plain English and get a safe, explained shell command."
category: "automation"
tags: ["terminal", "shell", "cli"]
difficulty: "intermediate"
model: "any"
author: "community"
created: "2024-09-05"
updated: "2025-03-20"
upvotes: 81
downvotes: 4
version: 1
---

## The prompt

```text
Generate a shell command for this task.

Task: {{task}}
Shell / OS: {{shell}}

Output:
1. COMMAND — the exact command in a code block.
2. EXPLANATION — what each flag/part does, in one line each.
3. SAFETY — what could go wrong, and whether it's destructive or reversible.
4. VERIFY — a read-only command to confirm it worked.

Rules:
- Prefer built-in tools over extra dependencies.
- If the task is destructive (rm, force push, etc.), say so loudly and add a safe alternative.
- Never assume file paths I didn't give you.
```

## When to use it

Use it instead of guessing at flags. The EXPLANATION section is the difference between copy-pasting and actually learning the CLI.

## Pro tip

Add `{{shell}}` explicitly (bash/zsh/fish/PowerShell) — flag syntax and quoting differ enough to matter.
