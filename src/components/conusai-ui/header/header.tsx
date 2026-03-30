"use client";

import { cva } from "class-variance-authority";
import { Menu, MoonStar, SunMedium } from "lucide-react";
import * as React from "react";

import { LanguagePicker } from "@/components/conusai-ui/language-picker";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { HeaderProps } from "./header.types";

const headerVariants = cva(
  "safe-pt flex items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur-xl",
  {
    variants: {
      surface: {
        default: "border-border/60 bg-background/70",
        elevated:
          "border-border/70 bg-card/85 shadow-[0_18px_40px_-28px_rgba(10,16,31,0.55)]",
      },
    },
    defaultVariants: {
      surface: "default",
    },
  }
);

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
      title,
      subtitle,
      language,
      languages,
      onLanguageChange,
      onMenuClick,
      showMenuButton = true,
      languagePresentation = "auto",
      languagePickerProps,
      menuButtonAsChild = false,
      menuButtonChild,
      menuButtonLabel = "Open navigation",
      themeToggleAsChild = false,
      themeToggleChild,
      themeToggleLabel = "Toggle theme",
      avatar,
      surface = "default",
      className,
      ...props
    },
    ref
  ) => {
    const { resolvedTheme, setTheme } = useTheme();
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

    return (
      <header
        ref={ref}
        data-slot="conus-header"
        data-surface={surface}
        className={cn(headerVariants({ surface }), className)}
        {...props}
      >
        <div className="flex min-w-0 items-center gap-3">
          {showMenuButton ? (
            <Button
              asChild={menuButtonAsChild && Boolean(menuButtonChild)}
              variant="outline"
              size="icon-sm"
              className="touch-target border-border/70 bg-background/80"
              onClick={onMenuClick}
              aria-label={menuButtonLabel}
            >
              {menuButtonChild ?? <Menu />}
            </Button>
          ) : null}
          <div className="min-w-0">
            <p className="truncate font-heading text-[0.95rem] uppercase tracking-[0.18em] text-muted-foreground">
              {subtitle}
            </p>
            <h1 className="truncate text-base font-semibold">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguagePicker
            options={languages}
            value={language}
            onChange={onLanguageChange}
            presentation={languagePresentation}
            triggerVariant="outline"
            {...languagePickerProps}
          />
          <Button
            asChild={themeToggleAsChild && Boolean(themeToggleChild)}
            variant="outline"
            size="icon-sm"
            className="touch-target border-border/70 bg-background/80"
            onClick={() => setTheme(nextTheme)}
            aria-label={themeToggleLabel}
          >
            {themeToggleChild ??
              (resolvedTheme === "dark" ? <SunMedium /> : <MoonStar />)}
          </Button>
          {avatar ?? (
            <Avatar className="ring-1 ring-border/60">
              <AvatarFallback className="bg-[linear-gradient(135deg,rgba(110,204,255,0.32),rgba(255,211,126,0.38))] text-foreground">
                CA
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </header>
    );
  }
);

Header.displayName = "ConusHeader";

export { Header };
