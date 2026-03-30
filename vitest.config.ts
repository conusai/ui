import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/components/conusai-ui/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": "/Users/liutauras.m/Projects/conusai-ui/src",
    },
  },
});
