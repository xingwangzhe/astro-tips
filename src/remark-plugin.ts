import { visit } from "unist-util-visit";
import type { Root, Node } from "hast";
import type { AstroTipsConfig } from "./types.js";
import { defaultConfig, pageUsageTracker } from "./config.js";
import { isTipVariant, isDirective, createTipBox } from "./utils.js";

// 基于 AST 的 remark 插件处理提示框语法
export function remarkTips(options: AstroTipsConfig = {}): any {
  const tipsConfig = { ...defaultConfig, ...options };

  return function transformer(tree: Root, file: any) {
    let hasTips = false;

    try {
      visit(
        tree,
        (node: Node, index: number | undefined, parent: Node | undefined) => {
          try {
            if (!parent || index === undefined || !isDirective(node)) {
              return;
            }

            // 只处理 containerDirective（:::tip:::）
            if (node.type !== "containerDirective") {
              return;
            }

            const variant = (node as any).name;
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

            hasTips = true;

            // 创建提示框 HTML 结构，包含内联样式
            const tipBox = createTipBox(
              variant,
              config,
              (node as any).children
            );

            (parent as any).children[index] = tipBox;
          } catch (error) {
            console.error(
              `[astro-tips] Error processing tip node "${(node as any).name}":`,
              (error as Error).message
            );
          }
        }
      );

      // 记录这个文件使用了提示框
      if (hasTips && file?.path) {
        pageUsageTracker.add(file.path);
      }
    } catch (error) {
      console.error(
        "[astro-tips] Error during AST transformation:",
        (error as Error).message
      );
    }
  };
}
