"use client";

import { Download, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { previewModes } from "./todo-demo.constants";
import type { TodoDemoController } from "./todo-demo.types";
import { TodoPreviewWorkspace } from "./todo-preview-workspace";

type TodoDemoShellProps = {
  demo: TodoDemoController;
};

export function TodoDemoShell({ demo }: TodoDemoShellProps) {
  const [exporting, setExporting] = useState(false);

  async function handleExportScreenshots() {
    setExporting(true);
    try {
      const res = await fetch("/api/export");
      if (!res.ok) {
        throw new Error(`Export failed: ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "conusai-screenshots.zip";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <section className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
      <div
        className={cn(
          "mx-auto grid gap-10 lg:items-start",
          demo.isMobilePreview
            ? "max-w-7xl lg:grid-cols-[1.05fr_0.95fr]"
            : demo.previewMode === "tablet"
              ? "max-w-[1560px] lg:grid-cols-[minmax(320px,0.7fr)_minmax(780px,1.3fr)]"
              : "max-w-[1760px] lg:grid-cols-[minmax(320px,0.62fr)_minmax(920px,1.38fr)]"
        )}
      >
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/75 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
            <Sparkles className="size-4 text-primary" />
            ConusAI UI Library Demo
          </div>
          <div className="space-y-4">
            <p className="font-heading text-sm uppercase tracking-[0.28em] text-muted-foreground">
              Mobile-first, PWA-ready, shadcn-style
            </p>
            <h1 className="max-w-2xl font-heading text-4xl leading-none tracking-tight sm:text-5xl lg:text-6xl">
              A focused Todo demo that proves the component library under a real
              mobile workflow.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              The preview frame bundles a branded loader, left navigation, right
              detail editor, footer tabs, language switching, haptics, system
              theme, and motion-driven state changes.
            </p>
          </div>

          <div className="grid gap-3 rounded-[1.8rem] border border-border/70 bg-card/68 p-3 backdrop-blur sm:grid-cols-3">
            {previewModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                data-preview-mode={mode.id}
                onClick={() => demo.setPreviewMode(mode.id)}
                className={cn(
                  "touch-target rounded-[1.35rem] border px-4 py-3 text-left transition-colors",
                  demo.previewMode === mode.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 bg-background/75 hover:bg-muted"
                )}
              >
                <p className="font-heading text-sm uppercase tracking-[0.18em]">
                  {mode.label}
                </p>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    demo.previewMode === mode.id
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}
                >
                  {mode.caption}
                </p>
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="border-border/70 bg-card/70 shadow-none backdrop-blur">
              <CardContent className="space-y-1 p-5">
                <p className="text-sm text-muted-foreground">Open tasks</p>
                <p className="font-heading text-3xl">
                  {demo.summary.openCount}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-card/70 shadow-none backdrop-blur">
              <CardContent className="space-y-1 p-5">
                <p className="text-sm text-muted-foreground">Deep focus</p>
                <p className="font-heading text-3xl">
                  {demo.summary.focusCount}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-card/70 shadow-none backdrop-blur">
              <CardContent className="space-y-1 p-5">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="font-heading text-3xl">
                  {demo.summary.completedCount}
                </p>
              </CardContent>
            </Card>
          </div>

          <Button
            variant="outline"
            size="lg"
            disabled={exporting}
            onClick={handleExportScreenshots}
            className="w-full sm:w-auto"
          >
            {exporting ? (
              <Loader2 className="animate-spin" data-icon="inline-start" />
            ) : (
              <Download data-icon="inline-start" />
            )}
            {exporting ? "Generating…" : "Export All Screenshots"}
          </Button>
        </div>

        <TodoPreviewWorkspace demo={demo} />
      </div>
    </section>
  );
}
