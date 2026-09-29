export type Hobby = {
  id: string;
  title: string;
  line: string;
  detail: string;
  /** Bioluminescent organism used to represent the hobby. */
  organism: "jelly" | "siphonophore" | "comb" | "radiolarian";
  hue: number;
  link?: { label: string; href: string };
};

// Gaming and Music copy is intentionally generic — replace with your own specifics.
export const hobbies: Hobby[] = [
  {
    id: "cp",
    title: "Competitive Programming",
    line: "Timed puzzles, under pressure.",
    detail:
      "When the clock starts, he stops being Gaurav and becomes ATHEUS — 500+ problems across Codeforces and LeetCode, and a best finish of #682 in a Div. 2 round.",
    organism: "comb",
    hue: 267,
    link: { label: "Codeforces profile", href: "https://codeforces.com/profile/ATHEUS" },
  },
  {
    id: "oss",
    title: "Open Source",
    line: "Reading other people's code, for fun.",
    detail:
      "For him, a stranger's monorepo is a map of a city he has never visited. He walks it until he finds something to fix.",
    organism: "siphonophore",
    hue: 170,
    link: { label: "GitHub", href: "https://github.com/D3S-Gaurav" },
  },
  {
    id: "gaming",
    title: "Gaming",
    line: "How he switches off.",
    detail: "When the terminal closes, a game opens. It is where he goes to switch off.",
    organism: "jelly",
    hue: 316,
  },
  {
    id: "music",
    title: "Music",
    line: "Always something playing.",
    detail: "There is almost always something playing while he builds — the soundtrack to most of the code on this page.",
    organism: "radiolarian",
    hue: 199,
  },
];
