"use client";
import { useState } from "react";
import { hobbies } from "@/data/hobbies";
import Organism from "@/components/ui/Organism";
import ZoneHeader from "./ZoneHeader";

export default function Hobbies() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section id="hobbies" className="zone zone-hobbies" aria-labelledby="hobbies-title">
      <ZoneHeader
        id="hobbies"
        lede="Down here the only light is the light things make themselves. These are the ones that kept him glowing. Touch one."
      />
      <ul className="organisms">
        {hobbies.map((h, i) => {
          const isOpen = open === h.id;
          return (
            <li
              key={h.id}
              className={`hobby${isOpen ? " is-open" : ""}`}
              style={{ "--hue": h.hue, "--i": i } as React.CSSProperties}
              data-reveal
            >
              <button
                type="button"
                className="hobby-trigger"
                aria-expanded={isOpen}
                aria-controls={`hobby-${h.id}`}
                onClick={() => setOpen(isOpen ? null : h.id)}
              >
                <span className="hobby-float">
                  <Organism kind={h.organism} />
                </span>
                <span className="hobby-title">{h.title}</span>
                <span className="hobby-line">{h.line}</span>
              </button>
              <div id={`hobby-${h.id}`} className="hobby-detail" hidden={!isOpen}>
                <p>{h.detail}</p>
                {h.link && (
                  <a href={h.link.href} target="_blank" rel="noreferrer">
                    {h.link.label}
                    <span className="sr-only"> (opens in new tab)</span> →
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
