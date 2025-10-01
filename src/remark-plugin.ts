import { visit } from "unist-util-visit";
import type { Root, Node } from "hast";
import type { AstroTipsConfig } from "./types.js";
import { defaultConfig } from "./config.js";
import { isTipVariant, isDirective, createTipBox } from "./utils.js";

// 基于 AST 的 remark 插件处理提示框语法
export function remarkTips(options: AstroTipsConfig = {}): any {
  console.log(
    "[astro-tips] remarkTips plugin initialized with options:",
    options
  );
  const tipsConfig = { ...defaultConfig, ...options };

  return function transformer(tree: Root, file: any) {
    console.log(
      "[astro-tips] remarkTips processing file:",
      file?.path || "unknown file"
    );
    console.log(
      "[astro-tips] remarkTips processing tree:",
      tree.children.length,
      "children"
    );
    let _hasTips = false;
    const usedVariants = new Set<string>();

    try {
      visit(
        tree,
        (node: Node, index: number | undefined, parent: Node | undefined) => {
          console.log("[astro-tips] Visiting node:", node.type, node);
          try {
            if (!parent || index === undefined || !isDirective(node)) {
              return;
            }

            console.log("[astro-tips] Node is directive, checking type...");
            // 只处理 containerDirective（:::tip:::）
            if (node.type !== "containerDirective") {
              return;
            }

            const variant = (node as any).name;
            console.log(
              "[astro-tips] Found containerDirective with name:",
              variant
            );
            if (!isTipVariant(variant)) {
              console.warn(
                `[astro-tips] Warning: Unknown tip variant "${variant}", skipping...`
              );
              return;
            }

            const config = tipsConfig[variant];
            if (!config) {
              console.warn(
                `[astro-tips] Warning: No configuration found for tip variant "${variant}", skipping...`
              );
              return;
            }

            _hasTips = true;
            usedVariants.add(variant);

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
          } catch (error) {
            console.error(
              `[astro-tips] Error processing tip node "${(node as any).name}":`,
              (error as Error).message
            );
          }
        }
      );
    } catch (error) {
      console.error(
        "[astro-tips] Error during AST transformation:",
        (error as Error).message
      );
    }
  };
}
