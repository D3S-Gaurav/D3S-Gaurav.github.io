export type SectionId = "home" | "about" | "projects" | "hobbies" | "settings" | "contact";

export type Section = {
  id: SectionId;
  label: string;
  path: string;
  zone: string;
  title: string;
  description: string;
};

export const sections: Section[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
    zone: "Surface",
    title: "Kumar Gaurav — Backend / Full Stack Engineer",
    description:
      "Kumar Gaurav (ATHEUS) — backend and full-stack engineer building distributed, real-time systems and AI platforms. Descend through an interactive deep-ocean portfolio.",
  },
  {
    id: "about",
    label: "About",
    path: "/about/",
    zone: "Twilight Zone",
    title: "About",
    description:
      "About Kumar Gaurav: CS undergraduate at BIT Mesra, backend engineer and open-source contributor focused on distributed systems and real-time software.",
  },
  {
    id: "projects",
    label: "Projects",
    path: "/projects/",
    zone: "Deep Ocean",
    title: "Projects",
    description:
      "Projects by Kumar Gaurav: Loom (multi-agent LLM orchestration), ChatFlow (real-time chat), Soil Suitability Platform and open-source work on Karmada, Oppia, Joomla and FOSSology.",
  },
  {
    id: "hobbies",
    label: "Hobbies",
    path: "/hobbies/",
    zone: "Bioluminescent Zone",
    title: "Hobbies",
    description: "What Kumar Gaurav does away from work: competitive programming, open source, gaming and music.",
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings/",
    zone: "Abyss",
    title: "Settings",
    description: "Adjust visual quality, particle density, animation intensity and reduced motion for the portfolio experience.",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact/",
    zone: "Trench",
    title: "Contact",
    description: "Get in touch with Kumar Gaurav — email, GitHub, LinkedIn and resume.",
  },
];

export const sectionById = Object.fromEntries(sections.map((s) => [s.id, s])) as Record<SectionId, Section>;

/** Maximum depth reached at the bottom of the page, in metres (Challenger Deep). */
export const MAX_DEPTH_M = 10935;

/** Non-linear mapping so the shallow zones take up more of the scroll. */
export const depthToMeters = (d: number) => Math.round(MAX_DEPTH_M * Math.pow(Math.min(Math.max(d, 0), 1), 1.9));
