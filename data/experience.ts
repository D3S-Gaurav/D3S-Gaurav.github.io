export type PullRequest = {
  repo: string;
  href: string;
  stars: string;
  what: string;
  lang: string;
  status: "merged" | "in review" | "reviewed";
};

export type Voyage = {
  id: string;
  role: string;
  org: string;
  period: string;
  mode: string;
  narrative: string[];
  log: string[];
  stack: string[];
  href?: string;
};

export const voyages: Voyage[] = [
  {
    id: "soil",
    role: "Backend Engineer",
    org: "SoilSense (Soil Suitability Platform)",
    period: "Mar 2026 — Present",
    mode: "Team project · Schneider Electric Hackathon 2026",
    narrative: [
      "The probe read the soil — nitrogen, phosphorus, potassium, pH, moisture — and the team needed something to tell farmers what would grow in it, and what to add when it would not.",
      "Gaurav wrote that judgement: a rules engine over 2,200 labelled samples and 22 crops, then made the all-crops check fast enough to run on every reading.",
    ],
    log: [
      "Wrote the crop-suitability rules engine over a 2,200-sample, 22-crop dataset, with tolerance bands (10% on NPK, 0.3 on pH) that map each deficiency to an organic amendment.",
      "Built an all-crops endpoint that loads the dataset once instead of once per crop — the 22-crop scan went from 48 ms to 21 ms (2.3× faster) and 22 client requests became one.",
      "Closed the Gemini analysis route to prompt injection by allow-listing and type-casting the 5 expected sensor fields before anything reaches the prompt.",
      "Migrated the dashboard to Next.js and split the monolithic UI into isolated sensor cards for 500 ms live polling.",
    ],
    stack: ["Python", "FastAPI", "pandas", "Next.js", "React", "Gemini API"],
    href: "https://github.com/D3S-Gaurav/soil-suitability-app",
  },
  {
    id: "oss",
    role: "Open Source Contributor",
    org: "Oppia · FOSSology · Karmada · Joomla · CARE",
    period: "Jan 2026 — Present",
    mode: "Go · TypeScript · PHP · Remote",
    narrative: [
      "Next he went looking for sharp edges in codebases far larger than his own: a CNCF Kubernetes orchestrator, a learning platform used around the world, a CMS behind a slice of the web.",
      "He found them — a CLI that killed its own process instead of returning an error, a style leak that kept coming back, CI jobs quietly overwriting each other's artifacts. At Oppia, two merged PRs earned him merge access on the Dev Workflow team.",
    ],
    log: [
      "Shipped a custom ESLint rule for Oppia that turns undocumented ViewEncapsulation.None into a CI failure — picked up a stalled maintainer request and landed it with 10 RuleTester tests and a 41-file legacy allowlist so CI stayed green.",
      "Replaced fatal os.Exit calls with propagated errors across 4 files of Karmada's karmadactl CLI, making those paths recoverable and testable (in review).",
      "Patched 3 CI defects in Joomla's GitHub Actions pipeline — artifact-name collisions, a flaky Cypress wait and a pcntl_waitpid bitwise bug (in review).",
      "Upgraded FOSSology's Vagrant base box from Ubuntu focal to jammy.",
    ],
    stack: ["Go", "TypeScript", "Angular", "PHP", "GitHub Actions", "Docker", "Vagrant", "ESLint"],
    href: "https://github.com/D3S-Gaurav",
  },
  {
    id: "research",
    role: "Research Intern",
    org: "Birla Institute of Technology, Mesra",
    period: "May 2026 — Jul 2026",
    mode: "NLP · Content moderation",
    narrative: [
      "198,000 comments, four moderation categories, and one that mattered most and appeared least: threats, 2.8% of the data.",
      "He built features a model could not find on its own — threat and identity lexicons, intent patterns, vote controversy — and blended two model families until the rare class stopped hiding.",
    ],
    log: [
      "Combined word and character TF-IDF with 36 engineered signals into an 80k-feature sparse matrix.",
      "Compared Naive Bayes, L1 Logistic Regression and LightGBM under 5-fold stratified CV with class weights.",
      "Blended LightGBM and Logistic Regression (simulated-annealing weights, Nelder-Mead per-class thresholds) to 0.836 macro-F1; threat-class F1 went from 0.23 to 0.65.",
    ],
    stack: ["Python", "scikit-learn", "LightGBM", "pandas", "SciPy"],
    href: "https://github.com/D3S-Gaurav/comment-moderation-nlp",
  },
];

export const pullRequests: PullRequest[] = [
  {
    repo: "oppia/oppia",
    href: "https://github.com/oppia/oppia/pull/26520",
    stars: "6.8k",
    what: "ESLint rule blocking undocumented ViewEncapsulation.None",
    lang: "TypeScript",
    status: "merged",
  },
  {
    repo: "oppia/oppia",
    href: "https://github.com/oppia/oppia/pull/24609",
    stars: "6.8k",
    what: "Fixed classroom-admin text overflow",
    lang: "CSS",
    status: "merged",
  },
  {
    repo: "fossology/fossology",
    href: "https://github.com/fossology/fossology/pull/3391",
    stars: "1.0k",
    what: "Vagrant base box upgrade, focal → jammy",
    lang: "Vagrant",
    status: "merged",
  },
  {
    repo: "karmada-io/karmada",
    href: "https://github.com/karmada-io/karmada/pull/7517",
    stars: "5.7k",
    what: "karmadactl returns errors instead of calling os.Exit",
    lang: "Go",
    status: "in review",
  },
  {
    repo: "joomla/joomla-cms",
    href: "https://github.com/joomla/joomla-cms",
    stars: "5.1k",
    what: "CI artifact collisions, flaky Cypress spec, pcntl_waitpid flags",
    lang: "PHP",
    status: "in review",
  },
  {
    repo: "ohcnetwork/care_fe",
    href: "https://github.com/ohcnetwork/care_fe",
    stars: "623",
    what: "Debug-log cleanup and missing i18n strings",
    lang: "TypeScript",
    status: "reviewed",
  },
];

export const ossStats = [
  { value: "5", label: "upstream orgs" },
  { value: "13", label: "PRs opened" },
  { value: "3", label: "merged upstream" },
  { value: "10", label: "tests on the Oppia lint rule" },
];
