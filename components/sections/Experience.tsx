import { ossStats, pullRequests, voyages } from "@/data/experience";
import ZoneHeader from "./ZoneHeader";

export default function Experience() {
  return (
    <section id="experience" className="zone zone-experience" aria-labelledby="experience-title">
      <ZoneHeader id="experience" lede="Two expeditions. Both still under way." />

      <ol className="voyages">
        {voyages.map((v, i) => (
          <li key={v.id} className="voyage" data-reveal>
            <div className="voyage-meta">
              <span className="voyage-index">Voyage {i + 1}</span>
              <span>{v.period}</span>
              <span>{v.mode}</span>
            </div>
            <div className="voyage-body">
              <h3>
                {v.role}
                <span className="voyage-org">{v.org}</span>
              </h3>
              <div className="prose prose-tight">
                {v.narrative.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
              <h4 className="label">Ship's log</h4>
              <ul className="log">
                {v.log.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <ul className="chips">
                {v.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <div className="ledger" data-reveal>
        <div className="ledger-head">
          <h3 className="label">Upstream ledger</h3>
          <ul className="ledger-stats">
            {ossStats.map((s) => (
              <li key={s.label}>
                <b>{s.value}</b> {s.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="ledger-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">What he did</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {pullRequests.map((pr) => (
                <tr key={pr.repo + pr.what}>
                  <td>
                    <a href={pr.href} target="_blank" rel="noreferrer">
                      {pr.repo}
                    </a>
                    <span className="ledger-stars">★ {pr.stars}</span>
                  </td>
                  <td>
                    {pr.what} <span className="ledger-lang">{pr.lang}</span>
                  </td>
                  <td>
                    <span className={`status status-${pr.status.replace(" ", "-")}`}>{pr.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
