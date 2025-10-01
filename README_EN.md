[中文](README.md)
# 🎨 Astro Tips - Beautiful Tip Blocks Integration

> 🌟 Beautiful tip blocks for the Astro ecosystem

**Make your content more engaging!** `astro-tips` is an easy-to-use Astro integration that creates 31 beautiful tip blocks in Markdown and MDX files with just a few lines of code.

✨ **Key Features**
- 🚀 Zero configuration, works out of the box
- 🎨 31 built-in tip block types covering all use cases
- 🌙 Auto light/dark theme adaptation
- 📝 Full Markdown syntax compatibility
- ✨ Simple and intuitive usage

## 📦 Quick Installation

Choose your favorite package manager:

```bash
# Using bun (recommended)
bun add astro-tips

# Using npm
npm install astro-tips

# Using yarn  
yarn add astro-tips

# Using pnpm
pnpm add astro-tips
```

## ⚙️ Configuration Setup

### Basic Setup (Recommended)

Add the integration to your `astro.config.mjs` file and enjoy zero-configuration convenience:

```js
import { defineConfig } from 'astro/config';
import astroTips from 'astro-tips';

export default defineConfig({
  integrations: [astroTips()], // That's it!
});
```

### Advanced Configuration (Optional)

If you want to customize styles or add your own tip block types:

```js
import { defineConfig } from 'astro/config';
import astroTips from 'astro-tips';

export default defineConfig({
  integrations: [
    astroTips({
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

:::ai
🤖 **AI Assistant:** This is an AI-related tip block for machine learning content.
:::

:::todo
📋 **Todo:** Remember to complete this important task.
:::

:::security
🔒 **Security Note:** Make sure your passwords are complex enough.
:::
````

**Rendered Result:**

![Tip Block Example](show.webp)

## 🎨 31 Built-in Styles

We've carefully designed 31 tip blocks to meet various use cases:

### 📝 Basic Types
- `tip` 💡 - Practical tips and advice
- `note` 📝 - Important notes
- `info` ℹ️ - General information
- `warning` ⚠️ - Warning notifications

### 🚨 Status Alerts  
- `success` ✅ - Success feedback
- `error` ❌ - Error messages
- `danger` ⛔ - Danger warnings
- `caution` 🔻 - Caution reminders

### 💡 Special Purpose
- `recommend` 👍 - Recommendations
- `important` ⭐ - Important emphasis
- `example` 🔍 - Examples and demonstrations
- `question` ❓ - Questions
- `answer` ✨ - Question answers

### 🎯 Other Types
- `quote` 💭 - Quoted content
- `mention` 💬 - Special mentions
- `bug` 🐛 - Bug related tips

### 📋 Project Management
- `todo` 📋 - Todo items
- `feature` ✨ - New features
- `deprecated` 🚫 - Deprecated features
- `breaking` 💥 - Breaking changes

### 🔒 Technical Topics
- `security` 🔒 - Security tips
- `performance` ⚡ - Performance optimization
- `accessibility` ♿ - Accessibility
- `experimental` 🧪 - Experimental features

### 🎉 Version Related
- `beta` 🎯 - Beta versions
- `new` 🎉 - New content

### 🤖 AI & Automation
- `ai` 🤖 - AI related content
- `bot` 🤖 - Bots/automation tools
- `chat` 💬 - Chat conversations
- `assistant` 👨‍💼 - Assistant tips
- `automation` ⚙️ - Automation processes

## ✨ Smart Theme Adaptation

No configuration needed - tip blocks intelligently adapt to your website theme:

✨ **Auto Detection**
- 🌞 User prefers light mode → Use light tip blocks
- 🌙 User prefers dark mode → Use dark tip blocks  
- 💻 Follow system settings → Smart switching

## 🧩 Common Use Cases

### In Blog Posts

Tip blocks are perfect for highlighting important information in blog posts:

```markdown
:::tip
💡 **Author's Note:** This article requires basic knowledge of HTML and CSS.
:::

Your content...

:::important
⭐ Pay attention to this key concept as it will appear throughout the article.
:::
```

### In Documentation

In technical documentation, tip blocks can clearly mark important notices:

```markdown
### Installation Steps

:::info
ℹ️ Make sure you have Node.js version ≥ 16.0.0 before installing.
:::

Installation instructions...

:::warning
⚠️ Do not use default configuration in production as it may pose security risks.
:::
```

### In Tutorials

Highlight key steps in tutorials with tip blocks:

```markdown
:::success
✅ Congratulations! You've completed creating your first Astro component.
:::

:::example
📖 **Example:** Here's a complete component example
```js
// Example code
```
:::
```

---

## 📄 License

This project is open source under the [MIT License](LICENSE). Feel free to use and contribute!

**Find it useful? Don't forget to give us a ⭐ Star!**