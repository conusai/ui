import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export const conusaiThemeVariables = {
  ":root": {
    "--background": "oklch(0.97 0.01 95.87)",
    "--foreground": "oklch(0.22 0.04 256.48)",
    "--card": "oklch(0.99 0.004 95.81)",
    "--card-foreground": "oklch(0.22 0.04 256.48)",
    "--popover": "oklch(0.99 0.004 95.81)",
    "--popover-foreground": "oklch(0.22 0.04 256.48)",
    "--primary": "oklch(0.3 0.08 255.71)",
    "--primary-foreground": "oklch(0.98 0.002 106.43)",
    "--secondary": "oklch(0.92 0.02 210.41)",
    "--secondary-foreground": "oklch(0.22 0.04 256.48)",
    "--muted": "oklch(0.94 0.01 84.59)",
    "--muted-foreground": "oklch(0.52 0.03 244.14)",
    "--accent": "oklch(0.91 0.05 217.55)",
    "--accent-foreground": "oklch(0.2 0.05 253.79)",
    "--destructive": "oklch(0.58 0.19 25.42)",
    "--border": "oklch(0.88 0.015 83.89)",
    "--input": "oklch(0.88 0.015 83.89)",
    "--ring": "oklch(0.75 0.12 220.87)",
    "--chart-1": "oklch(0.79 0.13 220.87)",
    "--chart-2": "oklch(0.69 0.09 199.14)",
    "--chart-3": "oklch(0.57 0.08 245.86)",
    "--chart-4": "oklch(0.68 0.11 146.17)",
    "--chart-5": "oklch(0.73 0.12 78.91)",
    "--radius": "1.1rem",
    "--sidebar": "oklch(0.985 0.005 99.08 / 92%)",
    "--sidebar-foreground": "oklch(0.22 0.04 256.48)",
    "--sidebar-primary": "oklch(0.3 0.08 255.71)",
    "--sidebar-primary-foreground": "oklch(0.98 0.002 106.43)",
    "--sidebar-accent": "oklch(0.92 0.03 218.19)",
    "--sidebar-accent-foreground": "oklch(0.2 0.05 253.79)",
    "--sidebar-border": "oklch(0.88 0.015 83.89 / 80%)",
    "--sidebar-ring": "oklch(0.75 0.12 220.87)",
    "--conus-aurora": "oklch(0.82 0.12 218.66)",
    "--conus-sun": "oklch(0.86 0.09 86.27)",
    "--conus-shadow": "oklch(0.22 0.04 256.48)",
  },
  ".dark": {
    "--background": "oklch(0.17 0.03 255.89)",
    "--foreground": "oklch(0.95 0.01 94.18)",
    "--card": "oklch(0.22 0.03 256.16 / 92%)",
    "--card-foreground": "oklch(0.95 0.01 94.18)",
    "--popover": "oklch(0.21 0.03 257.46 / 96%)",
    "--popover-foreground": "oklch(0.95 0.01 94.18)",
    "--primary": "oklch(0.81 0.11 218.66)",
    "--primary-foreground": "oklch(0.17 0.03 255.89)",
    "--secondary": "oklch(0.29 0.03 252.95)",
    "--secondary-foreground": "oklch(0.95 0.01 94.18)",
    "--muted": "oklch(0.24 0.03 252.95)",
    "--muted-foreground": "oklch(0.73 0.03 230.15)",
    "--accent": "oklch(0.31 0.04 221.42)",
    "--accent-foreground": "oklch(0.95 0.01 94.18)",
    "--destructive": "oklch(0.68 0.16 24.77)",
    "--border": "oklch(0.99 0 0 / 10%)",
    "--input": "oklch(0.99 0 0 / 13%)",
    "--ring": "oklch(0.81 0.11 218.66)",
    "--chart-1": "oklch(0.81 0.11 218.66)",
    "--chart-2": "oklch(0.72 0.09 192.39)",
    "--chart-3": "oklch(0.65 0.08 254.58)",
    "--chart-4": "oklch(0.73 0.08 145.68)",
    "--chart-5": "oklch(0.79 0.1 83.5)",
    "--sidebar": "oklch(0.21 0.03 257.46 / 92%)",
    "--sidebar-foreground": "oklch(0.95 0.01 94.18)",
    "--sidebar-primary": "oklch(0.81 0.11 218.66)",
    "--sidebar-primary-foreground": "oklch(0.17 0.03 255.89)",
    "--sidebar-accent": "oklch(0.28 0.04 220.52)",
    "--sidebar-accent-foreground": "oklch(0.95 0.01 94.18)",
    "--sidebar-border": "oklch(0.99 0 0 / 10%)",
    "--sidebar-ring": "oklch(0.81 0.11 218.66)",
    "--conus-aurora": "oklch(0.81 0.11 218.66)",
    "--conus-sun": "oklch(0.73 0.08 83.5)",
    "--conus-shadow": "oklch(0.13 0.02 260.09)",
  },
} as const;

export const conusaiUtilities = {
  ".no-scrollbar": {
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  ".touch-target": {
    minHeight: "44px",
    minWidth: "44px",
  },
  ".safe-pt": {
    paddingTop: "env(safe-area-inset-top)",
  },
  ".safe-pb": {
    paddingBottom: "env(safe-area-inset-bottom)",
  },
} as const;

export const conusaiTailwindPreset = {
  theme: {
    extend: {
      borderRadius: {
        sm: "calc(var(--radius) * 0.6)",
        md: "calc(var(--radius) * 0.8)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) * 1.4)",
        "2xl": "calc(var(--radius) * 1.8)",
        "3xl": "calc(var(--radius) * 2.2)",
        "4xl": "calc(var(--radius) * 2.6)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        sidebar: "var(--sidebar)",
        "sidebar-foreground": "var(--sidebar-foreground)",
        "sidebar-border": "var(--sidebar-border)",
        aurora: "var(--conus-aurora)",
        sun: "var(--conus-sun)",
        shadow: "var(--conus-shadow)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)"],
        heading: ["var(--font-space-grotesk)"],
      },
    },
  },
} satisfies Pick<Config, "theme">;

export const conusaiTailwindPlugin = plugin(({ addBase, addUtilities }) => {
  addBase(conusaiThemeVariables);
  addUtilities(conusaiUtilities);
});

export function createConusaiTailwindConfig(content: string[]): Config {
  return {
    content,
    theme: conusaiTailwindPreset.theme,
    plugins: [conusaiTailwindPlugin],
  };
}
