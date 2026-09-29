export type Project = {
  id: string;
  title: string;
  subtitle: string;
  kind: "Project" | "Experience" | "Open Source";
  period: string;
  description: string;
  problem: string;
  technologies: string[];
  technicalHighlights: string[];
  githubUrl?: string;
  liveUrl?: string;
  /** Visual form of the object in the deep-ocean scene. */
  form: "station" | "nautilus" | "coral" | "beacon";
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "loom",
    title: "Loom",
    subtitle: "Real-time multi-agent LLM orchestration",
    kind: "Project",
    period: "Apr – May 2026",
    description:
      "An orchestration engine that decomposes a goal into a dependency-aware task graph and runs specialist agents concurrently, streaming every state change to a live graph UI.",
    problem:
      "Multi-agent LLM runs are slow, opaque and expensive. Loom parallelises the work, shows it happening in real time, and bounds context cost per mode.",
    technologies: ["Next.js", "TypeScript", "Go", "Kafka", "gRPC", "Redis", "PostgreSQL", "Stripe"],
    technicalHighlights: [
      "Dependency-aware task DAG with concurrent specialist agents, Zod-validated structured outputs and automatic revision loops.",
      "Event pipeline Kafka → Go microservice → gRPC / WebSocket / Prometheus, feeding a React Flow UI over WebSocket with SSE fallback and sequence-numbered, idempotent replay.",
      "Non-blocking Go fan-out hub with per-subscriber buffered channels that evicts slow consumers instead of stalling the Kafka poll loop — verified with -race tests over gRPC bufconn.",
      "Mode-scoped token budgets (Low / Auto / Max), SSRF-safe GitHub fetching and prompt-injection-resistant vision context extraction.",
    ],
    githubUrl: "https://github.com/D3S-Gaurav/Loom",
    form: "station",
  },
  {
    id: "chatflow",
    title: "ChatFlow",
    subtitle: "Real-time, distributed group chat",
    kind: "Project",
    period: "May – Jun 2026",
    description:
      "A stateless HTTP/WebSocket chat gateway in full-stack TypeScript where every socket event is compile-time checked.",
    problem:
      "Real-time apps usually lose type safety at the socket boundary. ChatFlow keeps one typed contract from server emit to client handler, and treats every payload as hostile.",
    technologies: ["TypeScript", "React", "Express", "Socket.IO", "Prisma", "PostgreSQL", "Vitest", "k6"],
    technicalHighlights: [
      "Fully typed Socket.IO event contract via TypeScript generics — every emit/on call is compile-time checked.",
      "Zod validation on every payload, scrypt hashing, timing-safe comparison, tiered rate limiting and boot-time env validation.",
      "Cursor-based pagination and role-based access control (Admin / Moderator / Member) with orphan-admin protection and multi-tab presence.",
      "32 Vitest unit + integration tests across 6 suites in GitHub Actions against live PostgreSQL 17, plus a k6 WebSocket load harness.",
    ],
    githubUrl: "https://github.com/D3S-Gaurav/chat-fullstack",
    form: "nautilus",
  },
  {
    id: "soil",
    title: "Soil Suitability Platform",
    subtitle: "Backend engineer · Agri-tech / AI",
    kind: "Experience",
    period: "Jan 2026 – Present",
    description:
      "A platform that turns live soil-sensor readings into per-crop suitability verdicts and organic-amendment recommendations.",
    problem:
      "A single monolithic backend meant an AI model outage took down the whole app, and raw sensor input flowed straight into an LLM prompt.",
    technologies: ["Python", "FastAPI", "Next.js", "React", "PostgreSQL", "Gemini API"],
    technicalHighlights: [
      "Split the backend into 3 isolated, stateless microservices (sensor ingestion, crop lookup, Gemini analysis) with a health-check endpoint — a model outage now degrades one feature, not the app.",
      "Hardened the AI route against prompt injection by allow-listing and type-casting the 5 expected sensor fields and discarding everything else.",
      "Dashboard on a 500 ms refresh cycle with live NPK / pH / moisture / climate readings and per-crop verdicts.",
      "Tolerance-buffered rules engine (10% band on NPK, 0.3 on pH) mapping deficiencies to a deduplicated amendment lookup.",
    ],
    githubUrl: "https://github.com/D3S-Gaurav/soil-suitability-app",
    form: "coral",
  },
  {
    id: "open-source",
    title: "Open Source",
    subtitle: "Karmada · Oppia · Joomla · FOSSology",
    kind: "Open Source",
    period: "Jan 2026 – Present",
    description:
      "Upstream contributions to distributed-systems and CLI tooling, developer workflow and CI/CD across four projects with 18k+ combined stars.",
    problem:
      "Mature projects accumulate sharp edges — fatal exits, flaky pipelines, recurring bug classes. These fixes make them recoverable, testable and enforced by CI.",
    technologies: ["Go", "TypeScript", "Angular", "PHP", "GitHub Actions", "Docker", "Vagrant", "ESLint"],
    technicalHighlights: [
      "Karmada (CNCF): replaced fatal os.Exit calls with propagated errors across 4 files of the karmadactl CLI, making process-terminating paths recoverable and testable.",
      "Oppia: 2 merged PRs after maintainer review, earning merge access for the Dev Workflow team; wrote a custom ESLint rule that turns undocumented ViewEncapsulation.None into a CI failure.",
      "Joomla CMS: fixed 3 GitHub Actions defects — artifact-name collisions, a flaky Cypress wait and a pcntl waitpid bitwise bug.",
      "FOSSology: shipped a Docker/Vagrant base-box upgrade from Ubuntu focal to jammy.",
    ],
    githubUrl: "https://github.com/D3S-Gaurav",
    links: [
      { label: "Karmada", href: "https://github.com/karmada-io/karmada" },
      { label: "Oppia", href: "https://github.com/oppia/oppia" },
      { label: "Joomla", href: "https://github.com/joomla/joomla-cms" },
      { label: "FOSSology", href: "https://github.com/fossology/fossology" },
    ],
    form: "beacon",
  },
];
