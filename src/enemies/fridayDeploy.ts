// Friday Deploy: drifts lazily until its clock hits 5:00 PM, then sprints.
import { Mover } from '../maze';
import { SPRITES } from '../sprites';
import type { Game } from '../state';
import { BASE_SPEED, Enemy } from './enemy';

const WORK_DAY_TICKS = 480;
const SPRINT_TICKS = 180;

export class FridayDeploy extends Enemy {
  clock = 0;

  constructor() {
    super('"Deployed on a Friday. Bold."', 'Rollback complete', '#ffb000', 2);
  }

  protected init(c: number, r: number) {
    this.clock = 0;
    this.bodies = [{ m: new Mover(c, r), sprite: SPRITES.friday, alpha: 1, solid: true }];
  }

  /** Clock hand position, from 0 to 1 across the working day. */
  get dayProgress() {
    return Math.min(1, this.clock / WORK_DAY_TICKS);
  }

  protected act(g: Game) {
    const body = this.bodies[0];
    this.clock++;
    if (this.clock === WORK_DAY_TICKS) g.addLabel(body.m.x, body.m.y, '5:00 PM', this.color);
    if (this.clock < WORK_DAY_TICKS) {
      body.m.advance(BASE_SPEED * 0.45, (m) => g.maze.wander(m, g.player.m, 0.35));
    } else {
      body.m.advance(BASE_SPEED * 1.05, (m) => g.maze.toward(m, g.player.m));
      if (this.clock >= WORK_DAY_TICKS + SPRINT_TICKS) this.clock = 0;
    }
  }
}
