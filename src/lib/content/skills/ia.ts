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
    label: "ChatGPT",
    icon: "/icons/openai.svg",
  },
  {
    label: "GLM",
    icon: "/icons/zhipu.svg",
  },
  {
    label: "Kimi",
    icon: "/icons/moonshot.svg",
  },
  {
    label: "Qwen",
    icon: "/icons/alibaba-cloud.svg",
  },
  {
    label: "Mistral",
    icon: "/icons/mistral.svg",
  },
  {
    label: "fal",
    icon: "/icons/fal.svg",
  },
  {
    label: "OpenCode",
    icon: "/icons/opencode.webp",
    match: [labels.opencode],
  },
  {
    label: "Pi",
    icon: "/icons/pi.svg",
  },
  {
    label: "OpenRouter",
    icon: "/icons/openrouter.svg",
  },
  {
    label: "9router",
    icon: "/icons/9router.svg",
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
  {
    label: "Langfuse",
    icon: "/icons/langfuse.svg",
  },
];
