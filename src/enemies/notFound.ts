// 404: fades out and reappears elsewhere in the maze.
import { Mover } from '../maze';
import { SPRITES } from '../sprites';
import type { Game } from '../state';
import { BASE_SPEED, Enemy } from './enemy';

const SEEN_TICKS = 240;
const FADE_TICKS = 36;
const GONE_TICKS = 120;
const MIN_TELEPORT_DIST = 8;

export class NotFound extends Enemy {
  private phase: 'seen' | 'fading' | 'gone' | 'appearing' = 'seen';
  private timer = SEEN_TICKS;

  constructor() {
    super('"Player not found."', 'Route restored', '#aab0c0', 3);
  }

  protected init(c: number, r: number) {
    this.phase = 'seen';
    this.timer = SEEN_TICKS;
    this.bodies = [{ m: new Mover(c, r), sprite: SPRITES.notFound, alpha: 1, solid: true }];
  }

  protected act(g: Game) {
    const body = this.bodies[0];
    this.timer--;
    if (this.phase === 'seen') {
      body.m.advance(BASE_SPEED * 0.6, (m) => g.maze.toward(m, g.player.m));
      if (this.timer <= 0) {
        this.phase = 'fading';
        this.timer = FADE_TICKS;
      }
    } else if (this.phase === 'fading') {
      body.alpha = this.timer / FADE_TICKS;
      body.solid = body.alpha > 0.6;
      if (this.timer <= 0) {
        this.phase = 'gone';
        this.timer = GONE_TICKS;
      }
    } else if (this.phase === 'gone') {
      if (this.timer <= 0) {
        const tile = g.maze.randomFar(g.player.m, MIN_TELEPORT_DIST);
        body.m.place(tile.c, tile.r);
        this.phase = 'appearing';
        this.timer = FADE_TICKS;
      }
    } else {
      body.alpha = 1 - this.timer / FADE_TICKS;
      body.solid = body.alpha > 0.6;
      if (this.timer <= 0) {
        this.phase = 'seen';
        this.timer = SEEN_TICKS;
        body.alpha = 1;
        body.solid = true;
      }
    }
  }
}
