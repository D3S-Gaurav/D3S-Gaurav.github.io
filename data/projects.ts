export type Project = {
  id: string;
  title: string;
  subtitle: string;
  kind: "Project" | "Experiment";
  period?: string;
  /** Opening line in the narrative voice. */
  hook: string;
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
    hook: "One goal went in. A swarm came out — planners, researchers, validators — each one visible on a live graph while it worked.",
    description:
      "An orchestration engine that decomposes a goal into a dependency-aware task graph, runs specialist agents concurrently, validates their output and synthesises the answer, streaming every state change to a React Flow UI.",
    problem:
      "Multi-agent LLM runs are slow, opaque and expensive. Loom parallelises the work, shows it happening in real time, and puts a hard budget on context cost per mode.",
    technologies: ["Next.js", "TypeScript", "Go", "Kafka", "gRPC", "Redis", "PostgreSQL", "Temporal", "Stripe"],
    technicalHighlights: [
      "Dependency-aware task DAG with concurrent specialist agents, Zod-validated structured outputs and mode-aware revision loops.",
      "Event pipeline Kafka → Go microservice → gRPC / WebSocket / Prometheus, feeding the UI over WebSocket with SSE fallback and sequence-numbered, idempotent replay.",
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
    hook: "The load test blamed the sockets. He followed the stall further down and found the real culprit waiting in the Prisma connection pool.",
    description:
      "A stateless HTTP/WebSocket chat gateway in full-stack TypeScript where every socket event is compile-time checked and every payload is treated as hostile.",
    problem:
      "Real-time apps usually lose type safety at the socket boundary. ChatFlow keeps one typed contract from server emit to client handler.",
    technologies: ["TypeScript", "React", "Express", "Socket.IO", "Prisma", "PostgreSQL", "Vitest", "k6"],
    technicalHighlights: [
      "Fully typed Socket.IO event contract via TypeScript generics — every emit/on call is compile-time checked.",
      "Zod validation on every payload, scrypt hashing, timing-safe comparison, tiered rate limiting and boot-time env validation.",
      "Cursor pagination over a composite (groupId, createdAt) index, role-based access (Admin / Moderator / Member) with orphan-admin protection, multi-tab presence.",
      "32 Vitest tests across 6 suites in GitHub Actions against live PostgreSQL 17, plus a k6 WebSocket load harness.",
    ],
    githubUrl: "https://github.com/D3S-Gaurav/chat-fullstack",
    form: "nautilus",
  },
  {
    id: "college-predictor",
    title: "CollegePredictor",
    subtitle: "JoSAA / CSAB eligibility from scraped cutoffs",
    kind: "Project",
    period: "2026",
    hook: "The cutoffs lived behind a legacy ASP.NET page that did not want to be read. He taught a real browser to read it anyway.",
    description:
      "Enter a JEE rank, category and preferences; get institutes banded Safe, Likely, Dream or Reach — from cutoff data scraped out of the official JoSAA archive into PostgreSQL.",
    problem:
      "The official archive answers one dropdown combination at a time. \"With rank 12,000, where can I get in?\" took dozens of manual lookups. This answers it in one request.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Playwright", "Recharts"],
    technicalHighlights: [
      "Playwright ETL against an ASP.NET WebForms archive — solved VIEWSTATE corruption, jQuery Chosen dropdowns and client-side validation gates, with retries and failure screenshots.",
      "Four-band confidence model and a composite score out of 110 blending institute tier, branch preference, confidence and rank proximity — pure, unit-tested functions.",
      "Batched cross-year lookups: one findMany over unique tuples instead of one query per row, backed by 8 targeted indexes.",
      "6,135 verified cutoff rows (2024–2025) and 34 tests in CI; the README documents the dataset's current limits honestly.",
    ],
    githubUrl: "https://github.com/D3S-Gaurav/CollegePredictor",
    form: "coral",
  },
  {
    id: "co",
    title: "Co",
    subtitle: "A self-hosting agent runtime",
    kind: "Experiment",
    period: "2026 · in progress",
    hook: "An agent with the keys to its own source code, meant one day to plan, implement, test and ship changes to itself.",
    description:
      "A durable execution runtime built with strict typing, Effect-TS for structured concurrency and sandboxed code execution, laid out as a package monorepo.",
    problem:
      "Letting an agent modify itself safely needs typed state, permissions and a sandbox before it needs a clever planner. Co is being built in that order.",
    technologies: ["Bun", "TypeScript", "Effect-TS", "Drizzle", "PostgreSQL", "Docker Compose", "e2b"],
    technicalHighlights: [
      "Phase 1 complete: database layer, typed repositories and a health API with versioned Drizzle migrations.",
      "Integration tests run against a real Postgres in Docker Compose.",
      "Planned next: tool registry with permissions and an e2b sandbox, then planner, executor and an SSE real-time API.",
    ],
    githubUrl: "https://github.com/D3S-Gaurav/SelfHostingAgent",
    form: "beacon",
  },
];

/** Smaller finds, listed rather than staged in the scene. */
export const smallFinds = [
  {
    title: "Soil Suitability App",
    line: "The agri-tech platform from Chapter II — crop suitability from live sensor data.",
    stack: "Next.js · Python",
    href: "https://github.com/D3S-Gaurav/soil-suitability-app",
  },
  {
    title: "Gmail Mail Parser",
    line: "Groups an inbox by sender and finds unsubscribe links — processed locally over OAuth2.",
    stack: "Python · Flask · Gmail API",
    href: "https://github.com/D3S-Gaurav/Mail_parser",
  },
  {
    title: "Job Tracker",
    line: "A full-stack monorepo for tracking job applications end to end.",
    stack: "Next.js · Express · PostgreSQL",
    href: "https://github.com/D3S-Gaurav/Job-Tracker",
  },
];
