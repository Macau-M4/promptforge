---
title: "Python Script Scaffolder"
description: "Generate a complete, runnable Python script with error handling and a CLI interface."
category: "automation"
tags: ["python", "scripting", "cli"]
difficulty: "advanced"
model: "any"
author: "community"
created: "2024-10-28"
updated: "2025-03-12"
upvotes: 44
downvotes: 5
version: 1
---

## The prompt

```text
Write a complete, runnable Python script for this task.

Task: {{task}}
Inputs: {{inputs}}
Outputs: {{outputs}}

Requirements:
- Use only the Python standard library unless I say otherwise.
- Include a `main()` function and a `if __name__ == "__main__":` guard.
- Add a `--help` argument parser (argparse) for all inputs.
- Handle errors gracefully (file not found, bad input) with clear messages.
- Include a short docstring and 2-3 inline comments on non-obvious lines.
- Print a clear success/failure summary at the end.

Output the script in one code block, then a one-line "how to run" example.
```

## When to use it

Use it to turn a one-off manual task into a reusable script. The argparse + error-handling boilerplate is what makes it production-ready instead of a toy.

## Pro tip

After it runs, paste the script into the "Code Review Expert" prompt to harden it before you commit it.
