"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import type { ProjectKey } from "./screenshot-config";

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
  const [prompt, setPrompt] = useState(DEFAULT_USER_PROMPT);

  async function handleAIExport() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ project });
      const trimmedPrompt = prompt.trim();

      if (trimmedPrompt) {
        params.set("prompt", trimmedPrompt);
      }

      const res = await fetch(
        `/api/screenshots/intelligent?${params.toString()}`
      );
      if (!res.ok) {
        throw new Error(`AI Export failed: ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${project}-ai-screenshots.zip`;
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
          AI Explorer Brief
        </p>
        <p className="text-sm text-muted-foreground">
          Tell the explorer which screens to prioritize before it navigates the
          app.
        </p>
      </div>

      <Textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value.slice(0, 1000))}
        placeholder="Example: Capture onboarding, sidebar open states, task editor, stats screens, and any scrolled views that look useful for docs."
        className="min-h-28 resize-y bg-background/80"
      />

      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>Prompt guides the screenshots Gemini should hunt for.</span>
        <span>{prompt.length}/1000</span>
      </div>

      <Button
        variant="outline"
        size="lg"
        disabled={loading}
        onClick={handleAIExport}
        className="w-full sm:w-auto"
      >
        {loading ? (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        ) : (
          <Sparkles data-icon="inline-start" />
        )}
        {loading ? "AI Exploring…" : "AI Explore & Export All Screens"}
      </Button>
    </div>
  );
}
