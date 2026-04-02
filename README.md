# ConusAI UI

Mobile-first, copy-paste component library built on **Next.js 16**, **React 19**, **Tailwind CSS 4**, and **Framer Motion** — following the **shadcn/ui** open-code philosophy.

> Components are files, not packages. Install them into your project with a single command.

## Quick Start

```bash
bun run https://raw.githubusercontent.com/conusai/conusai-ui/main/scripts/conusai-add.ts header
```

No install required — runs the CLI directly from GitHub. Once installed, files are **yours**.

## CLI Reference

```bash
# List all available components
bun run https://raw.githubusercontent.com/conusai/conusai-ui/main/scripts/conusai-add.ts --list

# Add a single component
bun run https://raw.githubusercontent.com/conusai/conusai-ui/main/scripts/conusai-add.ts header

# Add multiple (dependencies auto-resolved)
bun run https://raw.githubusercontent.com/conusai/conusai-ui/main/scripts/conusai-add.ts header language-picker mobile-footer

# Install everything
bun run https://raw.githubusercontent.com/conusai/conusai-ui/main/scripts/conusai-add.ts --all

# Custom target directory (default: src)
bun run https://raw.githubusercontent.com/conusai/conusai-ui/main/scripts/conusai-add.ts header --dir src/components

# Preview without writing files
bun run https://raw.githubusercontent.com/conusai/conusai-ui/main/scripts/conusai-add.ts header --dry-run

# Install from a fork or branch
bun run https://raw.githubusercontent.com/conusai/conusai-ui/main/scripts/conusai-add.ts header --repo your-org/conusai-ui --branch develop
```

## Available Components

| Component | Description |
|-----------|-------------|
| `header` | App header with leading/trailing slots, glassmorphism, safe-area support |
| `language-picker` | Accessible language selector (Sheet or DropdownMenu) |
| `left-sidebar` | Animated navigation sidebar (overlay / inline) |
| `loader` | Full-screen animated loader with gradient spinner |
| `mobile-footer` | Bottom tab bar with tap animations and safe-area padding |
| `mobile-preview-frame` | Device frame wrapper (mobile / tablet / desktop) |
| `right-sidebar` | Generic detail panel with animated enter/exit |
| `component-preview` | Bordered card for component demos |
| `theme-provider` | Zero-dependency light/dark/system theme context |
| `motion-variants` | Framer Motion variant factories with reduced-motion support |

### Hooks

| Hook | Description |
|------|-------------|
| `use-reduced-motion` | `prefers-reduced-motion` media query |
| `use-mobile` | Viewport-based mobile detection |
| `use-minimum-delay` | Minimum loader duration |
| `use-vibrate` | Haptic feedback wrapper |

## Routes

- `/` redirects to `/docs`
- `/docs` Fumadocs documentation site
- `/demo/todolist` TodoList showcase inside a mobile preview frame
- `/demo/logistix` Logistix AI invoice demo

## Stack

- Next.js 16 App Router + React Compiler + Turbopack
- React 19 (`startTransition`, `useDeferredValue`)
- Tailwind CSS 4 (CSS-first config, OKLCH tokens)
- shadcn/ui v4 (radix-nova style) + Radix UI
- Framer Motion 12 with reduced-motion support
- Custom ThemeProvider (class strategy, localStorage)
- Fumadocs for documentation
- Biome 2.4 + ESLint for linting
- Vitest + Testing Library for tests
- next-pwa for service worker (production)

## Development

```bash
bun install
bun run dev
```

Open `http://localhost:3000/docs` for documentation.

Open `http://localhost:3000/demo/todolist` for the TodoList demo.

## Build & Lint

```bash
bun run lint
bun run build
bun run build:registry   # Regenerate registry/registry.json
```

## Architecture

See [docs/arch.md](docs/arch.md) for the full architecture reference.

See [docs/refactoring.md](docs/refactoring.md) for the refactoring plan and migration checklist.
