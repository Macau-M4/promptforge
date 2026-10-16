---
title: "Unit Test Generator"
description: "Generate a focused, edge-case-aware unit test suite for a function, in your framework of choice."
category: "coding"
tags: ["testing", "tdd", "quality"]
difficulty: "advanced"
model: "any"
author: "community"
created: "2024-11-05"
updated: "2025-03-27"
upvotes: 74
downvotes: 3
version: 1
---

## The prompt

```text
Write a unit test suite for the function below using {{framework}}.

Requirements:
- Cover the happy path AND edge cases (empty input, null/undefined, boundary values, error paths).
- Use a clear AAA (Arrange/Act/Assert) structure.
- Mock external dependencies if present.
- Include one test that documents a tricky edge case, with a comment explaining the assumption.

Function ({{language}}):
{{code}}

Output only the test code, then a short list of edge cases you covered.
```

## When to use it

Paste a single pure function or a small class method into `{{code}}`. For whole modules, run it one function at a time to keep coverage targeted.

## Pro tip

After generating, read each assertion and confirm the expected value is actually what you want — the model can assert the buggy behavior if the function is wrong.
