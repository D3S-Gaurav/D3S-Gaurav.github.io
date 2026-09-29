"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSystemReducedMotion } from "@/hooks/useReducedMotion";
import { detectQualityTier, type QualityTier } from "@/hooks/useDevicePerformance";

export type Settings = {
  quality: "auto" | QualityTier;
  /** 0–1 multiplier on particle count. */
  particles: number;
  /** 0–1 multiplier on ambient animation speed and camera response. */
  intensity: number;
  /** Light rays, caustics and passing creatures. */
  ambient: boolean;
  motion: "system" | "reduce" | "full";
};

export const defaultSettings: Settings = {
  quality: "auto",
  particles: 1,
  intensity: 1,
  ambient: true,
  motion: "system",
};

type Ctx = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  reset: () => void;
  reducedMotion: boolean;
  quality: QualityTier;
  /** Auto mode can step quality down at runtime if frames drop. */
  downgrade: () => void;
};

const SettingsContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "abyss-settings-v1";

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {}
  return defaultSettings;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [autoTier, setAutoTier] = useState<QualityTier>("medium");
  const systemReduced = useSystemReducedMotion();

  useEffect(() => {
    setSettings(load());
    setAutoTier(detectQualityTier());
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setSettings(defaultSettings);
  }, []);

  const downgrade = useCallback(() => {
    setAutoTier((t) => (t === "high" ? "medium" : "low"));
  }, []);

  const reducedMotion = settings.motion === "reduce" || (settings.motion === "system" && systemReduced);
  const quality = settings.quality === "auto" ? autoTier : settings.quality;

  useEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? "reduce" : "full";
    document.documentElement.dataset.ambient = settings.ambient ? "on" : "off";
  }, [reducedMotion, settings.ambient]);

  const value = useMemo(
    () => ({ settings, update, reset, reducedMotion, quality, downgrade }),
    [settings, update, reset, reducedMotion, quality, downgrade],
  );
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
