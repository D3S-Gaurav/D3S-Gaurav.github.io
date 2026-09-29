# Kumar Gaurav — Deep Ocean Portfolio

An interactive portfolio where scrolling is a descent from the ocean surface to the trench floor.
Live at **https://d3s-gaurav.github.io**.

## Stack

Next.js (static export) · React · TypeScript · three.js (custom shaders) · plain CSS. No other runtime deps.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`.

## Where things live

| Path | What |
| --- | --- |
| `data/profile.ts` | Name, intro, education, experience, skills, achievements, links |
| `data/projects.ts` | Projects shown as deep-sea "contacts" (add an entry to add a project) |
| `data/hobbies.ts` | Hobbies shown as bioluminescent organisms |
| `data/sections.ts` | Routes, zone names, page titles/descriptions |
| `lib/depth.ts` | Scroll → depth engine (zone mapping, easing, scroll-linked reveals) |
| `lib/settings.tsx` | Quality / particles / intensity / ambient / reduced-motion settings |
| `components/ocean/` | WebGL water column + particles (`OceanCanvas`, `shaders.ts`) and silhouettes |
| `components/sections/` | Home, About, Projects, Hobbies, Settings, Contact |
| `components/navigation/DepthHUD.tsx` | Depth gauge navigation (desktop) / bottom sheet (mobile) |

All content is real HTML outside the canvas, so it stays accessible and indexable. Every route
(`/about`, `/projects`, …) renders the same world and starts at that section's depth.
