"use client";
import { profile } from "@/data/profile";
import { MAX_DEPTH_M } from "@/data/sections";
import { useNavigate } from "@/lib/nav";
import ZoneHeader from "./ZoneHeader";

export default function Contact() {
  const navigate = useNavigate();
  return (
    <section id="contact" className="zone zone-contact" aria-labelledby="contact-title">
      <div className="contact-inner">
        <ZoneHeader id="contact" />
        <div data-reveal className="contact-body">
          <p className="contact-note">
            Every descent ends somewhere. This one ends with an invitation: he is open to backend and full-stack roles,
            internships and open-source collaboration — and the surface is only an email away.
          </p>
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <ul className="contact-links">
            {profile.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  <span className="contact-link-label">{l.label}</span>
                  <span className="contact-link-value">{l.value}</span>
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <a href={profile.resumeUrl} download>
                <span className="contact-link-label">Resume</span>
                <span className="contact-link-value">PDF</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="seafloor" aria-hidden="true">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
          <path d="M0 150C120 120 200 160 320 140s220-60 330-30 160 70 290 50 210-90 330-70 130 40 170 30V220H0z" />
          <path className="seafloor-near" d="M0 190c160-20 260 10 420-5s250-40 420-10 300 30 400 5 160-10 200-5V220H0z" />
        </svg>
      </div>

      <footer className="site-footer">
        <p>
          {MAX_DEPTH_M.toLocaleString("en-US")} m · You reached the bottom.
        </p>
        <p>
          © {new Date().getFullYear()} {profile.name} ·{" "}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("home");
            }}
          >
            Return to surface ↑
          </a>
        </p>
      </footer>
    </section>
  );
}
