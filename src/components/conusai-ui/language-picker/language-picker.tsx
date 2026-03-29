"use client";

import { Globe, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import type { LanguagePickerProps } from "./language-picker.types";

export function LanguagePicker({
  options,
  value,
  onChange,
  presentation = "auto",
  className,
}: LanguagePickerProps) {
  const selected =
    options.find((option) => option.value === value) ?? options[0];
  const isMobile = useIsMobile();
  const useSheet =
    presentation === "sheet" || (presentation === "auto" && isMobile);

  const trigger = (
    <Button
      variant="outline"
      size="icon-sm"
      className={cn(
        "touch-target border-border/70 bg-background/80 backdrop-blur",
        className
      )}
      aria-label="Change language"
    >
      <Globe />
    </Button>
  );

  if (useSheet) {
    return (
      <Sheet>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent
          side="bottom"
          className="rounded-t-[2rem] border-border/70 bg-card pb-[calc(env(safe-area-inset-bottom)+2rem)]"
        >
          <div className="mx-auto mt-2 h-1.5 w-14 rounded-full bg-border" />
          <div className="px-4 pt-6">
            <SheetTitle className="font-heading text-lg">Language</SheetTitle>
            <div className="mt-4 grid gap-2">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(option.value)}
                  className={cn(
                    "touch-target flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors",
                    option.value === value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg" aria-hidden="true">
                      {option.flag}
                    </span>
                    <span className="font-medium">{option.label}</span>
                  </span>
                  <Languages className="size-4 opacity-70" />
                </button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onChange(option.value)}
          >
            <span className="mr-2 text-lg" aria-hidden="true">
              {option.flag}
            </span>
            <span className="flex-1">{option.label}</span>
            {selected.value === option.value ? (
              <span className="text-xs text-muted-foreground">Active</span>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
