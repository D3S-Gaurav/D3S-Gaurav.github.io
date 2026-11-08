// Tile map, collision, pellet placement and path scoring.
export const TILE = 12;
export const COLS = 21;
export const ROWS = 27;
export const DIRS = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];
export const opposite = (d: number) => (d + 2) % 4;

export const GATE = { c: 10, r: 20 };
export const JUNCTION = { c: 10, r: 19 };
export const START = { c: 10, r: 25 };
export const SPAWNS = [
  { c: 7, r: 7 },
  { c: 13, r: 7 },
  { c: 7, r: 10 },
  { c: 13, r: 10 },
];

// Left half including the centre column; the right half is mirrored from it.
// # wall, . skill pellet, P project, S school pellet, G gate, @ start.
const HALF = [
  '###########',
  '#P.........',
  '#.##.##.###',
  '#.##.##.###',
  '#....##...P',
  '####.##.##.',
  '####.##.##.',
  '#..........',
  '#.##.##.##.',
  '#.##.##.##.',
  '#P...##...P',
  '####.##.##.',
  '####.##.##.',
  '#..........',
  '#.##.#####.',
  '#.##.#####.',
  '#....##...P',
  '#.##.##.###',
  '#.##.##.###',
  '#P.........',
  '##########G',
  '##########S',
  '##########S',
  '##########S',
  '##########S',
  '##########@',
  '###########',
];

export const GRID = HALF.map((row) => row + [...row.slice(0, 10)].reverse().join(''));

// Nearest spots first, so the first projects a visitor finds are the strongest.
export const PROJECT_SPOTS = [
  { c: 10, r: 16 },
  { c: 1, r: 19 },
  { c: 19, r: 19 },
  { c: 1, r: 10 },
  { c: 19, r: 10 },
  { c: 10, r: 10 },
  { c: 1, r: 1 },
  { c: 19, r: 1 },
  { c: 10, r: 4 },
];

const idx = (c: number, r: number) => r * COLS + c;
const baseOpen = (c: number, r: number) =>
  c >= 0 && r >= 0 && c < COLS && r < ROWS && GRID[r][c] !== '#';
const collegeOpen = (c: number, r: number) => baseOpen(c, r) && r < GATE.r;

/** Six skill zones: two columns by three bands of the maze. */
export const zoneOf = (c: number, r: number) => (r < 7 ? 0 : r < 14 ? 2 : 4) + (c > 10 ? 1 : 0);

const distCache = new Map<number, Int16Array>();
export function distFrom(c: number, r: number): Int16Array {
  const key = idx(c, r);
  let dist = distCache.get(key);
  if (dist) return dist;
  dist = new Int16Array(COLS * ROWS).fill(-1);
  dist[key] = 0;
  const queue = [key];
  for (let head = 0; head < queue.length; head++) {
    const at = queue[head];
    const ac = at % COLS;
    const ar = (at - ac) / COLS;
    for (const d of DIRS) {
      const nc = ac + d.x;
      const nr = ar + d.y;
      if (collegeOpen(nc, nr) && dist[idx(nc, nr)] < 0) {
        dist[idx(nc, nr)] = dist[at] + 1;
        queue.push(idx(nc, nr));
      }
    }
  }
  distCache.set(key, dist);
  return dist;
}

export interface Tile {
  c: number;
  r: number;
}

export class Mover {
  dir = -1;
  t = 0;
  constructor(
    public c: number,
    public r: number,
  ) {}

  get x() {
    return (this.c + (this.dir >= 0 ? DIRS[this.dir].x * this.t : 0)) * TILE;
  }
  get y() {
    return (this.r + (this.dir >= 0 ? DIRS[this.dir].y * this.t : 0)) * TILE;
  }

  place(c: number, r: number) {
    this.c = c;
    this.r = r;
    this.dir = -1;
    this.t = 0;
  }

  /** Turn around mid-tile: the tile ahead becomes the tile we are leaving. */
  reverse() {
    if (this.dir < 0) return;
    this.c += DIRS[this.dir].x;
    this.r += DIRS[this.dir].y;
    this.dir = opposite(this.dir);
    this.t = 1 - this.t;
  }

  advance(speed: number, pick: (m: Mover) => number, onArrive?: () => void) {
    if (this.dir < 0) {
      this.dir = pick(this);
      if (this.dir < 0) return;
    }
    this.t += speed;
    if (this.t < 1) return;
    this.c += DIRS[this.dir].x;
    this.r += DIRS[this.dir].y;
    this.t -= 1;
    onArrive?.();
    const next = pick(this);
    if (next < 0) {
      this.dir = -1;
      this.t = 0;
    } else {
      this.dir = next;
    }
  }
}

export class Maze {
  readonly pellets = new Uint8Array(COLS * ROWS); // 0 none, 1 skill, 2 school
  readonly totals = [0, 0, 0, 0, 0, 0];
  readonly eaten = [0, 0, 0, 0, 0, 0];
  remaining = 0;
  gateClosed = false;

  constructor() {
    GRID.forEach((row, r) =>
      [...row].forEach((ch, c) => {
        if (ch === '.') {
          this.pellets[idx(c, r)] = 1;
          this.totals[zoneOf(c, r)]++;
          this.remaining++;
        } else if (ch === 'S') {
          this.pellets[idx(c, r)] = 2;
          this.remaining++;
        }
      }),
    );
  }

  open(c: number, r: number) {
    if (this.gateClosed) return collegeOpen(c, r);
    return baseOpen(c, r);
  }

  pelletAt(c: number, r: number) {
    return this.pellets[idx(c, r)];
  }

  eat(c: number, r: number) {
    const kind = this.pellets[idx(c, r)];
    if (!kind) return 0;
    this.pellets[idx(c, r)] = 0;
    this.remaining--;
    if (kind === 1) this.eaten[zoneOf(c, r)]++;
    return kind;
  }

  private choices(m: Mover) {
    const out: number[] = [];
    DIRS.forEach((d, i) => {
      if (i !== (m.dir >= 0 ? opposite(m.dir) : -1) && this.open(m.c + d.x, m.r + d.y)) out.push(i);
    });
    if (!out.length && m.dir >= 0) out.push(opposite(m.dir));
    return out;
  }

  private best(m: Mover, score: (c: number, r: number) => number) {
    let bestDir = -1;
    let bestScore = Infinity;
    for (const i of this.choices(m)) {
      const s = score(m.c + DIRS[i].x, m.r + DIRS[i].y) + Math.random() * 0.1;
      if (s < bestScore) {
        bestScore = s;
        bestDir = i;
      }
    }
    return bestDir;
  }

  toward(m: Mover, target: Tile) {
    const dist = distFrom(target.c, target.r);
    return this.best(m, (c, r) => dist[idx(c, r)]);
  }

  away(m: Mover, from: Tile) {
    const dist = distFrom(from.c, from.r);
    return this.best(m, (c, r) => -dist[idx(c, r)]);
  }

  wander(m: Mover, target: Tile, chase: number) {
    if (Math.random() < chase) return this.toward(m, target);
    const options = this.choices(m);
    return options[Math.floor(Math.random() * options.length)] ?? -1;
  }

  /** The farthest open tile up to n steps from a tile, along a straight line. */
  reach(from: Tile, dir: number, n: number): Tile {
    let { c, r } = from;
    const d = DIRS[dir < 0 ? 1 : dir];
    for (let i = 0; i < n && collegeOpen(c + d.x, r + d.y); i++) {
      c += d.x;
      r += d.y;
    }
    return { c, r };
  }

  /** A random walkable college tile at least minDist steps from a tile. */
  randomFar(from: Tile, minDist: number): Tile {
    const dist = distFrom(from.c, from.r);
    const tiles: Tile[] = [];
    for (let r = 0; r < GATE.r; r++) {
      for (let c = 0; c < COLS; c++) {
        if (collegeOpen(c, r) && dist[idx(c, r)] >= minDist) tiles.push({ c, r });
      }
    }
    return tiles[Math.floor(Math.random() * tiles.length)] ?? SPAWNS[0];
  }

  farthestSpawn(from: Tile): Tile {
    const dist = distFrom(from.c, from.r);
    return SPAWNS.reduce((a, b) => (dist[idx(b.c, b.r)] > dist[idx(a.c, a.r)] ? b : a));
  }
}
