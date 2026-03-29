"use client";

import { Sparkles, Truck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AIExportButton } from "@/tools/screenshot-generator";

import { formatCurrency, previewModes } from "./logistix-demo.constants";
import type { LogistixDemoController } from "./logistix-demo.types";
import { LogistixDemoWorkspace } from "./logistix-demo-workspace";

type LogistixDemoShellProps = {
  demo: LogistixDemoController;
};

export function LogistixDemoShell({ demo }: LogistixDemoShellProps) {
  return (
    <section className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
      <div
        className={cn(
          "mx-auto grid gap-10 lg:items-start",
          demo.isMobilePreview
            ? "max-w-7xl lg:grid-cols-[1.05fr_0.95fr]"
            : demo.previewMode === "tablet"
              ? "max-w-[1600px] lg:grid-cols-[minmax(320px,0.7fr)_minmax(800px,1.3fr)]"
              : "max-w-[1820px] lg:grid-cols-[minmax(340px,0.62fr)_minmax(980px,1.38fr)]"
        )}
      >
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/75 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
            <Truck className="size-4 text-primary" />
            Logistix AI Mocked UX Prototype
          </div>

          <div className="space-y-4">
            <p className="font-heading text-sm uppercase tracking-[0.28em] text-muted-foreground">
              Invoice extraction, review, and re-billing
            </p>
            <h1 className="max-w-3xl font-heading text-4xl leading-none tracking-tight sm:text-5xl lg:text-6xl">
              A mocked finance operations workspace built entirely from the
              current ConusAI UI primitives.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              The prototype simulates uploads, Gmail intake, AI confidence
              scoring, invoice review, and re-invoicing inside the same
              mobile-first shell used by the component library.
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

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="border-border/70 bg-card/70 shadow-none backdrop-blur">
              <CardContent className="space-y-1 p-5">
                <p className="text-sm text-muted-foreground">
                  Invoices tracked
                </p>
                <p className="font-heading text-3xl">
                  {demo.summary.totalInvoices}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-card/70 shadow-none backdrop-blur">
              <CardContent className="space-y-1 p-5">
                <p className="text-sm text-muted-foreground">Ready to bill</p>
                <p className="font-heading text-3xl">
                  {demo.summary.readyCount}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-card/70 shadow-none backdrop-blur">
              <CardContent className="space-y-1 p-5">
                <p className="text-sm text-muted-foreground">Needs review</p>
                <p className="font-heading text-3xl">
                  {demo.summary.flaggedCount}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-card/70 shadow-none backdrop-blur">
              <CardContent className="space-y-1 p-5">
                <p className="text-sm text-muted-foreground">Recovered value</p>
                <p className="font-heading text-3xl">
                  {formatCurrency(demo.summary.totalRecovered, "EUR")}
                </p>
              </CardContent>
            </Card>
          </div>

          <AIExportButton project="logistix" className="max-w-2xl" />

          <div className="rounded-[1.6rem] border border-border/70 bg-card/72 p-4 text-sm text-muted-foreground backdrop-blur">
            <div className="flex items-center gap-2 text-foreground">
              <Sparkles className="size-4 text-primary" />
              Demo behaviors
            </div>
            <p className="mt-2 leading-6">
              Upload actions create new invoices with staged AI processing,
              Gmail sync injects email-based billing docs, and the re-invoice
              tab recalculates customer totals live from selected ready
              invoices.
            </p>
          </div>
        </div>

        <LogistixDemoWorkspace demo={demo} />
      </div>
    </section>
  );
}
