import claude from "@/../public/icons/Claude_AI_symbol.svg.png";
import mcp from "@/../public/icons/mcp.svg";
import mlflow from "@/../public/icons/mlflow.svg";
import finops from "@/../public/icons/finops.jpeg";
import evalIcon from "@/../public/icons/eval.svg";
import opencode from "@/../public/icons/opencode.png";
import llm from "@/../public/icons/Icon_AI_brain_blue.svg.webp";
import labels from "./labels";

const data = [
  {
    label: "Claude code",
    icon: claude,
    default: true,
    match: [labels.claude],
  },
  {
    label: "Gemini",
    icon: claude,
  },
  {
    label: "OpenCode",
    icon: opencode,
    default: true,
    match: [labels.opencode],
  },
  {
    label: "LLM / RAG",
    icon: llm,
    default: true,
    match: [labels.llm, labels.rag],
  },
  {
    label: "Pipelines IA / ML",
    icon: mlflow,
  },
  {
    label: "MCP",
    icon: mcp,
    default: true,
  },
  {
    label: "FinOps",
    icon: finops,
    default: true,
  },
  {
    label: "Évaluation des modèles",
    icon: evalIcon,
  },
];

export default data;
