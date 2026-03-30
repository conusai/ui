"use client";

import { Camera, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import type { ProjectKey } from "./screenshot-config";

type ExportMode = "quick" | "explore";

type AIExportButtonProps = {
  project?: ProjectKey;
  className?: string;
};

const DEFAULT_USER_PROMPT =
  "Capture the most valuable product screens for docs and marketing. Prioritize navigation open states, task detail states, responsive layouts, and any view that looks meaningfully different from the default screen.";

export function AIExportButton({
  project = "todolist",
  className,
}: AIExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ExportMode>("quick");
  const [prompt, setPrompt] = useState(DEFAULT_USER_PROMPT);
  const [maxSteps, setMaxSteps] = useState(25);

  async function handleExport() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ project });

      if (mode === "quick") {
        params.set("maxSteps", "0");
      } else {
        params.set("maxSteps", String(maxSteps));
        const trimmedPrompt = prompt.trim();
        if (trimmedPrompt) {
          params.set("prompt", trimmedPrompt);
        }
      }

      const res = await fetch(
        `/api/screenshots/intelligent?${params.toString()}`
      );
      if (!res.ok) {
        throw new Error(`Export failed: ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${project}-screenshots.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "w-full space-y-3 rounded-[1.6rem] border border-border/70 bg-card/72 p-4 backdrop-blur",
        className
      )}
    >
      <div className="space-y-1">
        <p className="font-heading text-sm uppercase tracking-[0.18em] text-muted-foreground">
          Screenshot export
        </p>
        <p className="text-sm text-muted-foreground">
          Quick capture grabs the main screen in each preview mode. AI explore
          navigates the app to discover every state.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode("quick")}
          className={cn(
            "rounded-[1.1rem] border px-3 py-2.5 text-left transition-colors",
            mode === "quick"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border/70 bg-background/75 hover:bg-muted"
          )}
        >
          <p className="font-heading text-sm uppercase tracking-[0.18em]">
            Quick
          </p>
          <p
            className={cn(
              "mt-0.5 text-xs",
              mode === "quick"
                ? "text-primary-foreground/80"
                : "text-muted-foreground"
            )}
          >
            3 screenshots — one per mode
          </p>
        </button>
        <button
          type="button"
          onClick={() => setMode("explore")}
          className={cn(
            "rounded-[1.1rem] border px-3 py-2.5 text-left transition-colors",
            mode === "explore"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border/70 bg-background/75 hover:bg-muted"
          )}
        >
          <p className="font-heading text-sm uppercase tracking-[0.18em]">
            AI Explore
          </p>
          <p
            className={cn(
              "mt-0.5 text-xs",
              mode === "explore"
                ? "text-primary-foreground/80"
                : "text-muted-foreground"
            )}
          >
            Gemini navigates every state
          </p>
        </button>
      </div>

      {mode === "explore" ? (
        <>
          <Textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value.slice(0, 1000))}
            placeholder="Example: Capture sidebar open states, task editor, invoice detail, and any view useful for docs."
            className="min-h-28 resize-y bg-background/80"
          />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="max-steps"
                className="text-xs text-muted-foreground"
              >
                Max steps per mode
              </Label>
              <Input
                id="max-steps"
                type="number"
                min={1}
                max={25}
                value={maxSteps}
                onChange={(event) =>
                  setMaxSteps(
                    Math.max(1, Math.min(25, Number(event.target.value) || 1))
                  )
                }
                className="h-8 w-16 bg-background/80 text-center"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {prompt.length}/1000
            </span>
          </div>
        </>
      ) : null}

      <Button
        variant="outline"
        size="lg"
        disabled={loading}
        onClick={handleExport}
        className="w-full sm:w-auto"
      >
        {loading ? (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        ) : mode === "quick" ? (
          <Camera data-icon="inline-start" />
        ) : (
          <Sparkles data-icon="inline-start" />
        )}
        {loading
          ? mode === "quick"
            ? "Capturing…"
            : "AI Exploring…"
          : mode === "quick"
            ? "Capture Main Screens"
            : "AI Explore & Export"}
      </Button>
    </div>
  );
}
