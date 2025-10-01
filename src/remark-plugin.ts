import { visit } from "unist-util-visit";
import type { Root, Node } from "hast";
import type { AstroTipsConfig } from "./types.js";
import { defaultConfig } from "./config.js";
import { isTipVariant, isDirective, createTipBox } from "./utils.js";

// 基于 AST 的 remark 插件处理提示框语法
export function remarkTips(options: AstroTipsConfig = {}): any {
  const tipsConfig = { ...defaultConfig, ...options };

  return function transformer(tree: Root) {
    visit(
      tree,
      (node: Node, index: number | undefined, parent: Node | undefined) => {
        if (!parent || index === undefined || !isDirective(node)) {
          return;
        }

        // 只处理 containerDirective（:::tip:::）
        if (node.type !== "containerDirective") {
          return;
        }

        const variant = (node as any).name;
        if (!isTipVariant(variant)) {
          return;
        }

        const config = tipsConfig[variant];
        if (!config) {
          return;
        }

        // 使用createTipBox生成HTML字符串
        const htmlContent = createTipBox(
          variant,
          config,
          (node as any).children
        );

        // 创建html类型的mdast节点
        const htmlNode = {
          type: "html",
          value: htmlContent,
        };

        // 替换为html节点
        (parent as any).children[index] = htmlNode;
      }
    );
  };
}
