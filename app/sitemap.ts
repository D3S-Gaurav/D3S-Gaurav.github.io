import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { sections } from "@/data/sections";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return sections.map((s) => ({ url: `${profile.siteUrl}${s.path}`, changeFrequency: "monthly", priority: s.id === "home" ? 1 : 0.7 }));
}
