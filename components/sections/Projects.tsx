"use client";
import { useRef } from "react";
import { projects, type Project } from "@/data/projects";
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
        title="Projects"
        lede={`Sonar has ${projects.length} contacts in range. Approach one to illuminate it; inspect it to read the log.`}
      />
      <div className="discoveries">
        {projects.map((p, i) => (
          <Discovery key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
