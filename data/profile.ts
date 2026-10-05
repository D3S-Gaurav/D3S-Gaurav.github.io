// All narrative copy is written in a third-person, novel-like voice, but every
// fact in it comes from the resume, GitHub, Codeforces or LeetCode.

export type Skill = { name: string; icon?: string };

export const profile = {
  name: "Kumar Gaurav",
  shortName: "Gaurav",
  handle: "ATHEUS",
  role: "Backend / Full Stack Engineer",
  focus: ["Distributed Systems", "Real-time", "AI Platforms"],
  tagline: "Every system has a surface. He was always more interested in what lay beneath it.",
  location: "Jamshedpur, India",
  email: "kumargauravrocco2724@gmail.com",
  resumeUrl: "/Kumar_Gaurav_Resume.pdf",
  siteUrl: "https://d3s-gaurav.github.io",

  story: [
    "From Jamshedpur, Kumar Gaurav went north to Ranchi to study Computer Science at the Birla Institute of Technology, Mesra. Somewhere between lectures and contest rounds he noticed that the parts of software he liked best were the ones nobody sees — the services, queues and contracts that keep an application standing when something upstream falls over.",
    "So he went looking for them. He built WebSocket gateways where every event is type-checked before it leaves the server, event pipelines that refuse to stall for one slow reader, and an orchestration engine that turns a single goal into a swarm of cooperating agents. When he wasn't building his own, he was reading other people's — and sending patches upstream.",
    "He has a habit: file the issue first, then the PR. He likes the unglamorous work that unblocks people — flaky tests, broken CI matrices, lint rules that erase whole classes of bugs. These days he is going deeper, into distributed systems and into Go.",
  ],

  fieldNotes: [
    { label: "Based in", value: "Jamshedpur, Jharkhand, India" },
    { label: "Studying", value: "B.Tech CSE · BIT Mesra · 2023 – 2027" },
    { label: "CGPA", value: "7.88 / 10" },
    { label: "Currently", value: "Backend Engineer, SoilSense" },
    { label: "Going deeper on", value: "Distributed systems & Go" },
    { label: "Signs his work", value: "ATHEUS" },
  ],

  skills: [
    {
      group: "Languages",
      items: [
        { name: "TypeScript", icon: "typescript" },
        { name: "JavaScript", icon: "javascript" },
        { name: "Python", icon: "python" },
        { name: "Go", icon: "go" },
        { name: "C++", icon: "cplusplus" },
        { name: "SQL" },
        { name: "Bash", icon: "gnubash" },
      ],
    },
    {
      group: "Web",
      items: [
        { name: "React", icon: "react" },
        { name: "Next.js", icon: "nextdotjs" },
        { name: "Node.js", icon: "nodedotjs" },
        { name: "Express", icon: "express" },
        { name: "FastAPI", icon: "fastapi" },
        { name: "Socket.IO", icon: "socketdotio" },
        { name: "Zod", icon: "zod" },
        { name: "Bun", icon: "bun" },
      ],
    },
    {
      group: "Data",
      items: [
        { name: "PostgreSQL", icon: "postgresql" },
        { name: "Prisma", icon: "prisma" },
        { name: "Redis", icon: "redis" },
        { name: "Kafka", icon: "apachekafka" },
      ],
    },
    {
      group: "Infra",
      items: [
        { name: "Docker", icon: "docker" },
        { name: "GitHub Actions", icon: "githubactions" },
        { name: "Linux", icon: "linux" },
        { name: "Git", icon: "git" },
        { name: "gRPC" },
      ],
    },
  ] satisfies { group: string; items: Skill[] }[],

  links: [
    { label: "GitHub", value: "D3S-Gaurav", href: "https://github.com/D3S-Gaurav" },
    { label: "LinkedIn", value: "kumar-gaurav-cs", href: "https://www.linkedin.com/in/kumar-gaurav-cs" },
    { label: "Codeforces", value: "ATHEUS", href: "https://codeforces.com/profile/ATHEUS" },
    { label: "LeetCode", value: "ATHEUS_007", href: "https://leetcode.com/u/ATHEUS_007/" },
  ],
} as const;

export type Profile = typeof profile;
