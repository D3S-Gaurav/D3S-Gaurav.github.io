// localStorage read/write for collected projects and the high score.
// Storage can be blocked or throw, so the game must keep working without it.
const KEY = 'arcade-portfolio-v1';

export interface Save {
  collected: string[];
  high: number;
}

export function loadSave(): Save {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return {
      collected: Array.isArray(raw.collected) ? raw.collected : [],
      high: Number(raw.high) || 0,
    };
  } catch {
    return { collected: [], high: 0 };
  }
}

export function writeSave(save: Save) {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    // Progress simply lasts for this visit.
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing stored to clear.
  }
}

/** Stage 1 to 4: the first three collected projects each evolve the player. */
export const stageFor = (save: Save) => Math.min(4, 1 + save.collected.length);
