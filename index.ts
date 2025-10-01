import remarkDirective from "remark-directive";
import type { AstroIntegration } from "astro";
import type {
  AstroTipsOptions,
  AstroTipsConfig,
  TipConfig,
} from "./src/types.js";
import { defaultConfig } from "./src/config.js";
import { remarkTips } from "./src/remark-plugin.js";

function astroTips(options: AstroTipsOptions = {}): AstroIntegration {
  return {
    name: "astro-tips",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
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
