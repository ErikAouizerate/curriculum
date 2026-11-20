import type { Skill } from "#lib/content/types.js";
import { labels } from "#lib/content/labels.js";

export const iaSkills: Skill[] = [
  {
    label: "Claude code",
    icon: "/icons/Claude_AI_symbol.svg.webp",
    default: true,
    match: [labels.claude],
  },
  {
    label: "Gemini",
    icon: "/icons/Claude_AI_symbol.svg.webp",
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
    icon: "/icons/Icon_AI_brain_blue.svg.webp",
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
    label: "Évaluation des modèles",
    icon: "/icons/eval.svg",
  },
];
