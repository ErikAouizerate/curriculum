import type { Label } from "#lib/content/labels.js";

export type SkillType = "frontend" | "backend";

export interface Skill {
  label: string;
  icon: string;
  default?: boolean;
  match?: Label[];
  type?: SkillType;
  link?: string;
}

export interface Job {
  default?: boolean;
  small?: boolean;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM */
  end?: string;
  title: string;
  description: string;
  tasks?: string[];
  tools: Label[];
  /** Project id (`projects.ts`) whose thumbnail is shown beside the job on wide screens. */
  project?: string;
}

export interface School {
  default?: boolean;
  year: string;
  title: string;
  school: string;
  subtitle?: string;
}
