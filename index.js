import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 支持的 tip 类型 - 从 defaultConfig 动态生成
const TIP_VARIANTS = new Set([
  'warning', 'danger', 'tip', 'mention', 'recommend', 'note', 
  'info', 'success', 'error', 'bug', 'quote', 'important', 
  'example', 'question', 'answer', 'caution'
]);

function isTipVariant(variant) {
  return TIP_VARIANTS.has(variant);
}

// 生成 mdast 节点的辅助函数
function createTipNode(type, attrs = {}, children = []) {
  return {
    type: type,
    data: {
      hName: type,
      hProperties: attrs
    },
    children
  };
}

// 默认配置 - 包含图标和颜色
const defaultConfig = {
  warning: {
    icon: '⚠️',
    style: {
      border: '#ffb100',
      light: { background: '#fff8e6' },
      dark: { background: '#3d371f' }
    }
  },
  danger: {
    icon: '⛔',
    style: {
      border: '#ff4545',
      light: { background: '#ffeded' },
      dark: { background: '#3d2222' }
    }
  },
  tip: {
    icon: '💡',
    style: {
      border: '#409eff',
      light: { background: '#e6f4ff' },
      dark: { background: '#1f2f3d' }
    }
  },
  mention: {
    icon: '💬',
    style: {
      border: '#b45fff',
      light: { background: '#f3e6ff' },
      dark: { background: '#2f1f3d' }
    }
  },
  recommend: {
    icon: '👍',
    style: {
      border: '#67c23a',
      light: { background: '#e6ffe6' },
      dark: { background: '#1f3d1f' }
    }
  },
  note: {
    icon: '📝',
    style: {
      border: '#9e9e9e',
      light: { background: '#f5f5f5' },
      dark: { background: '#363636' }
    }
  },
  info: {
    icon: 'ℹ️',
    style: {
      border: '#03a9f4',
      light: { background: '#e3f2fd' },
      dark: { background: '#1f313d' }
    }
  },
  success: {
    icon: '✅',
    style: {
      border: '#4caf50',
      light: { background: '#e8f5e9' },
      dark: { background: '#1f3d24' }
    }
  },
  error: {
    icon: '❌',
    style: {
      border: '#f44336',
      light: { background: '#ffebee' },
      dark: { background: '#3d1f22' }
    }
  },
  bug: {
    icon: '🐛',
    style: {
      border: '#e91e63',
      light: { background: '#fce4ec' },
      dark: { background: '#3d1f2a' }
    }
  },
  quote: {
    icon: '💬',
    style: {
      border: '#607d8b',
      light: { background: '#eceff1' },
      dark: { background: '#1f292d' }
    }
  },
  important: {
    icon: '❗',
    style: {
      border: '#ff5722',
      light: { background: '#fbe9e7' },
      dark: { background: '#3d241f' }
    }
  },
  example: {
    icon: '📖',
    style: {
      border: '#ff9800',
      light: { background: '#fff3e0' },
      dark: { background: '#3d311f' }
    }
  },
  question: {
    icon: '❓',
    style: {
      border: '#2196f3',
      light: { background: '#e3f2fd' },
      dark: { background: '#1f2937' }
    }
  },
  answer: {
    icon: '💡',
    style: {
      border: '#8bc34a',
      light: { background: '#f1f8e9' },
      dark: { background: '#273318' }
    }
  },
  caution: {
    icon: '⚠️',
    style: {
      border: '#ff9800',
      light: { background: '#fff3e0' },
      dark: { background: '#3d311f' }
    }
  }
};

// 检查一个节点是否是指令
function isDirective(node) {
  return (
    node.type === 'textDirective' ||
    node.type === 'leafDirective' ||
    node.type === 'containerDirective'
  );
}

// 基于 AST 的 remark 插件处理提示框语法
function remarkTips(options = {}) {
  const tipsConfig = { ...defaultConfig, ...options };
  
  return function transformer(tree, _file) {
    visit(tree, (node, index, parent) => {
      if (!parent || index === undefined || !isDirective(node)) {
        return;
      }
      
      // 只处理 containerDirective（:::tip:::）
      if (node.type !== 'containerDirective') {
        return;
      }
      
      const variant = node.name;
      if (!isTipVariant(variant)) {
        return;
      }
      
      const config = tipsConfig[variant];
      if (!config) {
        return;
      }
        // 创建提示框 HTML 结构
      const tipBox = createTipNode(
        'div',
        {
          class: `astro-tips-layout astro-tips-${variant} tips-style-${variant}`,
          'data-type': variant
        },
        [
          createTipNode(
            'div',
            { class: 'icon' },
            [{ type: 'text', value: config.icon }]
          ),
          createTipNode(
            'div',
            { class: 'content' },
            node.children
          )
        ]
      );
      
      parent.children[index] = tipBox;
    });
  };
}

function astroTips(options = {}) {
  return {
    name: 'astro-tips',
    hooks: {
      'astro:config:setup': ({ updateConfig, addWatchFile, injectScript }) => {
        // 合并默认配置和用户配置
        const tipsConfig = { ...defaultConfig, ...options };
        
        // 读取基础 CSS 文件
        const cssFilePath = resolve(__dirname, 'styles/tips.css');
        let cssContent = fs.readFileSync(cssFilePath, 'utf8');
        
        // 添加文件监听，开发时CSS文件变化会触发重新构建
        addWatchFile(cssFilePath);
        
        // 动态生成每种类型的颜色变量 - 学习hexo-tips的方式
        Object.keys(tipsConfig).forEach(type => {
          const style = tipsConfig[type].style || {};
          const styleRules = `
.tips-style-${type} {
  --tips-light-bg: ${style.light?.background || '#fff'};
  --tips-dark-bg: ${style.dark?.background || '#333'};
  --tips-border: ${style.border || '#000'};
}`;
          cssContent += styleRules;
        });
          // 最小必要性CSS注入 - 模仿hexo-tips的injector方式
        injectScript('head-inline', `
if (!document.getElementById('astro-tips-styles')) {
  const style = document.createElement('style');
  style.id = 'astro-tips-styles';
  style.textContent = ${JSON.stringify(cssContent)};
  document.head.appendChild(style);
}`);
        
        // 配置 markdown 处理
        updateConfig({
          markdown: {
            remarkPlugins: [
              remarkDirective,
              [remarkTips, tipsConfig]
            ]
          }
        });
      }
    }
  };
}

export default astroTips;
