// The Bug: chases directly. Slowest, but never stops.
import { Mover } from '../maze';
import { SPRITES } from '../sprites';
import type { Game } from '../state';
import { BASE_SPEED, Enemy } from './enemy';

export class Bug extends Enemy {
  constructor() {
    super('"Uncaught exception."', 'Bug fixed', '#ff3b4e', 0);
  }

  protected init(c: number, r: number) {
    this.bodies = [{ m: new Mover(c, r), sprite: SPRITES.bug[0], alpha: 1, solid: true }];
  }

  protected act(g: Game) {
    const body = this.bodies[0];
    body.sprite = SPRITES.bug[g.tick >> 3 & 1];
    body.m.advance(BASE_SPEED * 0.6, (m) => g.maze.toward(m, g.player.m));
  }
}
