import { projects } from "#lib/content/projects.js";
import {
  JOB_COUNT,
  JOB_FULL,
  JOB_HIDDEN,
  JOB_SMALL,
  SKILL_COUNT,
  defaultJobModes,
  type CvState,
  type JobMode,
} from "#lib/cv.js";

export type AskMode = "jd" | "question" | "keywords";
export type SkillLevel = "strong" | "partial" | "missing";

/** Events the model is allowed to produce, one JSON object per line. */
export type ModelEvent =
  | { type: "mode"; value: AskMode }
  | { type: "text"; delta: string }
  | { type: "skill"; index?: number; level: SkillLevel; term: string }
  | { type: "project"; id: string; why: string }
  | { type: "job"; index: number; mode: 1 | 2 };

/** Everything the endpoint streams to the browser. */
export type AskEvent =
  | ModelEvent
  | { type: "cv"; href: string }
  | { type: "error"; message: string };

export const MAX_INPUT_LENGTH = 10000;
export const MAX_SKILLS = 14;
export const MAX_JOBS = 6;
export const MAX_PROJECTS = 3;

const MODES = new Set<string>(["jd", "question", "keywords"]);
const LEVELS = new Set<string>(["strong", "partial", "missing"]);
const PROJECT_IDS = new Set(projects.map((project) => project.id));

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function index(value: unknown, count: number): number | null {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) < count
    ? (value as number)
    : null;
}

/**
 * Parses one line of model output. Anything malformed or pointing outside the catalog is
 * dropped, so the page never shows a skill, job or repository that does not exist.
 */
export function parseModelLine(line: string): ModelEvent | null {
  let raw: unknown;
  try {
    raw = JSON.parse(line);
  } catch {
    return null;
  }
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;

  switch (data.type) {
    case "mode":
      return typeof data.value === "string" && MODES.has(data.value)
        ? { type: "mode", value: data.value as AskMode }
        : null;
    case "text": {
      const delta = text(data.delta, 600);
      return delta ? { type: "text", delta } : null;
    }
    case "skill": {
      const term = text(data.term, 60);
      if (!term || typeof data.level !== "string" || !LEVELS.has(data.level)) return null;
      const level = data.level as SkillLevel;
      const skillIndex = index(data.index, SKILL_COUNT);
      if (level === "missing") return { type: "skill", level, term };
      return skillIndex === null ? null : { type: "skill", index: skillIndex, level, term };
    }
    case "project": {
      const why = text(data.why, 220);
      return typeof data.id === "string" && PROJECT_IDS.has(data.id) && why
        ? { type: "project", id: data.id, why }
        : null;
    }
    case "job": {
      const jobIndex = index(data.index, JOB_COUNT);
      return jobIndex !== null && (data.mode === JOB_FULL || data.mode === JOB_SMALL)
        ? { type: "job", index: jobIndex, mode: data.mode as 1 | 2 }
        : null;
    }
    default:
      return null;
  }
}

/** Splits a growing text buffer into complete lines and the unfinished remainder. */
export function splitLines(buffer: string): { lines: string[]; rest: string } {
  const parts = buffer.split("\n");
  const rest = parts.pop() ?? "";
  return { lines: parts.map((part) => part.trim()).filter(Boolean), rest };
}

/** Keeps the stream within the display limits and drops duplicates. */
export class EventFilter {
  private skills = new Set<string>();
  private projects = new Set<string>();
  private jobs = new Map<number, JobMode>();
  private selected = new Set<number>();

  accept(event: ModelEvent): boolean {
    switch (event.type) {
      case "skill": {
        const key = event.index === undefined ? `t:${event.term.toLowerCase()}` : `i:${event.index}`;
        if (this.skills.has(key) || this.skills.size >= MAX_SKILLS) return false;
        this.skills.add(key);
        if (event.index !== undefined) this.selected.add(event.index);
        return true;
      }
      case "project":
        if (this.projects.has(event.id) || this.projects.size >= MAX_PROJECTS) return false;
        this.projects.add(event.id);
        return true;
      case "job":
        if (this.jobs.has(event.index) || this.jobs.size >= MAX_JOBS) return false;
        this.jobs.set(event.index, event.mode);
        return true;
      default:
        return true;
    }
  }

  /**
   * The tailored CV: matched skills only, and the jobs the model picked (the default jobs when it
   * picked none). Null when nothing was matched, e.g. an off-topic question.
   */
  cvState(): CvState | null {
    if (this.selected.size === 0) return null;
    const jobs: JobMode[] =
      this.jobs.size === 0
        ? defaultJobModes()
        : Array.from({ length: JOB_COUNT }, (_, i) => this.jobs.get(i) ?? JOB_HIDDEN);
    const skills = Array.from({ length: SKILL_COUNT }, (_, i) => this.selected.has(i));
    return { jobs, skills };
  }
}
