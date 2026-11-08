// Shared enemy behaviour: fleeing, being caught and returning to the maze.
import { Mover, SPAWNS } from '../maze';
import type { Sprite } from '../sprites';
import type { Game } from '../state';

export const BASE_SPEED = 0.125;
const FLEE_SPEED = 0.06;

export interface Body {
  m: Mover;
  sprite: Sprite;
  alpha: number;
  solid: boolean;
}

export abstract class Enemy {
  bodies: Body[] = [];
  out = false;

  constructor(
    readonly line: string,
    readonly caughtTip: string,
    readonly color: string,
    protected spawnIndex: number,
  ) {}

  protected abstract act(g: Game): void;
  protected abstract init(c: number, r: number): void;

  reset() {
    const spawn = SPAWNS[this.spawnIndex];
    this.out = false;
    this.init(spawn.c, spawn.r);
  }

  update(g: Game) {
    if (this.out) {
      if (g.fright <= 0) {
        const spawn = g.maze.farthestSpawn(g.player.m);
        this.out = false;
        this.init(spawn.c, spawn.r);
      }
      return;
    }
    if (g.fright > 0) {
      for (const b of this.bodies) b.m.advance(FLEE_SPEED, (m) => g.maze.away(m, g.player.m));
      return;
    }
    this.act(g);
  }
}
