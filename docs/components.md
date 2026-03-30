# ConusAI UI — Component Library Documentation

## Overview

ConusAI UI is a mobile-first component library designed for building app-shell layouts that render inside device preview frames. It provides a complete set of layout primitives — header, sidebars, footer, loader, language picker, and a device frame — that compose into full-screen mobile/tablet/desktop previews.

The library is published as the `@conusai/ui` npm package (see `packages/conusai-ui/`) and is also consumed internally by the demo apps in `src/features/`.

---

## Design Principles

### 1. Mobile-First, Responsive by Design

Every component is built for a **375 × 812 mobile viewport** first, then adapts to tablet and desktop through variant props (`variant`, `mode`, `surface`). The `MobilePreviewFrame` wraps content in a realistic device chrome for all three breakpoints.

### 2. Composition Over Configuration

Components are atomic layout blocks. They do NOT own routing, data fetching, or global state. The consuming app wires them together via callback props (`onMenuClick`, `onSelect`, `onChange`, `onClose`). This makes them reusable across any demo or product.

### 3. Variant-Driven Styling with CVA

All visual variations are expressed through [class-variance-authority (CVA)](https://cva.style/) variant maps — never with conditional ternary class strings scattered across JSX. Each component exports its CVA definition (e.g. `headerVariants`, `leftSidebarVariants`) alongside the React component.

### 4. `asChild` + Slot Support

Every interactive trigger in the library supports the `asChild` pattern (via Radix `Slot`). When `asChild` is `true` and a custom `children` element is provided, the component merges its props (classes, handlers, accessibility attributes) onto the consumer's element instead of rendering its own. This is the standard shadcn/ui composition pattern.

Components with `asChild` support:
- **Header** — menu button (`menuButtonAsChild`), theme toggle (`themeToggleAsChild`)
- **LanguagePicker** — trigger button (`asChild`)
- **LeftSidebar** — close button (`closeButtonAsChild`), nav items (`NavItem.asChild`)
- **RightSidebar** — back button (`backButtonAsChild`), delete button (`deleteButtonAsChild`)
- **MobileFooter** — tab items (`FooterTab.asChild`)

### 5. Motion with Accessibility

Animations use Framer Motion and are gated by the `useReducedMotionPreference()` hook. Every motion factory function (`createSidebarVariants`, `createFadeUpVariants`, etc.) accepts a `shouldReduceMotion` boolean and returns simplified opacity-only transitions when the user prefers reduced motion.

### 6. Forwarded Refs and Native Prop Spreading

Every component uses `React.forwardRef` and extends the native HTML element's props (`ComponentPropsWithoutRef<"header">`, `<"aside">`, `<"nav">`, etc.). This means consumers can attach refs, add `data-*` attributes, set `aria-*` attributes, or apply additional class names without wrapper hacks.

### 7. `displayName` on Every Component

All forwarded components set a `displayName` (`"ConusHeader"`, `"ConusLeftSidebar"`, etc.). This ensures clear labels in React DevTools and error messages — a standard shadcn/ui practice.

### 8. Data-Slot Attributes for Testing and Theming

Components render a `data-slot` attribute (e.g. `data-slot="conus-header"`, `data-slot="conus-left-sidebar"`) on their root element. This provides stable selectors for integration tests, screenshot tooling, and CSS overrides without coupling to class names.

### 9. Touch-Target Compliance

Interactive elements use the `touch-target` utility class to enforce a minimum 44 × 44px tap area, meeting WCAG 2.5.8 (Target Size) guidelines. Every `<Button>` and interactive element inside the library follows this rule.

### 10. Safe-Area Awareness

The `Header` applies `safe-pt` (safe-area padding top) and the `MobileFooter` applies `safe-pb` (safe-area padding bottom) to respect device notches and home indicators when rendered inside the device frame.

### 11. Semantic HTML

Components use the correct HTML5 elements: `<header>` for the header, `<aside>` for sidebars, `<nav>` for the footer. This provides built-in landmark navigation for screen readers.

### 12. Separated Type Files

Every component has a co-located `.types.ts` file that contains all TypeScript type definitions. Types are re-exported from the barrel `index.ts` so consumers can import both the component and its types from the same path.

---

## Architecture

### File Structure Convention

Each component follows this structure:

```
component-name/
  index.ts                    # Barrel re-exports
  component-name.tsx          # Component implementation
  component-name.types.ts     # TypeScript type definitions
  component-name.test.tsx     # Vitest snapshot test
```

### Barrel Export

All components are re-exported from `src/components/conusai-ui/index.ts`:

```ts
export { ThemeProvider, useTheme } from "../theme-provider";
export type { ComponentPreviewProps } from "./component-preview";
export { ComponentPreview } from "./component-preview";
export type { HeaderProps } from "./header";
export { Header } from "./header";
export type { LanguageOption, LanguagePickerPresentation, LanguagePickerProps } from "./language-picker";
export { LanguagePicker } from "./language-picker";
export type { LeftSidebarProps, NavItem } from "./left-sidebar";
export { LeftSidebar } from "./left-sidebar";
export type { LoaderProps } from "./loader";
export { Loader } from "./loader";
export type { FooterTab, MobileFooterProps } from "./mobile-footer";
export { MobileFooter } from "./mobile-footer";
export type { MobilePreviewFrameProps, PreviewMode } from "./mobile-preview-frame";
export { MobilePreviewFrame } from "./mobile-preview-frame";
export { createFadeUpVariants, createLoaderVariants, createPanelVariants, createSidebarVariants, createTapMotion } from "./motion";
export type { EditableTodo, RightSidebarProps } from "./right-sidebar";
export { RightSidebar } from "./right-sidebar";
```

### Package Exports Map

The `@conusai/ui` package exposes multiple sub-path exports for optimal tree-shaking:

| Sub-path | Contents |
|----------|----------|
| `.` | All components, types, ThemeProvider, useTheme |
| `./motion` | Motion variant factory functions only |
| `./theme-provider` | ThemeProvider + useTheme only |
| `./component-preview` | ComponentPreview wrapper only |
| `./tailwind` | Tailwind plugin, preset, and utilities |

**Consumer imports:**

```ts
// Everything
import { Header, LeftSidebar, useTheme } from "@conusai/ui";

// Sub-paths for tree-shaking
import { createSidebarVariants } from "@conusai/ui/motion";
import { ThemeProvider } from "@conusai/ui/theme-provider";
import { ComponentPreview } from "@conusai/ui/component-preview";
import { conusaiTailwindPlugin } from "@conusai/ui/tailwind";
```

### Build Configuration (tsup)

```ts
export default defineConfig({
  entry: [
    "src/index.ts",
    "src/tailwind.ts",
    "src/motion.ts",
    "src/theme-provider.ts",
    "src/component-preview.ts",
  ],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  treeshake: true,
  tsconfig: "./tsconfig.json",
  external: ["react", "react-dom", "framer-motion", "lucide-react", "radix-ui", "tailwindcss", "tailwindcss/plugin"],
});
```

---

## Shared Infrastructure

### ThemeProvider

**Import:** `import { ThemeProvider, useTheme } from "@conusai/ui"` or `"@conusai/ui/theme-provider"`

A context-based theme provider that manages `"light" | "dark" | "system"` themes.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `attribute` | `"class"` | `"class"` | Applies theme as a class on `<html>` |
| `defaultTheme` | `"light" \| "dark" \| "system"` | `"system"` | Initial theme value |
| `enableSystem` | `boolean` | `true` | Whether to track `prefers-color-scheme` |
| `disableTransitionOnChange` | `boolean` | `false` | Temporarily disable CSS transitions on theme switch |
| `storageKey` | `string` | `"conusai-ui-theme"` | `localStorage` key for persistence |

**`useTheme()` returns:**

| Field | Type | Description |
|-------|------|-------------|
| `theme` | `"light" \| "dark" \| "system"` | The raw theme setting |
| `resolvedTheme` | `"light" \| "dark"` | The computed actual theme (resolves `"system"`) |
| `setTheme` | `(theme: Theme) => void` | Update the theme |

### Motion Utilities

**Import:** `import { createSidebarVariants, createFadeUpVariants, ... } from "@conusai/ui"` or `"@conusai/ui/motion"`

Factory functions that return Framer Motion `Variants` objects. Each function takes a `shouldReduceMotion: boolean` parameter.

| Function | Purpose | Reduced Motion Behavior |
|----------|---------|------------------------|
| `createSidebarVariants(reduce)` | Slide-in from left for `LeftSidebar` | Opacity-only fade (0.16s) |
| `createPanelVariants(reduce)` | Slide-in from right for `RightSidebar` | Opacity-only fade (0.16s) |
| `createFadeUpVariants(reduce)` | Staggered fade-up for list items | Opacity-only fade, no `y` offset |
| `createLoaderVariants(reduce)` | Fade in/out for the `Loader` overlay | Shorter durations (0.14s) |
| `createTapMotion(reduce)` | `whileTap` scale + `whileHover` lift | Returns empty object (no motion) |
| `cnMotionProps(...propsList)` | Merges multiple Framer Motion prop objects | Utility, not motion-specific |

### Tailwind Plugin

**Import:** `import { conusaiTailwindPlugin, conusaiTailwindPreset, conusaiThemeVariables, conusaiUtilities, createConusaiTailwindConfig } from "@conusai/ui/tailwind"`

A Tailwind plugin and preset that provides the exact theme tokens, colors, and utility classes used by the library. Consumers can import this to get full theme parity without copying CSS.

| Export | Purpose |
|--------|---------|
| `conusaiTailwindPlugin` | Tailwind v4 plugin with all custom utilities |
| `conusaiTailwindPreset` | Full preset (colors, radius, fonts) |
| `conusaiThemeVariables` | Raw CSS custom property definitions |
| `conusaiUtilities` | Custom utility classes (`touch-target`, `safe-pt`, `safe-pb`, `font-heading`) |
| `createConusaiTailwindConfig` | Factory to compose plugin + preset into a Tailwind config |

### ComponentPreview

**Import:** `import { ComponentPreview } from "@conusai/ui"` or `"@conusai/ui/component-preview"`

**displayName:** `"ConusComponentPreview"`

A styled wrapper for showcasing components in documentation (Fumadocs live blocks, marketing pages).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Additional CSS classes |
| `children` | `ReactNode` | — | Content to preview |

**Rendered element:** `<div>` with `data-slot="conus-component-preview"`, rounded corners, border, card background, and subtle shadow.

### Hooks

| Hook | Description |
|------|-------------|
| `useReducedMotionPreference()` | Returns `true` when user prefers reduced motion (`prefers-reduced-motion: reduce`) |
| `useIsMobile()` | Returns `true` when viewport width < 768px |
| `useTheme()` | Access current theme and setter (requires `ThemeProvider` ancestor) |

### Utility: `cn()`

`cn(...inputs)` merges class names using `clsx` + `tailwind-merge`. Used by every component for safe Tailwind class composition.

---

## Components

---

### Header

**Import:** `import { Header } from "@conusai/ui"`

**displayName:** `"ConusHeader"`

The top-bar component for app-shell layouts. Includes a menu toggle button, title/subtitle, language picker, theme toggle, and an avatar.

#### Props (`HeaderProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | **Required.** Primary heading text |
| `subtitle` | `string` | — | **Required.** Small uppercase label above the title |
| `language` | `string` | — | **Required.** Active language value (e.g. `"en"`) |
| `languages` | `LanguageOption[]` | — | **Required.** Available language options |
| `onLanguageChange` | `(value: string) => void` | — | **Required.** Called when user picks a language |
| `onMenuClick` | `() => void` | — | **Required.** Called when the hamburger menu is tapped |
| `showMenuButton` | `boolean` | `true` | Whether to render the menu/hamburger button |
| `languagePresentation` | `LanguagePickerPresentation` | `"auto"` | How the language picker renders (see LanguagePicker) |
| `languagePickerProps` | `Partial<Omit<LanguagePickerProps, "options" \| "value" \| "onChange">>` | — | Additional props forwarded to the embedded `LanguagePicker` |
| `menuButtonAsChild` | `boolean` | `false` | Render menu button as `asChild` Slot |
| `menuButtonChild` | `ReactNode` | — | Custom element for the menu button trigger |
| `menuButtonLabel` | `string` | `"Open navigation"` | `aria-label` for the menu button |
| `themeToggleAsChild` | `boolean` | `false` | Render theme toggle as `asChild` Slot |
| `themeToggleChild` | `ReactNode` | — | Custom element for the theme toggle trigger |
| `themeToggleLabel` | `string` | `"Toggle theme"` | `aria-label` for the theme toggle |
| `avatar` | `ReactNode` | Default `CA` avatar | Custom avatar element (replaces the default) |
| `surface` | `"default" \| "elevated"` | `"default"` | Visual surface variant |
| `className` | `string` | — | Additional CSS classes |

**Surface variants:**
- `default` — translucent background with subtle border (`bg-background/70`)
- `elevated` — card-like surface with drop shadow (`bg-card/85 shadow-[...]`)

**asChild usage:**

```tsx
<Header
  menuButtonAsChild
  menuButtonChild={<MyCustomMenuIcon />}
  themeToggleAsChild
  themeToggleChild={<MyCustomThemeSwitch />}
  avatar={<img src="/avatar.png" />}
  // ... other required props
/>
```

**Rendered elements:** `<header>` with `data-slot="conus-header"`, `data-surface={surface}`

**Internal composition:** Embeds `LanguagePicker`, `Button` (theme toggle, menu toggle), and `Avatar`.

---

### LanguagePicker

**Import:** `import { LanguagePicker } from "@conusai/ui"`

**displayName:** `"ConusLanguagePicker"`

A responsive language selector that renders as a dropdown on desktop and a bottom sheet on mobile.

#### Props (`LanguagePickerProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `LanguageOption[]` | — | **Required.** Array of language options |
| `value` | `string` | — | **Required.** Currently selected language value |
| `onChange` | `(value: string) => void` | — | **Required.** Called when a language is selected |
| `presentation` | `LanguagePickerPresentation` | `"auto"` | Rendering strategy |
| `triggerVariant` | `"outline" \| "ghost"` | `"outline"` | Visual style of the trigger button |
| `ariaLabel` | `string` | `"Change language"` | Accessible label for the trigger |
| `asChild` | `boolean` | `false` | Render trigger as `asChild` Slot |
| `children` | `ReactNode` | `<Globe />` icon | Custom trigger element (used with `asChild`) |
| `title` | `string` | `"Language"` | Title shown in the sheet header (mobile) |
| `className` | `string` | — | Additional CSS classes on the trigger |

#### Types

```ts
type LanguageOption = {
  value: string;   // e.g. "en"
  label: string;   // e.g. "English"
  flag: string;    // e.g. "🇺🇸" (emoji flag)
};

type LanguagePickerPresentation = "auto" | "sheet" | "dropdown";
```

**Presentation modes:**
- `"auto"` — Uses `useIsMobile()` to choose: sheet on mobile (< 768px), dropdown on desktop
- `"sheet"` — Always renders as a bottom sheet (`Sheet` from shadcn/ui)
- `"dropdown"` — Always renders as a `DropdownMenu`

**asChild usage:**

```tsx
<LanguagePicker
  asChild
  options={languages}
  value="en"
  onChange={setLanguage}
>
  <button className="my-custom-trigger">🌐 {currentLanguage}</button>
</LanguagePicker>
```

---

### LeftSidebar

**Import:** `import { LeftSidebar } from "@conusai/ui"`

**displayName:** `"ConusLeftSidebar"`

A navigation sidebar that supports two layout modes: an animated overlay panel (mobile) or a persistent inline sidebar (desktop).

#### Props (`LeftSidebarProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | **Required.** Controls visibility (used by overlay variant) |
| `items` | `NavItem[]` | — | **Required.** Navigation items to render |
| `activeItem` | `string` | — | **Required.** ID of the currently active nav item |
| `onClose` | `() => void` | — | **Required.** Called when sidebar should close |
| `onSelect` | `(id: string) => void` | — | **Required.** Called when a nav item is tapped |
| `variant` | `"overlay" \| "inline"` | `"overlay"` | Layout mode |
| `eyebrow` | `string` | `"Library Nav"` | Small uppercase label above the title |
| `title` | `string` | `"Workspace"` | Sidebar heading text |
| `note` | `ReactNode` | Default "ConusAI Notes" card | Custom footer note (replaces the default) |
| `closeButtonAsChild` | `boolean` | `false` | Render close button as `asChild` Slot |
| `closeButtonChild` | `ReactNode` | `<X />` icon | Custom close button element |
| `closeButtonLabel` | `string` | `"Close navigation"` | `aria-label` for the close button |
| `renderItem` | `(item: NavItem, state: { active: boolean; index: number }) => ReactNode` | — | Custom render function for nav items (overrides default rendering) |
| `className` | `string` | — | Additional CSS classes |

#### Types

```ts
type NavItem = {
  id: string;          // Unique identifier
  label: string;       // Display text
  meta?: string;       // Optional right-aligned metadata text
  icon?: LucideIcon;   // Optional Lucide icon component
  ariaLabel?: string;  // Custom aria-label (defaults to label)
  asChild?: boolean;   // Render this item as a Slot
  children?: ReactNode; // Custom element when asChild is true
};
```

**Variant behavior:**
- `overlay` — Renders inside `AnimatePresence`. When `open` is `true`, shows a backdrop (click to close) and a slide-in panel from the left. Uses `createSidebarVariants` for spring-based enter animation.
- `inline` — Renders as a static `<aside>` with fixed width (`w-64`). No close button. No backdrop. No animation.

**Item asChild usage:**

```tsx
<LeftSidebar
  items={[
    { id: "home", label: "Home", icon: Home },
    {
      id: "custom",
      label: "Custom",
      asChild: true,
      children: <a href="/custom">Custom Link</a>,
    },
  ]}
  // ...
/>
```

**Custom renderItem usage:**

```tsx
<LeftSidebar
  renderItem={(item, { active, index }) => (
    <a href={`/${item.id}`} className={active ? "active" : ""}>
      {item.label}
    </a>
  )}
  // ...
/>
```

**Internal layout:**
1. Header section with eyebrow label + heading + optional close button
2. Nav items as `motion.button` elements (or Slot / custom render) with staggered `createFadeUpVariants` animation and `createTapMotion` interaction
3. Footer note card (customizable via `note` prop)

**Rendered element:** `<aside>` with `data-slot="conus-left-sidebar"`, `data-variant={variant}`

---

### RightSidebar

**Import:** `import { RightSidebar } from "@conusai/ui"`

**displayName:** `"ConusRightSidebar"`

A detail/inspector panel that slides in from the right. Designed for task editing workflows but accepts arbitrary children for custom content.

#### Props (`RightSidebarProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | **Required.** Controls visibility |
| `todo` | `EditableTodo \| null` | `null` | Task data for built-in edit form |
| `onClose` | `() => void` | — | **Required.** Called when sidebar should close |
| `onChange` | `(patch: Partial<EditableTodo>) => void` | — | Called when a field is edited |
| `onDelete` | `() => void` | — | Called when delete button is clicked |
| `variant` | `"overlay" \| "inline"` | `"overlay"` | Layout mode |
| `panelEyebrow` | `string` | `"Inspector"` | Small label above panel title |
| `panelTitle` | `string` | `"Task detail"` | Panel heading text |
| `backLabel` | `string` | `"Back"` | Label on the back/close button |
| `showDeleteButton` | `boolean` | `true` | Whether to show the delete action |
| `backButtonAsChild` | `boolean` | `false` | Render back button as `asChild` Slot |
| `backButtonChild` | `ReactNode` | `<ArrowLeft /> Back` | Custom back button element |
| `deleteButtonAsChild` | `boolean` | `false` | Render delete button as `asChild` Slot |
| `deleteButtonChild` | `ReactNode` | `<Trash2 />` icon | Custom delete button element |
| `deleteButtonLabel` | `string` | `"Delete task"` | `aria-label` for the delete button |
| `emptyState` | `ReactNode` | Default placeholder | Custom content when no `todo` is selected |
| `children` | `ReactNode` | — | Custom panel body (overrides built-in form) |
| `className` | `string` | — | Additional CSS classes |

#### Types

```ts
type EditableTodo = {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
};
```

**Variant behavior:**
- `overlay` — Animated slide-in from right with backdrop. Uses `createPanelVariants`. Only renders when `open` is `true` AND there is content (`todo` or `children`).
- `inline` — Fixed-width `320px` panel. Renders as an animated `<aside>` without backdrop. Same content gate (`open && hasContent`).

**Built-in form (when `todo` is provided and no `children`):**
- Title — `<Input>` bound to `todo.title`
- Description — `<textarea>` bound to `todo.description`
- Priority — 3-button toggle (`Low`, `Medium`, `High`) with active state via CVA

**Custom content (when `children` is provided):** The built-in form is replaced entirely with the provided children.

**Rendered element:** `<aside>` with `data-slot="conus-right-sidebar"`, `data-variant={variant}`

---

### MobileFooter

**Import:** `import { MobileFooter } from "@conusai/ui"`

**displayName:** `"ConusMobileFooter"`

A bottom tab bar for mobile navigation. Renders a fixed row of 4 icon+label tabs.

#### Props (`MobileFooterProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `FooterTab[]` | — | **Required.** Tab items (exactly 4 expected by the grid) |
| `activeItem` | `string` | — | **Required.** ID of the active tab |
| `onChange` | `(id: string) => void` | — | **Required.** Called when a tab is tapped |
| `surface` | `"floating" \| "flush"` | `"floating"` | Visual surface variant |
| `renderItem` | `(item: FooterTab, state: { active: boolean; index: number }) => ReactNode` | — | Custom render function for tab items (overrides default rendering) |
| `className` | `string` | — | Additional CSS classes |

#### Types

```ts
type FooterTab = {
  id: string;          // Unique identifier
  label: string;       // Tab display text
  icon: LucideIcon;    // Lucide icon component
  ariaLabel?: string;  // Custom aria-label (defaults to label)
  asChild?: boolean;   // Render this tab as a Slot
  children?: ReactNode; // Custom element when asChild is true
};
```

**Surface variants:**
- `floating` — Absolutely positioned with rounded corners, border, shadow, and `backdrop-blur-xl`. Floats above content.
- `flush` — Relative positioning, no border or shadow. Sits inline in the layout flow.

**Item asChild usage:**

```tsx
<MobileFooter
  items={[
    { id: "home", label: "Home", icon: Home },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      asChild: true,
      children: (
        <a href="/settings">
          <Settings className="size-4" />
          <span>Settings</span>
        </a>
      ),
    },
  ]}
  // ...
/>
```

**Interaction:** Each tab uses `motion.button` with `createTapMotion` for haptic-like press feedback. Active tab uses `bg-primary text-primary-foreground`.

**Rendered element:** `<nav>` with `data-slot="conus-mobile-footer"`, `data-surface={surface}`

---

### MobilePreviewFrame

**Import:** `import { MobilePreviewFrame } from "@conusai/ui"`

**displayName:** `"ConusMobilePreviewFrame"`

A purely decorative device frame that wraps child content in realistic device chrome. Used for showcasing app UI in documentation, marketing pages, and screenshot generation.

#### Props (`MobilePreviewFrameProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | **Required.** Content to render inside the device frame |
| `mode` | `PreviewMode` | `"mobile"` | Device form factor |
| `screenshotCrop` | `boolean` | `false` | Strip all chrome for clean screenshot exports |
| `screenClassName` | `string` | — | Additional CSS classes on the viewport/screen area |
| `frameClassName` | `string` | — | Additional CSS classes on the outer frame shell |
| `chromeLabel` | `string` | `"conusai.app/demo"` | URL shown in the desktop address bar |
| `className` | `string` | — | Additional CSS classes on the root wrapper |

#### Types

```ts
type PreviewMode = "mobile" | "tablet" | "desktop";
```

**Mode rendering:**
- `mobile` — Max width `420px`. iPhone-style frame with rounded corners (`2.8rem`), notch bar, and 375:812 aspect ratio. Dark chrome gradient with ambient glow effect.
- `tablet` — Max width `1120px`. iPad-style frame with 4:3 aspect ratio. Simpler chrome without notch.
- `desktop` — Max width `1480px`. macOS-style window frame with traffic light dots (red/yellow/green), address bar (customizable via `chromeLabel`), and 16:10 aspect ratio. Light/dark adaptive chrome using a `dark:` variant.

**Screenshot cropping:** When `screenshotCrop` is `true`, the component strips all decorative chrome (borders, shadows, notch, address bar), leaving only the content viewport — perfect for automated screenshot generation without device chrome.

**Screenshot support:** Renders `data-screenshot="preview-frame"`, `data-screenshot-crop={screenshotCrop}`, and `data-preview-mode={mode}` attributes for automated screenshot tooling.

**Rendered element:** `<div>` with `data-slot="conus-mobile-preview-frame"`

---

### Loader

**Import:** `import { Loader } from "@conusai/ui"`

**displayName:** `"ConusLoader"`

A full-screen loading overlay with a spinning branded icon and status text.

#### Props (`LoaderProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | — | **Required.** Controls visibility |
| `tone` | `"default" \| "soft"` | `"default"` | Background opacity/intensity |
| `children` | `ReactNode` | — | Custom loader body (overrides default branded UI) |
| `label` | `string` | `"ConusAI"` | Heading text below the spinner |
| `description` | `string` | `"Calibrating the mobile demo"` | Subtext below the label |
| `indicator` | `ReactNode` | Default spinning gradient icon | Custom spinner/indicator element |
| `className` | `string` | — | Additional CSS classes |

**Tone variants:**
- `default` — Stronger radial gradient overlay (`rgba(110,204,255,0.24)` aurora highlight, `rgba(9,17,31,0.96)` base)
- `soft` — Lighter overlay for less prominent loading states

**Customization levels:**
1. **Label + description only** — Change the text while keeping the default spinner: `<Loader visible label="Loading" description="Please wait..." />`
2. **Custom indicator** — Replace only the spinner: `<Loader visible indicator={<MySpinner />} />`
3. **Full override** — Replace the entire loader body: `<Loader visible><MyCustomLoader /></Loader>`

**Animation:**
- Entry/exit controlled by `AnimatePresence` + `createLoaderVariants`
- Inner icon rotates continuously (360°, 2.8s, linear) unless reduced motion is preferred
- Icon is a gradient square (`110,204,255` → `255,211,126`) inside nested circular borders

**Rendered element:** `<div>` with `data-slot="conus-loader"`, `data-tone={tone}`

---

## Component Template

The file `template.tsx` provides a skeleton for creating new components with `asChild` + Slot support built in:

```tsx
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

const conusComponentVariants = cva("", {
  variants: {
    surface: {
      default: "",
    },
  },
  defaultVariants: {
    surface: "default",
  },
});

export interface ConusComponentTemplateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof conusComponentVariants> {}

const ConusComponentTemplate = React.forwardRef<
  HTMLDivElement,
  ConusComponentTemplateProps & { asChild?: boolean }
>(({ asChild = false, className, surface, ...props }, ref) => {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      ref={ref}
      className={cn(conusComponentVariants({ surface }), className)}
      {...props}
    />
  );
});

ConusComponentTemplate.displayName = "ConusComponentTemplate";
```

**When creating a new component:**
1. Copy `template.tsx` into a new `component-name/` directory
2. Create `component-name.types.ts` with the props type extending native element props
3. Create `component-name.test.tsx` with at least one Vitest snapshot test
4. Create `index.ts` barrel re-exporting the component and types
5. Add the export to `src/components/conusai-ui/index.ts`
6. Use CVA for all visual variants
7. Use `React.forwardRef` with the appropriate HTML element type
8. Add `asChild` + `Slot` support for interactive triggers
9. Set `displayName = "Conus{ComponentName}"`
10. Add `data-slot="conus-{component-name}"` to the root element
11. Gate any animations behind `useReducedMotionPreference()`

---

## CSS & Theming

### Design Tokens

The library uses CSS custom properties (oklch color space) defined in `globals.css`. Key tokens:

| Token | Purpose |
|-------|---------|
| `--background` | Page background |
| `--foreground` | Primary text color |
| `--card` | Card/panel backgrounds |
| `--primary` / `--primary-foreground` | Active states, CTAs |
| `--muted` / `--muted-foreground` | Subdued text and surfaces |
| `--border` | Border color |
| `--sidebar` | Sidebar-specific background |
| `--radius` | Base border radius (components use multiples: `0.6×` to `2.6×`) |

### Custom CSS Utilities

| Class | Purpose |
|-------|---------|
| `touch-target` | Minimum 44×44px tap area |
| `safe-pt` | `padding-top` respecting `env(safe-area-inset-top)` |
| `safe-pb` | `padding-bottom` respecting `env(safe-area-inset-bottom)` |
| `font-heading` | Space Grotesk heading font |

### Backdrop Blur

Most surfaces use `backdrop-blur-xl` or `backdrop-blur-2xl` for a frosted-glass effect. This is a core visual identity of the library — surfaces are semi-transparent and blur the content behind them.

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `class-variance-authority` | Variant-driven styling |
| `framer-motion` | Animations and gestures |
| `lucide-react` | Icon set |
| `radix-ui` | Slot primitive for `asChild` composition |
| `clsx` + `tailwind-merge` | Class name composition |
| `@radix-ui/*` (via shadcn/ui) | Accessible primitives (`DropdownMenu`, `Sheet`, `Avatar`, etc.) |
| `tailwindcss` v4 | Utility-first CSS (peer dependency) |
