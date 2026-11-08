// Keyboard, swipe and on-screen d-pad, reduced to one wanted direction.
const KEYS: Record<string, number> = {
  ArrowUp: 0, KeyW: 0,
  ArrowRight: 1, KeyD: 1,
  ArrowDown: 2, KeyS: 2,
  ArrowLeft: 3, KeyA: 3,
};
const SWIPE_MIN = 18;

export class Input {
  dir = -1;
  /** Set by the game: input is only taken while a run is being played. */
  active = false;
  onPause: () => void = () => {};

  constructor(dpad: HTMLElement) {
    addEventListener('keydown', (e) => {
      if (e.code === 'KeyP' || e.code === 'Escape') {
        this.onPause();
        return;
      }
      const dir = KEYS[e.code];
      if (dir === undefined || !this.active) return;
      e.preventDefault();
      this.dir = dir;
    });

    let start: { x: number; y: number } | null = null;
    addEventListener('touchstart', (e) => {
      start = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    addEventListener('touchmove', (e) => {
      if (!start || !this.active) return;
      const dx = e.touches[0].clientX - start.x;
      const dy = e.touches[0].clientY - start.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN) return;
      this.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : dy > 0 ? 2 : 0;
      start = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    dpad.addEventListener('pointerdown', (e) => {
      const button = (e.target as HTMLElement).closest<HTMLElement>('[data-dir]');
      if (button && this.active) {
        e.preventDefault();
        this.dir = Number(button.dataset.dir);
      }
    });
  }
}
