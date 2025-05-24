# Astro Tips 使用指南

`astro-tips` 是一个 Astro 集成，它让你可以在 Markdown 和 MDX 文件中轻松创建美观的提示框。

## 安装

```bash
# 使用 npm
npm install astro-tips

# 使用 yarn
yarn add astro-tips

# 使用 pnpm
pnpm add astro-tips
```

## 配置

在 `astro.config.mjs` 文件中添加集成：

```js
import { defineConfig } from 'astro/config';
import tips from 'astro-tips';

export default defineConfig({
  integrations: [tips()],
  // 可选：自定义配置
  tips: {
    // 自定义 info 类型
    info: {
      icon: 'ℹ️', // 自定义图标
      style: {
        light: { background: '#e8f0fe' }, // 亮色模式背景
        dark: { background: '#1e3a5f' },  // 暗色模式背景
        border: '#4285f4'  // 边框颜色
      }
    },
    // 可以添加自定义类型
    custom: {
      icon: '🔍',
      style: {
        light: { background: '#f9f9f9' },
        dark: { background: '#292929' },
        border: '#757575'
      }
    }
  }
});
```

## 基本用法

在 Markdown 或 MDX 文件中使用以下语法：

````markdown
:::类型
内容（支持 Markdown 语法）
:::
````

例如：

````markdown
:::info
这是一个信息提示框。

可以包含**加粗文字**、*斜体文字*等 Markdown 格式。

```js
// 也可以包含代码块
console.log('Hello, Astro!');
```
:::
````

## 内置类型

`astro-tips` 内置了多种提示框类型：

- `info` - 信息提示框 ℹ️
- `warning` - 警告提示框 ⚠️
- `danger` - 危险提示框 ⛔
- `tip` - 小提示 💡
- `success` - 成功提示框 ✅
- `error` - 错误提示框 ❌
- `note` - 笔记提示框 📝
- `bug` - Bug 提示框 🐛
- `todo` - 待办提示框 📋
- `mention` - 提及提示框 💬
- `recommend` - 推荐提示框 👍
- `example` - 示例提示框 🔍
- `quote` - 引用提示框 💭
- `link` - 链接提示框 🔗
- `code` - 代码提示框 💻
- `update` - 更新提示框 🔄
- `star` - 星标提示框 ⭐
- `time` - 时间提示框 ⌛

## 自适应暗色模式

提示框会自动适应网站的暗色模式，无需额外配置。

- 当用户设置为暗色模式时，提示框使用暗色背景
- 当用户设置为亮色模式时，提示框使用亮色背景
- 如果用户的系统设置为暗色模式，且网站没有明确指定亮色模式，提示框也会使用暗色背景
