// DOM overlays over the canvas, so their text stays selectable and readable.
import content from '../../content/content.json';
import { ICONS } from '../sprites';
import type { GameUI, Project } from '../state';
import { esc } from './resumeHtml';

const TYPE_MS = 26;
const LINE_PAUSE_MS = 220;
const HOLD_AFTER_TYPING_MS = 1400;

const p = content.profile;
const contactLinks = `
  <a class="nes-btn" href="${esc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
  <a class="nes-btn" href="mailto:${esc(p.email)}">Email</a>
  <a class="nes-btn" href="${esc(p.resumePdf)}" download>Download resume</a>`;

export interface StartInfo {
  rank: string | null;
  onStart: () => void;
  onReset: () => void;
}

export class Overlays implements GameUI {
  private onKey: ((e: KeyboardEvent) => void) | null = null;

  constructor(
    private root: HTMLElement,
    private live: HTMLElement,
    private reducedMotion: boolean,
  ) {}

  hide() {
    this.clearKey();
    this.root.classList.remove('show');
    this.root.innerHTML = '';
  }

  announce(text: string) {
    this.live.textContent = text;
  }

  private clearKey() {
    if (this.onKey) removeEventListener('keydown', this.onKey);
    this.onKey = null;
  }

  private show(html: string) {
    this.clearKey();
    this.root.innerHTML = html;
    this.root.classList.add('show');
    this.root.scrollTop = 0;
    this.root.querySelector<HTMLElement>('[data-focus]')?.focus({ preventScroll: true });
  }

  private on(selector: string, handler: () => void) {
    this.root.querySelector(selector)?.addEventListener('click', handler);
  }

  intro(done: () => void) {
    const lines = [
      ['NAME', p.name],
      ['ORIGIN', p.origin],
      ['COLLEGE', p.college],
      ['DEGREE', p.degree],
      ['CLASS OF', p.classOf],
    ].map(([k, v]) => `${k.padEnd(9)}${v.toUpperCase()}`);

    this.show(`<div class="player-card">
      <h1>PLAYER 1</h1>
      <pre id="typed" aria-hidden="true"></pre>
      <p class="sr">${esc(lines.join('. '))}</p>
      <p class="hint blink">PRESS ANY KEY</p>
    </div>`);

    const typed = this.root.querySelector<HTMLElement>('#typed')!;
    const full = lines.join('\n');
    let timer = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      removeEventListener('keydown', finish);
      removeEventListener('pointerdown', finish);
      done();
    };
    addEventListener('keydown', finish);
    addEventListener('pointerdown', finish);

    if (this.reducedMotion) {
      typed.textContent = full;
      timer = window.setTimeout(finish, HOLD_AFTER_TYPING_MS * 2);
      return;
    }
    let shown = 0;
    const type = () => {
      typed.textContent = full.slice(0, ++shown);
      if (shown >= full.length) {
        timer = window.setTimeout(finish, HOLD_AFTER_TYPING_MS);
      } else {
        timer = window.setTimeout(type, full[shown - 1] === '\n' ? LINE_PAUSE_MS : TYPE_MS);
      }
    };
    type();
  }

  start(info: StartInfo) {
    this.show(`<div class="start">
      <h1>${esc(p.name.toUpperCase())}</h1>
      <p class="tag">${esc(p.title)}</p>
      ${info.rank ? `<p class="welcome">WELCOME BACK, ${esc(info.rank.toUpperCase())}</p>` : ''}
      <div class="actions column">
        <button class="nes-btn is-warning" id="start" data-focus>START GAME</button>
        <a class="nes-btn" href="#resume">VIEW RESUME</a>
      </div>
      <p class="hint">ARROWS, WASD OR SWIPE. P TO PAUSE.</p>
      <details class="settings">
        <summary>SETTINGS</summary>
        <button class="nes-btn is-error" id="reset">RESET PROGRESS</button>
      </details>
    </div>`);
    this.on('#start', info.onStart);
    this.on('#reset', info.onReset);
  }

  private iconCanvas(name: string) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 12;
    canvas.className = 'icon';
    canvas.setAttribute('aria-hidden', 'true');
    const ctx = canvas.getContext('2d')!;
    for (const px of ICONS[name]) {
      ctx.fillStyle = px.color;
      ctx.fillRect(px.x, px.y, 1, 1);
    }
    return canvas;
  }

  showProject(project: Project, alreadySeen: boolean, onClose: () => void) {
    const links = project.links
      .map((l) => `<a class="nes-btn" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`)
      .join('');
    this.show(`<section class="card nes-container is-dark" role="dialog" aria-modal="true" aria-labelledby="card-title">
      <div class="icon-slot"></div>
      <div class="details">
        <p class="kicker">${alreadySeen ? 'PROJECT REVISITED' : 'PROJECT UNLOCKED'}</p>
        <h2 id="card-title">${esc(project.title)}</h2>
        <p class="role">${esc(project.role)}${project.dates ? `<br>${esc(project.dates)}` : ''}</p>
        <p>${esc(project.summary)}</p>
        <ul>${project.points.map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
        <p class="stack">${esc(project.stack.join(' / '))}</p>
        <div class="actions">
          <button class="nes-btn is-warning" id="continue" data-focus>CONTINUE</button>
          ${links}
        </div>
      </div>
    </section>`);
    this.root.querySelector('.icon-slot')!.append(this.iconCanvas(project.icon));
    this.on('#continue', onClose);
    this.onKey = (e) => {
      if (e.code === 'Escape') onClose();
    };
    addEventListener('keydown', this.onKey);
  }

  showGameOver(line: string, score: number, onRetry: () => void) {
    this.show(`<section class="card end nes-container is-dark" role="dialog" aria-modal="true" aria-labelledby="end-title">
      <h2 id="end-title" class="over">GAME OVER</h2>
      <p class="line">${esc(line)}</p>
      <p>SCORE ${score}</p>
      <p class="tag">${esc(p.availability)}</p>
      <div class="actions">
        <button class="nes-btn is-warning" id="retry" data-focus>Retry</button>
        ${contactLinks}
      </div>
    </section>`);
    this.on('#retry', onRetry);
  }

  showWin(score: number, onRetry: () => void) {
    this.show(`<section class="card end nes-container is-dark" role="dialog" aria-modal="true" aria-labelledby="end-title">
      <h2 id="end-title" class="win">ALL CLEARED</h2>
      <p class="line">You've seen it all. Let's build something.</p>
      <p>SCORE ${score}</p>
      <p class="tag">${esc(p.availability)}</p>
      <div class="actions">
        <a class="nes-btn is-success" href="mailto:${esc(p.email)}" data-focus>Email me</a>
        <a class="nes-btn" href="${esc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
        <a class="nes-btn" href="${esc(p.resumePdf)}" download>Download resume</a>
        <button class="nes-btn" id="retry">Play again</button>
      </div>
    </section>`);
    this.on('#retry', onRetry);
  }

  showPaused(onResume: () => void) {
    this.show(`<div class="start">
      <h2>PAUSED</h2>
      <div class="actions column">
        <button class="nes-btn is-warning" id="resume-game" data-focus>RESUME GAME</button>
        <a class="nes-btn" href="#resume">VIEW RESUME</a>
      </div>
    </div>`);
    this.on('#resume-game', onResume);
  }
}
