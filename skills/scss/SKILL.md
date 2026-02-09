---
name: scss
description: >
  Modern SCSS patterns for "Smooth" UI and Theme Management.
  Trigger: When styling with SCSS files, using the cn() utility in Angular templates, or implementing Dark/Light mode transitions.
license: Apache-2.0
metadata:
  author: prowler-cloud
  version: "1.0"
  scope: [root, ui]
  auto_invoke: "Working with SCSS classes"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## Styling Decision Tree


```

Standard component style? → Define in .scss (BEM/Scoped)
Dynamic value (JS-based)? → [style.--var]="value"
Conditional classes?       → [class]="cn('base', cond && 'variant')"
Smooth transition/effect? → Use system variables (var(--transition-smooth))
Theming?                   → Use CSS Variables (var(--bg-surface))

```

## Critical Rules

### Never Use var() in Template Class strings

```html
<div [class]="'bg-[var(--primary)]'"></div>

<div class="bg-primary"></div>
<div [style.--local-color]="customColor"></div>

```

### Never Use Hex Colors in Components

```scss
// ❌ NEVER: Hardcoded hex colors
.card { background: #ffffff; color: #1e293b; }

// ✅ ALWAYS: Use CSS variables from the theme system
.card { 
  background: var(--bg-surface); 
  color: var(--text-main); 
}

```

## The cn() Utility (Angular)

```typescript
// Shared utility (usually in shared/utils/ui.ts)
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge'; // Optional: if using Tailwind base

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

```

### When to Use cn()

```html
<div [class]="cn('card-base', isActive && 'card-active')"></div>

<button [class]="cn(
  'btn-smooth',
  variant === 'primary' ? 'btn-primary' : 'btn-secondary',
  disabled && 'btn-disabled'
)"></button>

```

## Theme Toggle (Smooth Mode)

Define variables in `styles.scss` to allow seamless switching.

```scss
// ✅ CSS Variables for Theme Toggle
:root {
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --text-main: #0f172a;
  --transition-theme: 0.3s ease;
}

.dark-theme {
  --bg-app: #0f172a;
  --bg-surface: #1e293b;
  --text-main: #f8fafc;
}

// Global apply for smooth transition
body {
  background-color: var(--bg-app);
  color: var(--text-main);
  transition: background-color var(--transition-theme), color var(--transition-theme);
}

```

## Common Patterns (Smooth UI)

### Flexbox & Alignment

```scss
.flex-center { display: flex; align-items: center; justify-content: center; gap: var(--spacing-md); }
.flex-column { display: flex; flex-direction: column; gap: var(--spacing-sm); }

```

### Grid Layouts

```scss
.grid-auto { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  gap: var(--spacing-lg); 
}

```

### Spacing (Semantic)

```scss
.p-main { padding: var(--spacing-lg); }
.m-auto { margin-left: auto; margin-right: auto; }
.gap-smooth { gap: var(--spacing-md); }

```

### Typography

```scss
.text-h1 { font-size: 2rem; font-weight: 700; color: var(--text-main); letter-spacing: -0.02em; }
.text-body { font-size: 1rem; color: var(--text-muted); line-height: 1.6; }

```

### Borders & Shadows (Smooth)

```scss
.smooth-border { border: 1px solid var(--border-subtle); border-radius: var(--radius-md); }
.smooth-shadow { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1); }
.rounded-full { border-radius: 9999px; }

```

### Interaction States

```scss
.interactive {
  transition: all var(--transition-smooth);
  &:hover { transform: translateY(-2px); filter: brightness(1.05); }
  &:active { transform: scale(0.98); }
}

```

### Responsive (Mixins)

```scss
.container {
  width: 100%;
  @include mobile-up { width: 90%; }
  @include desktop-up { width: 1200px; }
}

```

### Dark Mode Selective Styling

```scss
.card {
  background: var(--bg-surface);
  // Specific tweak if needed beyond variables
  .dark-theme & {
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

```

## Design Tokens (Visual Reference)

| Token | Value | Description |
| --- | --- | --- |
| `--radius-md` | `12px` | Standard "smooth" corner |
| `--radius-lg` | `24px` | Large container/Modal corner |
| `--transition-smooth` | `0.2s cubic-bezier(0.4, 0, 0.2, 1)` | Standard interaction |
| `--shadow-smooth` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Professional elevation |

## Dynamic Values (Escape Hatch)

```html
<div class="custom-card" [style.--custom-height]="'450px'"></div>

.custom-card { height: var(--custom-height, auto); }

```

