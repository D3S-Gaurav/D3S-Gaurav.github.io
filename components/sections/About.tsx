import { profile } from "@/data/profile";
import ZoneHeader from "./ZoneHeader";

export default function About() {
  const { education } = profile;
  return (
    <section id="about" className="zone zone-about" aria-labelledby="about-title">
      <ZoneHeader id="about" title="About" />

      <div className="about-intro" data-reveal>
        <p className="about-lead">{profile.intro}</p>
        <p>{profile.introMore}</p>
      </div>

      <div className="readings">
        <article className="reading reading-edu" data-reveal>
          <h3 className="reading-label">Education</h3>
          <p className="reading-title">{education.school}</p>
          <p>{education.degree}</p>
          <p className="muted">
            {education.period} · {education.detail}
          </p>
        </article>

        <article className="reading reading-now" data-reveal>
          <h3 className="reading-label">Currently</h3>
          <ul className="timeline">
            {profile.experience.map((x) => (
              <li key={x.role}>
                <p className="reading-title">
                  {x.role} <span className="muted">— {x.org}</span>
                </p>
                <p className="muted small">
                  {x.period} · {x.kind}
                </p>
                <p>{x.summary}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="reading reading-focus" data-reveal>
          <h3 className="reading-label">What I like building</h3>
          <ul className="focus-list">
            {profile.interests.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </article>

        <article className="reading reading-skills" data-reveal>
          <h3 className="reading-label">Toolkit</h3>
          <dl className="skills">
            {profile.skills.map((g) => (
              <div key={g.group}>
                <dt>{g.group}</dt>
                <dd>
                  <ul className="chips">
                    {g.items.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="reading reading-signals" data-reveal>
          <h3 className="reading-label">Signals</h3>
          <ul className="signals">
            {profile.achievements.map((a) => (
              <li key={a.label}>
                <span className="signal-value">{a.value}</span>
                <span className="signal-label">{a.label}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
