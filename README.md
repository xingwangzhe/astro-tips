
[English](README_EN.md)
# 🎨 Astro Tips - 美观的提示框集成

> 🌟 移植自 [hexo-tips](https://github.com/xingwangzhe/hexo-tips)，专为 Astro 生态系统优化

**让你的内容更加生动！** `astro-tips` 是一个简单易用的 Astro 集成，只需几行代码就能在 Markdown 和 MDX 文件中创建 18 种精美的提示框。

✨ **核心特性**
- 🚀 零配置即用，开箱即用
- 🎨 18 种内置提示框类型，覆盖所有使用场景
- 🌙 自动适配亮色/暗色主题
- 📝 完全兼容 Markdown 语法
- ⚡ 轻量级，不影响网站性能
- 🎯 完美支持 TypeScript

## 📦 快速安装

选择你喜欢的包管理器：

```bash
# 使用 npm
npm install astro-tips

# 使用 yarn  
yarn add astro-tips

# 使用 pnpm
pnpm add astro-tips

# 使用 bun
bun add astro-tips
```

## ⚙️ 配置设置

### 基础配置（推荐）

在 `astro.config.mjs` 文件中添加集成，享受零配置的便利：

```js
import { defineConfig } from 'astro/config';
import tips from 'astro-tips';

export default defineConfig({
  integrations: [tips()], // 就这么简单！
});
```

### 高级配置（可选）

如果你想自定义样式或添加自己的提示框类型：

```js
import { defineConfig } from 'astro/config';
import tips from 'astro-tips';

export default defineConfig({
  integrations: [
    tips({
      // 自定义现有类型的样式
      info: {
        icon: 'ℹ️', // 自定义图标
        style: {
          light: { background: '#e8f0fe' }, // 亮色模式背景
          dark: { background: '#1e3a5f' },  // 暗色模式背景
          border: '#4285f4'  // 边框颜色
        }
      },
      // 添加你自己的提示框类型
      custom: {
        icon: '🔍',
        style: {
          light: { background: '#f9f9f9' },
          dark: { background: '#292929' },
          border: '#757575'
        }
      }
    })
  ]
});
```

## 🚀 使用方法

### 基础语法

在任何 Markdown 或 MDX 文件中使用以下简单语法：

````markdown
:::类型名
你的内容（支持完整的 Markdown 语法）
:::
````

### 实际示例

````markdown
:::info
💡 **小贴士：** 这是一个信息提示框！

你可以在这里写任何内容：
- **加粗文字** 和 *斜体文字*
- [链接](https://astro.build)
- 甚至代码块：

```javascript
console.log('Hello, Astro Tips!');
```
:::
````

**渲染效果：**

![提示框示例](show.webp)

## 🎨 18 种内置样式

我们为你精心设计了 18 种提示框，满足各种使用场景：

### 📝 内容创作
- `info` ℹ️ - 重要信息说明
- `note` 📝 - 学习笔记
- `quote` 💭 - 引用内容
- `example` 🔍 - 代码示例

### ⚠️ 状态提醒  
- `success` ✅ - 成功消息
- `warning` ⚠️ - 注意事项
- `error` ❌ - 错误提示
- `danger` ⛔ - 危险警告

### 💡 技巧分享
- `tip` 💡 - 实用技巧
- `recommend` 👍 - 推荐内容
- `star` ⭐ - 重点标记
- `update` 🔄 - 更新说明

### 🔧 开发相关
- `code` 💻 - 代码说明
- `bug` 🐛 - Bug 提示
- `todo` 📋 - 待办事项
- `link` 🔗 - 外部链接

### 🕐 其他用途
- `time` ⌛ - 时间提醒
- `mention` 💬 - 特别提及


## ✨ 自动检测机制
- 🌞 用户偏好亮色模式 → 使用亮色提示框
- 🌙 用户偏好暗色模式 → 使用暗色提示框  
- 💻 跟随系统设置 → 智能切换

---

## 📄 开源协议

本项目基于 [MIT 协议](LICENSE) 开源，欢迎自由使用和贡献！

**觉得有用？别忘了给我们一个 ⭐ Star 哦！**
