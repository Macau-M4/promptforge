---
name: frontend-motion
description: Add tasteful web motion — scroll reveal, hover micro-interactions, staggered entrances, and animated transitions — with plain CSS and IntersectionObserver (no heavy animation library). Use when a site feels static, or the user asks for motion, animation, or to "make it feel alive".
---

# Frontend motion

Add motion that makes a page feel responsive without hurting load time or accessibility.
Prefer **plain CSS + IntersectionObserver** first; reach for a library only when you need
timeline choreography or physics.

## Hard rules

- Respect `prefers-reduced-motion: reduce` — disable or minimize non-essential motion.
- Keep animations GPU-friendly: animate `transform` and `opacity`, never `top`/`left`/`width`/`height`.
- Total motion should be short: entrances 200–400 ms, hover 120–200 ms, and never blocking content.
- No layout thrash: read once, then write, inside a single `requestAnimationFrame` when responding to scroll.

## Scroll reveal (no library)

```html
<div class="reveal">…</div>
```

```css
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity .5s ease, transform .5s cubic-bezier(.2,.7,.2,1);
}
.reveal.is-visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

```js
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  }
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
```

## Staggered entrances

Give siblings an increasing delay so a grid "cascades" in. Cap the delay so large lists
don't feel slow (e.g. `min(i * 60, 360)ms`).

```js
items.forEach((el, i) => el.style.transitionDelay = `${Math.min(i * 60, 360)}ms`);
```

## Hover micro-interactions

Scale/lift cards and underline links. Keep it subtle (2–6 px, ≤200 ms).

```css
.card { transition: transform .18s ease, box-shadow .18s ease; }
.card:hover { transform: translateY(-3px); }
a { background-image: linear-gradient(currentColor, currentColor); background-size: 0 1px; }
a:hover { background-size: 100% 1px; }
```

## When you actually need a library

Use a tiny one only for timeline/scroll choreography. **License note for free sites:**
prefer MIT/ISC options (e.g. `motion`/Framer Motion is MIT; `anime.js` is MIT). Avoid
GSAP's older non-commercial terms and Remotion (source-available, not OSI) if the project
must stay 100% free/open-source — plain CSS covers most prompt-library/utility sites.

## Checklist

- [ ] Animations only animate transform/opacity
- [ ] `prefers-reduced-motion` handled
- [ ] No layout properties animated
- [ ] Entrance under 400 ms; hover under 200 ms
- [ ] Library added only if CSS is genuinely insufficient, and it's MIT/ISC
