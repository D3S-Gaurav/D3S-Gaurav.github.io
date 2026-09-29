"use client";
import { forwardRef } from "react";
import type { Project } from "@/data/projects";

const ProjectDialog = forwardRef<HTMLDialogElement, { project: Project; index: number; onClose: () => void }>(
  function ProjectDialog({ project: p, index, onClose }, ref) {
    const titleId = `${p.id}-dialog-title`;
    return (
      <dialog
        ref={ref}
        className="dossier"
        aria-labelledby={titleId}
        onClose={onClose}
        onClick={(e) => {
          // Clicking the backdrop (the dialog element itself) closes it.
          if (e.target === e.currentTarget) (e.currentTarget as HTMLDialogElement).close();
        }}
      >
        <div className="dossier-inner">
          <header className="dossier-head">
            <p className="eyebrow">
              <span>Contact {String(index + 1).padStart(2, "0")}</span>
              <span aria-hidden="true">·</span>
              <span>{p.kind}</span>
              {p.period && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{p.period}</span>
                </>
              )}
            </p>
            <h3 id={titleId}>{p.title}</h3>
            <p className="dossier-sub">{p.subtitle}</p>
            <form method="dialog">
              <button className="dossier-close" aria-label={`Close ${p.title} details`}>
                <span aria-hidden="true">×</span>
              </button>
            </form>
          </header>

          <p className="dossier-hook">{p.hook}</p>
          <p className="dossier-desc">{p.description}</p>

          <section className="dossier-block">
            <h4>Problem</h4>
            <p>{p.problem}</p>
          </section>

          <section className="dossier-block">
            <h4>Technical highlights</h4>
            <ul className="dossier-list">
              {p.technicalHighlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>

          <section className="dossier-block">
            <h4>Stack</h4>
            <ul className="chips">
              {p.technologies.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>

          <div className="dossier-links">
            {p.githubUrl && (
              <a className="btn" href={p.githubUrl} target="_blank" rel="noreferrer">
                Source on GitHub
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            )}
            {p.liveUrl && (
              <a className="btn btn-ghost" href={p.liveUrl} target="_blank" rel="noreferrer">
                Live demo<span className="sr-only"> of {p.title} (opens in new tab)</span>
              </a>
            )}
            {p.links?.map((l) => (
              <a key={l.href} className="btn btn-ghost" href={l.href} target="_blank" rel="noreferrer">
                {l.label}
                <span className="sr-only"> repository (opens in new tab)</span>
              </a>
            ))}
          </div>
        </div>
      </dialog>
    );
  },
);

export default ProjectDialog;
