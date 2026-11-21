import type { Skill } from "#lib/content/types.js";
import { labels } from "#lib/content/labels.js";

export const iaSkills: Skill[] = [
  {
    label: "Claude code",
    icon: "/icons/claude.webp",
    default: true,
    match: [labels.claude],
  },
  {
    label: "Gemini",
    icon: "/icons/gemini.svg",
  },
  {
    label: "DeepSeek",
    icon: "/icons/deepseek.webp",
    default: true,
  },
  {
    label: "OpenCode",
    icon: "/icons/opencode.webp",
    match: [labels.opencode],
  },
  {
    label: "LLM / RAG",
    icon: "/icons/ai-brain.webp",
    default: true,
    match: [labels.llm, labels.rag],
  },
  {
    label: "Pipelines IA / ML",
    icon: "/icons/mlflow.svg",
  },
  {
    label: "MCP",
    icon: "/icons/mcp.svg",
    default: true,
  },
  {
    label: "FinOps",
    icon: "/icons/finops.webp",
    default: true,
  },
  {
    label: "Évaluation LLM",
    icon: "/icons/weights-and-biases.svg",
  },
];
