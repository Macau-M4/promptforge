---
title: "Google AI Studio (Gemini)"
description: "Free tier for the Gemini API — grab a key in one click, no credit card required."
category: "coding"
kind: "free-api"
url: "https://aistudio.google.com/"
free: true
---

# Google AI Studio — Gemini API

The fastest way to a real, free LLM API key. The free tier is generous and **does not
require a credit card**.

## Get a key (2 minutes)

1. Go to [aistudio.google.com](https://aistudio.google.com/) and sign in with a Google account.
2. Click **"Get API key"** → **"Create API key"**.
3. Copy the key and paste it into PromptForge's **Run** page (it's stored only in your browser).

## Free models

- `gemini-2.0-flash` — fast, great general purpose.
- `gemini-1.5-flash` — high speed, low latency.
- `gemini-2.5-flash` — strong reasoning (free tier subject to limits).

## How PromptForge uses it

The Run page calls `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
directly from your browser with your key. Your key never touches a PromptForge server —
PromptForge is a static site with no backend.
