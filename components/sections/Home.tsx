"use client";
import { profile } from "@/data/profile";
import { useNavigate } from "@/lib/nav";

export default function Home() {
  const navigate = useNavigate();
  return (
    <section id="home" className="zone zone-home" aria-labelledby="home-title" data-sink>
      <div className="hero">
        <p className="eyebrow">
          <span className="eyebrow-accent">Prologue</span>
          <span aria-hidden="true">·</span>
          <span>A story told in eight depths</span>
        </p>
        <h1 id="home-title" className="hero-name">
          {profile.name}
        </h1>
        <p className="hero-role">
          {profile.role} <span className="hero-handle">a.k.a. {profile.handle}</span>
        </p>
        <p className="hero-focus">
          {profile.focus.map((f) => (
            <span key={f}>{f}</span>
          ))}
        </p>
        <p className="hero-tag">{profile.tagline}</p>
      </div>
      <a
        href="/about/"
        className="descend"
        onClick={(e) => {
          e.preventDefault();
          navigate("about");
        }}
      >
        <span className="descend-line" aria-hidden="true">
          <span />
        </span>
        <span>Scroll to descend</span>
      </a>
    </section>
  );
}
