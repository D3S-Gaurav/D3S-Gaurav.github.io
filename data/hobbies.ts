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
      "500+ problems across Codeforces and LeetCode, with a best of rank 682 in a Codeforces Div. 2 round. I compete as ATHEUS.",
    organism: "comb",
    hue: 186,
    link: { label: "Codeforces profile", href: "https://codeforces.com/profile/ATHEUS" },
  },
  {
    id: "oss",
    title: "Open Source",
    line: "Reading other people's code for fun.",
    detail:
      "Contributing to Karmada, Oppia, Joomla and FOSSology — the best way I know to learn how large codebases are actually run.",
    organism: "siphonophore",
    hue: 160,
    link: { label: "GitHub", href: "https://github.com/D3S-Gaurav" },
  },
  {
    id: "gaming",
    title: "Gaming",
    line: "How I switch off.",
    detail: "Games are where I unwind after a long session at the keyboard.",
    organism: "jelly",
    hue: 205,
  },
  {
    id: "music",
    title: "Music",
    line: "Always something playing.",
    detail: "Music is the constant background to most of my building sessions.",
    organism: "radiolarian",
    hue: 172,
  },
];
