import { depthToMeters, sectionById, type SectionId } from "@/data/sections";
import { ZONE_DEPTH } from "@/lib/depth";

export default function ZoneHeader({ id, title, lede }: { id: SectionId; title: string; lede?: string }) {
  const s = sectionById[id];
  return (
    <header className="zone-header" data-reveal>
      <p className="eyebrow">
        <span>{s.zone}</span>
        <span aria-hidden="true">·</span>
        <span>{depthToMeters(ZONE_DEPTH[id]).toLocaleString("en-US")} m</span>
      </p>
      <h2 id={`${id}-title`}>{title}</h2>
      {lede && <p className="zone-lede">{lede}</p>}
    </header>
  );
}
