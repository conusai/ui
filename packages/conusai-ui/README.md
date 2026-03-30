# @conusai/ui

Composition-first mobile UI primitives for ConusAI demos and documentation.

## Installation

```bash
npm install @conusai/ui
```

## Usage

```tsx
import { Header, MobilePreviewFrame, ThemeProvider } from "@conusai/ui";

export function Example() {
  return (
    <ThemeProvider>
      <MobilePreviewFrame>
        <Header
          title="Operations"
          subtitle="ConusAI"
          language="en"
          languages={[{ value: "en", label: "English", flag: "US" }]}
          onLanguageChange={() => undefined}
          onMenuClick={() => undefined}
        />
      </MobilePreviewFrame>
    </ThemeProvider>
  );
}
```

## Tailwind

```ts
import { createConusaiTailwindConfig } from "@conusai/ui/tailwind";

export default createConusaiTailwindConfig([
  "./src/**/*.{ts,tsx}",
  "./node_modules/@conusai/ui/dist/**/*.{js,mjs}",
]);
```

For finer control, import `conusaiTailwindPlugin`, `conusaiThemeVariables`, and `conusaiUtilities` from `@conusai/ui/tailwind`.