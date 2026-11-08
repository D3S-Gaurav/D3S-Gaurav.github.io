// All canvas drawing: maze, sprites, HUD and effects.
import content from '../content/content.json';
import { FridayDeploy } from './enemies/fridayDeploy';
import { COLS, GATE, GRID, PROJECT_SPOTS, ROWS, TILE, zoneOf } from './maze';
import { CHECK, ICONS, INK, WHITE, playerSprite, type PlayerFrame, type Sprite } from './sprites';
import { FRIGHT_WARNING_TICKS, type Game } from './state';

const HUD_H = 30;
const TICKER_H = 22;
export const WIDTH = COLS * TILE;
export const HEIGHT = HUD_H + ROWS * TILE + TICKER_H;

const CHAR = 8;
const TICKER_COLS = Math.floor(WIDTH / CHAR) - 1;
const IDLE_TAP = 180;
const IDLE_YAWN = 360;

const WALL = '#2ef2ff';
const WALL_DIM = '#0f7f92';
const SCHOOL_WALL = '#8a8fa8';
const ZONE_COLORS = ['#ffe14a', '#ff4fa3', '#3dff8b', '#4aa8ff', '#ff8a1e', '#c08bff'];
const FRIGHT = '#3a6bff';

const glyphs = new Map<string, HTMLCanvasElement>();

/** Canvas text anti-aliases, so each glyph is thresholded to hard pixels once. */
function glyph(ch: string, color: string) {
  const key = color + ch;
  let cached = glyphs.get(key);
  if (cached) return cached;
  cached = document.createElement('canvas');
  cached.width = cached.height = CHAR;
  const ctx = cached.getContext('2d', { willReadFrequently: true })!;
  ctx.font = `${CHAR}px "Press Start 2P"`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = color;
  ctx.fillText(ch, 0, 0);
  const image = ctx.getImageData(0, 0, CHAR, CHAR);
  for (let i = 3; i < image.data.length; i += 4) image.data[i] = image.data[i] > 110 ? 255 : 0;
  ctx.putImageData(image, 0, 0);
  glyphs.set(key, cached);
  return cached;
}

function text(ctx: CanvasRenderingContext2D, str: string, x: number, y: number, color: string) {
  const clean = str.toUpperCase().replace(/[^\x20-\x7e]/g, '-');
  [...clean].forEach((ch, i) => {
    if (ch !== ' ') ctx.drawImage(glyph(ch, color), x + i * CHAR, y);
  });
}

function draw(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  y: number,
  flip = false,
  recolor?: (color: string) => string,
) {
  for (const p of sprite) {
    ctx.fillStyle = recolor ? recolor(p.color) : p.color;
    ctx.fillRect(Math.round(flip ? x + 11 - p.x : x + p.x), Math.round(y + p.y), 1, 1);
  }
}

function drawWalls(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = ROWS * TILE;
  const ctx = canvas.getContext('2d')!;
  const wall = (c: number, r: number) =>
    c < 0 || r < 0 || c >= COLS || r >= ROWS || GRID[r][c] === '#';
  const I = 3;

  const lines = (color: string, offset: number) => {
    ctx.fillStyle = color;
    const inset = I + offset;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!wall(c, r)) continue;
        if (r > GATE.r) ctx.fillStyle = offset ? '#3b3f52' : SCHOOL_WALL;
        else ctx.fillStyle = color;
        const x = c * TILE;
        const y = r * TILE;
        const up = !wall(c, r - 1);
        const down = !wall(c, r + 1);
        const left = !wall(c - 1, r);
        const right = !wall(c + 1, r);
        const x0 = left ? x + inset : x;
        const x1 = right ? x + TILE - inset : x + TILE;
        const y0 = up ? y + inset : y;
        const y1 = down ? y + TILE - inset : y + TILE;
        if (up) ctx.fillRect(x0, y + inset, x1 - x0, 1);
        if (down) ctx.fillRect(x0, y + TILE - inset - 1, x1 - x0, 1);
        if (left) ctx.fillRect(x + inset, y0, 1, y1 - y0);
        if (right) ctx.fillRect(x + TILE - inset - 1, y0, 1, y1 - y0);
        // Inner corners, where only the diagonal tile is open.
        const a = inset;
        const b = TILE - inset - 1;
        if (!up && !left && !wall(c - 1, r - 1)) {
          ctx.fillRect(x, y + a, a + 1, 1);
          ctx.fillRect(x + a, y, 1, a + 1);
        }
        if (!up && !right && !wall(c + 1, r - 1)) {
          ctx.fillRect(x + b, y + a, TILE - b, 1);
          ctx.fillRect(x + b, y, 1, a + 1);
        }
        if (!down && !left && !wall(c - 1, r + 1)) {
          ctx.fillRect(x, y + b, a + 1, 1);
          ctx.fillRect(x + a, y + b, 1, TILE - b);
        }
        if (!down && !right && !wall(c + 1, r + 1)) {
          ctx.fillRect(x + b, y + b, TILE - b, 1);
          ctx.fillRect(x + b, y + b, 1, TILE - b);
        }
      }
    }
  };
  lines(WALL_DIM, 1);
  lines(WALL, 0);
  return canvas;
}

let wallLayer: HTMLCanvasElement | null = null;

function wrap(str: string, width: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const word of str.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > width && line) {
      out.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  out.push(line);
  return out.slice(0, 2);
}

function drawHud(ctx: CanvasRenderingContext2D, g: Game) {
  text(ctx, '1UP', 4, 1, '#ff3b4e');
  text(ctx, String(g.score).padStart(6, '0'), 4, 10, WHITE);
  text(ctx, g.rank, 4, 20, '#ff8a1e');
  text(ctx, 'HIGH SCORE', WIDTH / 2 - 40, 1, '#ff3b4e');
  text(ctx, String(g.high).padStart(6, '0'), WIDTH / 2 - 24, 10, WHITE);
  for (let i = 0; i < g.lives; i++) {
    draw(ctx, playerSprite(g.stage, 'shut'), WIDTH - 15 - i * 14, 8);
  }
}

function drawPanels(ctx: CanvasRenderingContext2D, g: Game) {
  const top = HUD_H + 21 * TILE + 4;
  content.skills.forEach((skill, i) => {
    const y = top + i * 11;
    const fill = g.maze.totals[i] ? g.maze.eaten[i] / g.maze.totals[i] : 0;
    text(ctx, skill.short, 4, y, ZONE_COLORS[i]);
    ctx.fillStyle = '#1b1d2b';
    ctx.fillRect(48, y + 1, 60, 5);
    ctx.fillStyle = ZONE_COLORS[i];
    ctx.fillRect(48, y + 1, Math.round(60 * fill), 5);
  });

  const x = 142;
  text(ctx, 'PROJECTS', x, top, '#8a8fa8');
  text(ctx, `${g.save.collected.length}/${content.projects.length}`, x, top + 11, WHITE);
  text(ctx, 'LEVEL', x, top + 28, '#8a8fa8');
  for (let i = 1; i <= 4; i++) {
    const locked = i > g.stage;
    draw(ctx, playerSprite(i, 'shut'), x + (i - 1) * 15, top + 40, false, locked ? () => '#2a2d3e' : undefined);
  }
}

function drawPellets(ctx: CanvasRenderingContext2D, g: Game) {
  const blink = g.tick >> 4 & 1;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const kind = g.maze.pelletAt(c, r);
      if (!kind) continue;
      const x = c * TILE;
      const y = r * TILE + HUD_H;
      if (kind === 1) {
        ctx.fillStyle = ZONE_COLORS[zoneOf(c, r)];
        ctx.fillRect(x + 5, y + 5, 2, 2);
      } else {
        ctx.fillStyle = blink ? '#ffe14a' : '#fff1c9';
        ctx.fillRect(x + 4, y + 4, 4, 4);
      }
    }
  }
}

function drawProjects(ctx: CanvasRenderingContext2D, g: Game) {
  PROJECT_SPOTS.forEach((spot, i) => {
    const project = content.projects[i];
    if (!project) return;
    const x = spot.c * TILE;
    const y = spot.r * TILE + HUD_H;
    if (g.save.collected.includes(project.id)) {
      ctx.globalAlpha = 0.3;
      draw(ctx, ICONS[project.icon], x, y);
      ctx.globalAlpha = 1;
      draw(ctx, CHECK, x, y);
    } else {
      draw(ctx, ICONS[project.icon], x, y + (g.reducedMotion ? 0 : (g.tick >> 4) & 1));
    }
  });
}

function playerFrame(g: Game): PlayerFrame {
  const { idle, m } = g.player;
  if (m.dir >= 0) return g.tick >> 2 & 1 ? 'open' : 'shut';
  if (idle > IDLE_YAWN && idle % 240 < 60) return 'yawn';
  if (idle > IDLE_TAP) return idle >> 3 & 1 ? 'tap' : 'shut';
  return 'shut';
}

function drawPlayer(ctx: CanvasRenderingContext2D, g: Game) {
  const p = g.player;
  const x = p.m.x;
  const y = p.m.y + HUD_H;
  const flip = p.facing === 3;
  const sprite = playerSprite(g.stage, playerFrame(g));

  p.trail.forEach((bit, i) => {
    ctx.globalAlpha = 1 - (i + 1) / (p.trail.length + 1);
    text(ctx, bit.ch, bit.x + 2, bit.y + HUD_H + 2, '#3dff8b');
  });
  ctx.globalAlpha = 1;

  if (g.scene === 'dying') {
    if (g.reducedMotion) {
      draw(ctx, sprite, x, y, flip);
      return;
    }
    const spread = 1 - g.timer / 54;
    ctx.globalAlpha = 1 - spread;
    for (const px of sprite) {
      // Each pixel keeps a stable direction derived from where it started.
      const angle = (px.x * 7 + px.y * 13) * 0.9;
      ctx.fillStyle = px.color;
      ctx.fillRect(
        Math.round(x + px.x + Math.cos(angle) * spread * 26),
        Math.round(y + px.y + Math.sin(angle) * spread * 26),
        1,
        1,
      );
    }
    ctx.globalAlpha = 1;
    return;
  }

  if (g.scene === 'evolve' && !g.reducedMotion) {
    if (g.timer > 18) {
      draw(ctx, sprite, x, y, flip, () => WHITE);
    } else {
      for (const px of sprite) {
        ctx.fillStyle = px.color;
        const j = g.timer > 0 ? 2 : 0;
        ctx.fillRect(
          Math.round(x + px.x + (Math.random() * j * 2 - j)),
          Math.round(y + px.y + (Math.random() * j * 2 - j)),
          1,
          1,
        );
      }
    }
    return;
  }
  draw(ctx, sprite, x, y, flip);
}

function drawEnemies(ctx: CanvasRenderingContext2D, g: Game) {
  const warning = g.fright > 0 && g.fright < FRIGHT_WARNING_TICKS && g.tick >> 3 & 1;
  const recolor =
    g.fright > 0
      ? (color: string) => (color === WHITE || color === INK ? color : warning ? WHITE : FRIGHT)
      : undefined;
  for (const enemy of g.enemies) {
    if (enemy.out) continue;
    for (const body of enemy.bodies) {
      ctx.globalAlpha = body.alpha;
      const x = body.m.x;
      const y = body.m.y + HUD_H;
      draw(ctx, body.sprite, x, y, false, recolor);
      if (enemy instanceof FridayDeploy && g.fright <= 0) {
        // The hand sweeps from 9 o'clock round to 5 o'clock across its day.
        const angle = Math.PI + enemy.dayProgress * Math.PI * (5 / 3);
        ctx.fillStyle = '#ff3b4e';
        ctx.fillRect(Math.round(x + 5), Math.round(y + 4), 2, 2);
        for (let i = 1; i <= 3; i++) {
          ctx.fillRect(
            Math.round(x + 5.5 + Math.cos(angle) * i),
            Math.round(y + 4.5 + Math.sin(angle) * i),
            1,
            1,
          );
        }
      }
    }
  }
  ctx.globalAlpha = 1;
}

function drawLabels(ctx: CanvasRenderingContext2D, g: Game) {
  for (const l of g.labels) {
    const clean = l.text.toUpperCase();
    const width = clean.length * CHAR;
    const x = Math.max(1, Math.min(WIDTH - width - 1, Math.round(l.x + 6 - width / 2)));
    const y = Math.max(HUD_H, Math.round(l.y + HUD_H - 10 - (40 - l.life) / 4));
    ctx.fillStyle = INK;
    ctx.fillRect(x - 1, y - 1, width + 2, CHAR + 2);
    text(ctx, clean, x, y, l.color);
  }
}

export function render(ctx: CanvasRenderingContext2D, g: Game) {
  wallLayer ??= drawWalls();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.drawImage(wallLayer, 0, HUD_H);

  if (g.maze.gateClosed) {
    ctx.fillStyle = '#ff3b4e';
    for (let i = 0; i < 3; i++) ctx.fillRect(GATE.c * TILE + i * 5, GATE.r * TILE + HUD_H + 5, 3, 2);
  }

  drawHud(ctx, g);
  drawPanels(ctx, g);
  drawPellets(ctx, g);
  drawProjects(ctx, g);
  if (g.enemiesOn) drawEnemies(ctx, g);
  if (g.scene !== 'idle') drawPlayer(ctx, g);
  drawLabels(ctx, g);

  if (g.scene === 'ready' && (g.reducedMotion || g.tick >> 4 & 1)) {
    const y = HUD_H + 12 * TILE + 2;
    ctx.fillStyle = INK;
    ctx.fillRect(WIDTH / 2 - 26, y - 2, 52, 12);
    text(ctx, 'READY!', WIDTH / 2 - 24, y, '#ffe14a');
  }

  const lines = wrap(g.ticker, TICKER_COLS);
  lines.forEach((line, i) => {
    const y = HUD_H + ROWS * TILE + (lines.length === 1 ? 7 : 2 + i * 10);
    text(ctx, line, (WIDTH - line.length * CHAR) / 2, y, '#ffe14a');
  });
}
