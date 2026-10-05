// Snapshot of public profiles taken September 2026.
export const STATS_AS_OF = "Sep 2026";

export type Achievement = {
  id: string;
  kicker: string;
  value: string;
  title: string;
  story: string;
  tone: "peach" | "yellow" | "green" | "mauve" | "teal" | "pink";
  href?: string;
  size?: "wide";
};

export const achievements: Achievement[] = [
  {
    id: "worldquant",
    kicker: "Quant research",
    value: "Gold",
    title: "WorldQuant BRAIN — Gold Level certificate",
    story: "More than 10,000 points, earned across 8 alphas that each survived peer review.",
    tone: "yellow",
    size: "wide",
  },
  {
    id: "sebi",
    kicker: "Hackathon",
    value: "Finalist",
    title: "SEBI Hackathon",
    story: "A national-level hackathon hosted by the Securities and Exchange Board of India. He made the final.",
    tone: "peach",
  },
  {
    id: "oppia-access",
    kicker: "Open source",
    value: "Merge access",
    title: "Merge rights at Oppia",
    story: "Two reviewed, merged PRs earned him merge access on Oppia's Dev Workflow team.",
    tone: "mauve",
    href: "https://github.com/oppia/oppia",
  },
  {
    id: "dsa",
    kicker: "Problem solving",
    value: "600+",
    title: "DSA problems solved",
    story: "Across LeetCode, Codeforces, CodeChef and GeeksforGeeks, one timed puzzle at a time.",
    tone: "teal",
  },
  {
    id: "upstream",
    kicker: "Upstream",
    value: "3 merged",
    title: "Patches in production OSS",
    story: "Code now running in Oppia (6.8k★) and FOSSology (1.0k★), with more in review at Karmada and Joomla.",
    tone: "pink",
    href: "https://github.com/pulls?q=author%3AD3S-Gaurav+is%3Amerged",
  },
];

export const codeforces = {
  handle: "ATHEUS",
  href: "https://codeforces.com/profile/ATHEUS",
  maxRating: 1306,
  rank: "Pupil",
  contests: 7,
  bestRank: 682,
};

export const leetcode = {
  handle: "ATHEUS_007",
  href: "https://leetcode.com/u/ATHEUS_007/",
  solved: 393,
  easy: 98,
  medium: 211,
  hard: 84,
};
