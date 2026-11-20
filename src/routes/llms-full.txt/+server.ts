import {
  formatMonth,
  jobDuration,
  skillCategories,
} from "#lib/cv.js";
import { jobs } from "#lib/content/jobs.js";
import { profile } from "#lib/content/profile.js";
import { schools } from "#lib/content/schools.js";

export const prerender = true;

const SITE = "https://www.erik-aouizerate.me";

function jobTitle(title: string): string {
  return title.replace(/\s+–\s*$/, "").trim();
}

export function GET(): Response {
  const lines: string[] = [];

  lines.push(`# ${profile.name} — CV`, "");
  lines.push(`> ${profile.summary}`, "");
  lines.push(`**${profile.title}**`, "");
  lines.push(profile.english, "");

  lines.push("## Contact", "");
  for (const contact of profile.contacts) {
    lines.push(`- [${contact.label}](${contact.href})`);
  }
  lines.push("");

  lines.push("## Compétences", "");
  for (const category of skillCategories) {
    lines.push(`### ${category.title}`, "");
    for (const skill of category.skills.filter((item) => item.default)) {
      lines.push(`- ${skill.label}`);
    }
    lines.push("");
  }

  lines.push("## Expériences professionnelles", "");
  for (const job of jobs.filter((item) => item.default || item.small)) {
    const period = job.end
      ? `${formatMonth(job.start)} – ${formatMonth(job.end)}`
      : `${formatMonth(job.start)} – présent`;
    const duration = jobDuration(job);
    lines.push(`### ${jobTitle(job.title)}`, "");
    lines.push(`${period} (${duration})`, "");
    if (job.default) {
      lines.push(job.description, "");
      for (const task of job.tasks ?? []) {
        lines.push(`- ${task}`);
      }
      lines.push("");
    }
    lines.push(`Outils : ${job.tools.join(", ")}`, "");
  }

  lines.push("## Formations", "");
  for (const school of schools) {
    const subtitle = school.subtitle ? ` — ${school.subtitle}` : "";
    lines.push(
      `- **${school.year} — ${school.title}**, ${school.school}${subtitle}`,
    );
  }
  lines.push("");

  lines.push("## Liens", "");
  lines.push(`- CV statique : ${SITE}/`);
  lines.push(`- Version interactive : ${SITE}/studio`);
  lines.push(`- PDF : ${SITE}/Erik_Aouizerate_CV.pdf`);
  lines.push("");

  lines.push("## Usage", "");
  lines.push(
    "Le CV est public et peut être lu, indexé et cité. L'entraînement de modèles n'est pas autorisé (`Content-Signal: ai-train=no` dans `robots.txt`).",
  );
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
