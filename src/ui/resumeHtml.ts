// The plain resume, built from content.json at build time.
import content from '../../content/content.json';

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

type Entry = (typeof content.projects)[number];

function entry(item: Entry) {
  const links = item.links
    .map((l) => `<a href="${esc(l.href)}" rel="noopener">${esc(l.label)}</a>`)
    .join(' · ');
  return `<article>
    <h3>${esc(item.title)}</h3>
    <p class="meta">${esc(item.role)}${item.dates ? ` · ${esc(item.dates)}` : ''}</p>
    <ul>${item.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
    <p class="meta">${esc(item.stack.join(', '))}${links ? ` · ${links}` : ''}</p>
  </article>`;
}

const section = (title: string, kind: string) =>
  `<section><h2>${title}</h2>${content.projects.filter((p) => p.kind === kind).map(entry).join('')}</section>`;

export function resumeHtml() {
  const p = content.profile;
  return `<nav class="resume-nav">
    <a class="resume-back" href="#">Back to the game</a>
    <a href="${esc(p.resumePdf)}" download>Download PDF</a>
  </nav>
  <header>
    <h1>${esc(p.name)}</h1>
    <p>${esc(p.title)}</p>
    <p><a href="mailto:${esc(p.email)}">${esc(p.email)}</a> · <a href="${esc(p.linkedin)}" rel="noopener">LinkedIn</a> · <a href="${esc(p.github)}" rel="noopener">GitHub</a> · Codeforces: ${esc(p.codeforces)} · LeetCode: ${esc(p.leetcode)}</p>
    <p>${esc(p.availability)}</p>
  </header>
  ${section('Experience', 'experience')}
  ${section('Projects', 'project')}
  ${section('More projects', 'more')}
  <section><h2>Achievements</h2><ul>${content.achievements.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></section>
  <section><h2>Skills</h2><dl>${content.skills
    .map((s) => `<div><dt>${esc(s.name)}</dt><dd>${esc(s.items.join(', '))}</dd></div>`)
    .join('')}</dl></section>
  <section><h2>Education</h2>
    <h3>${esc(p.collegeFull)}</h3>
    <p class="meta">${esc(p.degreeFull)} · CGPA ${esc(p.cgpa)} · ${esc(p.educationDates)}</p>
  </section>`;
}
