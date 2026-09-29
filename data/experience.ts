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
    org: "Soil Suitability Platform",
    period: "Jan 2026 — Present",
    mode: "Agri-Tech / AI · Remote",
    narrative: [
      "The platform read the soil — nitrogen, phosphorus, potassium, pH, moisture — and told farmers what would grow in it. The trouble was that it had been built as one piece. When the AI model went down, everything went down with it.",
      "Gaurav cut it apart. Three stateless services now stand where one stood before, and a model outage dims a single feature instead of the whole app.",
    ],
    log: [
      "Split the FastAPI backend into 3 isolated microservices — sensor ingestion, crop lookup and Gemini-powered analysis — behind a dedicated health-check endpoint.",
      "Closed the AI route to prompt injection by allow-listing and type-casting the 5 expected sensor fields and discarding everything else before it reached the prompt.",
      "Rebuilt the React/Next.js dashboard on a 500 ms refresh cycle with live NPK, pH, moisture and climate readings and per-crop suitability verdicts.",
      "Wrote a tolerance-buffered rules engine (10% band on NPK, 0.3 on pH) that maps deficiencies to a deduplicated organic-amendment lookup.",
    ],
    stack: ["Python", "FastAPI", "Next.js", "React", "PostgreSQL", "Gemini API"],
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
      "Wrote a custom ESLint rule for Oppia that turns undocumented ViewEncapsulation.None into a CI failure — filed the bug, proposed the fix, shipped it.",
      "Replaced fatal os.Exit calls with propagated errors across 4 files of Karmada's karmadactl CLI, making those paths recoverable and testable (in review).",
      "Patched 3 CI defects in Joomla's GitHub Actions pipeline — artifact-name collisions, a flaky Cypress wait and a pcntl_waitpid bitwise bug (in review).",
      "Upgraded FOSSology's Vagrant base box from Ubuntu focal to jammy.",
    ],
    stack: ["Go", "TypeScript", "Angular", "PHP", "GitHub Actions", "Docker", "Vagrant", "ESLint"],
    href: "https://github.com/D3S-Gaurav",
  },
];

export const pullRequests: PullRequest[] = [
  {
    repo: "oppia/oppia",
    href: "https://github.com/oppia/oppia",
    stars: "6.7k",
    what: "ESLint rule banning undocumented ViewEncapsulation.None",
    lang: "TypeScript",
    status: "merged",
  },
  {
    repo: "oppia/oppia",
    href: "https://github.com/oppia/oppia",
    stars: "6.7k",
    what: "Fixed classroom-field text overflow",
    lang: "CSS",
    status: "merged",
  },
  {
    repo: "fossology/fossology",
    href: "https://github.com/fossology/fossology",
    stars: "1.0k",
    what: "Vagrant base box upgrade, focal → jammy",
    lang: "Vagrant",
    status: "merged",
  },
  {
    repo: "karmada-io/karmada",
    href: "https://github.com/karmada-io/karmada",
    stars: "5.5k",
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
  { value: "19k+", label: "combined stars" },
];
