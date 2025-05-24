[中文](README.md)
# 🎨 Astro Tips - Beautiful Tip Blocks Integration

> 🌟 Ported from [hexo-tips](https://github.com/xingwangzhe/hexo-tips), optimized for the Astro ecosystem

**Make your content more engaging!** `astro-tips` is an easy-to-use Astro integration that creates 18 beautiful tip blocks in Markdown and MDX files with just a few lines of code.

✨ **Key Features**
- 🚀 Zero configuration, works out of the box
- 🎨 18 built-in tip block types covering all use cases
- 🌙 Auto light/dark theme adaptation
- 📝 Full Markdown syntax compatibility
- ⚡ Lightweight, no performance impact
- 🎯 Perfect TypeScript support

## 📦 Quick Installation

Choose your favorite package manager:

```bash
# Using npm
npm install astro-tips

# Using yarn  
yarn add astro-tips

# Using pnpm
pnpm add astro-tips

# Using bun
bun add astro-tips
```

## ⚙️ Configuration Setup

### Basic Setup (Recommended)

Add the integration to your `astro.config.mjs` file and enjoy zero-configuration convenience:

```js
import { defineConfig } from 'astro/config';
import tips from 'astro-tips';

export default defineConfig({
  integrations: [tips()], // That's it!
});
```

### Advanced Configuration (Optional)

If you want to customize styles or add your own tip block types:

```js
import { defineConfig } from 'astro/config';
import tips from 'astro-tips';

export default defineConfig({
  integrations: [
    tips({
      // Customize existing type styles
      info: {
        icon: 'ℹ️', // Custom icon
        style: {
          light: { background: '#e8f0fe' }, // Light mode background
          dark: { background: '#1e3a5f' },  // Dark mode background
          border: '#4285f4'  // Border color
        }
      },
      // Add your own tip block types
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

## 🚀 Usage

### Basic Syntax

Use this simple syntax in any Markdown or MDX file:

````markdown
:::type-name
Your content (supports full Markdown syntax)
:::
````

### Real Example

````markdown
:::info
💡 **Pro Tip:** This is an info tip block!

You can write anything here:
- **Bold text** and *italic text*
- [Links](https://astro.build)
- Even code blocks:

```javascript
console.log('Hello, Astro Tips!');
```
:::
````

**Rendered Result:**

![Tip Block Example](show.webp)

## 🎨 18 Built-in Styles

We've carefully designed 18 tip blocks to meet various use cases:

### 📝 Content Creation
- `info` ℹ️ - Important information
- `note` 📝 - Study notes
- `quote` 💭 - Quoted content
- `example` 🔍 - Code examples

### ⚠️ Status Alerts  
- `success` ✅ - Success messages
- `warning` ⚠️ - Warnings
- `error` ❌ - Error alerts
- `danger` ⛔ - Danger warnings

### 💡 Tips & Tricks
- `tip` 💡 - Practical tips
- `recommend` 👍 - Recommendations
- `star` ⭐ - Highlights
- `update` 🔄 - Updates

### 🔧 Development
- `code` 💻 - Code explanations
- `bug` 🐛 - Bug alerts
- `todo` 📋 - Todo items
- `link` 🔗 - External links

### 🕐 Others
- `time` ⌛ - Time reminders
- `mention` 💬 - Special mentions

## ✨ Smart Theme Adaptation

No configuration needed - tip blocks intelligently adapt to your website theme:

✨ **Auto Detection**
- 🌞 User prefers light mode → Use light tip blocks
- 🌙 User prefers dark mode → Use dark tip blocks  
- 💻 Follow system settings → Smart switching

---

## 📄 License

This project is open source under the [MIT License](LICENSE). Feel free to use and contribute!

**Find it useful? Don't forget to give us a ⭐ Star!**