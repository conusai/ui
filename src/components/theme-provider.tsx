"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  attribute?: "class";
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
};

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme() {
  if (typeof window === "undefined") {
    return "light" as const;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  storageKey = "conusai-ui-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(
    defaultTheme === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;

    if (
      storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "system"
    ) {
      setThemeState(storedTheme);
      return;
    }

    setThemeState(defaultTheme);
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    if (!enableSystem || theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => {
      setResolvedTheme(mediaQuery.matches ? "dark" : "light");
    };

    updateSystemTheme();
    mediaQuery.addEventListener("change", updateSystemTheme);

    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, [enableSystem, theme]);

  useEffect(() => {
    const nextResolvedTheme =
      theme === "system" && enableSystem ? getSystemTheme() : theme;

    if (disableTransitionOnChange) {
      document.documentElement.style.setProperty("transition", "none");
    }

    setResolvedTheme(nextResolvedTheme === "dark" ? "dark" : "light");

    if (attribute === "class") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(nextResolvedTheme);
    }

    window.localStorage.setItem(storageKey, theme);

    if (!disableTransitionOnChange) {
      return;
    }

    const timeout = window.setTimeout(() => {
      document.documentElement.style.removeProperty("transition");
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [attribute, disableTransitionOnChange, enableSystem, storageKey, theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: setThemeState,
    }),
    [resolvedTheme, theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return context;
}
