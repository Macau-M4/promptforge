---
title: "Regex Builder from Description"
description: "Describe a text pattern in words and get a working, explained regular expression."
category: "automation"
tags: ["regex", "pattern-matching", "text"]
difficulty: "intermediate"
model: "any"
author: "community"
created: "2024-04-22"
updated: "2025-01-27"
upvotes: 55
downvotes: 3
version: 1
---

## The prompt

```text
Write a regular expression that matches the pattern I describe.

Pattern description: {{description}}
Flavor: {{flavor}} (e.g. JavaScript, Python, PCRE)
Examples that SHOULD match:
{{matchExamples}}
Examples that should NOT match:
{{notMatchExamples}}

Output:
1. PATTERN — the regex in a code block.
2. BREAKDOWN — each token explained line by line.
3. TEST CASES — show the match result for every example I gave.
4. GOTCHAS — edge cases or flavor differences to watch out for.

Do not add anchors unless I ask for them.
```

## When to use it

Use it for validation (emails, phones, IDs), extraction, or find-and-replace. Providing non-match examples dramatically improves accuracy.

## Pro tip

Always state the `{{flavor}}` — lookbehind, named groups, and unicode support differ between engines and cause silent bugs.
