"use client";
import { useEffect, useRef } from "react";
import { subscribeDepth } from "@/lib/depth";

/** Visibility window: fades in at a, full between b and c, gone by d. */
const band = (x: number, a: number, b: number, c: number, d: number) =>
  x <= a || x >= d ? 0 : x < b ? (x - a) / (b - a) : x > c ? (d - x) / (d - c) : 1;

/**
 * Distant silhouettes that pass the visitor at particular depths.
 * Purely decorative, positioned from depth so they feel anchored in the water column.
 */
export default function Creatures() {
  const whale = useRef<HTMLDivElement>(null);
  const manta = useRef<HTMLDivElement>(null);
  const angler = useRef<HTMLDivElement>(null);
  const wreck = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      subscribeDepth(({ depth: d }) => {
        if (whale.current) {
          const t = (d - 0.02) / 0.3;
          whale.current.style.opacity = String(band(d, 0.02, 0.07, 0.22, 0.32) * 0.5);
          whale.current.style.transform = `translate3d(${110 - t * 150}vw, ${58 - t * 30}vh, 0)`;
        }
        if (manta.current) {
          const t = (d - 0.18) / 0.3;
          manta.current.style.opacity = String(band(d, 0.18, 0.24, 0.36, 0.46) * 0.6);
          manta.current.style.transform = `translate3d(${-30 + t * 120}vw, ${70 - t * 70}vh, 0) rotate(${-8 + t * 16}deg)`;
        }
        if (wreck.current) {
          const t = (d - 0.47) / 0.18;
          wreck.current.style.opacity = String(band(d, 0.47, 0.52, 0.6, 0.66) * 0.9);
          wreck.current.style.transform = `translate3d(0, ${70 - t * 60}vh, 0)`;
        }
        if (angler.current) {
          const t = (d - 0.8) / 0.2;
          angler.current.style.opacity = String(band(d, 0.8, 0.86, 0.95, 1.01));
          angler.current.style.transform = `translate3d(${72 - t * 8}vw, ${60 - t * 40}vh, 0)`;
        }
      }),
    [],
  );

  return (
    <div className="creatures" aria-hidden="true">
      <div ref={whale} className="creature whale">
        <svg viewBox="0 0 400 140">
          <path d="M10 70C40 45 120 35 200 40c70 4 130 15 170 22l25-22c3 15 1 30-3 38l6 22c-13-8-23-14-33-18-45 13-115 23-185 20-50-2-100-7-135-14C30 85 15 80 10 70z" />
          <path d="M120 95c20 25 50 40 80 37-20-12-40-24-50-34z" />
        </svg>
      </div>
      <div ref={manta} className="creature manta">
        <svg viewBox="0 0 300 200">
          <path d="M150 40c20 0 35 20 45 35 35 5 75 20 100 45-35-2-75 0-105 10-10 20-25 35-40 40-15-5-30-20-40-40-30-10-70-12-105-10 25-25 65-40 100-45 10-15 25-35 45-35z" />
          <path d="M149 168h2l2 32h-6z" />
        </svg>
      </div>
      <div ref={wreck} className="creature wreck">
        <svg viewBox="0 0 600 260">
          <path d="M20 190l40-60h420l60 20-30 70H70z" />
          <path d="M150 130l-18-120h6l20 120zM330 130l30-110h6l-26 110z" />
          <path className="wreck-rig" d="M138 20L60 128M138 20L300 128M362 22l100 106M362 22L230 128" fill="none" />
          <path d="M0 240c80-18 160-20 260-10s220 10 340-6V260H0z" />
        </svg>
      </div>
      <div ref={angler} className="creature angler">
        <svg viewBox="0 0 220 150">
          <path className="angler-body" d="M40 85c0-40 60-50 100-30 30 15 50 20 75 5l-5 25 5 25c-25-15-45-10-75 5-40 20-100 10-100-30z" />
          <path className="angler-stalk" d="M62 62C55 30 35 16 14 20" fill="none" />
        </svg>
        <span className="angler-lure" />
      </div>
    </div>
  );
}
