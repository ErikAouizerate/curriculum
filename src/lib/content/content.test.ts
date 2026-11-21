import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { jobs } from "#lib/content/jobs.js";
import { labels } from "#lib/content/labels.js";
import { projects } from "#lib/content/projects.js";
import { schools } from "#lib/content/schools.js";
import { cloudSkills } from "#lib/content/skills/cloud.js";
import { devSkills } from "#lib/content/skills/dev.js";
import { devopsSkills } from "#lib/content/skills/devops.js";
import { iaSkills } from "#lib/content/skills/ia.js";
import { tools } from "#lib/content/tools.js";
import { JOB_COUNT, SKILL_COUNT, skillCatalog } from "#lib/cv.js";

const labelValues = new Set<string>(Object.values(labels));
const skillGroups = [
  ["dev", devSkills],
  ["ia", iaSkills],
  ["devops", devopsSkills],
  ["cloud", cloudSkills],
] as const;

describe("CV content", () => {
  it("keeps the expected catalog size", () => {
    expect(JOB_COUNT).toBe(14);
    expect(SKILL_COUNT).toBe(87);
    expect(devSkills).toHaveLength(50);
    expect(iaSkills).toHaveLength(19);
    expect(devopsSkills).toHaveLength(12);
    expect(cloudSkills).toHaveLength(6);
    expect(schools).toHaveLength(3);
  });

  it("uses ISO year-month dates", () => {
    for (const job of jobs) {
      expect(job.start, job.title).toMatch(/^\d{4}-\d{2}$/);
      if (job.end) expect(job.end, job.title).toMatch(/^\d{4}-\d{2}$/);
    }
  });

  it("links jobs to projects that have a thumbnail", () => {
    for (const job of jobs) {
      for (const id of job.projects ?? []) {
        const project = projects.find((item) => item.id === id);
        expect(project?.image, `${job.title}: ${id}`).toMatch(/^\/projects\//);
        expect(existsSync(resolve("static", project!.image!.slice(1))), id).toBe(true);
      }
    }
  });

  it("references known labels in job tools", () => {
    for (const job of jobs) {
      expect(job.tools.length, job.title).toBeGreaterThan(0);
      for (const tool of job.tools) {
        expect(labelValues.has(tool), `${job.title}: ${tool}`).toBe(true);
      }
    }
  });

  it("ships an icon for every skill and tool", () => {
    for (const skill of [...skillCatalog, ...tools]) {
      expect(skill.icon, skill.label).toMatch(/^\/icons\//);
      expect(existsSync(resolve("static", skill.icon.slice(1))), skill.icon).toBe(true);
    }
  });

  it("ships optimized icon assets", () => {
    for (const skill of [...skillCatalog, ...tools]) {
      expect(skill.icon, skill.label).toMatch(/\.(svg|webp)$/);
      const size = statSync(resolve("static", skill.icon.slice(1))).size;
      expect(size, skill.icon).toBeLessThan(10 * 1024);
    }
  });

  it("names icon files after the logo, in lowercase kebab-case", () => {
    for (const skill of [...skillCatalog, ...tools]) {
      expect(skill.icon, skill.label).toMatch(/^\/icons\/[a-z0-9]+(-[a-z0-9]+)*\.(svg|webp)$/);
    }
  });

  it("keeps at least one default skill per category", () => {
    for (const [name, skills] of skillGroups) {
      expect(skills.filter((skill) => skill.default).length, name).toBeGreaterThan(0);
    }
  });

  it("keeps default job entries visible", () => {
    expect(jobs.filter((job) => job.default).length).toBeGreaterThan(0);
  });
});
