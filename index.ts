import remarkDirective from "remark-directive";
import type { AstroIntegration } from "astro";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import type {
  AstroTipsOptions,
  AstroTipsConfig,
  TipConfig,
} from "./src/types.js";
import { defaultConfig } from "./src/config.js";
import { remarkTips } from "./src/remark-plugin.js";

// 生成暗色主题CSS
function generateDarkThemeCSS(): string {
  const variants = Object.keys(defaultConfig);
  return variants
    .map((variant) => {
      const config = defaultConfig[variant];
      const style = config.style || {};
      const darkBg = style.dark?.background || "#333";
      const borderColor = style.border || "#000";
      return `
@media (prefers-color-scheme: dark) {
  [data-type="${variant}"] {
    background-color: ${darkBg} !important;
    border-color: ${borderColor} !important;
  }
  [data-type="${variant}"] .astro-tips-icon {
    color: ${borderColor} !important;
  }
}
html.dark [data-type="${variant}"] {
  background-color: ${darkBg} !important;
  border-color: ${borderColor} !important;
}
html.dark [data-type="${variant}"] .astro-tips-icon {
  color: ${borderColor} !important;
}`;
    })
    .join("\n");
}

function astroTips(options: AstroTipsOptions = {}): AstroIntegration {
  console.log("[astro-tips] Plugin initialized with options:", options);
  return {
    name: "astro-tips",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        console.log("[astro-tips] astro:config:setup hook called");
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
      "astro:build:generated": ({ dir }) => {
        console.log(
          "[astro-tips] astro:build:generated hook called, dir:",
          dir
        );
        try {
          const darkThemeCSS = generateDarkThemeCSS();
          const styleTag = `<style data-astro-tips="dark">${darkThemeCSS}</style>`;

          // 将URL转换为文件系统路径
          const buildDir = fileURLToPath(dir);
          console.log("[astro-tips] Build directory:", buildDir);

          function processDirectory(directory: string) {
            console.log(`[astro-tips] Processing directory: ${directory}`);
            const files = readdirSync(directory);
            console.log(
              `[astro-tips] Found ${files.length} items in directory`
            );
            for (const file of files) {
              const filePath = join(directory, file);
              const stat = statSync(filePath);

              if (stat.isDirectory()) {
                console.log(
                  `[astro-tips] Recursing into directory: ${filePath}`
                );
                processDirectory(filePath);
              } else if (file.endsWith(".html")) {
                console.log(`[astro-tips] Processing HTML file: ${filePath}`);
                let content = readFileSync(filePath, "utf-8");
                console.log(
                  `[astro-tips] File content length: ${content.length}`
                );
                if (!content.includes('data-astro-tips="dark"')) {
                  const newContent = content.replace(
                    "</head>",
                    `${styleTag}</head>`
                  );
                  if (newContent !== content) {
                    writeFileSync(filePath, newContent);
                    console.log(
                      `[astro-tips] Successfully injected dark theme CSS into: ${filePath}`
                    );
                  } else {
                    console.log(
                      `[astro-tips] Failed to find </head> tag in: ${filePath}`
                    );
                  }
                } else {
                  console.log(
                    `[astro-tips] Dark theme CSS already present in: ${filePath}`
                  );
                }
              }
            }
          }

          processDirectory(buildDir);
        } catch (error) {
          console.error(
            "[astro-tips] Error in build:generated hook:",
            (error as Error).message
          );
          console.error("[astro-tips] Stack trace:", (error as Error).stack);
        }
      },
    },
  };
}

export default astroTips;

// 导出类型供外部使用
export type {
  AstroTipsOptions,
  AstroTipsConfig,
  TipConfig,
  TipStyle,
} from "./src/types.js";
