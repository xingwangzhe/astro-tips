import { TIP_VARIANTS } from "./config.js";
import { SHARED_STYLES } from "./styles.js";

export function isTipVariant(variant: string): boolean {
  return TIP_VARIANTS.has(variant);
}

// 生成 mdast 节点的辅助函数
export function createTipNode(
  type: string,
  attrs: Record<string, any> = {},
  children: any[] = []
): any {
  return {
    type: "element",
    tagName: type,
    properties: attrs,
    children,
  };
}

// 检查一个节点是否是指令 - 只允许容器指令（:::语法）
export function isDirective(node: any): boolean {
  return node.type === "containerDirective";
}

// 生成完整的内联样式字符串（包含所有CSS规则和媒体查询）
export function generateCompleteStyle(style: {
  light?: { background?: string };
  dark?: { background?: string };
  border?: string;
}): string {
  const lightBg = style.light?.background || "#fff";
  const darkBg = style.dark?.background || "#333";
  const borderColor = style.border || "#000";

  // 生成CSS变量并压缩空格
  return `--tips-light-bg:${lightBg};--tips-dark-bg:${darkBg};--tips-border:${borderColor};${SHARED_STYLES.base
    .replace(/\s+/g, " ")
    .trim()}`
    .replace(/\s+/g, " ")
    .trim();
}

// 提取文本内容
function extractTextContent(children: any[]): string {
  let content = "";
  for (const child of children) {
    if (child.type === "text") {
      content += child.value;
    } else if (child.type === "paragraph" && child.children) {
      content += "<p>";
      content += extractTextContent(child.children);
      content += "</p>";
    } else if (child.children) {
      content += extractTextContent(child.children);
    }
  }
  return content;
}

// 创建提示框的HTML字符串（直接返回HTML，不使用转义）
export function createTipBox(
  variant: string,
  config: { icon: string; style?: any },
  children: any[]
): string {
  const completeStyle = generateCompleteStyle(config.style || {});
  const iconStyle = SHARED_STYLES.icon.replace(/\s+/g, " ").trim();
  const contentStyle = SHARED_STYLES.content.replace(/\s+/g, " ").trim();

  const content = extractTextContent(children);

  // 直接返回HTML字符串，不使用任何转义
  return `<div data-type="${variant}" class="astro-tips-${variant}" style="${completeStyle}"><div class="astro-tips-icon" style="${iconStyle}">${config.icon}</div><div class="astro-tips-content" style="${contentStyle}">${content}</div></div>`;
}
