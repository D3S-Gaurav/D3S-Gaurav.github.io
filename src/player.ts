// Player movement, facing, idle timing and the binary trail.
import { DIRS, Mover, START } from './maze';
import type { Game } from './state';

const SPEED = 0.11;
const CORRIDOR_SPEED = 0.1;
const TRAIL_LENGTH = 8;
const TRAIL_EVERY = 5;

export interface TrailBit {
  x: number;
  y: number;
  ch: string;
}

export class Player {
  m = new Mover(START.c, START.r);
  facing = 1;
  idle = 0;
  trail: TrailBit[] = [];
  private trailTick = 0;

  place(c: number, r: number) {
    this.m.place(c, r);
    this.idle = 0;
    this.trail = [];
  }

  update(g: Game) {
    const m = this.m;
    const wanted = g.input.dir;
    if (wanted >= 0 && m.dir >= 0 && m.t > 0 && wanted === (m.dir + 2) % 4) m.reverse();

    if (g.hold > 0) {
      g.hold--;
    } else {
      const speed = g.scene === 'corridor' ? CORRIDOR_SPEED : SPEED;
      m.advance(speed, (at) => this.pick(g, at), () => g.arrive());
    }

    if (m.dir === 1 || m.dir === 3) this.facing = m.dir;
    this.idle = m.dir < 0 ? this.idle + 1 : 0;
    this.updateTrail(g);
  }

  private pick(g: Game, m: Mover) {
    const wanted = g.input.dir;
    const canGo = (d: number) => d >= 0 && g.maze.open(m.c + DIRS[d].x, m.r + DIRS[d].y);
    if (canGo(wanted)) return wanted;
    return canGo(m.dir) ? m.dir : -1;
  }

  private updateTrail(g: Game) {
    if (g.stage < 4 || ++this.trailTick % TRAIL_EVERY) return;
    if (this.m.dir < 0) {
      this.trail.pop();
      return;
    }
    this.trail.unshift({ x: this.m.x, y: this.m.y, ch: Math.random() < 0.5 ? '0' : '1' });
    this.trail.length = Math.min(this.trail.length, TRAIL_LENGTH);
  }
}
