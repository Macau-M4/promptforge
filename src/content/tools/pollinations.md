---
title: "Pollinations AI"
description: "Free, keyless text and image generation API — the default provider for the in-page Run feature. No account, no card."
category: "coding"
kind: "free-api"
url: "https://text.pollinations.ai/"
free: true
---

# Pollinations AI

A friendly open-source Gen-AI platform. Its text endpoint is **completely free and
requires no API key**, which is why PromptForge uses it as the default "Run" backend.

## Quick facts

- **Cost:** free, no signup, no rate-limit key required (fair-use limits apply).
- **Text endpoint:** `GET https://text.pollinations.ai/{prompt}` — returns plain text.
- **Chat-completions endpoint:** `POST https://text.pollinations.ai/openai` — OpenAI-style.
- **Image endpoint:** `GET https://image.pollinations.ai/prompt/{prompt}` — returns an image.

## Useful query params

| Param | What it does |
|---|---|
| `model` | `openai` (default), `mistral`, `llama`, `deepseek`, `phi`, `gemini` |
| `system` | system/instructions message |
| `seed` | deterministic output |
| `json` | `true` to force JSON |
| `stream` | `true` for server-sent events |
| `private` | `true` to not log/display your prompt publicly |

## Try it

Run any prompt on this site's **Run** page with Pollinations selected — it works
immediately with no key. For more control or higher throughput, add a free Gemini
or Groq key.
