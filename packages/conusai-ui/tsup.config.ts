import { defineConfig } from "tsup";

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
  external: [
    "react",
    "react-dom",
    "framer-motion",
    "lucide-react",
    "radix-ui",
    "tailwindcss",
    "tailwindcss/plugin",
  ],
});
