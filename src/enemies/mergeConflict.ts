// Merge Conflict: near the player it splits and closes in from opposite sides.
import { Mover } from '../maze';
import { SPRITES } from '../sprites';
import type { Game } from '../state';
import { BASE_SPEED, Enemy, type Body } from './enemy';

const SPLIT_RANGE = 6;
const SPLIT_TICKS = 300;
const COOLDOWN_TICKS = 360;

export class MergeConflict extends Enemy {
  private phase: 'whole' | 'split' | 'merging' = 'whole';
  private timer = 0;
  private cooldown = 0;

  constructor() {
    super('"Merge Conflict got you. Resolve and retry?"', 'Conflict resolved', '#3dff8b', 1);
  }

  protected init(c: number, r: number) {
    this.phase = 'whole';
    this.timer = 0;
    this.cooldown = COOLDOWN_TICKS / 3;
    this.bodies = [{ m: new Mover(c, r), sprite: SPRITES.merge, alpha: 1, solid: true }];
  }

  private half(from: Mover, sprite: Body['sprite']): Body {
    const m = new Mover(from.c, from.r);
    m.dir = from.dir;
    m.t = from.t;
    return { m, sprite, alpha: 1, solid: true };
  }

  private merge() {
    const left = this.bodies[0];
    this.bodies = [{ m: left.m, sprite: SPRITES.merge, alpha: 1, solid: true }];
    this.phase = 'whole';
    this.cooldown = COOLDOWN_TICKS;
  }

  protected act(g: Game) {
    const p = g.player.m;
    if (this.phase === 'whole') {
      const m = this.bodies[0].m;
      if (this.cooldown > 0) this.cooldown--;
      else if (Math.abs(m.c - p.c) + Math.abs(m.r - p.r) <= SPLIT_RANGE) {
        this.bodies = [this.half(m, SPRITES.mergeLeft), this.half(m, SPRITES.mergeRight)];
        this.phase = 'split';
        this.timer = SPLIT_TICKS;
        return;
      }
      m.advance(BASE_SPEED * 0.65, (at) => g.maze.toward(at, p));
      return;
    }

    const [a, b] = this.bodies;
    if (this.phase === 'split') {
      const facing = p.dir < 0 ? g.player.facing : p.dir;
      const ahead = g.maze.reach(p, facing, 4);
      const behind = g.maze.reach(p, (facing + 2) % 4, 4);
      a.m.advance(BASE_SPEED * 0.75, (m) => g.maze.toward(m, ahead));
      b.m.advance(BASE_SPEED * 0.75, (m) => g.maze.toward(m, behind));
      if (--this.timer <= 0) {
        this.phase = 'merging';
        this.timer = SPLIT_TICKS;
      }
      return;
    }

    a.m.advance(BASE_SPEED * 0.75, (m) => g.maze.toward(m, b.m));
    b.m.advance(BASE_SPEED * 0.75, (m) => g.maze.toward(m, a.m));
    const apart = Math.abs(a.m.c - b.m.c) + Math.abs(a.m.r - b.m.r);
    if (apart <= 1 || --this.timer <= 0) this.merge();
  }
}
