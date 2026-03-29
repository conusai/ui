"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  ScanSearch,
  TriangleAlert,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  channelLabel,
  formatCurrency,
  statusLabel,
} from "../logistix-demo.constants";
import type { LogisticsInvoice } from "../logistix-demo.types";

function statusStyles(status: LogisticsInvoice["status"]) {
  if (status === "ready") {
    return "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300";
  }

  if (status === "review") {
    return "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-300";
  }

  if (status === "processing") {
    return "border-sky-500/30 bg-sky-500/12 text-sky-700 dark:text-sky-300";
  }

  return "border-border/70 bg-muted/60 text-muted-foreground";
}

function statusIcon(status: LogisticsInvoice["status"]) {
  if (status === "ready") {
    return <CheckCircle2 className="size-3.5" />;
  }

  if (status === "review") {
    return <TriangleAlert className="size-3.5" />;
  }

  if (status === "processing") {
    return <Clock3 className="size-3.5" />;
  }

  return <ScanSearch className="size-3.5" />;
}

type InvoiceCardProps = {
  invoice: LogisticsInvoice;
  onOpen: (id: string) => void;
};

export function InvoiceCard({ invoice, onOpen }: InvoiceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(invoice.id)}
      className="w-full text-left"
    >
      <Card className="border-border/70 bg-card/78 shadow-none transition-transform hover:-translate-y-0.5 hover:bg-card/92">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {invoice.reference}
              </p>
              <CardTitle className="mt-1 text-lg">{invoice.vendor}</CardTitle>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                statusStyles(invoice.status)
              )}
            >
              {statusIcon(invoice.status)}
              {statusLabel(invoice.status)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Customer
              </p>
              <p className="mt-1 font-medium">{invoice.customerName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Route
              </p>
              <p className="mt-1 font-medium">{invoice.route}</p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Amount
              </p>
              <p className="mt-1 font-heading text-2xl">
                {formatCurrency(invoice.amount, invoice.currency)}
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>{channelLabel(invoice.channel)}</p>
              <p>Due {invoice.dueDate}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">AI confidence</span>
              <span className="font-medium">{invoice.confidence}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  invoice.confidence >= 90
                    ? "bg-emerald-500"
                    : invoice.confidence >= 82
                      ? "bg-sky-500"
                      : "bg-amber-500"
                )}
                style={{ width: `${invoice.confidence}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-2">
              {invoice.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/70 bg-background/80 px-2 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              Inspect
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
