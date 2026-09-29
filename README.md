# Kumar Gaurav — Deep Ocean Portfolio

An interactive portfolio where scrolling is a descent from the ocean surface to the trench floor.
Live at **https://d3s-gaurav.github.io**.

## Stack

Next.js (static export) · React · TypeScript · three.js (custom shaders) · plain CSS. No other runtime deps.
Palette is Catppuccin Mocha; skill icons are self-hosted from Simple Icons in `public/icons/`.

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
| `data/profile.ts` | Name, the About story (third-person narrative), field notes, skills + icons, links |
| `data/experience.ts` | Voyages (roles) and the upstream open-source PR ledger |
| `data/achievements.ts` | Achievement plaques and Codeforces / LeetCode snapshots |
| `data/projects.ts` | Projects shown as deep-sea "contacts", plus the smaller-finds list |
| `data/hobbies.ts` | Hobbies shown as bioluminescent organisms |
| `data/sections.ts` | Routes, chapter names/headings, zone names, page titles/descriptions |
| `lib/depth.ts` | Scroll → depth engine (zone mapping, easing, scroll-linked reveals) |
| `lib/settings.tsx` | Quality / particles / intensity / ambient / reduced-motion settings |
| `components/ocean/` | WebGL water column + particles (`OceanCanvas`, `shaders.ts`) and silhouettes |
| `components/sections/` | Home, About, Projects, Hobbies, Settings, Contact |
| `components/navigation/DepthHUD.tsx` | Depth gauge navigation (desktop) / bottom sheet (mobile) |

All content is real HTML outside the canvas, so it stays accessible and indexable. Every route
(`/about`, `/projects`, …) renders the same world and starts at that section's depth.
