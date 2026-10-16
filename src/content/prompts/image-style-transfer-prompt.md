---
title: "Image Style-Transfer Prompt"
description: "Compose a precise, reusable image-generation prompt with a consistent visual style block."
category: "creative"
tags: ["image", "art-direction", "style"]
difficulty: "advanced"
model: "any"
author: "community"
created: "2024-11-22"
updated: "2025-03-22"
upvotes: 39
downvotes: 6
version: 1
---

## The prompt

```text
Act as an art director. Write a single, self-contained image-generation prompt.

Subject: {{subject}}
Desired mood: {{mood}}
Medium/style reference: {{style}}

Build the prompt with these components, separated by commas:
1. SUBJECT — the exact thing in frame, with composition.
2. ENVIRONMENT — setting, lighting, time of day.
3. STYLE — medium, artist/period references, rendering (e.g. "35mm film", "octane render").
4. MOOD — emotional register and color palette.
5. TECHNICAL — camera angle, lens, depth of field, resolution hints.
6. NEGATIVE — what must NOT appear.

Output the final prompt as one block of comma-separated text ready to paste, then a 3-line note on why you chose each style element.
```

## When to use it

Use it to go from a vague idea to a prompt you can paste into any image model (Midjourney, Stable Diffusion, DALL·E, Flux).

## Pro tip

Keep the STYLE block identical across a series to get a visually consistent set of images for one project.
