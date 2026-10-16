---
name: frontend-3d
description: Integrate real-time 3D into web pages with Three.js — scene setup, lighting, GLTF/GLB model loading, scroll-driven camera, and performance tuning. Use when the user asks for a 3D hero, product viewer, or immersive scroll site.
---

# Frontend 3D (Three.js)

Use Three.js for real 3D scenes in the browser. All of this is MIT-licensed and free.

## Setup (ES modules)

```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); // cap DPR for perf
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);
```

## Lighting recipes (start here)

- Product/hero: one `DirectionalLight` key + one soft `HemisphereLight` fill + a subtle `AmbientLight`.
- Studio look: `Environment` from `three/addons/environments/Environment.js` (image-based lighting) for realistic metals/glass.
- Avoid many shadow-casting lights; enable `castShadow` only on the single key light.

## Loading a GLB model

```js
const loader = new GLTFLoader();
const draco = new DRACOLoader();
draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
loader.setDRACOLoader(draco);
const gltf = await loader.loadAsync('/model.glb');
scene.add(gltf.scene);
```

Prefer Draco-compressed `.glb` (smaller downloads). Always include a loading indicator and
a static-image fallback for devices without WebGL.

## Scroll-driven camera

Map scroll progress (0..1) to camera position/rotation in one rAF loop; don't create a
per-scroll listener that recomputes matrices.

```js
const cam = { pos: 3, rot: 0 };
addEventListener('scroll', () => {
  const p = scrollY / (document.body.scrollHeight - innerHeight);
  cam.pos = 3 - p * 1.5; cam.rot = p * 0.6;
});
(function loop() {
  camera.position.z += (cam.pos - camera.position.z) * 0.08; // lerp for smoothness
  scene.rotation.y += (cam.rot - scene.rotation.y) * 0.08;
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
})();
```

## Performance

- Cap `devicePixelRatio` at 2; pause the loop when the canvas is off-screen (IntersectionObserver).
- Reuse geometries/materials; call `renderer.dispose()` on teardown.
- Respect `prefers-reduced-motion`: reduce/disable camera motion, provide a static poster.

## Checklist

- [ ] Renderer + camera + at least 2 lights
- [ ] DPR capped at 2, loop paused off-screen
- [ ] Draco-compressed GLB with a loading state and non-WebGL fallback
- [ ] Reduced-motion path disables scroll animation
- [ ] Only MIT-licensed deps (three, GLTFLoader, DRACOLoader)
