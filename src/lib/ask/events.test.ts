import { describe, expect, it } from "vitest";

import { EventFilter, MAX_PROJECTS, parseModelLine, splitLines } from "#lib/ask/events.js";
import { systemPrompt } from "#lib/ask/prompt.js";
import { jobs } from "#lib/content/jobs.js";
import { projects } from "#lib/content/projects.js";
import { decodeCv, encodeCv } from "#lib/cv-codec.js";
import { JOB_COUNT, JOB_FULL, JOB_HIDDEN, SKILL_COUNT, defaultJobModes } from "#lib/cv.js";

const line = (value: unknown) => JSON.stringify(value);

describe("parseModelLine", () => {
  it("accepts valid events", () => {
    expect(parseModelLine(line({ type: "mode", value: "jd" }))).toEqual({ type: "mode", value: "jd" });
    expect(parseModelLine(line({ type: "text", delta: " Bon profil. " }))).toEqual({
      type: "text",
      delta: "Bon profil.",
    });
    expect(parseModelLine(line({ type: "skill", index: 0, level: "strong", term: "TS" }))).toEqual({
      type: "skill",
      index: 0,
      level: "strong",
      term: "TS",
    });
    expect(parseModelLine(line({ type: "job", index: 1, mode: 2 }))).toEqual({
      type: "job",
      index: 1,
      mode: 2,
    });
    expect(parseModelLine(line({ type: "project", id: projects[0].id, why: "Sandbox" }))).toEqual(
      { type: "project", id: projects[0].id, why: "Sandbox" },
    );
  });

  it("keeps missing skills without an index", () => {
    expect(parseModelLine(line({ type: "skill", index: 3, level: "missing", term: "Kotlin" }))).toEqual(
      { type: "skill", level: "missing", term: "Kotlin" },
    );
  });

  it("drops anything outside the catalog or malformed", () => {
    for (const bad of [
      "not json",
      "```json",
      line(null),
      line({ type: "mode", value: "chat" }),
      line({ type: "text", delta: "   " }),
      line({ type: "skill", index: SKILL_COUNT, level: "strong", term: "x" }),
      line({ type: "skill", index: 1.5, level: "strong", term: "x" }),
      line({ type: "skill", level: "strong", term: "x" }),
      line({ type: "skill", index: 0, level: "expert", term: "x" }),
      line({ type: "job", index: JOB_COUNT, mode: 1 }),
      line({ type: "job", index: 0, mode: 0 }),
      line({ type: "project", id: "not-a-project", why: "x" }),
      line({ type: "cv", href: "https://evil.example" }),
    ]) {
      expect(parseModelLine(bad), bad).toBeNull();
    }
  });

  it("truncates long strings", () => {
    const event = parseModelLine(line({ type: "skill", level: "missing", term: "x".repeat(500) }));
    expect(event?.type === "skill" && event.term.length).toBe(60);
  });
});

describe("splitLines", () => {
  it("returns complete lines and keeps the remainder", () => {
    expect(splitLines('{"a":1}\n\n{"b"')).toEqual({ lines: ['{"a":1}'], rest: '{"b"' });
  });
});

describe("EventFilter", () => {
  it("drops duplicates and enforces limits", () => {
    const filter = new EventFilter();
    expect(filter.accept({ type: "skill", index: 2, level: "strong", term: "a" })).toBe(true);
    expect(filter.accept({ type: "skill", index: 2, level: "partial", term: "b" })).toBe(false);
    expect(filter.accept({ type: "skill", level: "missing", term: "Kotlin" })).toBe(true);
    expect(filter.accept({ type: "skill", level: "missing", term: "kotlin" })).toBe(false);

    const accepted = projects
      .slice(0, MAX_PROJECTS + 1)
      .map((project) => filter.accept({ type: "project", id: project.id, why: "x" }));
    expect(accepted.filter(Boolean)).toHaveLength(MAX_PROJECTS);
  });

  it("builds no CV when nothing matched", () => {
    const filter = new EventFilter();
    filter.accept({ type: "skill", level: "missing", term: "Kotlin" });
    expect(filter.cvState()).toBeNull();
  });

  it("builds a tailored CV that survives the codec round-trip", () => {
    const filter = new EventFilter();
    filter.accept({ type: "skill", index: 0, level: "strong", term: "a" });
    filter.accept({ type: "skill", index: 5, level: "partial", term: "b" });
    filter.accept({ type: "job", index: 1, mode: 1 });
    filter.accept({ type: "job", index: 3, mode: 1 });
    filter.accept({ type: "job", index: 4, mode: 2 });

    const state = filter.cvState();
    expect(state).not.toBeNull();
    const decoded = decodeCv(encodeCv(state!));
    expect(decoded?.skills.flatMap((on, i) => (on ? [i] : []))).toEqual([0, 5]);
    expect(decoded?.jobs[1]).toBe(JOB_FULL);
    expect(decoded?.jobs[3]).toBe(JOB_FULL);
    expect(decoded?.jobs[4]).toBe(JOB_FULL);
    expect(decoded?.jobs.filter((mode) => mode !== JOB_HIDDEN)).toHaveLength(3);
  });

  describe("tailored jobs", () => {
    const airbus = jobs.findIndex((job) => job.title.includes("Airbus"));
    const meteo = jobs.findIndex((job) => job.title.includes("Météo France"));
    const pick = (picked: [number, 1 | 2][]) => {
      const filter = new EventFilter();
      filter.accept({ type: "skill", index: 0, level: "strong", term: "a" });
      for (const [index, mode] of picked) filter.accept({ type: "job", index, mode });
      return filter.cvState()!.jobs;
    };

    it("adds the Airbus job when neither Airbus nor Météo France was picked", () => {
      const state = pick([[meteo + 1, 2]]);
      expect(state[airbus]).toBe(JOB_FULL);
      expect(state[meteo]).toBe(JOB_HIDDEN);
    });

    it("keeps Météo France alone when it was picked", () => {
      expect(pick([[meteo, 2]])[airbus]).toBe(JOB_HIDDEN);
    });

    it("shows every picked job in full", () => {
      const state = pick([
        [meteo, 2],
        [meteo + 1, 2],
        [meteo + 2, 1],
      ]);
      expect(state.filter((mode) => mode !== JOB_HIDDEN)).toEqual([JOB_FULL, JOB_FULL, JOB_FULL]);
    });
  });

  it("falls back to the default jobs when the model picked none", () => {
    const filter = new EventFilter();
    filter.accept({ type: "skill", index: 0, level: "strong", term: "a" });
    expect(filter.cvState()?.jobs).toEqual(
      defaultJobModes().map((mode) => (mode === JOB_HIDDEN ? JOB_HIDDEN : JOB_FULL)),
    );
  });
});

describe("systemPrompt", () => {
  it("lists every skill index and project", () => {
    const prompt = systemPrompt();
    expect(prompt).toContain(`${SKILL_COUNT - 1}: `);
    for (const project of projects) expect(prompt).toContain(`${project.id}: `);
  });
});
