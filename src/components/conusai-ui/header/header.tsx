"use client";

import { Menu, MoonStar, SunMedium } from "lucide-react";

import { LanguagePicker } from "@/components/conusai-ui/language-picker";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { HeaderProps } from "./header.types";

export function Header({
  title,
  subtitle,
  language,
  languages,
  onLanguageChange,
  onMenuClick,
  showMenuButton = true,
  languagePresentation = "auto",
  className,
}: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header
      className={cn(
        "safe-pt flex items-center justify-between gap-3 border-b border-border/60 bg-background/70 px-4 py-3 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {showMenuButton ? (
          <Button
            variant="outline"
            size="icon-sm"
            className="touch-target border-border/70 bg-background/80"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <Menu />
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
        />
        <Button
          variant="outline"
          size="icon-sm"
          className="touch-target border-border/70 bg-background/80"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? <SunMedium /> : <MoonStar />}
        </Button>
        <Avatar className="ring-1 ring-border/60">
          <AvatarFallback className="bg-[linear-gradient(135deg,rgba(110,204,255,0.32),rgba(255,211,126,0.38))] text-foreground">
            CA
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
