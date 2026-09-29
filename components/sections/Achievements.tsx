import { STATS_AS_OF, achievements, codeforces, leetcode } from "@/data/achievements";
import ZoneHeader from "./ZoneHeader";

function Bar({ label, value, total, tone }: { label: string; value: number; total: number; tone: string }) {
  return (
    <li className={`bar tone-${tone}`}>
      <span className="bar-label">{label}</span>
      <span className="bar-track" aria-hidden="true">
        <span style={{ width: `${(value / total) * 100}%` }} />
      </span>
      <span className="bar-value">{value}</span>
    </li>
  );
}

export default function Achievements() {
  return (
    <section id="achievements" className="zone zone-achievements" aria-labelledby="achievements-title">
      <ZoneHeader
        id="achievements"
        lede="Halfway down lies a wreck. Some divers leave with nothing. He came back up with a few things worth keeping."
      />

      <div className="readouts">
        <a className="readout tone-green" href={codeforces.href} target="_blank" rel="noreferrer" data-reveal>
          <span className="readout-kicker">Codeforces · {codeforces.handle}</span>
          <span className="readout-value">{codeforces.maxRating}</span>
          <span className="readout-title">Peak rating · {codeforces.rank}</span>
          <span className="readout-row">
            <span>
              <b>#{codeforces.bestRank}</b> best Div. 2 rank
            </span>
            <span>
              <b>{codeforces.contests}</b> rated contests
            </span>
          </span>
          <span className="sr-only"> (opens Codeforces profile in new tab)</span>
        </a>

        <a className="readout tone-yellow" href={leetcode.href} target="_blank" rel="noreferrer" data-reveal>
          <span className="readout-kicker">LeetCode · {leetcode.handle}</span>
          <span className="readout-value">{leetcode.solved}</span>
          <span className="readout-title">Problems solved</span>
          <ul className="bars">
            <Bar label="Easy" value={leetcode.easy} total={leetcode.solved} tone="teal" />
            <Bar label="Medium" value={leetcode.medium} total={leetcode.solved} tone="yellow" />
            <Bar label="Hard" value={leetcode.hard} total={leetcode.solved} tone="red" />
          </ul>
          <span className="sr-only"> (opens LeetCode profile in new tab)</span>
        </a>
      </div>

      <ul className="plaques">
        {achievements.map((a) => {
          const body = (
            <>
              <span className="plaque-kicker">{a.kicker}</span>
              <span className="plaque-value">{a.value}</span>
              <span className="plaque-title">{a.title}</span>
              <span className="plaque-story">{a.story}</span>
            </>
          );
          return (
            <li key={a.id} className={`plaque tone-${a.tone}${a.size === "wide" ? " plaque-wide" : ""}`} data-reveal>
              {a.href ? (
                <a href={a.href} target="_blank" rel="noreferrer">
                  {body}
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              ) : (
                <div>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="asof">Profile figures as of {STATS_AS_OF}.</p>
    </section>
  );
}
