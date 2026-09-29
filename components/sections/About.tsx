import { profile } from "@/data/profile";
import SkillIcon from "@/components/ui/SkillIcon";
import ZoneHeader from "./ZoneHeader";

export default function About() {
  return (
    <section id="about" className="zone zone-about" aria-labelledby="about-title">
      <ZoneHeader id="about" />

      <div className="chapter-grid">
        <div className="prose">
          {profile.story.map((p, i) => (
            <p key={i} className={i === 0 ? "dropcap" : undefined} data-reveal>
              {p}
            </p>
          ))}
        </div>

        <aside className="field-notes" data-reveal aria-label="Field notes">
          <h3 className="label">Field notes</h3>
          <dl>
            {profile.fieldNotes.map((n) => (
              <div key={n.label}>
                <dt>{n.label}</dt>
                <dd>{n.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <div className="toolkit" data-reveal>
        <h3 className="label">What he carries down</h3>
        <div className="toolkit-groups">
          {profile.skills.map((g) => (
            <div key={g.group} className="toolkit-group">
              <h4>{g.group}</h4>
              <ul className="skills">
                {g.items.map((s) => (
                  <SkillIcon key={s.name} skill={s} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
