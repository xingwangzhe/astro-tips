import type { AstroTipsConfig } from "./types.js";

// 支持的 tip 类型 - 从 defaultConfig 动态生成
export const TIP_VARIANTS = new Set([
  "warning",
  "danger",
  "tip",
  "mention",
  "recommend",
  "note",
  "info",
  "success",
  "error",
  "bug",
  "quote",
  "important",
  "example",
  "question",
  "answer",
  "caution",
]);

// 页面级提示框使用跟踪
export const pageUsageTracker = new Set<string>();

// 默认配置 - 包含图标和颜色
export const defaultConfig: AstroTipsConfig = {
  warning: {
    icon: "⚠️",
    style: {
      border: "#ffb100",
      light: { background: "#fff8e6" },
      dark: { background: "#3d371f" },
    },
  },
  danger: {
    icon: "⛔",
    style: {
      border: "#ff4545",
      light: { background: "#ffeded" },
      dark: { background: "#3d2222" },
    },
  },
  tip: {
    icon: "💡",
    style: {
      border: "#409eff",
      light: { background: "#e6f4ff" },
      dark: { background: "#1f2f3d" },
    },
  },
  mention: {
    icon: "💬",
    style: {
      border: "#b45fff",
      light: { background: "#f3e6ff" },
      dark: { background: "#2f1f3d" },
    },
  },
  recommend: {
    icon: "👍",
    style: {
      border: "#67c23a",
      light: { background: "#e6ffe6" },
      dark: { background: "#1f3d1f" },
    },
  },
  note: {
    icon: "📝",
    style: {
      border: "#9e9e9e",
      light: { background: "#f5f5f5" },
      dark: { background: "#363636" },
    },
  },
  info: {
    icon: "ℹ️",
    style: {
      border: "#03a9f4",
      light: { background: "#e3f2fd" },
      dark: { background: "#1f313d" },
    },
  },
  success: {
    icon: "✅",
    style: {
      border: "#4caf50",
      light: { background: "#e8f5e9" },
      dark: { background: "#1f3d24" },
    },
  },
  error: {
    icon: "❌",
    style: {
      border: "#f44336",
      light: { background: "#ffebee" },
      dark: { background: "#3d1f22" },
    },
  },
  bug: {
    icon: "🐛",
    style: {
      border: "#e91e63",
      light: { background: "#fce4ec" },
      dark: { background: "#3d1f2a" },
    },
  },
  quote: {
    icon: "💬",
    style: {
      border: "#607d8b",
      light: { background: "#eceff1" },
      dark: { background: "#1f292d" },
    },
  },
  important: {
    icon: "❗",
    style: {
      border: "#ff5722",
      light: { background: "#fbe9e7" },
      dark: { background: "#3d241f" },
    },
  },
  example: {
    icon: "📖",
    style: {
      border: "#ff9800",
      light: { background: "#fff3e0" },
      dark: { background: "#3d311f" },
    },
  },
  question: {
    icon: "❓",
    style: {
      border: "#2196f3",
      light: { background: "#e3f2fd" },
      dark: { background: "#1f2937" },
    },
  },
  answer: {
    icon: "💡",
    style: {
      border: "#8bc34a",
      light: { background: "#f1f8e9" },
      dark: { background: "#273318" },
    },
  },
  caution: {
    icon: "⚠️",
    style: {
      border: "#ff9800",
      light: { background: "#fff3e0" },
      dark: { background: "#3d311f" },
    },
  },
};
