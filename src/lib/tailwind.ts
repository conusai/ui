import type { Config } from "tailwindcss";

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

export function createConusaiTailwindConfig(content: string[]): Config {
  return {
    content,
    theme: conusaiTailwindPreset.theme,
  };
}
