// Cinematic hero scene: monochrome particle field, chrome orb, fragmented ring,
// orbital line, and pointer-reactive specular light. Canvas 2D (no WebGL dependency).
export function initHero() {
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
  const hero = document.getElementById('hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let W = 0;
  let H = 0;
  let dpr = 1;
  const pointer = { x: 0.5, y: 0.35, tx: 0.5, ty: 0.35, active: false };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth;
    H = hero.clientHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Particles with depth
  interface P { x: number; y: number; z: number; vx: number; vy: number; s: number; }
  let particles: P[] = [];
  function seed() {
    const count = W < 640 ? 50 : 90;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      s: 0.5 + Math.random() * 1.4
    }));
  }

  // Orb center (right-of-center on desktop, centered on small screens)
  const orb = () => ({
    x: W < 768 ? W * 0.5 : W * 0.72,
    y: H * 0.46,
    r: Math.min(W, H) * (W < 768 ? 0.22 : 0.20)
  });

  function drawChromeOrb(o: { x: number; y: number; r: number }, t: number) {
    const r = o.r;
    // Base metallic sphere
    const base = ctx.createRadialGradient(o.x - r * 0.35, o.y - r * 0.4, r * 0.05, o.x, o.y, r);
    base.addColorStop(0, '#fafafa');
    base.addColorStop(0.25, '#c9c9cf');
    base.addColorStop(0.55, '#6b6b72');
    base.addColorStop(0.82, '#1c1c20');
    base.addColorStop(1, '#0a0a0b');
    ctx.beginPath();
    ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
    ctx.fillStyle = base;
    ctx.fill();

    // Specular highlight (follows pointer)
    const hx = o.x - r * 0.35 + (pointer.tx - 0.5) * r * 0.6;
    const hy = o.y - r * 0.38 + (pointer.ty - 0.5) * r * 0.6;
    const spec = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 0.5);
    spec.addColorStop(0, 'rgba(255,255,255,0.95)');
    spec.addColorStop(0.4, 'rgba(255,255,255,0.18)');
    spec.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
    ctx.fillStyle = spec;
    ctx.fill();

    // Bottom soft reflection
    const refl = ctx.createRadialGradient(o.x, o.y + r * 0.7, r * 0.1, o.x, o.y + r * 0.7, r * 0.9);
    refl.addColorStop(0, 'rgba(212,212,216,0.22)');
    refl.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
    ctx.fillStyle = refl;
    ctx.fill();

    // Rim light
    ctx.beginPath();
    ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Fragmented ring
    const ringR = r * 1.55;
    const segments = [
      { start: t * 0.4, len: 1.4, alpha: 0.9, lw: 1.2 },
      { start: t * 0.4 + 2.1, len: 0.7, alpha: 0.5, lw: 1 },
      { start: t * -0.25 + 3.6, len: 1.0, alpha: 0.7, lw: 1 }
    ];
    for (const seg of segments) {
      ctx.beginPath();
      ctx.arc(o.x, o.y, ringR, seg.start, seg.start + seg.len);
      ctx.strokeStyle = `rgba(228,228,232,${seg.alpha})`;
      ctx.lineWidth = seg.lw;
      ctx.stroke();
    }

    // Orbiting dot on the ring
    const dotA = t * 0.5;
    const dx = o.x + Math.cos(dotA) * ringR;
    const dy = o.y + Math.sin(dotA) * ringR;
    ctx.beginPath();
    ctx.arc(dx, dy, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = '#fafafa';
    ctx.fill();
  }

  function drawParticles(t: number) {
    const pOff = finePointer ? (pointer.tx - 0.5) * 16 : 0;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
      const depth = 0.35 + p.z * 0.65;
      const x = p.x + pOff * depth;
      const y = p.y + Math.sin(t * 0.4 + p.z * 6) * 3 * depth;
      ctx.beginPath();
      ctx.arc(x, y, p.s * depth, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(228,228,232,${0.14 * depth + 0.05})`;
      ctx.fill();
    }
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 1;
    const g = 56;
    for (let x = 0.5; x <= W; x += g) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0.5; y <= H; y += g) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }

  function drawPointerLight() {
    if (!finePointer || !pointer.active) return;
    const lx = pointer.tx * W;
    const ly = pointer.ty * H;
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 320);
    g.addColorStop(0, 'rgba(255,255,255,0.05)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function frame(t: number) {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawParticles(t / 1000);
    drawChromeOrb(orb(), t / 1000);
    drawPointerLight();
  }

  let running = false;
  let raf = 0;
  function loop(t: number) {
    // Ease pointer
    pointer.tx += (pointer.x - pointer.tx) * 0.08;
    pointer.ty += (pointer.y - pointer.ty) * 0.08;
    frame(t);
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    if (reduceMotion) {
      frame(1000); // single static frame
      return;
    }
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  resize();
  seed();
  start();

  window.addEventListener('resize', () => { resize(); seed(); if (!reduceMotion && running) { /* re-render via loop */ } });

  if (finePointer) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width;
      pointer.y = (e.clientY - r.top) / r.height;
      pointer.active = true;
    });
    hero.addEventListener('pointerleave', () => { pointer.active = false; });
  }

  // Pause when off-screen
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) start();
      else stop();
    }, { threshold: 0 });
    io.observe(hero);
  }
}
