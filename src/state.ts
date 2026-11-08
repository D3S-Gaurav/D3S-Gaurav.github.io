// Scene state machine and the rules of a run.
import content from '../content/content.json';
import { Bug } from './enemies/bug';
import type { Enemy } from './enemies/enemy';
import { FridayDeploy } from './enemies/fridayDeploy';
import { MergeConflict } from './enemies/mergeConflict';
import { NotFound } from './enemies/notFound';
import type { Input } from './input';
import { GATE, JUNCTION, Maze, PROJECT_SPOTS, START, zoneOf } from './maze';
import { Player } from './player';
import { loadSave, stageFor, writeSave, type Save } from './storage';

export type Project = (typeof content.projects)[number];
export type Scene = 'idle' | 'ready' | 'corridor' | 'maze' | 'powerup' | 'evolve' | 'dying' | 'over' | 'win';

export interface GameUI {
  showProject(project: Project, onClose: () => void): void;
  showGameOver(line: string, score: number, onRetry: () => void): void;
  showWin(score: number, onRetry: () => void): void;
  showPaused(onResume: () => void): void;
  hide(): void;
  announce(text: string): void;
}

export interface Label {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

const MAX_LIVES = 3;
const READY_TICKS = 90;
const FRIGHT_TICKS = 420;
const EVOLVE_TICKS = 30;
const DYING_TICKS = 54;
const SCHOOL_HOLD_TICKS = 84;
const TICKER_MIN_TICKS = 90;
const LABEL_TICKS = 40;
const COLLISION_PX = 9;

export const FRIGHT_WARNING_TICKS = 120;

export class Game {
  scene: Scene = 'idle';
  paused = false;
  tick = 0;
  timer = 0;
  maze = new Maze();
  player = new Player();
  enemies: Enemy[] = [new Bug(), new MergeConflict(), new FridayDeploy(), new NotFound()];
  enemiesOn = false;
  lives = MAX_LIVES;
  score = 0;
  fright = 0;
  hold = 0;
  labels: Label[] = [];
  ticker = '';
  save: Save = loadSave();

  readonly reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  private after: 'corridor' | 'maze' = 'corridor';
  private tickerQueue: string[] = [];
  private tickerTime = 0;
  private schoolIndex = 0;
  private skillIndex = content.skills.map(() => 0);
  private zone = -1;

  constructor(
    readonly input: Input,
    private ui: GameUI,
  ) {}

  get stage() {
    return stageFor(this.save);
  }
  get rank() {
    return content.ranks[this.stage - 1];
  }
  get high() {
    return Math.max(this.save.high, this.score);
  }
  get canPause() {
    return this.scene === 'corridor' || this.scene === 'maze' || this.scene === 'ready';
  }

  projectAt(c: number, r: number): Project | undefined {
    const i = PROJECT_SPOTS.findIndex((s) => s.c === c && s.r === r);
    return i >= 0 ? content.projects[i] : undefined;
  }

  reloadSave() {
    this.save = loadSave();
  }

  startRun() {
    this.ui.hide();
    this.maze = new Maze();
    this.lives = MAX_LIVES;
    this.score = 0;
    this.fright = 0;
    this.hold = 0;
    this.labels = [];
    this.enemiesOn = false;
    this.schoolIndex = 0;
    this.zone = -1;
    this.skillIndex = content.skills.map(() => 0);
    this.tickerQueue = [];
    this.tickerTime = 0;
    this.player.place(START.c, START.r);
    this.input.dir = -1;
    this.after = 'corridor';
    this.setTicker('PRESS UP OR SWIPE UP TO BEGIN');
    this.enter('ready', READY_TICKS);
  }

  pause() {
    if (!this.canPause || this.paused) return;
    this.paused = true;
    this.input.active = false;
    this.ui.showPaused(() => this.resume());
  }

  togglePause() {
    if (this.paused) this.resume();
    else this.pause();
  }

  private resume() {
    this.paused = false;
    this.ui.hide();
  }

  addLabel(x: number, y: number, text: string, color: string) {
    this.labels.push({ x, y, text, color, life: LABEL_TICKS });
  }

  update() {
    this.input.active = !this.paused && this.canPause;
    if (this.paused) return;
    this.tick++;
    this.updateTicker();
    this.labels = this.labels.filter((l) => --l.life > 0);

    switch (this.scene) {
      case 'ready':
        if (--this.timer <= 0) this.scene = this.after;
        break;
      case 'corridor':
      case 'maze':
        this.play();
        break;
      case 'evolve':
        if (--this.timer <= 0) this.scene = 'maze';
        break;
      case 'dying':
        if (--this.timer <= 0) this.afterDeath();
        break;
    }
  }

  private enter(scene: Scene, timer = 0) {
    this.scene = scene;
    this.timer = timer;
  }

  private play() {
    this.player.update(this);
    if (this.scene !== 'corridor' && this.scene !== 'maze') return;
    if (!this.enemiesOn) return;
    if (this.fright > 0) this.fright--;
    for (const enemy of this.enemies) enemy.update(this);
    this.checkCollisions();
  }

  /** Called each time the player reaches the centre of a new tile. */
  arrive() {
    const { c, r } = this.player.m;
    const kind = this.maze.eat(c, r);
    if (kind === 2) this.eatSchool();
    else if (kind === 1) this.eatSkill(c, r);

    if (this.scene === 'corridor' && c === JUNCTION.c && r === JUNCTION.r) this.enterCollege();
    if (this.scene === 'maze' && r < GATE.r) this.noteZone(c, r);

    if (this.maze.remaining === 0) {
      this.finish();
      return;
    }
    const project = this.projectAt(c, r);
    if (project && !this.save.collected.includes(project.id)) this.openProject(project);
  }

  private eatSchool() {
    this.score += 50;
    this.say(content.school[this.schoolIndex++]);
    this.hold = SCHOOL_HOLD_TICKS;
  }

  private eatSkill(c: number, r: number) {
    this.score += 10;
    const zone = zoneOf(c, r);
    const skill = content.skills[zone];
    const item = skill.items[this.skillIndex[zone]++ % skill.items.length];
    this.addLabel(this.player.m.x, this.player.m.y, `+1 ${item}`, '#ffffff');
  }

  private noteZone(c: number, r: number) {
    const zone = zoneOf(c, r);
    if (zone === this.zone) return;
    this.zone = zone;
    this.say(`SKILL CORRIDOR: ${content.skills[zone].name}`, true);
  }

  private enterCollege() {
    this.scene = 'maze';
    this.maze.gateClosed = true;
    this.enemiesOn = true;
    this.enemies.forEach((e) => e.reset());
    this.say('COLLEGE. THE CHOICES BEGIN.');
  }

  private openProject(project: Project) {
    this.scene = 'powerup';
    this.ui.showProject(project, () => {
      this.ui.hide();
      const before = this.stage;
      this.save.collected.push(project.id);
      this.persist();
      this.score += 200;
      this.lives = Math.min(MAX_LIVES, this.lives + 1);
      this.fright = FRIGHT_TICKS;
      if (this.stage > before) this.enter('evolve', this.reducedMotion ? 1 : EVOLVE_TICKS);
      else this.scene = 'maze';
    });
  }

  private checkCollisions() {
    const p = this.player.m;
    for (const enemy of this.enemies) {
      if (enemy.out) continue;
      for (const body of enemy.bodies) {
        if (!body.solid || Math.hypot(body.m.x - p.x, body.m.y - p.y) >= COLLISION_PX) continue;
        if (this.fright > 0) {
          enemy.out = true;
          this.addLabel(body.m.x, body.m.y, enemy.caughtTip, '#7fb2ff');
        } else {
          this.die(enemy);
        }
        return;
      }
    }
  }

  private killer: Enemy | null = null;

  private die(enemy: Enemy) {
    this.killer = enemy;
    this.lives--;
    this.input.dir = -1;
    this.enter('dying', this.reducedMotion ? 20 : DYING_TICKS);
  }

  private afterDeath() {
    if (this.lives > 0) {
      this.player.place(JUNCTION.c, JUNCTION.r);
      this.enemies.forEach((e) => e.reset());
      this.fright = 0;
      this.after = 'maze';
      this.enter('ready', READY_TICKS);
      return;
    }
    this.persist();
    this.scene = 'over';
    this.ui.showGameOver(this.killer?.line ?? '', this.score, () => this.startRun());
  }

  private finish() {
    this.score += 1000;
    this.persist();
    this.scene = 'win';
    this.ui.showWin(this.score, () => this.startRun());
  }

  private persist() {
    this.save.high = this.high;
    writeSave(this.save);
  }

  private setTicker(text: string) {
    this.ticker = text;
    this.tickerTime = TICKER_MIN_TICKS;
    this.ui.announce(text);
  }

  /** Queue a ticker line; a replaceable line only keeps the latest in the queue. */
  private say(text: string, replaceable = false) {
    if (this.tickerTime <= 0) {
      this.setTicker(text);
    } else if (replaceable) {
      this.tickerQueue = [text];
    } else {
      this.tickerQueue.push(text);
    }
  }

  private updateTicker() {
    if (this.tickerTime > 0) this.tickerTime--;
    if (this.tickerTime <= 0 && this.tickerQueue.length) this.setTicker(this.tickerQueue.shift()!);
  }
}
