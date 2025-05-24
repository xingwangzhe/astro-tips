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

// 使用 remark 插件处理提示框语法 - 完全重写以正确处理多行内容
function remarkTips(options = {}) {
  // 合并默认配置和用户配置
  const tipsConfig = { ...defaultConfig, ...options };
  
  return function transformer(tree) {
    console.log('🔍 Astro-Tips - 开始处理 Markdown 文件');
    
    // 首先将整个文档转换为文本进行预处理
    function nodeToText(node) {
      if (node.type === 'text') {
        return node.value;
      }
      if (node.children) {
        return node.children.map(nodeToText).join('');
      }
      return '';
    }
    
    // 收集所有段落的文本内容
    function collectAllText(tree) {
      const parts = [];
      tree.children.forEach(node => {
        if (node.type === 'paragraph') {
          parts.push(nodeToText(node));
        } else if (node.type === 'code') {
          parts.push('```' + (node.lang || '') + '\n' + node.value + '\n```');
        } else if (node.type === 'list') {
          // 处理列表
          const listText = node.children.map(item => {
            return '- ' + nodeToText(item);
          }).join('\n');
          parts.push(listText);
        } else if (node.type === 'heading') {
          parts.push('#'.repeat(node.depth) + ' ' + nodeToText(node));
        } else {
          parts.push(nodeToText(node));
        }
      });
      return parts.join('\n\n');
    }
    
    const fullText = collectAllText(tree);
    
    // 使用正则表达式匹配所有提示框
    const tipRegex = /:::\s*(\w+)\s*([\s\S]*?):::/g;
    let match;
    const tips = [];
    
    while ((match = tipRegex.exec(fullText)) !== null) {
      const type = match[1];
      const content = match[2].trim();
      
      if (tipsConfig[type]) {
        tips.push({
          type,
          content,
          fullMatch: match[0],
          start: match.index,
          end: match.index + match[0].length
        });
        console.log(`✅ Astro-Tips - 找到 ${type} 类型的提示框`);
      }
    }
    
    if (tips.length === 0) {
      return tree;
    }
      // 重建树结构，替换找到的提示框
    const newChildren = [];
    
    // 将文本按提示框分割
    let currentPos = 0;
    
    tips.forEach(tip => {
      // 添加提示框之前的内容
      if (tip.start > currentPos) {
        const beforeText = fullText.substring(currentPos, tip.start).trim();
        if (beforeText) {
          // 将普通文本转换回段落节点
          beforeText.split('\n\n').forEach(paragraph => {
            if (paragraph.trim()) {
              if (paragraph.startsWith('#')) {
                // 标题处理
                const level = paragraph.match(/^#+/)[0].length;
                const title = paragraph.replace(/^#+\s*/, '');
                newChildren.push({
                  type: 'heading',
                  depth: level,
                  children: [{ type: 'text', value: title }]
                });
              } else if (paragraph.startsWith('```')) {
                // 代码块处理
                const lines = paragraph.split('\n');
                const lang = lines[0].replace('```', '');
                const code = lines.slice(1, -1).join('\n');
                newChildren.push({
                  type: 'code',
                  lang: lang || null,
                  value: code
                });
              } else {
                // 普通段落
                newChildren.push({
                  type: 'paragraph',
                  children: [{ type: 'text', value: paragraph.trim() }]
                });
              }
            }
          });
        }
      }
      
      // 添加提示框
      const icon = tipsConfig[tip.type].icon;
      
      newChildren.push({
        type: 'html',
        value: `<div class="astro-tips-layout astro-tips-${tip.type} tips-style-${tip.type}">
  <div class="icon">${icon}</div>
  <div class="content">`
      });
      
      // 处理提示框内容
      if (tip.content.trim()) {
        tip.content.split('\n\n').forEach(paragraph => {
          if (paragraph.trim()) {
            if (paragraph.startsWith('```')) {
              // 代码块处理
              const lines = paragraph.split('\n');
              const lang = lines[0].replace('```', '');
              const code = lines.slice(1, -1).join('\n');
              newChildren.push({
                type: 'code',
                lang: lang || null,
                value: code
              });
            } else if (paragraph.includes('- ')) {
              // 列表处理
              const items = paragraph.split('\n').filter(line => line.trim().startsWith('- '));
              newChildren.push({
                type: 'list',
                ordered: false,
                children: items.map(item => ({
                  type: 'listItem',
                  children: [{
                    type: 'paragraph',
                    children: [{ type: 'text', value: item.replace(/^-\s*/, '') }]
                  }]
                }))
              });
            } else {
              // 普通段落
              newChildren.push({
                type: 'paragraph',
                children: [{ type: 'text', value: paragraph.trim() }]
              });
            }
          }
        });
      }
      
      newChildren.push({
        type: 'html',
        value: `  </div>
</div>`
      });
      
      currentPos = tip.end;
    });
    
    // 添加最后剩余的内容
    if (currentPos < fullText.length) {
      const afterText = fullText.substring(currentPos).trim();
      if (afterText) {
        afterText.split('\n\n').forEach(paragraph => {
          if (paragraph.trim()) {
            if (paragraph.startsWith('#')) {
              // 标题处理
              const level = paragraph.match(/^#+/)[0].length;
              const title = paragraph.replace(/^#+\s*/, '');
              newChildren.push({
                type: 'heading',
                depth: level,
                children: [{ type: 'text', value: title }]
              });
            } else {
              // 普通段落
              newChildren.push({
                type: 'paragraph',
                children: [{ type: 'text', value: paragraph.trim() }]
              });
            }
          }
        });
      }
    }
    
    // 替换整个子节点数组
    tree.children = newChildren;
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
