import { describe, expect, it } from "vitest";

import { jobs } from "#lib/content/jobs.js";
import {
  JOB_FULL,
  JOB_HIDDEN,
  JOB_SMALL,
  SKILL_COUNT,
  applyJobSkills,
  defaultCvState,
  groupJobTools,
  removeJob,
  showAll,
  toggleJobSmall,
  toView,
} from "#lib/cv.js";

describe("CV view model", () => {
  it("renders only visible jobs", () => {
    const view = toView(defaultCvState());
    expect(view.jobs.length).toBe(jobs.filter((job) => job.default || job.small).length);
    expect(view.jobs.every((item) => item.mode !== JOB_HIDDEN)).toBe(true);
  });

  it("exposes four categories and the full skill catalog", () => {
    const view = toView(defaultCvState());
    expect(view.categories.map((category) => category.key)).toEqual([
      "dev",
      "ia",
      "devops",
      "cloud",
    ]);
    expect(view.categories.flatMap((category) => category.skills)).toHaveLength(SKILL_COUNT);
  });

  it("hides a removed job and can collapse a visible one", () => {
    const state = defaultCvState();
    const visibleIndex = state.jobs.findIndex((mode) => mode === JOB_FULL);
    expect(removeJob(state, visibleIndex).jobs[visibleIndex]).toBe(JOB_HIDDEN);
    expect(toggleJobSmall(state, visibleIndex).jobs[visibleIndex]).toBe(JOB_SMALL);
  });

  it("shows everything on demand", () => {
    const state = showAll();
    expect(state.jobs.every((mode) => mode === JOB_FULL)).toBe(true);
    expect(state.skills.every(Boolean)).toBe(true);
  });

  it("derives skills from a job's tools", () => {
    const state = applyJobSkills(defaultCvState(), 1, false);
    const view = toView(state);
    expect(view.categories.flatMap((category) => category.skills).some((item) => item.selected)).toBe(
      true,
    );
    expect(jobs[1].tools.length).toBeGreaterThan(0);
  });
});

describe("job tool grouping", () => {
  it("keeps the category order and groups known tools", () => {
    const groups = groupJobTools(["TypeScript", "Python", "Docker", "Git"]);
    expect(groups).toHaveLength(6);
    expect(groups.flat().map((tool) => tool.label)).toEqual(
      expect.arrayContaining(["TypeScript", "Python", "Docker", "Git"]),
    );
    expect(groups.flat().find((tool) => tool.label === "TypeScript")?.group).toBe("frontend");
  });
});
