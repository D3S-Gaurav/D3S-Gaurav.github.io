import type { Metadata } from "next";
import { profile } from "@/data/profile";
import { sectionById, type SectionId } from "@/data/sections";

export function metadataFor(id: SectionId): Metadata {
  const s = sectionById[id];
  const title = id === "home" ? { absolute: s.title } : s.title;
  return {
    title,
    description: s.description,
    alternates: { canonical: s.path },
    openGraph: {
      title: id === "home" ? s.title : `${s.title} — ${profile.name}`,
      description: s.description,
      url: s.path,
      siteName: profile.name,
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: `${profile.name} — deep-ocean portfolio` }],
    },
    twitter: { card: "summary_large_image" },
  };
}
