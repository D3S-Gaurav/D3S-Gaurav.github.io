import { depthToMeters, sectionById, type SectionId } from "@/data/sections";
import { ZONE_DEPTH } from "@/lib/depth";

export default function ZoneHeader({ id, lede }: { id: SectionId; lede?: string }) {
  const s = sectionById[id];
  return (
    <header className="zone-header" data-reveal>
      <p className="eyebrow">
        <span className="eyebrow-accent">{s.chapter}</span>
        <span aria-hidden="true">·</span>
        <span>{s.label}</span>
        <span className="eyebrow-depth">
          {s.zone} — {depthToMeters(ZONE_DEPTH[id]).toLocaleString("en-US")} m
        </span>
      </p>
      <h2 id={`${id}-title`}>{s.heading}</h2>
      {lede && <p className="zone-lede">{lede}</p>}
    </header>
  );
}
