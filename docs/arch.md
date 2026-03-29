# ConusAI UI — Component Library Architecture

> Mobile-first, PWA-ready component library built on Next.js 16, React 19, Tailwind CSS 4, shadcn/ui (radix-nova style), and Framer Motion.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Directory Structure](#directory-structure)
3. [Build & Tooling Pipeline](#build--tooling-pipeline)
4. [Theming System](#theming-system)
5. [Component Layers](#component-layers)
6. [ConusAI Component Library (`conusai-ui`)](#conusai-component-library-conusai-ui)
7. [Custom Hooks](#custom-hooks)
8. [Motion System](#motion-system)
9. [Page & Routing Architecture](#page--routing-architecture)
10. [Documentation System (Fumadocs)](#documentation-system-fumadocs)
11. [PWA Configuration](#pwa-configuration)
12. [Data Flow & State Management](#data-flow--state-management)
13. [Responsive Strategy](#responsive-strategy)
14. [Design Tokens & Color System](#design-tokens--color-system)
15. [Screenshot Export System](#screenshot-export-system)
16. [Dev Tooling](#dev-tooling)

---

## Technology Stack

| Layer          | Technology                                          |
| -------------- | --------------------------------------------------- |
| Framework      | Next.js 16 (App Router, React Compiler, Turbopack)  |
| UI Runtime     | React 19 (`startTransition`, `useDeferredValue`)    |
| Styling        | Tailwind CSS 4 (CSS-first config) + `tw-animate-css` |
| Component Base | shadcn/ui v4 (radix-nova style) + Radix UI 1.4      |
| Motion         | Framer Motion 12                                    |
| Icons          | Lucide React                                        |
| Theme          | Custom `ThemeProvider` (class strategy, localStorage) |
| Documentation  | Fumadocs (fumadocs-core + fumadocs-ui + fumadocs-mdx) |
| PWA            | `next-pwa` (service worker, manifest)               |
| AI Vision      | Gemini 2.5 Flash (`@google/generative-ai`) — agentic UI exploration |
| Screenshots    | Playwright (headless Chromium) + adm-zip             |
| Linting        | Biome 2.4 (formatter + linter) + ESLint (Next.js)   |
| Package Manager| Bun                                                 |
| Language       | TypeScript 5 (strict mode)                          |

---

## Directory Structure

```
conusai-ui/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── globals.css               # Tailwind 4 theme, design tokens, base styles + fumadocs-ui styles
│   │   ├── layout.tsx                # Root layout: fonts, metadata, ThemeProvider, DevServiceWorkerReset
│   │   ├── manifest.ts               # PWA Web App Manifest (programmatic)
│   │   ├── page.tsx                  # Root redirect → /docs
│   │   ├── api/
│   │   │   ├── export/
│   │   │   │   ├── route.ts           # Static screenshot export (GET → zip of 3 viewport PNGs)
│   │   │   │   └── types.ts           # ViewportConfig type + VIEWPORTS array
│   │   │   ├── screenshots/
│   │   │   │   └── intelligent/
│   │   │   │       └── route.ts       # AI-powered screenshot explorer (GET → zip)
│   │   │   └── search/route.ts       # Fumadocs full-text search endpoint (GET)
│   │   ├── demo/
│   │   │   └── todolist/page.tsx     # TodoList demo page (RSC shell)
│   │   └── docs/
│   │       ├── layout.tsx            # Fumadocs DocsLayout + RootProvider shell
│   │       └── [[...slug]]/page.tsx  # Fumadocs catch-all MDX page renderer
│   │
│   ├── components/
│   │   ├── theme-provider.tsx        # Zero-dependency theme context (light/dark/system)
│   │   ├── dev-service-worker-reset.tsx  # Dev-only stale SW / cache cleanup
│   │   ├── docs/
│   │   │   └── component-previews.tsx    # Interactive preview wrappers for Fumadocs MDX pages
│   │   ├── conusai-ui/               # ★ Exportable ConusAI component library
│   │   │   ├── header/
│   │   │   │   ├── header.tsx
│   │   │   │   ├── header.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── language-picker/
│   │   │   ├── left-sidebar/
│   │   │   ├── loader/
│   │   │   ├── mobile-footer/
│   │   │   ├── mobile-preview-frame/
│   │   │   ├── motion/
│   │   │   │   ├── motion-variants.ts
│   │   │   │   └── index.ts
│   │   │   ├── right-sidebar/
│   │   │   ├── screenshot-generator/
│   │   │   │   ├── gemini-prompts.ts  # System prompt for AI explorer agent
│   │   │   │   ├── intelligent-button.tsx  # Client button component (AI export trigger)
│   │   │   │   ├── screenshot-config.ts   # Project seed routes registry
│   │   │   │   ├── types.ts           # GeminiAction, GeminiExplorerResponse, ScreenshotEntry
│   │   │   │   └── index.ts           # Barrel exports
│   │   │   └── index.ts              # Barrel export for all library components
│   │   └── ui/                       # shadcn/ui primitives (auto-generated)
│   │       ├── avatar.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── tabs.tsx
│   │       └── tooltip.tsx
│   │
│   ├── hooks/
│   │   ├── use-minimum-delay.ts      # Ensures loader shows for a minimum duration
│   │   ├── use-mobile.ts             # Viewport-based mobile detection via matchMedia
│   │   ├── use-reduced-motion.ts     # prefers-reduced-motion media query hook
│   │   └── use-vibrate.ts            # Navigator.vibrate() haptic feedback wrapper
│   │
│   ├── features/
│   │   └── todo-demo/                # Demo-only orchestration layer (not part of library)
│   │       ├── todo-demo.constants.ts
│   │       ├── todo-demo-shell.tsx
│   │       ├── todo-demo.types.ts
│   │       ├── todo-list-demo.tsx
│   │       ├── todo-preview-workspace.tsx
│   │       ├── todo-task-list.tsx
│   │       └── use-todo-demo-state.ts
│   │
│   ├── lib/
│   │   ├── utils.ts                  # cn() — clsx + tailwind-merge utility
│   │   ├── gemini-client.ts          # Reusable Gemini 2.5 Flash model instance
│   │   ├── screenshot-utils.ts       # Viewport presets (mobile/tablet/desktop dimensions)
│   │   └── docs/
│   │       └── source.ts             # Fumadocs loader (connects generated .source → app routes)
│   │
│   └── types/
│       └── next-pwa.d.ts             # Type declaration for next-pwa (no built-in types)
│
├── content/
│   └── docs/                         # MDX documentation source files (Fumadocs)
│       ├── meta.json                 # Root nav ordering
│       ├── index.mdx                 # Docs landing page
│       ├── getting-started.mdx       # Getting started guide
│       └── components/
│           ├── meta.json             # Component docs ordering
│           ├── header.mdx
│           ├── left-sidebar.mdx
│           ├── loader.mdx
│           ├── mobile-footer.mdx
│           └── mobile-preview-frame.mdx
│
├── .source/                          # Generated Fumadocs output (git-ignored)
│
├── components/                       # Placeholder dirs for future shadcn registry exports
│   ├── conusai-ui/                   # (empty — future package export target)
│   └── hooks/                        # (empty — future package export target)
│
├── public/
│   └── icons/
│       ├── icon.svg                  # App icon
│       └── icon-maskable.svg         # PWA maskable icon
│
├── docs/
│   └── lib.md                        # This document
│
├── source.config.ts                  # Fumadocs MDX source + rehype code theme config
├── package.json                      # Dependencies & scripts
├── next.config.ts                    # Next.js + PWA + Fumadocs MDX config
├── tsconfig.json                     # TypeScript (strict, bundler resolution, @/* alias)
├── biome.json                        # Biome linter/formatter config
├── eslint.config.mjs                 # ESLint (next core-web-vitals + typescript)
├── postcss.config.mjs                # PostCSS → @tailwindcss/postcss
├── components.json                   # shadcn/ui CLI config (radix-nova style)
├── AGENTS.md                         # AI agent instructions
└── CLAUDE.md                         # AI agent instructions (entry file)
```

---

## Build & Tooling Pipeline

### Next.js 16 Configuration (`next.config.ts`)

```ts
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import withPWA from "next-pwa";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  reactCompiler: true,   // Enables the React Compiler (automatic memoization)
  turbopack: {},          // Required by Next 16 for build checks
  serverExternalPackages: ["playwright", "adm-zip"],  // Keep native modules out of webpack bundling
};

export default withMDX(
  withPWA({ dest: "public", disable: process.env.NODE_ENV === "development", ... })(nextConfig)
);
```

- **React Compiler** is enabled, eliminating the need for manual `useMemo`/`useCallback` in most cases (though the codebase still uses them explicitly in performance-critical paths like `visibleTodos` filtering).
- **Turbopack** is enabled for dev server bundling.
- **Fumadocs MDX** wraps the outer config via `createMDX()` to process `.mdx` files in `content/docs`.
- **next-pwa** wraps the inner config to generate service worker assets.

### Linting & Formatting

Two complementary tools:

1. **Biome 2.4** — primary formatter and linter. Configured with:
   - 2-space indent, double quotes, ES5 trailing commas
   - `css.parser.tailwindDirectives: true` to parse Tailwind 4's `@theme`, `@utility`, `@custom-variant`
   - `noUnusedImports: error`

2. **ESLint** — Next.js-specific rules only (`core-web-vitals` + `typescript` presets)

### Path Aliases

```json
"paths": { "@/*": ["./src/*"] }
```

All imports use `@/components/...`, `@/hooks/...`, `@/lib/...` for clean paths.

---

## Theming System

### Theme Provider (`src/components/theme-provider.tsx`)

A **zero-dependency** theme provider (does not use `next-themes`) that implements:

- Three modes: `light`, `dark`, `system`
- **Class strategy**: toggles `.light` / `.dark` on `<html>`
- **System detection**: listens to `prefers-color-scheme` media query changes
- **Persistence**: stores selection in `localStorage` under key `conusai-ui-theme`
- **Flash prevention**: `disableTransitionOnChange` temporarily suppresses CSS transitions during theme switches
- Exposes `useTheme()` hook returning `{ theme, resolvedTheme, setTheme }`

### Design Tokens (`src/app/globals.css`)

All colors use the **OKLCH** color space for perceptually uniform theming:

```css
:root {
  --primary: oklch(0.3 0.08 255.71);
  --conus-aurora: oklch(0.82 0.12 218.66);   /* Brand accent — blue-cyan */
  --conus-sun: oklch(0.86 0.09 86.27);       /* Brand accent — warm gold */
  --conus-shadow: oklch(0.22 0.04 256.48);   /* Brand accent — deep navy */
  --radius: 1.1rem;                           /* Base radius (multiplied for sm–4xl) */
  /* ... full token set for card, popover, muted, accent, destructive, sidebar, chart */
}

.dark {
  /* Full override of every token for dark mode */
}
```

**Key design patterns:**
- **Glassmorphism**: extensive use of `bg-card/70`, `bg-sidebar/90`, `backdrop-blur-xl`, and alpha-transparent borders (`border-border/70`)
- **Gradient background**: the `body` has a fixed three-layer radial/linear gradient using `--conus-sun` and `--conus-aurora`
- **Custom selection color**: `::selection` uses primary at 24% mix
- **Radius scale**: computed from a single `--radius` token with 6 multiplied tiers (`sm` through `4xl`)

### Tailwind 4 Integration

Uses **CSS-first configuration** (no `tailwind.config.ts`):

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "fumadocs-ui/style.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --font-sans: var(--font-manrope);
  --font-heading: var(--font-space-grotesk);
  /* ... maps all design tokens into Tailwind's theme namespace */
}
```

Custom utilities are defined via `@utility`:

```css
@utility no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
}

@utility touch-target {
  min-height: 44px;
  min-width: 44px;
}

@utility safe-pt {
  padding-top: env(safe-area-inset-top);
}

@utility safe-pb {
  padding-bottom: env(safe-area-inset-bottom);
}
```

### Typography

Two Google Fonts loaded via `next/font/google`:

| Token              | Font           | Usage                    |
| ------------------ | -------------- | ------------------------ |
| `--font-manrope`   | Manrope        | Body text (`font-sans`)  |
| `--font-space-grotesk` | Space Grotesk | Headings (`font-heading`) |

---

## Component Layers

The component architecture now has **four distinct layers**:

```
┌─────────────────────────────────────────────────┐
│  App Router Pages (src/app/*)                    │  Route shells, metadata, layout
├─────────────────────────────────────────────────┤
│  Feature Modules (src/features/*)                │  Demo orchestration and state
├─────────────────────────────────────────────────┤
│  ConusAI Components (src/components/conusai-ui)  │  Exportable library components
├─────────────────────────────────────────────────┤
│  shadcn/ui Primitives (src/components/ui/*)      │  Radix-based atomic components
└─────────────────────────────────────────────────┘
```

1. **shadcn/ui primitives** (`src/components/ui/`) — generated via `shadcn` CLI with the `radix-nova` style. These are Radix UI wrappers with CVA (class-variance-authority) for variant styling. Includes: Button, Card, Input, Label, Sheet, DropdownMenu, Avatar, Tabs, Tooltip, Skeleton, Select, Separator, NavigationMenu, Sidebar.

2. **ConusAI component library** (`src/components/conusai-ui/`) — custom, higher-level components that compose shadcn/ui primitives with Framer Motion animations and responsive behavior. Each component lives in its own folder with `component.tsx`, `component.types.ts`, and `index.ts` for package-style exports.

3. **Feature modules** (`src/features/todo-demo/`) — demo-only composition, constants, and state. This layer consumes the library but is not part of the library itself.

4. **App Router shells** (`src/app/`) — minimal route files that keep metadata and page composition on the server side while mounting client features when needed.

---

## ConusAI Component Library (`conusai-ui`)

The library is now **folderized and barrel-exported**. Consumers can import from the root library barrel:

```ts
import { Header, MobilePreviewFrame, RightSidebar } from "@/components/conusai-ui";
```

Every library component has:
- `component.tsx` for implementation
- `component.types.ts` for public types
- `index.ts` for local re-exports

### Header (`header/header.tsx`)

A top-bar component with:
- Optional hamburger menu button (controlled by `showMenuButton`)
- Title and subtitle display
- Language picker (delegates to `LanguagePicker`)
- Theme toggle button (light/dark via `useTheme()`)
- User avatar (Radix Avatar with gradient fallback)
- Safe-area top padding via the `safe-pt` utility
- 44px minimum tap targets on icon buttons

**Props:** `title`, `subtitle`, `language`, `languages[]`, `onLanguageChange`, `onMenuClick`, `showMenuButton`, `languagePresentation`

### LanguagePicker (`language-picker/language-picker.tsx`)

An **adaptive** language selector that renders differently based on context:
- `"sheet"` — bottom Sheet (Radix Sheet) for mobile touch UIs
- `"dropdown"` — Radix DropdownMenu for desktop
- `"auto"` — uses `useIsMobile()` hook to decide at runtime

The mobile sheet now pads for `env(safe-area-inset-bottom)` to feel native on modern devices.

**Props:** `options: LanguageOption[]`, `value`, `onChange`, `presentation`

### LeftSidebar (`left-sidebar/left-sidebar.tsx`)

Navigation sidebar with **two rendering variants**:
- `"overlay"` (default) — slides in from the left with a backdrop overlay. Uses `AnimatePresence` + `sidebarVariants` for spring animation. Includes close button.
- `"inline"` — renders as a static sidebar column (no animation, no backdrop). Used in tablet/desktop preview modes.

Contains a reusable `SidebarContent` inner component that renders nav items with staggered entrance animation and a notes card at the bottom.

Motion is now generated from `createSidebarVariants()` and `createFadeUpVariants()` so the component can respect reduced-motion preferences.

**Props:** `open`, `items: NavItem[]`, `activeItem`, `onClose`, `onSelect`, `variant`, `className`

**Type:** `NavItem = { id, label, meta?, icon? }`

### RightSidebar (`right-sidebar/right-sidebar.tsx`)

Detail inspector panel with the same **two rendering variants** as LeftSidebar:
- `"overlay"` — slides in from the right with `panelVariants` spring animation
- `"inline"` — static column, used in desktop mode

Provides an editing form for a selected todo: title input, description textarea, priority selector (3-button grid), and delete button.

Like `LeftSidebar`, it now consumes motion factories that downgrade animation when the user prefers reduced motion.

**Props:** `open`, `todo: EditableTodo | null`, `onClose`, `onChange`, `onDelete`, `variant`, `className`

### MobileFooter (`mobile-footer/mobile-footer.tsx`)

A floating bottom tab bar (iOS-style):
- Rounds to `1.8rem` with glassmorphism styling
- 4-column grid layout
- Active tab gets primary color fill
- Each tab has `tapScale` motion for press feedback
- Bottom padding adapts to `env(safe-area-inset-bottom)`

**Props:** `items: FooterTab[]`, `activeItem`, `onChange`

**Type:** `FooterTab = { id, label, icon: LucideIcon }`

### MobilePreviewFrame (`mobile-preview-frame/mobile-preview-frame.tsx`)

A **device frame wrapper** that renders its children inside a realistic bezel. Three modes:

| Mode      | Aspect Ratio | Max Width | Details                                                |
| --------- | ------------ | --------- | ------------------------------------------------------ |
| `mobile`  | 375 × 812   | 420px     | Rounded bezel, dynamic island notch, deep shadow       |
| `tablet`  | 4:3          | 1120px    | Thinner bezel, no notch, subtle top glow               |
| `desktop` | 16:10        | 1480px    | macOS-style window chrome (traffic lights + URL bar)   |

All frames use gradient backgrounds on the outer bezel (`rgba(9,17,31,*)`), inner border glow, and top-edge blur effects. This component is **server-compatible** (no `"use client"` directive).

### Loader (`loader/loader.tsx`)

A branded splash screen overlay:
- Full-screen overlay with radial gradient background
- Spinning logo container (continuous 360° rotation, 2.8s period)
- Inner gradient square logo with glow shadow
- Fades in/out via `loaderVariants`

When reduced motion is enabled, the loader keeps the fade but disables the infinite rotation.

**Props:** `visible: boolean`

### Motion Helpers (`motion/motion-variants.ts`)

Centralized Framer Motion factories reused across all interactive components:

| Export             | Type     | Description                                                     |
| ------------------ | -------- | --------------------------------------------------------------- |
| `createSidebarVariants` | Function | Left sidebar animation with reduced-motion fallback            |
| `createPanelVariants`   | Function | Right panel animation with reduced-motion fallback             |
| `createFadeUpVariants`  | Function | Staggered fade/slide variants, collapses to fade-only when needed |
| `createTapMotion`       | Function | Hover/tap micro-interactions, disabled when reduced motion is set |
| `createLoaderVariants`  | Function | Loader fade timing tuned for normal and reduced motion         |

### Demo Feature Module (`src/features/todo-demo`)

The original God component has been split into focused files:

1. `use-todo-demo-state.ts`
  - Owns all demo state and actions
  - Keeps side-effects (`vibrate`, boot timing, deferred search) inside hooks

2. `todo-demo-shell.tsx`
  - Renders hero copy, preview mode controls, and summary cards

3. `todo-preview-workspace.tsx`
  - Composes the library components into the in-frame app experience

4. `todo-task-list.tsx`
  - Owns queue header, filters, composer, and animated task cards

5. `todo-list-demo.tsx`
  - Thin entry component that binds the state hook to the shell

---

## Custom Hooks

### `useMinimumDelay(active, minimumMs)` (`use-minimum-delay.ts`)

Ensures a boolean state (like a loading spinner) stays `true` for at least `minimumMs` milliseconds, preventing UI flicker from fast operations. Tracks start time via `useRef` and calculates remaining delay.

### `useIsMobile()` (`use-mobile.ts`)

Returns `boolean` based on viewport width < 768px. Uses `window.matchMedia` with a `change` event listener for reactive updates. Returns `false` during SSR (initial `undefined` coerced to `false`).

### `useReducedMotionPreference()` (`use-reduced-motion.ts`)

Tracks the `prefers-reduced-motion: reduce` media query and returns a boolean used by the motion helpers. This keeps animation policy in hooks instead of hardcoding it inside library components.

### `useVibrate()` (`use-vibrate.ts`)

Returns a stable callback (via `useCallback`) that calls `navigator.vibrate()` with a given pattern. Safely no-ops on devices/browsers without vibration support. Used for haptic feedback on button presses throughout the demo.

---

## Motion System

All animations use **Framer Motion** with a consistent approach:

- **Entry/exit**: `AnimatePresence` wraps conditional renders (sidebars, loader, todo items)
- **Layout animations**: `motion.article` with `layout` prop for smooth todo list reordering
- **Spring physics**: sidebars use spring-based open animations (stiffness 260–280, damping 28–30) for natural feel
- **Staggered reveals**: nav items and todo cards use `custom={index}` with `fadeUpVariants` for cascading entrance
- **Micro-interactions**: `tapScale` provides consistent press feedback (`scale: 0.97`) and hover lift (`y: -1`) on interactive elements
- **Exit mode**: todo list uses `mode="popLayout"` on `AnimatePresence` for smooth item removal during layout shifts
- **Reduced motion**: all library motion now routes through factories that collapse movement-heavy transitions into short opacity fades when the system preference is enabled

---

## Page & Routing Architecture

```
/                          → redirects to /docs (server redirect)
/docs                      → Fumadocs documentation site (landing page)
/docs/getting-started      → Getting started guide
/docs/components/*         → Component-level documentation pages
/demo/todolist             → TodoListDemoPage (RSC) → <TodoDemo /> (client)
/api/export                → Static screenshot export (3 viewport PNGs → zip)
/api/screenshots/intelligent?project=<key>  → AI-powered screenshot explorer (Gemini + Playwright → zip)
/api/search                → Fumadocs full-text search endpoint (GET)
```

- **Root page** (`src/app/page.tsx`): Server component that calls `redirect("/docs")`
- **Root layout** (`src/app/layout.tsx`): Server component that sets up fonts, metadata, viewport config, mounts `DevServiceWorkerReset`, and wraps children in `ThemeProvider`
- **Docs layout** (`src/app/docs/layout.tsx`): Wraps docs pages in Fumadocs `RootProvider` + `DocsLayout` with nav tree, search, and links to the demo
- **Docs page** (`src/app/docs/[[...slug]]/page.tsx`): Catch-all renderer using `source.getPage(slug)` to resolve MDX content, generates static params via `source.generateParams()`
- **Demo page** (`src/app/demo/todolist/page.tsx`): Server component shell with metadata, renders the client-only `<TodoListDemo />`
- **Static export route** (`src/app/api/export/route.ts`): Launches headless Chromium, navigates to the demo page, clicks each preview mode button (`data-preview-mode`), and screenshots the `[data-screenshot="preview-frame"]` element at 2× device scale. Returns a zip with `conusai-mobile.png`, `conusai-tablet.png`, `conusai-desktop.png`. Config: `maxDuration = 120`, `dynamic = "force-dynamic"`
- **AI screenshot route** (`src/app/api/screenshots/intelligent/route.ts`): Agentic exploration loop — Gemini 2.5 Flash receives a live screenshot, decides which UI actions to perform, Playwright executes them, then captures the new state. Repeats across all viewports until Gemini signals `done` or `MAX_STEPS` (25) is reached. Returns a zip of all discovered screens. Config: `maxDuration = 300`, `dynamic = "force-dynamic"`
- **Search route** (`src/app/api/search/route.ts`): GET handler created via `createFromSource(source)` for Fumadocs full-text search

The RSC → Client boundary is clean: only `TodoListDemo` and its children are client components. Layout and page shells remain server components.

---

## Documentation System (Fumadocs)

The project uses **Fumadocs** for an in-app documentation site rendered from MDX files.

### Dependencies

| Package              | Role                                              |
| -------------------- | ------------------------------------------------- |
| `fumadocs-core`      | Source loader, page tree, search server utilities  |
| `fumadocs-ui`        | `DocsLayout`, `DocsPage`, `DocsBody`, `RootProvider`, default MDX components |
| `fumadocs-mdx`       | MDX compilation, `createMDX()` Next.js plugin, `defineDocs`/`defineConfig` |
| `@fumadocs/cli`      | (dev) CLI tooling for codegen                     |
| `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react` | MDX runtime and loader chain |

### Source Pipeline

1. **`source.config.ts`** — registers `content/docs` as the docs directory and configures rehype code-block themes (`github-light` / `github-dark`).
2. **`.source/`** (generated, git-ignored) — Fumadocs codegen output. Created on build/dev start by the `fumadocs-mdx` plugin.
3. **`src/lib/docs/source.ts`** — connects the generated source to Fumadocs' `loader()`:
   ```ts
   import { loader } from "fumadocs-core/source";
   import { docs } from "../../../.source/server";

   export const source = loader({
     baseUrl: "/docs",
     source: docs.toFumadocsSource(),
   });
   ```

### Docs Layout (`src/app/docs/layout.tsx`)

Wraps all `/docs/**` routes in:
- `RootProvider` — Fumadocs context (theme disabled since the app has its own `ThemeProvider`; search enabled)
- `DocsLayout` — sidebar nav tree from `source.pageTree`, top nav with "ConusAI Docs" title and link to the Todo demo

### Docs Page Renderer (`src/app/docs/[[...slug]]/page.tsx`)

- `generateStaticParams()` calls `source.generateParams()` for static export of all docs pages
- `generateMetadata()` resolves page title/description from frontmatter
- Renders `DocsPage` → `DocsTitle` + `DocsDescription` + `DocsBody` → MDX content with default Fumadocs components + `createRelativeLink`

### Search (`src/app/api/search/route.ts`)

A GET route handler created from `createFromSource(source)` providing full-text search across all docs pages even without an external search backend.

### Content Structure (`content/docs/`)

```
content/docs/
├── meta.json                # Root nav ordering: ["index", "getting-started", "---Components---", "components"]
├── index.mdx                # Docs landing page
├── getting-started.mdx      # Setup and docs-authoring guide
└── components/
    ├── meta.json            # Component nav ordering
    ├── header.mdx
    ├── left-sidebar.mdx
    ├── loader.mdx
    ├── mobile-footer.mdx
    └── mobile-preview-frame.mdx
```

### Component Previews (`src/components/docs/component-previews.tsx`)

Client component that provides interactive preview wrappers (`HeaderPreview`, `LeftSidebarPreview`, `MobilePreviewFramePreview`, `MobileFooterPreview`, `LoaderPreview`) importable from MDX pages. Each preview composes real library components inside a styled shell with its own local state.

---

## Dev Tooling

### Service Worker Reset (`src/components/dev-service-worker-reset.tsx`)

A **development-only** client component mounted in the root layout (`src/app/layout.tsx`) before `ThemeProvider`. On mount in non-production:

1. Unregisters all existing service worker registrations
2. Clears all Cache Storage entries
3. If stale registrations were found and the session flag `conusai-dev-sw-reset` has not been set, reloads once

This prevents stale `next-pwa` service workers from serving outdated client chunks during development, which can cause runtime module-factory errors.

---

## PWA Configuration

### Manifest (`src/app/manifest.ts`)

Programmatic manifest generation using Next.js `MetadataRoute.Manifest`:
- `display: "standalone"`, `orientation: "portrait"`
- Start URL: `/demo/todolist`
- SVG icons (regular + maskable)

### Service Worker (`next.config.ts`)

Generated by `next-pwa`:
- Disabled in development
- `register: true` + `skipWaiting: true` for immediate activation
- Output to `public/` directory

### Metadata (`layout.tsx`)

- `manifest: "/manifest.webmanifest"`
- `appleWebApp: { capable: true, statusBarStyle: "default" }`
- Theme colors for both light (`#f5f2ea`) and dark (`#09111f`) schemes

---

## Data Flow & State Management

The demo uses **no external state library**. State is owned by `useTodoDemoState()` inside the feature module:

```
useTodoDemoState (state owner)
├── previewMode ────────→ MobilePreviewFrame (mode)
├── booting/showLoader ─→ Loader (visible)
├── language ───────────→ Header → LanguagePicker
├── leftOpen ───────────→ LeftSidebar (open)
├── activeTab ──────────→ LeftSidebar (activeItem), MobileFooter (activeItem)
├── activeNav ──────────→ filter pills (local), visibleTodos (derived)
├── searchQuery ────────→ useDeferredValue → visibleTodos (derived)
├── todos[] ────────────→ visibleTodos (memo), stat cards (derived counts)
├── selectedId ─────────→ RightSidebar (todo), card highlight
└── inspectorOpen ──────→ RightSidebar (open)
```

**Key patterns:**
- `useDeferredValue(searchQuery)` keeps UI responsive during typing
- `startTransition()` wraps nav/tab changes for non-blocking updates
- `useMemo` computes `visibleTodos` (bucket filter + search) only when dependencies change
- `crypto.randomUUID()` generates unique todo IDs client-side
- All mutations (`addTodo`, `toggleTodo`, `updateSelected`, `deleteSelected`) use functional `setState` updates to avoid stale closures
- The demo-only constants (`filterItems`, `footerTabs`, `previewModes`, `initialTodos`) live beside the feature, not inside the library

---

## Responsive Strategy

The library uses a **preview-mode-driven** responsive approach rather than pure CSS breakpoints:

| Preview Mode | Left Sidebar     | Right Sidebar    | Footer        | Language Picker | Grid Layout                     |
| ------------ | ---------------- | ---------------- | ------------- | --------------- | ------------------------------- |
| `mobile`     | Overlay (slide)  | Overlay (slide)  | Shown         | Bottom Sheet    | Single column, max-w 420px      |
| `tablet`     | Inline (static)  | Overlay (slide)  | Hidden        | Dropdown        | Two-column, max-w 1120px        |
| `desktop`    | Inline (static)  | Inline (static)  | Hidden        | Dropdown        | Three-panel, max-w 1480px       |

The **outer page layout** (hero + frame) does use CSS breakpoints via Tailwind classes (`sm:`, `lg:`, `xl:`) for the surrounding content grid.

Sidebar components accept a `variant` prop (`"overlay"` | `"inline"`) to switch between animated overlay and static inline rendering — enabling the same component to work across all device frames without duplication.

---

## Design Tokens & Color System

### Brand Colors

| Token             | Light Mode                | Dark Mode                 | Usage                      |
| ----------------- | ------------------------- | ------------------------- | -------------------------- |
| `--conus-aurora`  | `oklch(0.82 0.12 218.66)` | `oklch(0.81 0.11 218.66)` | Blue-cyan brand accent     |
| `--conus-sun`     | `oklch(0.86 0.09 86.27)`  | `oklch(0.73 0.08 83.5)`   | Warm gold accent           |
| `--conus-shadow`  | `oklch(0.22 0.04 256.48)` | `oklch(0.13 0.02 260.09)` | Deep navy (bezel, shadows) |

### Glassmorphism Pattern

Used extensively across the library:
```
bg-card/70 border-border/70 backdrop-blur-xl shadow-[...]
```

Alpha-transparent backgrounds + blurred backdrop + soft border creates depth without opaque surfaces. Sidebar tokens (`--sidebar`, `--sidebar-border`) include built-in alpha values (e.g., `oklch(... / 92%)`).

### Radius System

All border radii derive from a single `--radius: 1.1rem` token:

| Token        | Multiplier | Value   |
| ------------ | ---------- | ------- |
| `--radius-sm`   | 0.6×   | 0.66rem |
| `--radius-md`   | 0.8×   | 0.88rem |
| `--radius-lg`   | 1.0×   | 1.1rem  |
| `--radius-xl`   | 1.4×   | 1.54rem |
| `--radius-2xl`  | 1.8×   | 1.98rem |
| `--radius-3xl`  | 2.2×   | 2.42rem |
| `--radius-4xl`  | 2.6×   | 2.86rem |

Components also use hardcoded `rounded-[*]` values for fine-tuned bezels and cards (e.g., `rounded-[2.8rem]` for mobile frame, `rounded-[1.8rem]` for footer bar).