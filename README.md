# ConusAI UI

ConusAI UI is a Next 16 demo workspace for a mobile-first component library built on the App Router, shadcn-style primitives, Framer Motion, next-themes, and PWA metadata.

## Routes

- `/` redirects to `/demo/todolist`
- `/demo/todolist` renders the TodoList showcase page inside a mobile preview frame

## Stack

- Next.js 16 App Router
- React 19 + React Compiler
- Tailwind CSS 4 with CSS-first theme variables
- shadcn radix-nova primitives under `src/components/ui`
- Framer Motion for transitions
- next-themes for system theme support
- next-pwa for service worker generation in production builds

## Development

```bash
bun install
bun run dev
```

Open `http://localhost:3000/demo/todolist`.

## Build Checks

```bash
bun run lint
bun run build
```
