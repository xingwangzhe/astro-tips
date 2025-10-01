// 共享的CSS样式常量
export const SHARED_STYLES = {
  // 基础布局样式（所有提示框通用）
  base: `margin:0.5rem 0;padding:0.5rem 1.5rem;border-radius:8px;border:1px solid var(--tips-border);border-left-width:6px;display:flex;align-items:center;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);min-width:2rem;height:auto;overflow-x:auto;overflow-y:hidden;background-color:var(--tips-light-bg)`,

  // 图标样式
  icon: `margin-top:5px;display:flex;align-items:center;justify-content:center;margin-right:1rem;font-size:clamp(2em,2vw,3em);min-width:2rem;scale:1.5;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);color:var(--tips-border)`,

  // 内容样式
  content: `flex:1;display:flex;flex-direction:column;justify-content:center;transition:transform 0.3s ease;line-height:1.6`,
} as const;
