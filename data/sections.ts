export type SectionId =
  | "home"
  | "about"
  | "experience"
  | "projects"
  | "achievements"
  | "hobbies"
  | "settings"
  | "contact";

export type Section = {
  id: SectionId;
  label: string;
  path: string;
  zone: string;
  /** "Prologue", "Chapter I", … */
  chapter: string;
  /** Novel-style chapter title shown as the section heading. */
  heading: string;
  title: string;
  description: string;
};

export const sections: Section[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
    zone: "Surface",
    chapter: "Prologue",
    heading: "Kumar Gaurav",
    title: "Kumar Gaurav — Backend / Full Stack Engineer",
    description:
      "Kumar Gaurav (ATHEUS) — backend and full-stack engineer building distributed, real-time systems and AI platforms. A portfolio told as a descent into the deep ocean.",
  },
  {
    id: "about",
    label: "About",
    path: "/about/",
    zone: "Sunlit Zone",
    chapter: "Chapter I",
    heading: "Beneath the Surface",
    title: "About",
    description:
      "About Kumar Gaurav: CS undergraduate at BIT Mesra, backend engineer and open-source contributor drawn to distributed systems and real-time software.",
  },
  {
    id: "experience",
    label: "Experience",
    path: "/experience/",
    zone: "Twilight Zone",
    chapter: "Chapter II",
    heading: "The Voyages",
    title: "Experience",
    description:
      "Kumar Gaurav's experience: backend engineer on an agri-tech AI platform, and open-source contributor to Oppia, FOSSology, Karmada, Joomla and CARE.",
  },
  {
    id: "projects",
    label: "Projects",
    path: "/projects/",
    zone: "Midnight Zone",
    chapter: "Chapter III",
    heading: "Things Found in the Dark",
    title: "Projects",
    description:
      "Projects by Kumar Gaurav: Loom (multi-agent LLM orchestration), ChatFlow (real-time chat), CollegePredictor (JoSAA cutoff ETL) and Co (self-hosting agent runtime).",
  },
  {
    id: "achievements",
    label: "Achievements",
    path: "/achievements/",
    zone: "The Wreck",
    chapter: "Chapter IV",
    heading: "Salvage",
    title: "Achievements",
    description:
      "Achievements: WorldQuant BRAIN Gold, SEBI Hackathon finalist, Codeforces and LeetCode records, and merged upstream open-source work.",
  },
  {
    id: "hobbies",
    label: "Hobbies",
    path: "/hobbies/",
    zone: "Bioluminescent Zone",
    chapter: "Chapter V",
    heading: "Living Light",
    title: "Hobbies",
    description: "What Kumar Gaurav does away from work: competitive programming, open source, gaming and music.",
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings/",
    zone: "Abyss",
    chapter: "Interlude",
    heading: "The Instrument Panel",
    title: "Settings",
    description: "Adjust visual quality, particle density, animation intensity and reduced motion for the portfolio experience.",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact/",
    zone: "Trench",
    chapter: "Epilogue",
    heading: "Let's build something.",
    title: "Contact",
    description: "Get in touch with Kumar Gaurav — email, GitHub, LinkedIn and resume.",
  },
];

export const sectionById = Object.fromEntries(sections.map((s) => [s.id, s])) as Record<SectionId, Section>;

/** Maximum depth reached at the bottom of the page, in metres (Challenger Deep). */
export const MAX_DEPTH_M = 10935;

/** Non-linear mapping so the shallow zones take up more of the scroll. */
export const depthToMeters = (d: number) => Math.round(MAX_DEPTH_M * Math.pow(Math.min(Math.max(d, 0), 1), 1.9));
