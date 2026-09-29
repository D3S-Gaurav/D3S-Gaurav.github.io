"use client";
import { useEffect, useState } from "react";

export type QualityTier = "high" | "medium" | "low";

/** Rough first guess at what the device can render comfortably. */
export function detectQualityTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 600;

  if (nav.connection?.saveData) return "low";
  if (cores <= 2 || memory <= 2) return "low";
  if (coarse || small || cores <= 4 || memory <= 4) return "medium";
  return "high";
}

export function useDevicePerformance() {
  const [tier, setTier] = useState<QualityTier>("medium");
  useEffect(() => setTier(detectQualityTier()), []);
  return tier;
}
