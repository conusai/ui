# ConusAI UI — Aggressive Refactoring Plan

> Goal: Transform `conusai-ui` from a monolithic demo library into a **shadcn-style, copy-paste-first component registry** with a CLI that installs individual components from a GitHub URL — zero npm package coupling.

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Target Architecture](#2-target-architecture)
3. [Phase 1 — Component Decomposition](#phase-1--component-decomposition)
4. [Phase 2 — shadcn Registry Format](#phase-2--shadcn-registry-format)
5. [Phase 3 — Props & API Cleanup](#phase-3--props--api-cleanup)
6. [Phase 4 — Motion System Refactor](#phase-4--motion-system-refactor)
7. [Phase 5 — Theme Provider Extraction](#phase-5--theme-provider-extraction)
8. [Phase 6 — CLI Tool (conusai-add)](#phase-6--cli-tool-conusai-add)
9. [Phase 7 — Registry JSON & GitHub Hosting](#phase-7--registry-json--github-hosting)
10. [Phase 8 — Documentation Overhaul](#phase-8--documentation-overhaul)
11. [Phase 9 — Testing Strategy](#phase-9--testing-strategy)
12. [Phase 10 — Package Cleanup & Publish](#phase-10--package-cleanup--publish)
13. [File-by-File Change Map](#file-by-file-change-map)
14. [CLI Script Specification](#cli-script-specification)
15. [Migration Checklist](#migration-checklist)

---

## 1. Current State Assessment

### What works

- All 8 components (Header, LanguagePicker, LeftSidebar, Loader, MobileFooter, MobilePreviewFrame, RightSidebar, ComponentPreview) are functional
- CVA variants used consistently
- `forwardRef` on all components
- `asChild` pattern via Radix Slot
- Motion respects `prefers-reduced-motion`
- Touch targets enforced (44px)
- OKLCH color tokens well-structured
- Two demos (TodoList, Logistix) exercising the library in realistic contexts

### Critical problems

| Problem | Impact | Severity |
|---------|--------|----------|
| **Barrel exports couple everything** — `index.ts` re-exports all components, forcing tree-shaking to handle what the registry should | Consumers pull the entire library even if they need one component | 🔴 Critical |
| **`packages/conusai-ui` uses `../../../src` paths** — tsup entry points reach back into the app source tree | Fragile build, not publishable to npm cleanly, breaks on any folder restructure | 🔴 Critical |
| **RightSidebar bakes in `EditableTodo` domain type** — a generic sidebar panel hard-codes a todo-editing form | Consumers can't use it without todo-shaped data | 🔴 Critical |
| **Header bundles LanguagePicker internally** — imports and renders LanguagePicker as an implementation detail | Can't use Header without LanguagePicker, can't swap a different picker | 🟠 High |
| **No `registry.json`** — components are not discoverable by any CLI tool | No shadcn-style `add` workflow, no machine-readable component metadata | 🟠 High |
| **No dependency declarations per component** — each component implicitly depends on others, hooks, and UI primitives but these aren't declared anywhere | Manual installation is guesswork | 🟠 High |
| **Motion variants are library-global** — `motion-variants.ts` exports 6 functions used across different components | Can't install one component's motion without getting all motion code | 🟡 Medium |
| **`useIsMobile` leaks into LanguagePicker** — responsive behavior is baked in rather than prop-driven | Testing is harder, SSR mismatch risk | 🟡 Medium |
| **No error boundaries or Suspense boundaries** in components | Failures cascade to parent | 🟡 Medium |
| **Template component is vestigial** — `template.tsx` has no real variants, just empty CVA | Dead code | 🟢 Low |

---

## 2. Target Architecture

```
conusai-ui/
├── registry/                         # ★ NEW — shadcn-style registry
│   ├── registry.json                 # Machine-readable component manifest
│   ├── components/
│   │   ├── header.json               # Component metadata + file list
│   │   ├── language-picker.json
│   │   ├── left-sidebar.json
│   │   ├── loader.json
│   │   ├── mobile-footer.json
│   │   ├── mobile-preview-frame.json
│   │   ├── right-sidebar.json
│   │   └── component-preview.json
│   ├── hooks/
│   │   ├── use-reduced-motion.json
│   │   ├── use-mobile.json
│   │   ├── use-minimum-delay.json
│   │   └── use-vibrate.json
│   └── lib/
│       ├── motion-variants.json
│       └── theme-provider.json
│
├── src/
│   ├── components/
│   │   └── conusai-ui/               # Source-of-truth component files
│   │       ├── header/
│   │       │   ├── header.tsx         # Cleaned — no LanguagePicker import
│   │       │   ├── header.types.ts    # Strict, domain-free props
│   │       │   ├── header.test.tsx
│   │       │   └── index.ts
│   │       └── ...
│   ├── hooks/                        # Each hook is independently installable
│   └── lib/
│       └── motion-variants.ts        # ★ MOVED from conusai-ui/motion/
│
├── scripts/
│   └── conusai-add.ts                # ★ NEW — CLI script
│
└── packages/conusai-ui/              # Thin npm wrapper (optional, for npm users)
    └── src/                          # Auto-generated from registry, not ../../.. paths
```

### Core Principles (shadcn philosophy)

1. **Components are files, not packages** — you copy them into your project
2. **Zero runtime dependency on conusai-ui** — once installed, the files are yours
3. **Each component declares its dependencies** — registry JSON lists required UI primitives, hooks, and peer deps
4. **CLI resolves the dependency tree** — `conusai-add header` installs header + language-picker + use-mobile + button + avatar
5. **No barrel exports in the consumer project** — individual imports only
6. **Props are generic, not domain-specific** — no `EditableTodo`, no hardcoded nav shapes

---

## Phase 1 — Component Decomposition

### 1.1 Remove domain types from library components

**RightSidebar** is the worst offender. Refactor into a generic panel:

```tsx
// BEFORE (current) — baked-in todo editing
type RightSidebarProps = {
  todo?: EditableTodo | null;
  onChange?: (patch: Partial<EditableTodo>) => void;
  onDelete?: () => void;
  // ...
};

// AFTER — generic panel, children-only
type RightSidebarProps = ComponentPropsWithoutRef<"aside"> & {
  open: boolean;
  onClose: () => void;
  variant?: "overlay" | "inline";
  title?: string;
  eyebrow?: string;
  backLabel?: string;
  backButtonAsChild?: boolean;
  backButtonChild?: ReactNode;
  children: ReactNode;  // ★ Consumer provides content
};
```

Move the todo-editing form into `src/features/todo-demo/components/todo-edit-panel.tsx`.

### 1.2 Decouple Header from LanguagePicker

```tsx
// BEFORE — Header imports and renders LanguagePicker
import { LanguagePicker } from "../language-picker";

// AFTER — Header renders a slot
type HeaderProps = {
  title: string;
  subtitle?: string;
  leading?: ReactNode;   // ★ Slot for menu button / back button
  trailing?: ReactNode;  // ★ Slot for right-side actions (lang picker, avatar, etc.)
  surface?: "default" | "elevated";
};
```

Consumer composes:
```tsx
<Header
  title="Logistix"
  subtitle="v2.1"
  leading={<Button variant="ghost" onClick={onMenuClick}><Menu /></Button>}
  trailing={
    <>
      <LanguagePicker {...langProps} />
      <ThemeToggle />
      <Avatar />
    </>
  }
/>
```

### 1.3 Extract LanguagePicker responsive logic

Remove the internal `useIsMobile()` call. Make `presentation` required or default to `"dropdown"`:

```tsx
// BEFORE — auto-switches based on viewport
presentation?: "auto" | "sheet" | "dropdown"; // default: "auto"

// AFTER — consumer decides, no internal media query
presentation?: "sheet" | "dropdown"; // default: "dropdown"
```

If consumers want auto-switching, they use the `useIsMobile` hook themselves:

```tsx
const isMobile = useIsMobile();
<LanguagePicker presentation={isMobile ? "sheet" : "dropdown"} />
```

### 1.4 Delete Template component

`template.tsx` is dead code — empty CVA variants with no real purpose. Delete it.

### 1.5 Split motion variants per component

Move from a single `motion/motion-variants.ts` to co-located motion:

```
src/lib/motion-variants.ts  →  keep as shared utility (installable separately)
Each component that needs motion imports from @/lib/motion-variants
```

Actually keep `motion-variants.ts` in `src/lib/` as a standalone installable unit (registered in registry as `lib/motion-variants`), but each component's registry JSON declares its dependency on it.

---

## Phase 2 — shadcn Registry Format

### 2.1 Create `registry/registry.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "conusai-ui",
  "homepage": "https://github.com/conusai/conusai-ui",
  "items": [
    {
      "name": "header",
      "type": "registry:ui",
      "title": "Header",
      "description": "Mobile-first app header with leading/trailing slots, glassmorphism, and safe-area support.",
      "dependencies": ["class-variance-authority", "lucide-react"],
      "registryDependencies": [],
      "files": [
        {
          "path": "components/conusai-ui/header/header.tsx",
          "type": "registry:ui"
        },
        {
          "path": "components/conusai-ui/header/header.types.ts",
          "type": "registry:ui"
        },
        {
          "path": "components/conusai-ui/header/index.ts",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "language-picker",
      "type": "registry:ui",
      "title": "Language Picker",
      "description": "Accessible language selector with Sheet (mobile) or DropdownMenu (desktop) presentation.",
      "dependencies": ["class-variance-authority", "lucide-react"],
      "registryDependencies": ["button", "dropdown-menu", "sheet"],
      "files": [
        {
          "path": "components/conusai-ui/language-picker/language-picker.tsx",
          "type": "registry:ui"
        },
        {
          "path": "components/conusai-ui/language-picker/language-picker.types.ts",
          "type": "registry:ui"
        },
        {
          "path": "components/conusai-ui/language-picker/index.ts",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "left-sidebar",
      "type": "registry:ui",
      "title": "Left Sidebar",
      "description": "Animated navigation sidebar with overlay and inline variants.",
      "dependencies": ["class-variance-authority", "framer-motion", "lucide-react"],
      "registryDependencies": ["button"],
      "files": [
        {
          "path": "components/conusai-ui/left-sidebar/left-sidebar.tsx",
          "type": "registry:ui"
        },
        {
          "path": "components/conusai-ui/left-sidebar/left-sidebar.types.ts",
          "type": "registry:ui"
        },
        {
          "path": "components/conusai-ui/left-sidebar/index.ts",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "loader",
      "type": "registry:ui",
      "title": "Loader",
      "description": "Full-screen animated loader with gradient spinner and reduced-motion support.",
      "dependencies": ["class-variance-authority", "framer-motion"],
      "registryDependencies": [],
      "files": [
        {
          "path": "components/conusai-ui/loader/loader.tsx",
          "type": "registry:ui"
        },
        {
          "path": "components/conusai-ui/loader/loader.types.ts",
          "type": "registry:ui"
        },
        {
          "path": "components/conusai-ui/loader/index.ts",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "mobile-footer",
      "type": "registry:ui",
      "title": "Mobile Footer",
      "description": "Floating or flush bottom tab bar with tap animations and safe-area padding.",
      "dependencies": ["class-variance-authority", "framer-motion", "lucide-react"],
      "registryDependencies": [],
      "files": [
        {
          "path": "components/conusai-ui/mobile-footer/mobile-footer.tsx",
          "type": "registry:ui"
        },
        {
          "path": "components/conusai-ui/mobile-footer/mobile-footer.types.ts",
          "type": "registry:ui"
        },
        {
          "path": "components/conusai-ui/mobile-footer/index.ts",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "mobile-preview-frame",
      "type": "registry:ui",
      "title": "Mobile Preview Frame",
      "description": "Device frame wrapper with mobile, tablet, and desktop modes for component showcases.",
      "dependencies": ["class-variance-authority"],
      "registryDependencies": [],
      "files": [
        {
          "path": "components/conusai-ui/mobile-preview-frame/mobile-preview-frame.tsx",
          "type": "registry:ui"
        },
        {
          "path": "components/conusai-ui/mobile-preview-frame/mobile-preview-frame.types.ts",
          "type": "registry:ui"
        },
        {
          "path": "components/conusai-ui/mobile-preview-frame/index.ts",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "right-sidebar",
      "type": "registry:ui",
      "title": "Right Sidebar",
      "description": "Generic detail panel (overlay/inline) with animated enter/exit — bring your own content.",
      "dependencies": ["class-variance-authority", "framer-motion", "lucide-react"],
      "registryDependencies": ["button"],
      "files": [
        {
          "path": "components/conusai-ui/right-sidebar/right-sidebar.tsx",
          "type": "registry:ui"
        },
        {
          "path": "components/conusai-ui/right-sidebar/right-sidebar.types.ts",
          "type": "registry:ui"
        },
        {
          "path": "components/conusai-ui/right-sidebar/index.ts",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "component-preview",
      "type": "registry:ui",
      "title": "Component Preview",
      "description": "Bordered card container for component demonstrations.",
      "dependencies": [],
      "registryDependencies": [],
      "files": [
        {
          "path": "components/conusai-ui/component-preview.tsx",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "motion-variants",
      "type": "registry:lib",
      "title": "Motion Variants",
      "description": "Pre-built Framer Motion variant factories with reduced-motion support.",
      "dependencies": ["framer-motion"],
      "registryDependencies": [],
      "files": [
        {
          "path": "lib/motion-variants.ts",
          "type": "registry:lib"
        }
      ]
    },
    {
      "name": "theme-provider",
      "type": "registry:ui",
      "title": "Theme Provider",
      "description": "Zero-dependency light/dark/system theme context with class strategy and localStorage persistence.",
      "dependencies": [],
      "registryDependencies": [],
      "files": [
        {
          "path": "components/theme-provider.tsx",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "use-reduced-motion",
      "type": "registry:hook",
      "title": "useReducedMotionPreference",
      "description": "React hook for prefers-reduced-motion media query.",
      "dependencies": [],
      "registryDependencies": [],
      "files": [
        {
          "path": "hooks/use-reduced-motion.ts",
          "type": "registry:hook"
        }
      ]
    },
    {
      "name": "use-mobile",
      "type": "registry:hook",
      "title": "useIsMobile",
      "description": "Viewport-based mobile detection via matchMedia.",
      "dependencies": [],
      "registryDependencies": [],
      "files": [
        {
          "path": "hooks/use-mobile.ts",
          "type": "registry:hook"
        }
      ]
    },
    {
      "name": "use-minimum-delay",
      "type": "registry:hook",
      "title": "useMinimumDelay",
      "description": "Ensures a loading state shows for a minimum duration.",
      "dependencies": [],
      "registryDependencies": [],
      "files": [
        {
          "path": "hooks/use-minimum-delay.ts",
          "type": "registry:hook"
        }
      ]
    },
    {
      "name": "use-vibrate",
      "type": "registry:hook",
      "title": "useVibrate",
      "description": "Navigator.vibrate() wrapper for haptic feedback.",
      "dependencies": [],
      "registryDependencies": [],
      "files": [
        {
          "path": "hooks/use-vibrate.ts",
          "type": "registry:hook"
        }
      ]
    }
  ]
}
```

### 2.2 Update `components.json` to register conusai-ui

```json
{
  "registries": {
    "conusai": {
      "url": "https://raw.githubusercontent.com/conusai/conusai-ui/main/registry"
    }
  }
}
```

---

## Phase 3 — Props & API Cleanup

### 3.1 Strict React component patterns

Apply these rules to **every** component:

| Rule | Current | Target |
|------|---------|--------|
| **Props extend correct HTML element** | Most use `ComponentPropsWithoutRef` ✓ | Keep — this is correct |
| **No domain types in prop interfaces** | RightSidebar has `EditableTodo` | Remove all domain types |
| **Slots over hardcoded children** | Header renders LanguagePicker | Use `leading`/`trailing` ReactNode slots |
| **Discriminated unions for variants** | CVA variants ✓ | Keep — CVA is the right pattern |
| **Default exports banned** | Named exports ✓ | Keep |
| **`displayName` set** | Missing on all components | Add `Component.displayName = "Header"` on every `forwardRef` |
| **Generic callbacks** | `onSelect(id: string)` | Keep — this is generic enough |
| **No internal responsive logic** | LanguagePicker auto-switches | Remove — let consumer decide |

### 3.2 Prop naming conventions

Standardize across all components:

```
onClose        — close/dismiss actions
onSelect       — selection from a list
onChange       — value mutation  
variant       — visual variant (CVA)
surface       — background treatment
children      — primary content slot
asChild       — Radix Slot forwarding
```

### 3.3 Add `displayName` to all forwardRef components

```tsx
const Header = React.forwardRef<HTMLElement, HeaderProps>(/* ... */);
Header.displayName = "Header";
```

This is critical for React DevTools and error messages.

---

## Phase 4 — Motion System Refactor

### 4.1 Move `motion-variants.ts` to `src/lib/`

```
src/components/conusai-ui/motion/motion-variants.ts  →  src/lib/motion-variants.ts
src/components/conusai-ui/motion/index.ts            →  DELETE
```

All components import from `@/lib/motion-variants` instead of `../motion`.

### 4.2 Co-locate motion config with components (optional per-component overrides)

Components that need custom motion beyond the shared variants can define them inline. The shared `motion-variants.ts` stays as the default library.

### 4.3 Motion variant factory signature standardization

```tsx
// All factories follow the same signature:
type MotionFactory = (shouldReduceMotion: boolean) => Variants;

// Naming convention:
createSidebarVariants    → stays
createPanelVariants      → stays
createFadeUpVariants     → stays
createLoaderVariants     → stays
createTapMotion          → rename to createTapVariants for consistency
```

---

## Phase 5 — Theme Provider Extraction

### 5.1 Keep as standalone installable unit

The `ThemeProvider` is already well-isolated. Register it in the registry as `theme-provider` with zero dependencies.

### 5.2 Remove re-export from component barrel

```tsx
// BEFORE (src/components/conusai-ui/index.ts)
export { ThemeProvider, useTheme } from "../theme-provider";

// AFTER — removed from barrel, installed separately via CLI
```

### 5.3 Add `data-theme` attribute alongside class

For consumers who prefer `data-theme` over class toggling:

```tsx
document.documentElement.setAttribute("data-theme", resolved);
document.documentElement.classList.add(resolved);
```

---

## Phase 6 — CLI Tool (`conusai-add`)

### 6.1 Overview

A single TypeScript script (`scripts/conusai-add.ts`) that:

1. Fetches `registry.json` from GitHub raw URL
2. Resolves the requested component + all `registryDependencies`
3. Downloads each file from GitHub raw content
4. Writes files to the consumer's project under their configured aliases
5. Prints a summary of installed files and any peer dependencies to install

### 6.2 Usage

```bash
# Install a single component
bunx conusai-add header

# Install multiple components
bunx conusai-add header language-picker mobile-footer

# Install everything
bunx conusai-add --all

# Custom target directory
bunx conusai-add header --dir src/components

# List available components
bunx conusai-add --list

# Specify GitHub source (for forks or branches)
bunx conusai-add header --repo conusai/conusai-ui --branch main
```

### 6.3 Implementation spec

See [CLI Script Specification](#cli-script-specification) below.

---

## Phase 7 — Registry JSON & GitHub Hosting

### 7.1 Generate registry JSON from source

Create `scripts/build-registry.ts` that:

1. Scans `src/components/conusai-ui/`, `src/hooks/`, `src/lib/`
2. Reads each component's types file for description
3. Parses imports to auto-detect dependencies
4. Outputs `registry/registry.json`

### 7.2 GitHub raw URL structure

```
https://raw.githubusercontent.com/{owner}/{repo}/{branch}/registry/registry.json
https://raw.githubusercontent.com/{owner}/{repo}/{branch}/src/components/conusai-ui/header/header.tsx
```

### 7.3 Add registry build to CI

```json
// package.json scripts
{
  "build:registry": "bun run scripts/build-registry.ts",
  "precommit": "bun run build:registry && git add registry/"
}
```

---

## Phase 8 — Documentation Overhaul

### 8.1 Per-component MDX pages

Each component doc page should include:

1. **Installation** — `bunx conusai-add header`
2. **Dependencies** — auto-listed from registry
3. **Props table** — auto-generated from types
4. **Usage examples** — basic, with slots, with motion
5. **Variants** — visual demo of each CVA variant
6. **Accessibility** — ARIA attributes, keyboard nav

### 8.2 Add missing docs

- `right-sidebar.mdx` — currently missing
- `language-picker.mdx` — currently missing
- `component-preview.mdx` — currently missing
- `motion-variants.mdx` — document all factories

### 8.3 Update `getting-started.mdx`

Replace npm install instructions with CLI-based workflow:

```mdx
## Quick Start

```bash
# Add a component
bunx conusai-add header

# Add the theme provider
bunx conusai-add theme-provider
```
```

---

## Phase 9 — Testing Strategy

### 9.1 Current state

Tests exist for: Header, LanguagePicker, LeftSidebar, Loader, MobileFooter, MobilePreviewFrame, RightSidebar.

### 9.2 Required additions

| Test | Type | Priority |
|------|------|----------|
| **Registry JSON validates against schema** | Unit | 🔴 High |
| **CLI script installs components correctly** | Integration | 🔴 High |
| **Each component renders without domain props** | Unit | 🔴 High |
| **Motion variants respect reduced-motion** | Unit | 🟠 Medium |
| **Theme provider persists to localStorage** | Unit | 🟠 Medium |
| **Header slot composition** | Unit | 🟡 Low |

### 9.3 Testing patterns

- Use `vitest` + `@testing-library/react` (already configured)
- Mock `framer-motion` for motion tests
- Mock `matchMedia` for responsive tests
- Test components in isolation — no feature-level imports

---

## Phase 10 — Package Cleanup & Publish

### 10.1 Simplify `packages/conusai-ui/`

Two options:

**Option A (recommended): Remove the npm package entirely**
The shadcn model doesn't need an npm package. Components are files. Delete `packages/conusai-ui/` and reference the registry instead.

**Option B: Keep as thin wrapper**
If npm distribution is still needed, auto-generate the package contents from the registry source files during build. No more `../../../src` paths.

### 10.2 Clean up root `package.json`

Remove `packages/conusai-ui` workspace reference if going with Option A.

### 10.3 Update exports

Remove the barrel `src/components/conusai-ui/index.ts` barrel — each component is imported individually:

```tsx
// BEFORE
import { Header, LanguagePicker, MobileFooter } from "@/components/conusai-ui";

// AFTER
import { Header } from "@/components/conusai-ui/header";
import { LanguagePicker } from "@/components/conusai-ui/language-picker";
import { MobileFooter } from "@/components/conusai-ui/mobile-footer";
```

Keep the barrel for internal convenience in the demo app, but consumers use direct imports.

---

## File-by-File Change Map

### DELETE

| File | Reason |
|------|--------|
| `src/components/conusai-ui/template.tsx` | Dead code — empty CVA, unused |
| `src/components/conusai-ui/motion/index.ts` | Replaced by `src/lib/motion-variants.ts` import |
| `src/components/conusai-ui/motion/motion-variants.ts` | Moved to `src/lib/motion-variants.ts` |
| `packages/conusai-ui/src/motion.ts` | Replaced by registry install |

### CREATE

| File | Purpose |
|------|---------|
| `registry/registry.json` | Component manifest for CLI |
| `scripts/conusai-add.ts` | CLI download script |
| `scripts/build-registry.ts` | Registry generator |
| `src/features/todo-demo/components/todo-edit-panel.tsx` | Extracted domain UI from RightSidebar |
| `content/docs/components/right-sidebar.mdx` | Missing docs |
| `content/docs/components/language-picker.mdx` | Missing docs |

### MODIFY

| File | Changes |
|------|---------|
| `src/components/conusai-ui/header/header.tsx` | Remove LanguagePicker import, add `leading`/`trailing` slots |
| `src/components/conusai-ui/header/header.types.ts` | Remove language-related props, add slot props |
| `src/components/conusai-ui/right-sidebar/right-sidebar.tsx` | Remove `EditableTodo` form, make children-only |
| `src/components/conusai-ui/right-sidebar/right-sidebar.types.ts` | Remove `EditableTodo`, `onChange`, `onDelete` |
| `src/components/conusai-ui/language-picker/language-picker.tsx` | Remove `useIsMobile` auto-detection |
| `src/components/conusai-ui/language-picker/language-picker.types.ts` | Remove `"auto"` from presentation union |
| `src/components/conusai-ui/index.ts` | Remove ThemeProvider, Template exports; keep for demo app |
| `src/lib/motion-variants.ts` | ★ NEW location — contents from `motion/motion-variants.ts` |
| `components.json` | Add conusai registry URL |
| `package.json` | Add `build:registry` script, add `conusai-add` bin |
| `README.md` | Add CLI install instructions (see below) |
| `src/features/todo-demo/todo-list-demo.tsx` | Update RightSidebar usage with children |
| `src/features/logistix-demo/logistix-demo-workspace.tsx` | Update Header/RightSidebar usage |
| All `forwardRef` components | Add `.displayName` |

---

## CLI Script Specification

### `scripts/conusai-add.ts`

```typescript
#!/usr/bin/env node

/**
 * conusai-add — Download ConusAI UI components from GitHub into your project.
 *
 * Usage:
 *   bunx conusai-add <component...> [options]
 *   bunx conusai-add --list
 *   bunx conusai-add --all
 *
 * Options:
 *   --repo <owner/repo>   GitHub repository (default: conusai/conusai-ui)
 *   --branch <branch>     Git branch (default: main)
 *   --dir <path>          Target directory (default: src)
 *   --list                List available components
 *   --all                 Install all components
 *   --overwrite           Overwrite existing files
 *   --dry-run             Show what would be installed without writing
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parseArgs } from "node:util";

// --- Types ---

interface RegistryItem {
  name: string;
  type: "registry:ui" | "registry:hook" | "registry:lib";
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: { path: string; type: string }[];
}

interface Registry {
  name: string;
  homepage: string;
  items: RegistryItem[];
}

// --- Config ---

const DEFAULT_REPO = "conusai/conusai-ui";
const DEFAULT_BRANCH = "main";
const DEFAULT_DIR = "src";
const REGISTRY_PATH = "registry/registry.json";

// --- Helpers ---

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json() as Promise<T>;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

function rawURL(repo: string, branch: string, path: string): string {
  return `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;
}

function resolveDeps(
  items: RegistryItem[],
  names: string[],
  resolved = new Set<string>()
): RegistryItem[] {
  for (const name of names) {
    if (resolved.has(name)) continue;
    const item = items.find((i) => i.name === name);
    if (!item) {
      console.warn(`⚠ Unknown component: ${name} — skipping`);
      continue;
    }
    resolved.add(name);
    // Recursively resolve registry dependencies (other conusai components)
    const conusaiDeps = item.registryDependencies.filter((d) =>
      items.some((i) => i.name === d)
    );
    if (conusaiDeps.length > 0) {
      resolveDeps(items, conusaiDeps, resolved);
    }
  }
  return items.filter((i) => resolved.has(i.name));
}

// --- Main ---

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      repo: { type: "string", default: DEFAULT_REPO },
      branch: { type: "string", default: DEFAULT_BRANCH },
      dir: { type: "string", default: DEFAULT_DIR },
      list: { type: "boolean", default: false },
      all: { type: "boolean", default: false },
      overwrite: { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
    },
    allowPositionals: true,
  });

  const repo = values.repo!;
  const branch = values.branch!;
  const targetDir = resolve(values.dir!);
  const dryRun = values["dry-run"]!;

  // 1. Fetch registry
  const registryURL = rawURL(repo, branch, REGISTRY_PATH);
  console.log(`Fetching registry from ${repo}@${branch}...`);
  const registry = await fetchJSON<Registry>(registryURL);

  // 2. List mode
  if (values.list) {
    console.log(`\nAvailable components (${registry.items.length}):\n`);
    for (const item of registry.items) {
      const deps = item.dependencies.length
        ? ` [deps: ${item.dependencies.join(", ")}]`
        : "";
      console.log(`  ${item.name.padEnd(24)} ${item.description}${deps}`);
    }
    return;
  }

  // 3. Resolve components to install
  const names = values.all
    ? registry.items.map((i) => i.name)
    : positionals;

  if (names.length === 0) {
    console.error("Usage: conusai-add <component...> | --list | --all");
    process.exit(1);
  }

  const toInstall = resolveDeps(registry.items, names);

  if (toInstall.length === 0) {
    console.error("No matching components found.");
    process.exit(1);
  }

  console.log(`\nInstalling ${toInstall.length} component(s):\n`);

  // 4. Download and write files
  const allDeps = new Set<string>();
  let filesWritten = 0;

  for (const item of toInstall) {
    console.log(`  📦 ${item.title} (${item.name})`);
    for (const dep of item.dependencies) allDeps.add(dep);

    for (const file of item.files) {
      const sourcePath = `src/${file.path}`;
      const targetPath = join(targetDir, file.path);

      if (existsSync(targetPath) && !values.overwrite) {
        console.log(`     ⏭ ${file.path} (exists, use --overwrite)`);
        continue;
      }

      if (dryRun) {
        console.log(`     → ${file.path} (dry-run)`);
        filesWritten++;
        continue;
      }

      const content = await fetchText(rawURL(repo, branch, sourcePath));
      mkdirSync(dirname(targetPath), { recursive: true });
      writeFileSync(targetPath, content, "utf-8");
      console.log(`     ✓ ${file.path}`);
      filesWritten++;
    }
  }

  // 5. Summary
  console.log(`\n✅ ${filesWritten} file(s) ${dryRun ? "would be" : ""} installed to ${targetDir}`);

  if (allDeps.size > 0) {
    const depList = [...allDeps].sort().join(" ");
    console.log(`\n📎 Install peer dependencies:`);
    console.log(`   bun add ${depList}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

### Package.json bin entry

```json
{
  "bin": {
    "conusai-add": "./scripts/conusai-add.ts"
  }
}
```

---

## Migration Checklist

### Pre-flight

- [ ] Read all existing component tests to understand current assertions
- [ ] Create a branch `refactor/shadcn-registry`
- [ ] Snapshot current demo screenshots for visual regression

### Phase 1 — Component decomposition

- [ ] Extract todo-edit form from RightSidebar → `src/features/todo-demo/components/todo-edit-panel.tsx`
- [ ] Refactor RightSidebar to children-only API
- [ ] Refactor Header to `leading`/`trailing` slot API
- [ ] Remove LanguagePicker import from Header
- [ ] Remove `"auto"` presentation from LanguagePicker
- [ ] Delete `template.tsx`
- [ ] Move `motion-variants.ts` to `src/lib/`
- [ ] Update all component imports to `@/lib/motion-variants`
- [ ] Add `displayName` to all `forwardRef` components
- [ ] Update todo-demo to use new Header/RightSidebar APIs
- [ ] Update logistix-demo to use new Header/RightSidebar APIs
- [ ] Run all tests — fix breakages

### Phase 2 — Registry

- [ ] Create `registry/registry.json`
- [ ] Create `scripts/build-registry.ts`
- [ ] Validate registry against shadcn schema
- [ ] Add `build:registry` script to `package.json`

### Phase 3 — CLI

- [ ] Create `scripts/conusai-add.ts`
- [ ] Test CLI installs components to a temp directory
- [ ] Test dependency resolution (install header → requires button)
- [ ] Add `conusai-add` bin to `package.json`
- [ ] Test `--list`, `--all`, `--dry-run`, `--overwrite` flags

### Phase 4 — Documentation

- [ ] Update `getting-started.mdx` with CLI workflow
- [ ] Create missing component docs (right-sidebar, language-picker)
- [ ] Update existing docs with new prop APIs
- [ ] Add installation section to every component doc

### Phase 5 — Package cleanup

- [ ] Decide: remove `packages/conusai-ui` or keep as thin wrapper
- [ ] If keeping: rewrite to copy from `src/` instead of `../../../` paths
- [ ] Update `README.md`
- [ ] Run `bun run lint && bun run build` — verify clean

### Phase 6 — Final verification

- [ ] All tests pass
- [ ] Both demos render correctly (TodoList + Logistix)
- [ ] CLI installs to a fresh project correctly
- [ ] Registry JSON is valid
- [ ] No TypeScript errors
- [ ] No lint violations
