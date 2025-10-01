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

export interface AstroTipsOptions {
  /** 是否启用 CSS 压缩 */
  minifyCSS?: boolean;
  /** 是否启用 JS 压缩 */
  minifyJS?: boolean;
  /** 支持的提示框类型配置 */
  [key: string]: TipConfig | boolean | undefined;
}
