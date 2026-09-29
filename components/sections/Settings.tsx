"use client";
import { useId } from "react";
import { useSettings, type Settings as S } from "@/lib/settings";
import { useSystemReducedMotion } from "@/hooks/useReducedMotion";
import ZoneHeader from "./ZoneHeader";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  hint?: string;
}) {
  const name = useId();
  return (
    <fieldset className="control">
      <legend className="control-label">{label}</legend>
      <div className="segmented">
        {options.map((o) => (
          <label key={o.value} className={value === o.value ? "is-on" : undefined}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {hint && <p className="control-hint">{hint}</p>}
    </fieldset>
  );
}

function Range({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const id = useId();
  const pct = Math.round(value * 100);
  return (
    <div className="control">
      <label className="control-label" htmlFor={id}>
        {label} <output htmlFor={id}>{pct}%</output>
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={5}
        value={pct}
        style={{ "--v": `${pct}%` } as React.CSSProperties}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
      />
    </div>
  );
}

export default function Settings() {
  const { settings, update, reset, quality, reducedMotion } = useSettings();
  const systemReduced = useSystemReducedMotion();

  return (
    <section id="settings" className="zone zone-settings" aria-labelledby="settings-title">
      <ZoneHeader
        id="settings"
        lede="Before the last stretch, a pause at the controls. Tune the dive to your device and your comfort — it is remembered on this device."
      />
      <div className="console" data-reveal>
        <div className="console-status" aria-live="polite">
          <span>
            Render: <b>{quality}</b>
          </span>
          <span>
            Motion: <b>{reducedMotion ? "reduced" : "full"}</b>
          </span>
        </div>

        <Segmented<S["quality"]>
          label="Visual quality"
          value={settings.quality}
          onChange={(quality) => update({ quality })}
          options={[
            { value: "auto", label: "Auto" },
            { value: "high", label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" },
          ]}
          hint={settings.quality === "auto" ? `Auto picked ${quality} for this device and adapts if frames drop.` : undefined}
        />

        <Segmented<S["motion"]>
          label="Reduced motion"
          value={settings.motion}
          onChange={(motion) => update({ motion })}
          options={[
            { value: "system", label: "System" },
            { value: "reduce", label: "On" },
            { value: "full", label: "Off" },
          ]}
          hint={`Your system ${systemReduced ? "asks for" : "does not ask for"} reduced motion.`}
        />

        <Range label="Particle density" value={settings.particles} onChange={(particles) => update({ particles })} />
        <Range label="Animation intensity" value={settings.intensity} onChange={(intensity) => update({ intensity })} />

        <div className="control control-row">
          <span className="control-label" id="ambient-label">
            Ambient effects
            <span className="control-hint">Light shafts, bubbles and passing creatures</span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.ambient}
            aria-labelledby="ambient-label"
            className="switch"
            onClick={() => update({ ambient: !settings.ambient })}
          >
            <span />
          </button>
        </div>

        <button type="button" className="btn btn-ghost console-reset" onClick={reset}>
          Reset to defaults
        </button>
      </div>
    </section>
  );
}
