// Original 12x12 pixel art, written as text so it needs no image download.
export interface Pixel {
  x: number;
  y: number;
  color: string;
}
export type Sprite = Pixel[];

export const WHITE = '#ffffff';
export const INK = '#0b0b12';

const PALETTE: Record<string, string> = {
  O: '#ff8a1e', o: '#c85a00', W: WHITE, K: INK, T: '#fff1c9',
  H: '#19d3c5', h: '#0e8f87', M: '#ff4fa3',
  R: '#ff3b4e', r: '#a8182a', G: '#3dff8b', g: '#14a85a',
  A: '#ffb000', a: '#b36b00', S: '#aab0c0', s: '#667088',
  B: '#4aa8ff', Y: '#ffe14a', N: '#8a5a2b', n: '#5c3a1a',
};

function art(rows: string[]): Sprite {
  const out: Sprite = [];
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch !== '.') out.push({ x, y, color: PALETTE[ch] });
    }),
  );
  return out;
}

function layer(...sprites: Sprite[]): Sprite {
  const byPos = new Map<number, Pixel>();
  for (const sprite of sprites) for (const p of sprite) byPos.set(p.y * 12 + p.x, p);
  return [...byPos.values()];
}

const head = ['..OOOOOOOO..', '.OOOOOOOOOO.', 'OOOOWWOOOOOO', 'OOOOWKOOOOOO'];
const sleepyHead = ['..OOOOOOOO..', '.OOOOOOOOOO.', 'OOOOOOOOOOOO', 'OOOOKKOOOOOO'];
const feet = ['.OOOOOOOOOO.', '..OO....OO..', '..oo....oo..'];
const tapFeet = ['.OOOOOOOOOO.', '..OO.....OO.', '..oo......oo'];
const openMouth = ['OOOOOOOOOOTT', 'OOOOOOOKKKKK', 'OOOOOOKKKKKK', 'OOOOOOOKKKKK', 'OOOOOOOOOOTT'];
const shutMouth = ['OOOOOOOOOOOO', 'OOOOOOOOOOOO', 'OOOOOTKTKTKT', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO'];
const yawnMouth = ['OOOOOOKKKKKK', 'OOOOOKKKKKKK', 'OOOOOKKKKKKK', 'OOOOOKKKKKKK', 'OOOOOOKKKKKK'];

const FRAMES = {
  open: art([...head, ...openMouth, ...feet]),
  shut: art([...head, ...shutMouth, ...feet]),
  tap: art([...head, ...shutMouth, ...tapFeet]),
  yawn: art([...sleepyHead, ...yawnMouth, ...feet]),
};
export type PlayerFrame = keyof typeof FRAMES;

const HOODIE = art([
  '..HHHHHHHH..',
  '.HHHHHHHHHH.',
  'HHHh........',
  'HHh.........',
  'HH..........',
  'HH..........',
  'HH..........',
  'HHh.........',
  'HHHHHHHHHHHH',
  '.HhHHHHHHhH.',
  '............',
  '............',
]);

const HEADPHONES = art([
  '....MMMM....',
  '...M....M...',
  '............',
  '..MM........',
  '..MM........',
  '..MM........',
  '............',
  '............',
  '............',
  '............',
  '............',
  '............',
]);

const playerCache = new Map<string, Sprite>();
export function playerSprite(stage: number, frame: PlayerFrame): Sprite {
  const key = `${stage}:${frame}`;
  let sprite = playerCache.get(key);
  if (!sprite) {
    const layers = [FRAMES[frame]];
    if (stage >= 2) layers.push(HOODIE);
    if (stage >= 3) layers.push(HEADPHONES);
    sprite = layer(...layers);
    playerCache.set(key, sprite);
  }
  return sprite;
}

const merge = art([
  '...GGGGRR...',
  '.GGGGGGRRRR.',
  'GGGGGGGRRRRR',
  'GGWKGGGRWKRR',
  'GGGGGGGRRRRR',
  'GGGWGGGRRRRR',
  'GGWWWGGRWWWR',
  'GGGWGGGRRRRR',
  'GGGGGGGRRRRR',
  '.GGGGGGRRRR.',
  '...GGGGRR...',
  'G.g..G.R..r.',
]);

export const SPRITES = {
  bug: [
    art([
      '.R........R.',
      '..R.RRRR.R..',
      '...RRRRRR...',
      'R.RWKRRWKR.R',
      '.RRRRRRRRRR.',
      '...RrRRrR...',
      'R.RRRrrRRR.R',
      '.RRRRRRRRRR.',
      '...RRrrRR...',
      'R..RRRRRR..R',
      '.R..RRRR..R.',
      '............',
    ]),
    art([
      '..R......R..',
      '...RRRRRR...',
      'R..RRRRRR..R',
      '.RRWKRRWKRR.',
      '...RRRRRR...',
      'R.RRrRRrRR.R',
      '.RRRRrrRRRR.',
      '...RRRRRR...',
      'R..RRrrRR..R',
      '.RRRRRRRRRR.',
      '....RRRR....',
      '..R......R..',
    ]),
  ],
  merge,
  mergeLeft: merge.filter((p) => p.x < 7).map((p) => ({ ...p, x: p.x + 2 })),
  mergeRight: merge.filter((p) => p.x >= 7).map((p) => ({ ...p, x: p.x - 3 })),
  friday: art([
    '...AAAAAA...',
    '.AAAAAAAAAA.',
    'AAAWWWWWWAAA',
    'AAWWWWWWWWAA',
    'AAWWWWWWWWAA',
    'AAWWWWWWWWAA',
    'AAWWWWWWWWAA',
    'AAAWWWWWWAAA',
    '.AAAAAAAAAA.',
    'AAaAAaAAaAAa',
    'A.aA.aA.aA.a',
    '............',
  ]),
  notFound: art([
    '...SSSSSS...',
    '.SSs....sSS.',
    'Ss........sS',
    'S.S.SSS.S.S.',
    'S.S.S.S.S.S.',
    'SSS.S.S.SSS.',
    '..S.S.S...S.',
    '..S.SSS...S.',
    'Ss........sS',
    'S..........S',
    'S.ss.ss.ss.S',
    '.S..S..S..S.',
  ]),
};

export const CHECK = art([
  '............',
  '............',
  '............',
  '..........G.',
  '.........GG.',
  '........GG..',
  '.G.....GG...',
  '.GG...GG....',
  '..GG.GG.....',
  '...GGG......',
  '....G.......',
  '............',
]);

export const ICONS: Record<string, Sprite> = {
  loom: art([
    '....YYYY....', '....YYYY....', '.....BB.....', '...BB..BB...',
    '..B......B..', 'YYYY....YYYY', 'YYYY....YYYY', '..B......B..',
    '...BB..BB...', '.....BB.....', '....YYYY....', '....YYYY....',
  ]),
  chat: art([
    '.BBBBBBBBBB.', 'BBBBBBBBBBBB', 'BBBBBBBBBBBB', 'BBWWBWWBWWBB',
    'BBWWBWWBWWBB', 'BBBBBBBBBBBB', 'BBBBBBBBBBBB', '.BBBBBBBBBB.',
    '...BBB......', '...BB.......', '...B........', '............',
  ]),
  sprout: art([
    '............', '..GG....GG..', '.GGGG..GGGG.', '.GgGGGGGGgG.',
    '..GGGGGGGG..', '....GgGG....', '.....GG.....', '.....GG.....',
    'NNNNNNNNNNNN', 'NnNNnNNnNNnN', 'NNNnNNNNnNNN', 'nNNNNnNNNNnN',
  ]),
  branch: art([
    '..YY........', '..YY....YY..', '..GG....YY..', '..GG....GG..',
    '..GG...GG...', '..GG..GG....', '..GGGGG.....', '..GG........',
    '..GG........', '..YY........', '..YY........', '............',
  ]),
  flask: art([
    '....WWWW....', '.....BB.....', '.....BB.....', '.....BB.....',
    '....BBBB....', '...BB..BB...', '..BB....BB..', '..BGGGGGGB..',
    '.BGGYGGYGGB.', '.BGGGGGGGGB.', '.BBBBBBBBBB.', '............',
  ]),
  cap: art([
    '............', '.....YY.....', '...YYYYYY...', '.YYYYYYYYYY.',
    'YYYYYYYYYYYY', '.YYYYYYYYYY.', '...YYYYYY.B.', '..BYYYYYB.B.',
    '..BBBBBBB.B.', '..BBBBBBB.B.', '..........B.', '.........BBB',
  ]),
  robot: art([
    '.....YY.....', '.....BB.....', '.BBBBBBBBBB.', '.BWWBBBBWWB.',
    '.BWKBBBBKWB.', '.BBBBBBBBBB.', '.BBKKKKKKBB.', '.BBBBBBBBBB.',
    '...BB..BB...', '.GGGGGGGGGG.', '.G.GGGGGG.G.', '...GG..GG...',
  ]),
  mail: art([
    '............', 'WWWWWWWWWWWW', 'WBWWWWWWWWBW', 'WWBWWWWWWBWW',
    'WWWBWWWWBWWW', 'WWWWBWWBWWWW', 'WWWWWBBWWWWW', 'WWWWWWWWWWWW',
    'WWWWWWWWWWWW', 'WWWWWWWWWWWW', 'WWWWWWWWWWWW', '............',
  ]),
  case: art([
    '............', '....NNNN....', '....N..N....', 'NNNNNNNNNNNN',
    'NnnnnnnnnnnN', 'NnnnnYYnnnnN', 'NNNNNYYNNNNN', 'NnnnnnnnnnnN',
    'NnnnnnnnnnnN', 'NNNNNNNNNNNN', '............', '............',
  ]),
};
