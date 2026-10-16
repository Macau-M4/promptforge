---
name: frontend-design-system
description: Establish a coherent design system — design tokens, type scale, spacing rhythm, color palette, and accessible contrast — before writing UI code. Use when starting a site, refactoring a "flat" UI, or the user asks for polish and consistency.
---

# Frontend design system

A design system makes a UI look intentional instead of "default". Define tokens first, then
reference them everywhere — never hardcode raw values in components.

## Design tokens (CSS custom properties)

```css
:root {
  --bg: #0a0a10; --panel: #14141d; --border: #2a2a38;
  --text: #e6e6ef; --text-dim: #9a9ab0;
  --accent: #6366f1; --accent-2: #a78bfa;
  --radius: 12px;
  --space-1: 4px; --space-2: 8px; --space-3: 16px; --space-4: 24px; --space-5: 40px;
  --font: 'Inter', system-ui, sans-serif;
}
```

Use a 4px spacing scale (4/8/16/24/40…). Never invent one-off paddings.

## Type scale

Use a modular scale; pick 4–5 sizes and reuse them. Example (1.25 ratio): 14 / 18 / 24 / 30 / 38.
Set `line-height` 1.5–1.6 for body, 1.15–1.25 for headings. One font family for body, one for
monospace (code). Don't exceed ~2 families.

## Color + contrast (accessibility)

- One accent color used for the primary action only; a neutral for everything else.
- Body text must hit **WCAG AA** (≥4.5:1 on background); large text ≥3:1.
- Don't convey state with color alone — pair with an icon or label.

## Consistency rules

- Every interactive element uses the same hover/focus style; focus ring always visible.
- Borders, radius, and shadows come from tokens, not ad-hoc values.
- Buttons: one primary (accent), one ghost/secondary. No third variant unless justified.

## Motion guidelines

If the page uses motion (see `frontend-motion`), keep it consistent: one easing curve
(`cubic-bezier(.2,.7,.2,1)`), durations 150–400 ms, and honor `prefers-reduced-motion`.

## Checklist

- [ ] Tokens defined in `:root` and referenced (no raw values in components)
- [ ] 4px spacing scale, 4–5 type sizes, ≤2 font families
- [ ] Body text ≥4.5:1 contrast; focus visible
- [ ] One accent, one primary + one secondary button style
- [ ] Single easing curve; reduced-motion respected
