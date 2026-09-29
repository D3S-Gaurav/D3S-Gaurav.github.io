export const profile = {
  name: "Kumar Gaurav",
  handle: "ATHEUS",
  role: "Backend / Full Stack Engineer",
  focus: ["Distributed Systems", "Real-time", "AI Platforms"],
  tagline: "Building things worth exploring.",
  location: "Jamshedpur, Jharkhand, India",
  email: "kumargaurav122004@gmail.com",
  resumeUrl: "/Kumar_Gaurav_Resume.pdf",
  siteUrl: "https://d3s-gaurav.github.io",

  intro:
    "I'm a Computer Science undergraduate at BIT Mesra who likes the parts of software you don't see: the services, pipelines and contracts that keep an app standing when something upstream falls over.",
  introMore:
    "Most of what I build is backend-heavy and real-time — WebSocket gateways, event pipelines, LLM orchestration — and I spend my spare cycles contributing to open-source infrastructure and solving algorithm problems.",

  education: {
    school: "Birla Institute of Technology, Mesra",
    place: "Ranchi, Jharkhand",
    degree: "B.Tech, Computer Science and Engineering",
    period: "Aug 2023 – May 2027 (expected)",
    detail: "CGPA 7.88 / 10",
  },

  interests: [
    "Distributed systems that degrade gracefully instead of failing loudly",
    "Real-time transport: WebSockets, event streams, idempotent replay",
    "Type-safe contracts end to end — from payload validation to the UI",
    "LLM systems with bounded cost and hardened inputs",
  ],

  experience: [
    {
      role: "Backend Engineer",
      org: "Soil Suitability Platform",
      kind: "Agri-Tech / AI platform · Remote",
      period: "Jan 2026 – Present",
      summary:
        "Split a FastAPI backend into isolated, stateless microservices and hardened the Gemini-powered analysis route against prompt injection.",
    },
    {
      role: "Open Source Contributor",
      org: "Karmada · Oppia · Joomla · FOSSology",
      kind: "Go, TypeScript, PHP · Remote",
      period: "Jan 2026 – Present",
      summary:
        "Distributed-systems and CLI tooling fixes, lint rules and CI/CD repairs across four upstream projects with 18k+ combined stars.",
    },
  ],

  skills: [
    { group: "Languages", items: ["Python", "Java", "JavaScript", "TypeScript", "Go", "C++", "SQL", "Bash"] },
    { group: "Web", items: ["React", "Next.js", "Node.js", "Express", "REST", "Socket.IO", "Zod"] },
    { group: "Data", items: ["PostgreSQL", "MySQL", "MongoDB", "Prisma", "Redis", "Kafka"] },
    { group: "Tooling", items: ["Git", "GitHub Actions", "Docker", "Linux", "gRPC"] },
    { group: "Concepts", items: ["DSA", "OOP", "Distributed Systems", "WebSockets", "TCP/IP"] },
  ],

  achievements: [
    { value: "500+", label: "DSA problems solved on Codeforces & LeetCode" },
    { value: "#682", label: "Rank in a Codeforces Div. 2 round" },
    { value: "Finalist", label: "SEBI Hackathon (national level)" },
    { value: "Gold", label: "WorldQuant BRAIN — 10,000+ points, 8 alphas" },
  ],

  links: [
    { label: "GitHub", value: "D3S-Gaurav", href: "https://github.com/D3S-Gaurav" },
    { label: "LinkedIn", value: "kumar-gaurav-cs", href: "https://www.linkedin.com/in/kumar-gaurav-cs" },
    { label: "Codeforces", value: "ATHEUS", href: "https://codeforces.com/profile/ATHEUS" },
    { label: "LeetCode", value: "ATHEUS_007", href: "https://leetcode.com/u/ATHEUS_007/" },
  ],
} as const;

export type Profile = typeof profile;
