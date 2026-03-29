"use client";

import { ReceiptText, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { formatCurrency } from "../logistix-demo.constants";
import type { LogisticsInvoice } from "../logistix-demo.types";

type ReInvoicePreviewProps = {
  invoices: LogisticsInvoice[];
  selectedIds: string[];
  marginPercent: number;
  onToggle: (id: string) => void;
  onMarginChange: (value: number) => void;
};

export function ReInvoicePreview({
  invoices,
  selectedIds,
  marginPercent,
  onToggle,
  onMarginChange,
}: ReInvoicePreviewProps) {
  const selectedInvoices = invoices.filter((invoice) =>
    selectedIds.includes(invoice.id)
  );
  const baseTotal = selectedInvoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );
  const marginTotal = Math.round((baseTotal * marginPercent) / 100);
  const grandTotal = baseTotal + marginTotal;

  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="border-border/70 bg-card/76 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">Select ready invoices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {invoices.length ? (
            invoices.map((invoice) => {
              const selected = selectedIds.includes(invoice.id);

              return (
                <button
                  key={invoice.id}
                  type="button"
                  onClick={() => onToggle(invoice.id)}
                  className={cn(
                    "w-full rounded-[1.3rem] border p-4 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary/8"
                      : "border-border/70 bg-background/74 hover:bg-muted/70"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {invoice.reference}
                      </p>
                      <p className="mt-1 font-medium">{invoice.vendor}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {invoice.customerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {invoice.route}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="rounded-[1.3rem] border border-dashed border-border/80 bg-background/75 p-5 text-sm text-muted-foreground">
              No invoices are ready yet. Finish a few extractions in the Upload
              or Invoices tabs and they will appear here automatically.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/76 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">Re-invoice builder</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview">
            <TabsList
              variant="line"
              className="w-full justify-start overflow-x-auto"
            >
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="totals">Totals</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="space-y-4 pt-4">
              <div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-5">
                <div className="flex items-center gap-2 text-primary">
                  <ReceiptText className="size-4" />
                  <span className="text-sm font-medium">
                    Generated invoice preview
                  </span>
                </div>
                <div className="mt-4 rounded-[1.2rem] border border-border/70 bg-card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-heading text-lg">
                        Logistix AI Billing
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Consolidated logistics invoice for{" "}
                        {selectedInvoices.length} shipment(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Margin
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {marginPercent}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    {selectedInvoices.length ? (
                      selectedInvoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="flex items-center justify-between gap-3"
                        >
                          <span>{invoice.vendor}</span>
                          <span>
                            {formatCurrency(invoice.amount, invoice.currency)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">
                        Select one or more ready invoices to build the outbound
                        draft.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="totals" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="margin">Margin percentage</Label>
                <Input
                  id="margin"
                  type="number"
                  value={marginPercent}
                  min={0}
                  max={30}
                  onChange={(event) =>
                    onMarginChange(Number(event.target.value) || 0)
                  }
                />
              </div>
              <div className="rounded-[1.4rem] border border-border/70 bg-background/80 p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Carrier total</span>
                  <span className="font-medium">
                    {formatCurrency(baseTotal, "EUR")}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Applied margin</span>
                  <span className="font-medium">
                    {formatCurrency(marginTotal, "EUR")}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
                  <span className="font-medium">Outbound invoice total</span>
                  <span className="font-heading text-2xl">
                    {formatCurrency(grandTotal, "EUR")}
                  </span>
                </div>
              </div>
              <Button className="w-full">
                <Sparkles data-icon="inline-start" />
                Generate mock customer invoice
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
