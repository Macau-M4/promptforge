---
name: frontend-effects
description: Build GPU-accelerated visual effects — particle systems, custom shaders, and post-processing — with Canvas 2D, WebGL, or WebGPU. Use for hero backgrounds, loaders, and transitions; keep them budgeted, tasteful, and accessible.
---

# Frontend effects

Add eye-catching effects (particles, shaders, gradients, grain) that stay smooth and don't
bury the content. Prefer the simplest renderer that meets the goal.

## Choose the right renderer

| Renderer | Use for | Notes |
|---|---|---|
| CSS | gradients, blurs, hover glow, subtle grain | cheapest, always prefer first |
| Canvas 2D | up to ~5k particles, simple systems | no WebGL needed |
| WebGL | 10k+ particles, custom shaders, post-processing | Three.js or raw GL |
| WebGPU | heavy compute (reaction-diffusion, fluid) | modern browsers only; always fall back |

## Particle system (Canvas 2D, no deps)

```js
const cv = document.querySelector('canvas'); const ctx = cv.getContext('2d');
const P = Array.from({ length: 800 }, () => ({ x: Math.random()*cv.width, y: Math.random()*cv.height, vx: (Math.random()-.5)*.6, vy: (Math.random()-.5)*.6 }));
(function loop() {
  ctx.clearRect(0,0,cv.width,cv.height);
  for (const p of P) {
    p.x += p.vx; p.y += p.vy;
    if (p.x<0||p.x>cv.width) p.vx*=-1; if (p.y<0||p.y>cv.height) p.vy*=-1;
    ctx.fillStyle = 'rgba(129,140,248,.6)'; ctx.fillRect(p.x, p.y, 1.5, 1.5);
  }
  requestAnimationFrame(loop);
})();
```

## Custom shader (WebGL/Three.js)

For hero backgrounds, use a full-screen quad with a fragment shader (noise, gradient, fbm).
Load GLSL as a string; keep uniforms minimal and avoid heavy `sin`/`noise` per-pixel loops on
low-end GPUs.

## Post-processing

Use `three/addons/postprocessing/EffectComposer.js` + `RenderPass`/`UnrealBloomPass` for
bloom. Bloom is the highest-impact "expensive-looking" effect — use sparingly and with a low
threshold so text stays legible.

## Discipline (important)

- **Budget:** one hero effect per page; don't stack particles + bloom + parallax.
- **Cap DPR** at 2 and pause off-screen loops.
- **Accessibility:** honor `prefers-reduced-motion: reduce` — swap animated effects for a
  static gradient; never animate essential content.
- **Legibility:** effects belong behind/below text, never over it.
- **License:** Three.js/Canvas/WebGPU are free (MIT/BSD). Avoid Remotion/GSAP-specific packs
  if the project must remain 100% open-source.

## Checklist

- [ ] Simplest renderer chosen (CSS first)
- [ ] One effect per view, DPR capped, loop paused off-screen
- [ ] `prefers-reduced-motion` disables the effect
- [ ] Text remains legible over the effect
- [ ] Only MIT/BSD-licensed libraries
