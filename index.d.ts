import type { AstroIntegration } from 'astro';

export interface TipStyle {
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

export interface TipConfig {
    /** 图标 */
    icon: string;
    /** 样式配置 */
    style?: TipStyle;
}

export interface AstroTipsConfig {
    /** 支持的提示框类型配置 */
    [key: string]: TipConfig;
}

export interface AstroTipsOptions extends Partial<AstroTipsConfig> {
    /** 是否启用 CSS 压缩 */
    minifyCSS?: boolean;
    /** 是否启用 JS 压缩 */
    minifyJS?: boolean;
}

declare module 'astro' {
    interface AstroUserConfig {
        /** Astro Tips 插件配置 */
        tips?: AstroTipsOptions;
    }
}

export interface Props {
    /** 提示框类型 */
    type: string;
    /** 提示框内容 */
    content: string;
    /** 自定义图标 */
    icon?: string;
}

/**
 * Astro Tips 插件 - 为 Astro 项目添加美观的提示框功能
 * @param options 插件配置选项
 * @returns Astro 集成插件
 */
export default function astroTips(options?: AstroTipsOptions): AstroIntegration;
