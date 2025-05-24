import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 默认配置
const defaultConfig = {
  warning: {
    icon: '⚠',
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
  todo: {
    icon: '📋',
    style: {
      border: '#9c27b0',
      light: { background: '#f3e5f5' },
      dark: { background: '#2f1f3d' }
    }
  },
  example: {
    icon: '🔍',
    style: {
      border: '#ff9800',
      light: { background: '#fff3e0' },
      dark: { background: '#3d311f' }
    }
  },
  quote: {
    icon: '💭',
    style: {
      border: '#607d8b',
      light: { background: '#eceff1' },
      dark: { background: '#1f292d' }
    }
  },
  link: {
    icon: '🔗',
    style: {
      border: '#3f51b5',
      light: { background: '#e8eaf6' },
      dark: { background: '#1f2137' }
    }
  },
  code: {
    icon: '💻',
    style: {
      border: '#616161',
      light: { background: '#fafafa' },
      dark: { background: '#363636' }
    }
  },
  update: {
    icon: '🔄',
    style: {
      border: '#009688',
      light: { background: '#e0f2f1' },
      dark: { background: '#1f3734' }
    }
  },
  star: {
    icon: '⭐',
    style: {
      border: '#ffd700',
      light: { background: '#fffde7' },
      dark: { background: '#3d3a1f' }
    }
  },
  time: {
    icon: '⌛',
    style: {
      border: '#795548',
      light: { background: '#efebe9' },
      dark: { background: '#332824' }
    }
  }
};

// 使用 remark 插件处理提示框语法 - 简化版本，避免复杂的AST操作
function remarkTips(options = {}) {
  // 合并默认配置和用户配置
  const tipsConfig = { ...defaultConfig, ...options };
  
  return function transformer(tree) {
    console.log('🔍 Astro-Tips - 开始处理 Markdown 文件');
    
    // 递归遍历AST寻找提示框模式
    function visit(node, parent, index) {
      // 只处理段落节点
      if (node.type === 'paragraph' && node.children && node.children.length > 0) {
        // 获取段落的文本内容
        const textContent = node.children
          .filter(child => child.type === 'text')
          .map(child => child.value)
          .join('');
        
        // 检查是否包含提示框语法
        const tipMatch = textContent.match(/:::\s*(\w+)\s*([\s\S]*?):::/);
        if (tipMatch) {
          const type = tipMatch[1];
          const content = tipMatch[2].trim();
          
          // 检查是否是支持的类型
          if (!tipsConfig[type]) {
            console.log(`❌ Astro-Tips - 不支持的类型: ${type}`);
            return;
          }
          
          console.log(`✅ Astro-Tips - 处理 ${type} 类型的提示框`);
          
          const icon = tipsConfig[type].icon;
          
          // 简单处理内容 - 保持原始内容，让浏览器处理
          let processedContent = content;
          
          // 创建 HTML 节点
          const htmlNode = {
            type: 'html',
            value: `<div class="astro-tips-layout astro-tips-${type} tips-style-${type}">
  <div class="icon">${icon}</div>
  <div class="content">${processedContent}</div>
</div>`
          };
          
          // 替换当前节点
          if (parent && typeof index !== 'undefined') {
            parent.children[index] = htmlNode;
            return;
          }
        }
      }
      
      // 递归处理子节点
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          visit(node.children[i], node, i);
        }
      }
    }
    
    visit(tree);
    return tree;
  };
}

export default function (options = {}) {
  return {
    name: 'astro-tips',
    hooks: {
      'astro:config:setup': ({ updateConfig, injectScript }) => {
        // 合并默认配置和用户配置
        const tipsConfig = { ...defaultConfig, ...options };
        console.log('🔧 Astro-Tips - 配置加载:', Object.keys(tipsConfig).length, '种类型');
        
        // 读取基础 CSS
        let cssContent = fs.readFileSync(resolve(__dirname, 'styles/tips.css'), 'utf8');
        console.log('🎨 Astro-Tips - CSS 样式已加载');
        
        // 动态生成样式规则
        Object.keys(tipsConfig).forEach(type => {
          const style = tipsConfig[type].style || {};
          const styleClass = `tips-style-${type}`;
          const styleRules = `
.${styleClass} {
    --tips-light-bg: ${style.light?.background || '#fff'};
    --tips-dark-bg: ${style.dark?.background || '#333'};
    --tips-border: ${style.border || '#000'};
}`;
          cssContent += styleRules;
        });
        
        // 使用 injectScript 在页面头部注入样式
        injectScript('head-inline', `
          if (!document.getElementById('astro-tips-styles')) {
            const style = document.createElement('style');
            style.id = 'astro-tips-styles';
            style.textContent = \`${cssContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
            document.head.appendChild(style);
          }
        `);
        
        // 配置 markdown 处理
        updateConfig({
          markdown: {
            remarkPlugins: [[remarkTips, tipsConfig]]
          }
        });
        
        console.log('🚀 Astro-Tips - 集成完成，已配置 remarkPlugins 和样式注入');
      }
    }
  };
}
