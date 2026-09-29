import type { Hobby } from "@/data/hobbies";

const f = (n: number) => n.toFixed(1);

const RADIOLARIAN = Array.from({ length: 18 }, (_, i) => {
  const a = (i / 18) * Math.PI * 2;
  const len = i % 2 ? 62 : 76;
  return { x1: f(100 + Math.cos(a) * 40), y1: f(120 + Math.sin(a) * 40), x2: f(100 + Math.cos(a) * len), y2: f(120 + Math.sin(a) * len) };
});

const SIPHONOPHORE = Array.from({ length: 22 }, (_, i) => {
  const t = i / 21;
  return { x: f(100 + Math.sin(t * Math.PI * 2.2) * 34 * (0.4 + t)), y: f(18 + t * 230), r: f(5.5 - t * 3.2) };
});

export default function Organism({ kind }: { kind: Hobby["organism"] }) {
  return (
    <svg className={`organism organism-${kind}`} viewBox="0 0 200 260" aria-hidden="true" focusable="false">
      {kind === "jelly" && (
        <g>
          {[62, 82, 100, 118, 138].map((x, i) => (
            <path
              key={x}
              className="tentacle"
              style={{ animationDelay: `${i * -0.7}s` }}
              d={`M${x} 104C${x - 12} 140 ${x + 12} 170 ${x} 200S${x - 8} 240 ${x + 4} 256`}
            />
          ))}
          <path className="body" d="M40 102C40 34 160 34 160 102c-10-5-20 4-30-2-10 6-20-2-30 2-10-4-20 4-30-2-10 6-20-3-30 2z" />
          <path className="inner" d="M64 88c4-26 68-26 72 0" />
        </g>
      )}
      {kind === "siphonophore" && (
        <g>
          <path className="inner" d={`M${SIPHONOPHORE.map((p) => `${p.x} ${p.y}`).join("L")}`} />
          {SIPHONOPHORE.map((p, i) => (
            <circle key={i} className="bead" cx={p.x} cy={p.y} r={p.r} style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </g>
      )}
      {kind === "comb" && (
        <g>
          <ellipse className="body" cx="100" cy="124" rx="46" ry="80" />
          {[-34, -20, -7, 7, 20, 34].map((dx, i) => (
            <path
              key={dx}
              className="comb-row"
              style={{ animationDelay: `${i * -0.25}s` }}
              d={`M100 46Q${100 + dx * 1.9} 124 100 202`}
            />
          ))}
        </g>
      )}
      {kind === "radiolarian" && (
        <g>
          {RADIOLARIAN.map((s, i) => (
            <line key={i} className="inner" x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
          ))}
          <circle className="body" cx="100" cy="120" r="40" />
          <polygon className="inner" points="100,94 122,107 122,133 100,146 78,133 78,107" />
          <circle className="bead" cx="100" cy="120" r="6" />
        </g>
      )}
    </svg>
  );
}
