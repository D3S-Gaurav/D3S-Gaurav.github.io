"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { depthState } from "@/lib/depth";
import { useSettings } from "@/lib/settings";
import type { QualityTier } from "@/hooks/useDevicePerformance";
import { bubbleFragment, bubbleVertex, particleFragment, particleVertex, waterFragment, waterVertex } from "./shaders";

const PARTICLES: Record<QualityTier, number> = { high: 2400, medium: 1300, low: 500 };
const MAX_DPR: Record<QualityTier, number> = { high: 1.75, medium: 1.25, low: 1 };
const BUBBLES = 70;

/** Share of particles kept at a given depth: dense near the surface, sparse in the abyss. */
const densityAt = (d: number) => (d < 0.35 ? 1 - d * 1.2 : d < 0.8 ? 0.58 - (d - 0.35) * 0.6 : 0.31 - (d - 0.8) * 1.1);

function makeParticles(count: number) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = Math.random() - 0.5;
    pos[i * 3 + 1] = Math.random() * 1.3;
    pos[i * 3 + 2] = Math.pow(Math.random(), 0.7);
    seed[i * 4] = Math.random();
    seed[i * 4 + 1] = Math.random();
    seed[i * 4 + 2] = Math.random();
    seed[i * 4 + 3] = Math.random();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 4));
  return g;
}

function makeBubbles() {
  const pos = new Float32Array(BUBBLES * 3);
  const seed = new Float32Array(BUBBLES * 3);
  for (let i = 0; i < BUBBLES; i++) {
    // Bubbles rise in a few loose columns rather than uniformly.
    const column = [-0.32, -0.1, 0.18, 0.36][i % 4];
    pos[i * 3] = column + (Math.random() - 0.5) * 0.08;
    pos[i * 3 + 1] = Math.random() * 1.3;
    seed[i * 3] = Math.pow(Math.random(), 2);
    seed[i * 3 + 1] = Math.random();
    seed[i * 3 + 2] = Math.random();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));
  return g;
}

export default function OceanCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { settings, quality, reducedMotion, downgrade } = useSettings();
  const live = useRef({ settings, quality, reducedMotion, downgrade });
  live.current = { settings, quality, reducedMotion, downgrade };
  const api = useRef<{ setQuality: (q: QualityTier) => void } | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch {
      // No WebGL: the CSS gradient underneath carries the experience.
      canvas.style.display = "none";
      return;
    }
    renderer.setClearColor(0x000000);
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const water = new THREE.ShaderMaterial({
      vertexShader: waterVertex,
      fragmentShader: waterFragment,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uDepth: { value: 0 },
        uAspect: { value: 1 },
        uRays: { value: 1 },
        uMouse: { value: new THREE.Vector2() },
      },
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), water);
    quad.frustumCulled = false;
    scene.add(quad);

    const pUniforms = {
      uTime: { value: 0 },
      uCam: { value: 0 },
      uAspect: { value: 1 },
      uDepth: { value: 0 },
      uDensity: { value: 1 },
      uPixelRatio: { value: 1 },
      uScale: { value: 1 },
      uParallax: { value: 1 },
      uMouse: { value: new THREE.Vector2() },
    };
    const particleGeo = makeParticles(PARTICLES.high);
    const particles = new THREE.Points(
      particleGeo,
      new THREE.ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        uniforms: pUniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    particles.frustumCulled = false;
    scene.add(particles);

    const bUniforms = {
      uTime: { value: 0 },
      uCam: { value: 0 },
      uAspect: { value: 1 },
      uVisible: { value: 1 },
      uPixelRatio: { value: 1 },
    };
    const bubbles = new THREE.Points(
      makeBubbles(),
      new THREE.ShaderMaterial({
        vertexShader: bubbleVertex,
        fragmentShader: bubbleFragment,
        uniforms: bUniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      }),
    );
    bubbles.frustumCulled = false;
    scene.add(bubbles);

    let tier: QualityTier = live.current.quality;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR[tier]);
      renderer.setPixelRatio(dpr);
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      const aspect = window.innerWidth / window.innerHeight;
      water.uniforms.uAspect.value = aspect;
      pUniforms.uAspect.value = aspect;
      bUniforms.uAspect.value = aspect;
      pUniforms.uPixelRatio.value = dpr;
      bUniforms.uPixelRatio.value = dpr;
      // Keep particle size proportional to the viewport, not the pixel count.
      pUniforms.uScale.value = Math.min(1.3, Math.max(0.7, window.innerHeight / 900));
    };
    api.current = {
      setQuality: (q) => {
        tier = q;
        resize();
      },
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = new THREE.Vector2();
    const mouseTarget = new THREE.Vector2();
    const onPointer = (e: PointerEvent) => {
      mouseTarget.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let last = performance.now();
    let time = Math.random() * 100;
    let slowFrames = 0;
    let sampled = 0;
    let downgrades = 0;
    const started = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const { settings: s, reducedMotion: rm } = live.current;

      // Adaptive quality: if frames are consistently slow in auto mode, step down.
      if (s.quality === "auto" && now - started > 3000 && downgrades < 2) {
        sampled++;
        if (dt > 0.03) slowFrames++;
        if (sampled >= 120) {
          if (slowFrames > 70) {
            downgrades++;
            live.current.downgrade();
          }
          sampled = slowFrames = 0;
        }
      }

      const speed = rm ? 0.12 : 0.3 + 0.7 * s.intensity;
      time += dt * speed;
      const follow = rm ? 1 : 0.04 + 0.04 * s.intensity;
      if (rm) mouseTarget.multiplyScalar(0.0);
      mouse.lerp(mouseTarget, follow);

      const d = depthState.depth;
      const count = Math.floor(PARTICLES[tier] * s.particles);
      particleGeo.setDrawRange(0, count);
      particles.visible = count > 0;

      water.uniforms.uTime.value = time;
      water.uniforms.uDepth.value = d;
      water.uniforms.uRays.value = s.ambient ? (tier === "low" ? 0.6 : 1) : 0.15;
      water.uniforms.uMouse.value.copy(mouse);

      pUniforms.uTime.value = time;
      pUniforms.uCam.value = d;
      pUniforms.uDepth.value = d;
      pUniforms.uDensity.value = Math.max(0.05, densityAt(d));
      pUniforms.uParallax.value = rm ? 0 : s.intensity;
      pUniforms.uMouse.value.copy(mouse);

      const bubbleVis = s.ambient ? Math.max(0, 1 - d / 0.14) : 0;
      bubbles.visible = bubbleVis > 0.01 && tier !== "low";
      bUniforms.uTime.value = time;
      bUniforms.uCam.value = d;
      bUniforms.uVisible.value = bubbleVis;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    canvas.dataset.ready = "true";

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        (m.material as THREE.Material | undefined)?.dispose?.();
      });
      renderer.dispose();
      api.current = null;
    };
  }, []);

  useEffect(() => {
    api.current?.setQuality(quality);
  }, [quality]);

  return <canvas ref={ref} className="ocean-canvas" aria-hidden="true" />;
}
