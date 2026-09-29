"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useLayoutEffect } from "react";
import { sectionById, sections, type SectionId } from "@/data/sections";
import { profile } from "@/data/profile";
import { measure, sectionTop, setInstant, startDepthLoop, stopDepthLoop, subscribeDepth, subscribeSection } from "@/lib/depth";
import { NavContext } from "@/lib/nav";
import { SettingsProvider, useSettings } from "@/lib/settings";
import DepthHUD from "./navigation/DepthHUD";
import Creatures from "./ocean/Creatures";
import Home from "./sections/Home";
import About from "./sections/About";
import Voyages from "./sections/Experience";
import Projects from "./sections/Projects";
import Achievements from "./sections/Achievements";
import Hobbies from "./sections/Hobbies";
import Settings from "./sections/Settings";
import Contact from "./sections/Contact";

// three.js is loaded after first paint; the CSS backdrop covers the gap.
const OceanCanvas = dynamic(() => import("./ocean/OceanCanvas"), { ssr: false });

const titleFor = (id: SectionId) => (id === "home" ? sectionById.home.title : `${sectionById[id].title} — ${profile.name}`);

const normalise = (p: string) => (p.endsWith("/") ? p : `${p}/`);
const sectionForPath = (pathname: string) => sections.find((s) => normalise(s.path) === normalise(pathname))?.id ?? "home";

function World({ initial }: { initial: SectionId }) {
  const { reducedMotion } = useSettings();

  useEffect(() => setInstant(reducedMotion), [reducedMotion]);

  const navigate = useCallback(
    (id: SectionId) => {
      measure();
      window.scrollTo({ top: sectionTop(id), behavior: reducedMotion ? "auto" : "smooth" });
      const path = sectionById[id].path;
      if (normalise(location.pathname) !== normalise(path)) history.pushState({ id }, "", path);
      // Move focus to the section heading for keyboard and screen-reader users.
      const heading = document.getElementById(`${id}-title`);
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
    },
    [reducedMotion],
  );

  // Enter at the depth matching the URL before the first paint.
  useLayoutEffect(() => {
    history.scrollRestoration = "manual";
    measure();
    if (initial !== "home") window.scrollTo(0, sectionTop(initial));
    startDepthLoop();
    return stopDepthLoop;
  }, [initial]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    document.fonts?.ready.then(() => {
      const target = sectionForPath(location.pathname);
      measure();
      if (target !== "home" && window.scrollY < 4) window.scrollTo(0, sectionTop(target));
    });

    const offSection = subscribeSection((id) => {
      const path = sectionById[id].path;
      if (normalise(location.pathname) !== normalise(path)) history.replaceState({ id }, "", path);
      document.title = titleFor(id);
    });

    // Fallback backdrop tracks depth in case WebGL is unavailable.
    let lastD = -1;
    const offDepth = subscribeDepth(({ depth }) => {
      if (Math.abs(depth - lastD) > 0.002) {
        lastD = depth;
        document.documentElement.style.setProperty("--d", depth.toFixed(3));
      }
    });

    const onPop = () => {
      measure();
      window.scrollTo({ top: sectionTop(sectionForPath(location.pathname)) });
    };
    window.addEventListener("popstate", onPop);

    return () => {
      ro.disconnect();
      offSection();
      offDepth();
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  return (
    <NavContext.Provider value={navigate}>
      <div className="backdrop" aria-hidden="true" />
      <OceanCanvas />
      <Creatures />
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <DepthHUD initial={initial} />
      <main className="world">
        <Home />
        <About />
        <Voyages />
        <Projects />
        <Achievements />
        <Hobbies />
        <Settings />
        <Contact />
      </main>
    </NavContext.Provider>
  );
}

export default function Experience({ initial }: { initial: SectionId }) {
  return (
    <SettingsProvider>
      <World initial={initial} />
    </SettingsProvider>
  );
}
