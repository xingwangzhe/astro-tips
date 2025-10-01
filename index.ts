import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import type { AstroIntegration } from "astro";
import type { Root, Text } from "hast";
import type { Node } from "unist";

interface TipStyle {
  /** 边框颜色 */
  border?: string;
  /** 亮色主题样式 */
  light?: {
    /** 背景颜色 */
    background?: string;
  };
  /** 暗色主题样式 */
  dark?: {
    /** 背景颜色 */
    background?: string;
  };
}

interface TipConfig {
  /** 图标 */
  icon: string;
  /** 样式配置 */
  style?: TipStyle;
}

interface AstroTipsConfig {
  /** 支持的提示框类型配置 */
  [key: string]: TipConfig;
}

interface AstroTipsOptions {
  /** 是否启用 CSS 压缩 */
  minifyCSS?: boolean;
  /** 是否启用 JS 压缩 */
  minifyJS?: boolean;
  /** 支持的提示框类型配置 */
  [key: string]: TipConfig | boolean | undefined;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

// 支持的 tip 类型 - 从 defaultConfig 动态生成
const TIP_VARIANTS = new Set([
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
const pageUsagTracker = new Set<string>();

function isTipVariant(variant: string): boolean {
  return TIP_VARIANTS.has(variant);
}

// 生成 mdast 节点的辅助函数
function createTipNode(
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

// 默认配置 - 包含图标和颜色
const defaultConfig: AstroTipsConfig = {
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

// 检查一个节点是否是指令 - 只允许容器指令（:::语法）
function isDirective(node: Node): boolean {
  return node.type === "containerDirective";
}

// 基于 AST 的 remark 插件处理提示框语法
function remarkTips(options: AstroTipsConfig = {}): any {
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

            // 创建提示框 HTML 结构
            const tipBox = createTipNode(
              "div",
              {
                class: `astro-tips-layout astro-tips-${variant} tips-style-${variant}`,
                "data-type": variant,
              },
              [
                createTipNode("div", { class: "icon" }, [
                  { type: "text", value: config.icon } as Text,
                ]),
                createTipNode(
                  "div",
                  { class: "content" },
                  (node as any).children
                ),
              ]
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
        pageUsagTracker.add(file.path);
      }
    } catch (error) {
      console.error(
        "[astro-tips] Error during AST transformation:",
        (error as Error).message
      );
    }
  };
}

function astroTips(options: AstroTipsOptions = {}): AstroIntegration {
  return {
    name: "astro-tips",
    hooks: {
      "astro:config:setup": ({ updateConfig, addWatchFile, injectScript }) => {
        try {
          // 提取配置选项
          const { minifyCSS = true, minifyJS = true, ...tipTypes } = options;

          // 验证配置选项
          if (typeof minifyCSS !== "boolean") {
            console.warn(
              "[astro-tips] Warning: minifyCSS should be a boolean, using default value (true)"
            );
          }
          if (typeof minifyJS !== "boolean") {
            console.warn(
              "[astro-tips] Warning: minifyJS should be a boolean, using default value (true)"
            );
          }

          // 最终的提示框类型配置
          const finalTipsConfig: AstroTipsConfig = { ...defaultConfig };

          // 添加自定义提示框类型，只保留有效的配置
          Object.keys(tipTypes).forEach((typeName) => {
            const config = tipTypes[typeName];
            if (
              config &&
              typeof config === "object" &&
              !Array.isArray(config)
            ) {
              finalTipsConfig[typeName] = config as TipConfig;
            }
          });

          // 添加 CSS 文件监听
          const cssFilePath = resolve(__dirname, "../styles/tips.css");
          addWatchFile(cssFilePath);

          // 读取基础 CSS 文件
          let baseCss = "";
          try {
            baseCss = fs.readFileSync(cssFilePath, "utf8");
          } catch (error) {
            console.error(
              "[astro-tips] Error: Failed to read CSS file:",
              (error as Error).message
            );
            // 使用最小CSS作为后备
            baseCss = `
.astro-tips-layout {
  margin: 0.5rem 0;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  border: 1px solid;
  border-left-width: 6px;
  display: flex;
  align-items: center;
}
.astro-tips-layout .icon { margin-right: 1rem; }
.astro-tips-layout .content { flex: 1; }
`;
          }

          // 生成动态样式变量
          let dynamicCss = "";
          try {
            Object.keys(finalTipsConfig).forEach((type) => {
              const style = finalTipsConfig[type].style || {};
              dynamicCss += `\n.astro-tips-${type}.tips-style-${type} {\n  --tips-light-bg: ${
                style.light?.background || "#fff"
              };\n  --tips-dark-bg: ${
                style.dark?.background || "#333"
              };\n  --tips-border: ${style.border || "#000"};\n}`;
            });
          } catch (error) {
            console.error(
              "[astro-tips] Error generating dynamic CSS:",
              (error as Error).message
            );
          }

          const fullCss = baseCss + dynamicCss;

          // 注入动态CSS到页面head
          try {
            injectScript(
              "head-inline",
              `
(function(){
  if (!document.getElementById('astro-tips-styles')) {
    const style = document.createElement('style');
    style.id = 'astro-tips-styles';
    style.textContent = ${JSON.stringify(fullCss)};
    document.head.appendChild(style);
  }
})();`
            );
          } catch (error) {
            console.error(
              "[astro-tips] Error injecting styles:",
              (error as Error).message
            );
          }

          // 配置 markdown 处理
          try {
            updateConfig({
              markdown: {
                remarkPlugins: [remarkDirective, [remarkTips, finalTipsConfig]],
              },
              vite: {
                build: {
                  cssMinify: minifyCSS,
                  minify: minifyJS,
                },
              },
            });
          } catch (error) {
            console.error(
              "[astro-tips] Error updating Astro config:",
              (error as Error).message
            );
          }
        } catch (error) {
          console.error(
            "[astro-tips] Fatal error during setup:",
            (error as Error).message
          );
          console.error(
            "[astro-tips] Plugin will be disabled to prevent build failure"
          );
        }
      },
    },
  };
}

export default astroTips;
