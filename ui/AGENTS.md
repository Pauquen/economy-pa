# EconomyRPA UI - AI Agent Ruleset

> **Skills Reference**: For detailed implementation patterns, use these skills:
> * [`angular-20`](skills/angular-20/SKILL.md) - Signals, Standalone Components, New Control Flow.
> * [`scss`](skills/scss/SKILL.md) - Smooth UI patterns, Theme Toggle, CSS Variables.
> * [`typescript`](skills/typescript/SKILL.md) - Const types, flat interfaces, strict typing.
> * [`economyrpa-ui`](skills/economyrpa-ui/SKILL.md) - Project-specific domain patterns.
> * [`playwright`](skillsls/playwright/SKILL.md) - E2E Testing (Page Object Model).

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
| --- | --- |
| Creating or modifying Angular components/directives | `angular-20` |
| Styling components or configuring themes (Light/Dark) | `scss` |
| Defining models, interfaces, or data types | `typescript` |
| Working on business logic, RPAs, or dashboard features | `economyrpa-ui` |
| Writing unit tests or component specs | `angular-20` |
| Documenting features or creating User Stories | `economyrpa-docs` |
| Updating the project changelog | `economyrpa-changelog` |

---

## CRITICAL RULES - NON-NEGOTIABLE

### Angular & State Management

* **ALWAYS**: Use **Signals** (`signal`, `computed`, `effect`) for reactive state.
* **ALWAYS**: Use **Standalone Components**. `NgModules` are deprecated in this project.
* **NEVER**: Use `Zone.js` for manual change detection. Aim for Zoneless-ready code.
* **ALWAYS**: Use the **New Control Flow** syntax (`@if`, `@for`, `@switch`).

### Smooth UX/UI (Business Aesthetic)

* **ALWAYS**: Use semantic CSS variables (e.g., `var(--bg-surface)`).
* **NEVER**: Hardcode hex colors or static pixel values in component styles.
* **SMOOTHNESS**: All interactions must use `var(--transition-smooth)` (0.2s - 0.3s).
* **THEMING**: Support the toggle via a `.dark-theme` class applied to the `<body>` tag.

### Types & Models

* **ALWAYS**: Keep interfaces flat (one level depth). Use `extends` for composition.
* **ALWAYS**: Store business-related entities in `src/app/models/`.
* **NEVER**: Use the `any` type. Use `unknown` or define a specific interface.

### Scope Rule (Absolute)

* **Used in 1 feature**: Keep it local within `features/{feature-name}/`.
* **Used in 2+ places**: Move to `shared/` (UI/Pipes) or `services/` (Logic/API).

---

## DECISION TREES

### Component Placement

```
New UI element (Button, Input, Modal)? → src/app/shared/
Specific business feature (RPA List, User Profile)? → src/app/features/{feature}/
Data Fetching / Global State? → src/app/services/
Data Structure / Contract? → src/app/models/

```

### Styling Logic

```
Need "Smooth" Effect? → Apply var(--shadow-smooth) + var(--radius-md)
Theme Switch logic?   → Use var(--transition-theme) in global SCSS
Responsive Layout?    → Use SCSS Mixins (@include mobile-up)

```

---

## PATTERNS

### Modern Component (Angular 20 + Signals)

```typescript
@Component({
  selector: 'app-rpa-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (status(); as s) {
      <div class="status-card-smooth" [class.running]="isRunning()">
        <span class="dot"></span>
        {{ s.label }}
      </div>
    }
  `
})
export class RpaStatusComponent {
  status = input.required<StatusModel>();
  isRunning = computed(() => this.status().code === 'RUNNING');
}

```

### Smooth Theme System (SCSS)

```scss
// styles.scss entry point
:root {
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --transition-smooth: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-theme: 0.4s ease-in-out;
  --radius-md: 12px;
}

.dark-theme {
  --bg-app: #0f172a;
  --bg-surface: #1e293b;
}

body {
  background-color: var(--bg-app);
  transition: background-color var(--transition-theme);
}

```

---

## TECH STACK

**Angular 20** | **TypeScript 5.x** | **SCSS** | **RxJS** (only for complex streams) | **Signals** (primary state)

---

## PROJECT STRUCTURE

```
src/app/
├── features/   # Business domains: rpa-management, business-units, home, auth
├── shared/     # Atomic UI components, pipes, directives, theme-toggle
├── models/     # Domain interfaces & Type definitions (RPA, User, API)
├── services/   # API clients, ThemeService, NotificationService
├── app.config.ts  # Application providers (Zoneless, Routing)
├── app.routes.ts  # Lazy-loaded route definitions
└── app.scss       # Global "Smooth" styles and theme variables

```

---

## QA CHECKLIST BEFORE COMMIT

* [ ] Component is `standalone: true`.
* [ ] Uses `@if` / `@for` instead of legacy structural directives.
* [ ] Local state is managed via `signals`.
* [ ] SCSS is free of HEX colors (uses variables instead).
* [ ] Layout is responsive and follows the "Smooth" design (rounded corners, soft shadows).
* [ ] No secrets or hardcoded API keys.
* [ ] **Next Steps**: Always include a "Future Improvements" section in your PR/Response.

---
