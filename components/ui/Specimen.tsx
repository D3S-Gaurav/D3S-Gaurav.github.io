import type { Project } from "@/data/projects";

// Procedural line-art for each deep-sea "discovery". Geometry is computed once at module load.

const f = (n: number) => n.toFixed(1);

const STATION = (() => {
  const nodes: [number, number][] = [
    [120, 34], [66, 88], [174, 88], [36, 146], [120, 146], [204, 146], [82, 204], [158, 204],
  ];
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 6], [4, 6], [4, 7], [5, 7]];
  const paths = edges.map(([a, b]) => {
    const [x1, y1] = nodes[a];
    const [x2, y2] = nodes[b];
    const my = (y1 + y2) / 2;
    return `M${x1} ${y1}C${x1} ${my} ${x2} ${my} ${x2} ${y2}`;
  });
  return { nodes, paths };
})();

const NAUTILUS = (() => {
  const a = 3.2;
  const b = 0.2;
  const cx = 128;
  const cy = 122;
  const pts: string[] = [];
  const septa: string[] = [];
  const turns = 5.2 * Math.PI;
  for (let t = 0; t <= turns; t += 0.08) {
    const r = a * Math.exp(b * t);
    pts.push(`${f(cx + r * Math.cos(t))} ${f(cy + r * Math.sin(t))}`);
  }
  for (let t = Math.PI * 1.2; t <= turns; t += Math.PI / 5) {
    const r1 = a * Math.exp(b * t);
    const r2 = a * Math.exp(b * (t - 2 * Math.PI));
    const bend = (r1 + r2) / 2 + (r1 - r2) * 0.18;
    septa.push(
      `M${f(cx + r1 * Math.cos(t))} ${f(cy + r1 * Math.sin(t))}Q${f(cx + bend * Math.cos(t + 0.25))} ${f(cy + bend * Math.sin(t + 0.25))} ${f(cx + r2 * Math.cos(t))} ${f(cy + r2 * Math.sin(t))}`,
    );
  }
  return { spiral: `M${pts.join("L")}`, septa };
})();

const CORAL = (() => {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const branches: string[] = [];
  const tips: [number, number][] = [];
  const grow = (x: number, y: number, angle: number, len: number, depth: number) => {
    const x2 = x + Math.cos(angle) * len;
    const y2 = y + Math.sin(angle) * len;
    const cx = x + Math.cos(angle + 0.3) * len * 0.5;
    const cy = y + Math.sin(angle + 0.3) * len * 0.5;
    branches.push(`M${f(x)} ${f(y)}Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}`);
    if (depth === 0) {
      tips.push([x2, y2]);
      return;
    }
    grow(x2, y2, angle - 0.35 - rand() * 0.3, len * (0.68 + rand() * 0.12), depth - 1);
    grow(x2, y2, angle + 0.35 + rand() * 0.3, len * (0.68 + rand() * 0.12), depth - 1);
  };
  grow(120, 228, -Math.PI / 2, 58, 4);
  return { branches, tips };
})();

export default function Specimen({ form }: { form: Project["form"] }) {
  return (
    <svg className={`specimen-svg specimen-${form}`} viewBox="0 0 240 240" aria-hidden="true" focusable="false">
      {form === "station" && (
        <g>
          <circle className="faint" cx="120" cy="120" r="112" strokeDasharray="2 6" />
          {STATION.paths.map((d, i) => (
            <g key={i}>
              <path d={d} />
              <path d={d} className="pulse" style={{ animationDelay: `${i * 0.37}s` }} />
            </g>
          ))}
          {STATION.nodes.map(([x, y], i) => (
            <circle key={i} className="node" cx={x} cy={y} r={i === 0 ? 7 : 5} />
          ))}
        </g>
      )}
      {form === "nautilus" && (
        <g>
          <path d={NAUTILUS.spiral} />
          {NAUTILUS.septa.map((d, i) => (
            <path key={i} d={d} className="faint" />
          ))}
          <path d={NAUTILUS.spiral} className="pulse pulse-long" />
        </g>
      )}
      {form === "coral" && (
        <g>
          {CORAL.branches.map((d, i) => (
            <path key={i} d={d} />
          ))}
          {CORAL.tips.map(([x, y], i) => (
            <circle key={i} className="node polyp" cx={x} cy={y} r="3" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />
          ))}
        </g>
      )}
      {form === "beacon" && (
        <g>
          <circle className="ring" cx="120" cy="96" r="30" />
          <circle className="ring" cx="120" cy="96" r="30" style={{ animationDelay: "1.2s" }} />
          <circle className="ring" cx="120" cy="96" r="30" style={{ animationDelay: "2.4s" }} />
          <path d="M120 104V222M104 222h32M110 150l10-46 10 46z" />
          <circle className="node lamp" cx="120" cy="96" r="8" />
          <g className="orbit">
            {[0, 1, 2, 3].map((i) => {
              const a = (i / 4) * Math.PI * 2 + 0.4;
              return <circle key={i} className="node" cx={f(120 + Math.cos(a) * 70)} cy={f(96 + Math.sin(a) * 38)} r="4" />;
            })}
          </g>
          <ellipse className="faint" cx="120" cy="96" rx="70" ry="38" />
        </g>
      )}
    </svg>
  );
}
