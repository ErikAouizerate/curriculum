import dayjs from "dayjs";

import { jobs } from "#lib/content/jobs.js";
import { schools } from "#lib/content/schools.js";
import { cloudSkills } from "#lib/content/skills/cloud.js";
import { devSkills } from "#lib/content/skills/dev.js";
import { devopsSkills } from "#lib/content/skills/devops.js";
import { iaSkills } from "#lib/content/skills/ia.js";
import { tools } from "#lib/content/tools.js";
import type { Job, School, Skill } from "#lib/content/types.js";

export type CategoryKey = "dev" | "ia" | "devops" | "cloud";

export interface SkillCategory {
  key: CategoryKey;
  title: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  { key: "dev", title: "Développement", skills: devSkills },
  { key: "ia", title: "Ingénierie IA", skills: iaSkills },
  { key: "devops", title: "DevOps", skills: devopsSkills },
  { key: "cloud", title: "Cloud", skills: cloudSkills },
];

export const skillCatalog: Skill[] = skillCategories.flatMap((category) => category.skills);
export const JOB_COUNT = jobs.length;
export const SKILL_COUNT = skillCatalog.length;

export type JobMode = 0 | 1 | 2;
export const JOB_HIDDEN: JobMode = 0;
export const JOB_FULL: JobMode = 1;
export const JOB_SMALL: JobMode = 2;

export interface CvState {
  jobs: JobMode[];
  skills: boolean[];
}

export interface CvJobView {
  index: number;
  job: Job;
  mode: JobMode;
}

export interface CvSkillView {
  index: number;
  skill: Skill;
  selected: boolean;
}

export interface CvCategoryView {
  key: CategoryKey;
  title: string;
  skills: CvSkillView[];
}

export interface CvView {
  jobs: CvJobView[];
  categories: CvCategoryView[];
  schools: School[];
}

export interface CvActions {
  showAllSkills: () => void;
  resetSkills: () => void;
  removeAllSkills: () => void;
  removeSkill: (index: number) => void;
  showAllJobs: () => void;
  resetJobs: () => void;
  removeJob: (index: number) => void;
  toggleSmall: (index: number) => void;
  addSkills: (jobIndex: number, keepCurrent: boolean) => void;
}

export function defaultJobModes(): JobMode[] {
  return jobs.map((job) => (job.default ? JOB_FULL : job.small ? JOB_SMALL : JOB_HIDDEN));
}

export function defaultCvState(): CvState {
  return {
    jobs: defaultJobModes(),
    skills: skillCatalog.map((skill) => Boolean(skill.default)),
  };
}

export function toView(state: CvState): CvView {
  let offset = 0;
  const categories = skillCategories.map((category) => {
    const skills = category.skills.map((skill, index) => ({
      index: offset + index,
      skill,
      selected: state.skills[offset + index] ?? false,
    }));
    offset += category.skills.length;
    return { key: category.key, title: category.title, skills };
  });

  return {
    jobs: jobs
      .map((job, index) => ({ index, job, mode: state.jobs[index] ?? JOB_HIDDEN }))
      .filter(({ mode }) => mode !== JOB_HIDDEN),
    categories,
    schools,
  };
}

export function skillMatches(skill: Skill, labels: readonly string[]): boolean {
  const candidates = skill.match && skill.match.length ? skill.match : [skill.label];
  return candidates.some((label) => labels.includes(label));
}

function withJobMode(state: CvState, index: number, mode: JobMode): CvState {
  return {
    ...state,
    jobs: state.jobs.map((current, i) => (i === index ? mode : current)),
  };
}

export function removeJob(state: CvState, index: number): CvState {
  return withJobMode(state, index, JOB_HIDDEN);
}

export function toggleJobSmall(state: CvState, index: number): CvState {
  const mode = state.jobs[index];
  if (mode === JOB_HIDDEN) return state;
  return withJobMode(state, index, mode === JOB_SMALL ? JOB_FULL : JOB_SMALL);
}

export function showAllJobs(state: CvState): CvState {
  return { ...state, jobs: jobs.map(() => JOB_FULL) };
}

export function resetJobs(state: CvState): CvState {
  return { ...state, jobs: defaultJobModes() };
}

function withSkills(state: CvState, skills: boolean[]): CvState {
  return { ...state, skills };
}

export function removeSkill(state: CvState, index: number): CvState {
  return withSkills(
    state,
    state.skills.map((selected, i) => (i === index ? false : selected)),
  );
}

export function showAllSkills(state: CvState): CvState {
  return withSkills(
    state,
    skillCatalog.map(() => true),
  );
}

export function removeAllSkills(state: CvState): CvState {
  return withSkills(
    state,
    skillCatalog.map(() => false),
  );
}

export function resetSkills(state: CvState): CvState {
  return withSkills(
    state,
    skillCatalog.map((skill) => Boolean(skill.default)),
  );
}

export function applyJobSkills(
  state: CvState,
  jobIndex: number,
  keepCurrent: boolean,
): CvState {
  const jobTools = jobs[jobIndex]?.tools ?? [];
  return withSkills(
    state,
    skillCatalog.map(
      (skill, index) => skillMatches(skill, jobTools) || (keepCurrent && state.skills[index]),
    ),
  );
}

export function showAll(): CvState {
  return {
    jobs: jobs.map(() => JOB_FULL),
    skills: skillCatalog.map(() => true),
  };
}

export function jobDuration(job: Job): string {
  const end = job.end ? dayjs(job.end) : dayjs();
  const months = end.diff(dayjs(job.start), "month") + 1;
  return months > 16 ? `${Math.round(months / 12)} ans` : `${months} mois`;
}

export function formatMonth(value: string): string {
  return dayjs(value).format("MM/YY");
}

export function formatYear(value: string): string {
  return dayjs(value).format("YYYY");
}

export type ToolGroup = "frontend" | "backend" | "ia" | "cloud" | "devops" | "tool";

export interface GroupedTool {
  label: string;
  group: ToolGroup;
}

const toolsOrder = [...devSkills, ...iaSkills, ...cloudSkills, ...devopsSkills, ...tools].reduce<
  Record<string, number>
>((acc, item, index) => {
  const labels = item.match && item.match.length ? item.match : [item.label];
  for (const label of labels) {
    if (!(label in acc)) acc[label] = index;
  }
  return acc;
}, {});

const frontendLabels = new Set(
  devSkills.filter((skill) => skill.type === "frontend").map((skill) => skill.label),
);
const backendLabels = new Set(
  devSkills.filter((skill) => skill.type === "backend").map((skill) => skill.label),
);
const cloudLabels = new Set(cloudSkills.map((skill) => skill.label));
const toolLabels = new Set(tools.map((skill) => skill.label));

function groupOf(label: string): ToolGroup {
  if (frontendLabels.has(label)) return "frontend";
  if (backendLabels.has(label)) return "backend";
  if (skillMatchesIn(iaSkills, label)) return "ia";
  if (cloudLabels.has(label)) return "cloud";
  if (skillMatchesIn(devopsSkills, label)) return "devops";
  if (toolLabels.has(label)) return "tool";
  return "tool";
}

function skillMatchesIn(skills: Skill[], label: string): boolean {
  return skills.some((skill) => skillMatches(skill, [label]));
}

export function groupJobTools(jobTools: readonly string[]): GroupedTool[][] {
  const groups: GroupedTool[][] = [[], [], [], [], [], []];
  const indexOf: Record<ToolGroup, number> = {
    frontend: 0,
    backend: 1,
    ia: 2,
    cloud: 3,
    devops: 4,
    tool: 5,
  };

  for (const label of [...jobTools].sort(
    (a, b) =>
      (toolsOrder[a] ?? Number.MAX_SAFE_INTEGER) - (toolsOrder[b] ?? Number.MAX_SAFE_INTEGER),
  )) {
    const group = groupOf(label);
    groups[indexOf[group]].push({ label, group });
  }

  return groups;
}

export const toolBorder: Record<ToolGroup, string> = {
  frontend: "border-secondary",
  backend: "border-[#2a9d8f]",
  ia: "border-[#d64550]",
  cloud: "border-[#6C5CE7]",
  devops: "border-[#6C5CE7]",
  tool: "border-[#1a1a1a]",
};
