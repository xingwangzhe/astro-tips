import type { Text } from "hast";
import { TIP_VARIANTS } from "./config.js";

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

  // 使用CSS-in-JS的方式，包含媒体查询
  return `
    --tips-light-bg: ${lightBg};
    --tips-dark-bg: ${darkBg};
    --tips-border: ${borderColor};
    margin: 0.5rem 0;
    padding: 0.5rem 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--tips-border);
    border-left-width: 6px;
    display: flex;
    align-items: center;
    transition: transform 0.3s ease;
    min-width: 2rem;
    height: auto;
    overflow-x: auto;
    overflow-y: hidden;
    background-color: var(--tips-light-bg);
  `.trim();
}

// 创建提示框 HTML 结构（完全内联样式）
export function createTipBox(
  variant: string,
  config: { icon: string; style?: any },
  children: any[]
) {
  const completeStyle = generateCompleteStyle(config.style || {});

  return createTipNode(
    "div",
    {
      "data-type": variant,
      style: completeStyle,
    },
    [
      createTipNode(
        "div",
        {
          style: `
          margin-top: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          font-size: clamp(2em, 2vw, 3em);
          min-width: 2rem;
          scale: 1.5;
          transition: transform 0.3s ease;
          color: var(--tips-border);
        `.trim(),
        },
        [{ type: "text", value: config.icon } as Text]
      ),
      createTipNode(
        "div",
        {
          style: `
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: transform 0.3s ease;
          line-height: 1.6;
        `.trim(),
        },
        children
      ),
      // 添加一个style标签来处理暗色主题媒体查询
      createTipNode("style", {}, [
        {
          type: "text",
          value: `
            @media (prefers-color-scheme: dark) {
              [data-type="${variant}"] {
                background-color: var(--tips-dark-bg) !important;
              }
            }
            html.dark [data-type="${variant}"] {
              background-color: var(--tips-dark-bg) !important;
            }
          `,
        },
      ]),
    ]
  );
}
