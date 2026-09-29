"use client";
import { useEffect, useRef, useState } from "react";
import { depthToMeters, sectionById, sections, type SectionId } from "@/data/sections";
import { profile } from "@/data/profile";
import { ZONE_DEPTH, subscribeDepth } from "@/lib/depth";
import { useNavigate } from "@/lib/nav";
import { useCurrentSection } from "@/hooks/useScrollProgress";

export default function DepthHUD({ initial }: { initial: SectionId }) {
  const current = useCurrentSection(initial);
  const navigate = useNavigate();
  const marker = useRef<HTMLSpanElement>(null);
  const meters = useRef<HTMLSpanElement>(null);
  const mobileMeters = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastM = -1;
    return subscribeDepth(({ depth }) => {
      if (marker.current) marker.current.style.transform = `translateY(${(depth * 100).toFixed(2)}cqh)`;
      const m = depthToMeters(depth);
      if (m !== lastM) {
        lastM = m;
        const text = `${m.toLocaleString("en-US")} m`;
        if (meters.current) meters.current.textContent = text;
        if (mobileMeters.current) mobileMeters.current.textContent = text;
      }
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e: React.MouseEvent, id: SectionId) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setOpen(false);
    navigate(id);
  };

  const links = sections.map((s) => (
    <li key={s.id} style={{ "--at": ZONE_DEPTH[s.id] } as React.CSSProperties}>
      <a
        href={s.path}
        onClick={(e) => go(e, s.id)}
        aria-current={current === s.id ? "location" : undefined}
        className="hud-link"
      >
        <span className="hud-tick" aria-hidden="true" />
        <span className="hud-label">{s.label}</span>
        <span className="hud-zone" aria-hidden="true">
          {s.zone}
        </span>
      </a>
    </li>
  ));

  return (
    <>
      <a href={sections[0].path} onClick={(e) => go(e, "home")} className="hud-mark" aria-label={`${profile.name} — back to surface`}>
        {profile.handle}
      </a>

      <nav className="hud" aria-label="Depth navigation">
        <div className="hud-track">
          <span className="hud-marker" ref={marker} aria-hidden="true" />
          <ol>{links}</ol>
        </div>
        <p className="hud-readout" aria-hidden="true">
          <span ref={meters}>0 m</span>
          <span className="hud-readout-zone">{sectionById[current].zone}</span>
        </p>
      </nav>

      <div className={`hud-mobile${open ? " is-open" : ""}`}>
        <button
          type="button"
          className="hud-mobile-toggle"
          aria-expanded={open}
          aria-controls="hud-mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="hud-mobile-label">{sectionById[current].label}</span>
          <span className="hud-mobile-depth" ref={mobileMeters} aria-hidden="true">
            0 m
          </span>
          <span className="hud-mobile-icon" aria-hidden="true" />
          <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
        </button>
        <nav id="hud-mobile-menu" aria-label="Sections" hidden={!open}>
          <ol>{links}</ol>
        </nav>
      </div>
    </>
  );
}
