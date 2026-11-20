import { describe, expect, it } from "vitest";

import {
  JOB_COUNT,
  SKILL_COUNT,
  defaultCvState,
  type CvState,
  type JobMode,
} from "#lib/cv.js";
import { CODE_LENGTH, decodeCv, encodeCv } from "#lib/cv-codec.js";

function stateWith(jobs: JobMode[], skills: boolean[]): CvState {
  return { jobs, skills };
}

describe("CV code codec", () => {
  it("round-trips the default state", () => {
    const state = defaultCvState();
    expect(decodeCv(encodeCv(state))).toEqual(state);
  });

  it("round-trips every job mode", () => {
    const state = stateWith(
      Array.from({ length: JOB_COUNT }, (_, i) => (i % 3) as JobMode),
      Array.from({ length: SKILL_COUNT }, (_, i) => i % 2 === 0),
    );
    expect(decodeCv(encodeCv(state))).toEqual(state);
  });

  it("round-trips empty and full selections", () => {
    const empty = stateWith(
      Array.from({ length: JOB_COUNT }, () => 0 as JobMode),
      Array.from({ length: SKILL_COUNT }, () => false),
    );
    const full = stateWith(
      Array.from({ length: JOB_COUNT }, () => 2 as JobMode),
      Array.from({ length: SKILL_COUNT }, () => true),
    );
    expect(decodeCv(encodeCv(empty))).toEqual(empty);
    expect(decodeCv(encodeCv(full))).toEqual(full);
  });

  it("produces fixed-length URL-safe codes", () => {
    const code = encodeCv(defaultCvState());
    expect(code).toHaveLength(CODE_LENGTH);
    expect(code).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("rejects malformed codes", () => {
    expect(decodeCv("")).toBeNull();
    expect(decodeCv("short")).toBeNull();
    expect(decodeCv("!".repeat(CODE_LENGTH))).toBeNull();
    expect(decodeCv("a".repeat(CODE_LENGTH + 1))).toBeNull();
  });

  it("rejects a state with the wrong shape", () => {
    expect(() => encodeCv(stateWith([], []))).toThrow(/shape mismatch/);
  });

  it("rejects an invalid job mode", () => {
    const state = stateWith(
      Array.from({ length: JOB_COUNT }, () => 0 as JobMode),
      Array.from({ length: SKILL_COUNT }, () => false),
    );
    state.jobs[0] = 3 as JobMode;
    expect(() => encodeCv(state)).toThrow(/Invalid job mode/);
  });
});
