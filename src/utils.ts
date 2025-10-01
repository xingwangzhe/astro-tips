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

// 生成动态样式字符串
export function generateDynamicStyle(style: {
  light?: { background?: string };
  dark?: { background?: string };
  border?: string;
}): string {
  return `
  --tips-light-bg: ${style.light?.background || "#fff"};
  --tips-dark-bg: ${style.dark?.background || "#333"};
  --tips-border: ${style.border || "#000"};
`.trim();
}

// 创建提示框 HTML 结构
export function createTipBox(
  variant: string,
  config: { icon: string; style?: any },
  children: any[]
) {
  const dynamicStyle = generateDynamicStyle(config.style || {});

  return createTipNode(
    "div",
    {
      class: `astro-tips-layout astro-tips-${variant} tips-style-${variant}`,
      "data-type": variant,
      style: dynamicStyle,
    },
    [
      createTipNode("div", { class: "icon" }, [
        { type: "text", value: config.icon } as Text,
      ]),
      createTipNode("div", { class: "content" }, children),
    ]
  );
}
