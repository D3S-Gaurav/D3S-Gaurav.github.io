"use client";
import { useRef } from "react";
import { projects, smallFinds, type Project } from "@/data/projects";
import Specimen from "@/components/ui/Specimen";
import ProjectDialog from "@/components/ui/ProjectDialog";
import ZoneHeader from "./ZoneHeader";

function Discovery({ project, index }: { project: Project; index: number }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const open = () => {
    dialog.current?.showModal();
    document.documentElement.dataset.inspecting = "true";
  };
  const bearing = String((index * 97 + 42) % 360).padStart(3, "0");

  return (
    <article className={`discovery discovery-${index % 2 ? "right" : "left"}`} aria-labelledby={`${project.id}-title`}>
      <div className="specimen" data-near onClick={open}>
        <div className="specimen-glow" aria-hidden="true" />
        <Specimen form={project.form} />
      </div>
      <div className="discovery-info" data-reveal>
        <p className="eyebrow">
          <span>Contact {String(index + 1).padStart(2, "0")}</span>
          <span aria-hidden="true">·</span>
          <span>Bearing {bearing}°</span>
          <span aria-hidden="true">·</span>
          <span>{project.kind}</span>
        </p>
        <h3 id={`${project.id}-title`}>{project.title}</h3>
        <p className="discovery-sub">{project.subtitle}</p>
        <p className="discovery-hook">{project.hook}</p>
        <p className="discovery-desc">{project.description}</p>
        <ul className="chips chips-quiet">
          {project.technologies.slice(0, 5).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <button type="button" className="btn" onClick={open} aria-haspopup="dialog">
          Inspect<span className="sr-only"> {project.title}</span>
        </button>
      </div>
      <ProjectDialog ref={dialog} project={project} index={index} onClose={() => delete document.documentElement.dataset.inspecting} />
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="zone zone-projects" aria-labelledby="projects-title">
      <ZoneHeader
        id="projects"
        lede={`Past a thousand metres, sunlight gives up. Sonar reports ${projects.length} contacts in range — each something he built. Approach one to light it; inspect it to read the log.`}
      />
      <div className="discoveries">
        {projects.map((p, i) => (
          <Discovery key={p.id} project={p} index={i} />
        ))}
      </div>

      <div className="small-finds" data-reveal>
        <h3 className="label">Smaller finds</h3>
        <ul>
          {smallFinds.map((f) => (
            <li key={f.title}>
              <a href={f.href} target="_blank" rel="noreferrer">
                <span className="small-title">{f.title}</span>
                <span className="small-line">{f.line}</span>
                <span className="small-stack">{f.stack}</span>
                <span className="sr-only"> (opens GitHub in new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
