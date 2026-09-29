import type { SectionId } from "@/data/sections";
import { sections } from "@/data/sections";

/**
 * Scene depth (0 = surface, 1 = trench floor) at the top of each section.
 * Depth is interpolated between these anchors so zones line up with content
 * regardless of how tall each section renders on a given screen.
 */
export const ZONE_DEPTH: Record<SectionId, number> = {
  home: 0,
  about: 0.12,
  experience: 0.24,
  projects: 0.37,
  achievements: 0.55,
  hobbies: 0.66,
  settings: 0.8,
  contact: 0.9,
};

export type DepthState = {
  /** Raw depth from the current scroll position. */
  target: number;
  /** Eased depth used by the renderer (inertia). */
  depth: number;
  /** Signed eased scroll speed, roughly -1..1. */
  velocity: number;
  section: SectionId;
};

type Listener = (s: DepthState) => void;

const state: DepthState = { target: 0, depth: 0, velocity: 0, section: "home" };
const listeners = new Set<Listener>();
const sectionListeners = new Set<(id: SectionId) => void>();

let anchors: { id: SectionId; top: number }[] = [];
let maxScroll = 1;
let revealEls: HTMLElement[] = [];
let nearEls: HTMLElement[] = [];
let sinkEls: HTMLElement[] = [];
let lastY = -1;
let lastVh = -1;
let raf = 0;
let running = false;
let instant = false;

export const depthState = state;

export function subscribeDepth(fn: Listener) {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

export function subscribeSection(fn: (id: SectionId) => void) {
  sectionListeners.add(fn);
  return () => void sectionListeners.delete(fn);
}

/** Skip easing (reduced motion). */
export function setInstant(v: boolean) {
  instant = v;
}

/** Re-measure section offsets and animated elements. Call after layout changes. */
export function measure() {
  const vh = window.innerHeight;
  maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
  anchors = sections
    .map((s) => {
      const el = document.getElementById(s.id);
      return el ? { id: s.id, top: el.getBoundingClientRect().top + window.scrollY } : null;
    })
    .filter((a): a is { id: SectionId; top: number } => a !== null);
  revealEls = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  nearEls = Array.from(document.querySelectorAll<HTMLElement>("[data-near]"));
  sinkEls = Array.from(document.querySelectorAll<HTMLElement>("[data-sink]"));
  lastY = -1;
}

export function sectionTop(id: SectionId) {
  return anchors.find((a) => a.id === id)?.top ?? 0;
}

function depthFromScroll(y: number) {
  if (anchors.length === 0) return 0;
  const points = anchors.map((a) => ({ y: Math.min(a.top, maxScroll), d: ZONE_DEPTH[a.id] }));
  points.push({ y: maxScroll, d: 1 });
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (y <= b.y) {
      const span = Math.max(1, b.y - a.y);
      return a.d + (b.d - a.d) * Math.min(1, Math.max(0, (y - a.y) / span));
    }
  }
  return 1;
}

function currentSection(y: number, vh: number): SectionId {
  const probe = y + vh * 0.42;
  let id: SectionId = "home";
  for (const a of anchors) if (a.top <= probe) id = a.id;
  if (y >= maxScroll - 2) id = anchors[anchors.length - 1]?.id ?? id;
  return id;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Scroll-linked visibility: fade in from below, fade out towards the top. */
function updateElements(y: number, vh: number) {
  // The surface content sinks away over the first ~three quarters of a screen.
  const sink = clamp01(y / (vh * 0.75)).toFixed(3);
  for (const el of sinkEls) el.style.setProperty("--s", sink);

  const reveal = revealEls.map((el) => el.getBoundingClientRect());
  const near = nearEls.map((el) => el.getBoundingClientRect());
  for (let i = 0; i < revealEls.length; i++) {
    const r = reveal[i];
    const enter = clamp01((vh - r.top) / (vh * 0.28));
    const exit = clamp01(r.bottom / (vh * 0.22));
    revealEls[i].style.setProperty("--r", Math.min(enter, exit).toFixed(3));
  }
  for (let i = 0; i < nearEls.length; i++) {
    const r = near[i];
    const center = r.top + r.height / 2;
    const dist = Math.abs(center - vh * 0.5) / (vh * 0.6);
    nearEls[i].style.setProperty("--near", clamp01(1 - dist).toFixed(3));
  }
}

function tick() {
  const y = window.scrollY;
  const vh = window.innerHeight;
  if (y !== lastY || vh !== lastVh) {
    lastY = y;
    lastVh = vh;
    state.target = depthFromScroll(y);
    updateElements(y, vh);
    const id = currentSection(y, vh);
    if (id !== state.section) {
      state.section = id;
      sectionListeners.forEach((fn) => fn(id));
    }
  }
  const prev = state.depth;
  state.depth = instant ? state.target : prev + (state.target - prev) * 0.075;
  if (Math.abs(state.target - state.depth) < 1e-5) state.depth = state.target;
  const v = (state.depth - prev) * 60;
  state.velocity += (v - state.velocity) * 0.1;
  listeners.forEach((fn) => fn(state));
  raf = requestAnimationFrame(tick);
}

export function startDepthLoop() {
  if (running) return;
  running = true;
  measure();
  state.target = state.depth = depthFromScroll(window.scrollY);
  raf = requestAnimationFrame(tick);
}

export function stopDepthLoop() {
  running = false;
  cancelAnimationFrame(raf);
}
