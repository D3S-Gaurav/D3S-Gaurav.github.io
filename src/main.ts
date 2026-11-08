// Boot, canvas setup, resume routing and the fixed-timestep game loop.
import '@fontsource/press-start-2p/latin-400.css';
import 'nes.css/css/nes.min.css';
import './style.css';
import { Input } from './input';
import { HEIGHT, WIDTH, render } from './render';
import { Game } from './state';
import { clearSave } from './storage';
import { Overlays } from './ui/overlays';

const STEP_MS = 1000 / 60;
const MAX_FRAME_MS = 100;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

async function boot() {
  await document.fonts.load('8px "Press Start 2P"');

  const canvas = $<HTMLCanvasElement>('screen');
  const ctx = canvas.getContext('2d')!;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  ctx.imageSmoothingEnabled = false;

  const gameEl = $('game');
  const resumeEl = $('resume');
  const bar = $('bar');
  const dpad = $('dpad');
  const input = new Input(dpad);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ui = new Overlays($('overlay'), $('live'), reduced);
  const game = new Game(input, ui);
  input.onPause = () => game.togglePause();

  const showStart = () => {
    game.reloadSave();
    ui.start({
      rank: game.save.collected.length ? game.rank : null,
      onStart: () => game.startRun(),
      onReset: () => {
        clearSave();
        showStart();
      },
    });
  };

  // Whole-number scaling keeps pixels even. Small laptop screens get half steps,
  // because a 1x canvas would be too small to play.
  const fit = () => {
    const dpr = devicePixelRatio || 1;
    const availW = innerWidth - 16;
    const availH = innerHeight - bar.offsetHeight - dpad.offsetHeight - 12;
    const raw = Math.min((availW * dpr) / WIDTH, (availH * dpr) / HEIGHT);
    const scale = Math.max(1, raw >= 2 ? Math.floor(raw) : Math.floor(raw * 2) / 2);
    canvas.style.width = `${(WIDTH * scale) / dpr}px`;
    canvas.style.height = `${(HEIGHT * scale) / dpr}px`;
  };

  const route = () => {
    const onResume = location.hash === '#resume';
    resumeEl.hidden = !onResume;
    gameEl.hidden = onResume;
    if (onResume) {
      game.pause();
      scrollTo(0, 0);
    } else {
      fit();
    }
  };

  addEventListener('resize', fit);
  addEventListener('hashchange', route);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) game.pause();
  });

  route();
  ui.intro(showStart);

  let last = performance.now();
  let pending = 0;
  const frame = (now: number) => {
    pending += Math.min(MAX_FRAME_MS, now - last);
    last = now;
    while (pending >= STEP_MS) {
      game.update();
      pending -= STEP_MS;
    }
    render(ctx, game);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

void boot();
