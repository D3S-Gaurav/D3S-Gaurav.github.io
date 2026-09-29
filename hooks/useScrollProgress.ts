"use client";
import { useEffect, useState } from "react";
import type { SectionId } from "@/data/sections";
import { depthState, subscribeSection } from "@/lib/depth";

/** Current section, re-rendering only when it changes. Continuous depth is read via subscribeDepth. */
export function useCurrentSection(initial: SectionId) {
  const [section, setSection] = useState<SectionId>(initial);
  useEffect(() => {
    setSection(depthState.section);
    return subscribeSection(setSection);
  }, []);
  return section;
}
