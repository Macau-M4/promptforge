---
title: "Groq (free tier)"
description: "Blazing-fast open-model inference with a free tier and no credit card."
category: "coding"
kind: "free-api"
url: "https://console.groq.com/"
free: true
---

# Groq — free fast inference

Groq serves open models (Llama, Mixtral, Gemma) at extremely high speed. The free
tier needs **no credit card**.

## Get a key

1. Sign in at [console.groq.com](https://console.groq.com/) (GitHub or Google login).
2. Go to **API Keys** → **Create API Key**.
3. Paste it into the PromptForge **Run** page.

## Free models

- `llama-3.3-70b-versatile`
- `llama-3.1-8b-instant`
- `mixtral-8x7b-32768`
- `gemma2-9b-it`

## How PromptForge uses it

The Run page calls the OpenAI-compatible endpoint
`POST https://api.groq.com/openai/v1/chat/completions` with `Authorization: Bearer <key>`,
directly from your browser. The key is stored only in your browser's localStorage.
