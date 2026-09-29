import type { Skill } from "@/data/profile";

export default function SkillIcon({ skill }: { skill: Skill }) {
  return (
    <li className="skill">
      {skill.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/icons/${skill.icon}.svg`} alt="" width={16} height={16} loading="lazy" />
      ) : (
        <span className="skill-dot" aria-hidden="true" />
      )}
      {skill.name}
    </li>
  );
}
