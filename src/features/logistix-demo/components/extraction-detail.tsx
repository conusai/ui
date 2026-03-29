"use client";

import { FileSearch, ShieldCheck, WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { formatCurrency, statusLabel } from "../logistix-demo.constants";
import type { LogisticsInvoice } from "../logistix-demo.types";

type ExtractionDetailProps = {
  invoice: LogisticsInvoice;
  onChange: (patch: Partial<LogisticsInvoice>) => void;
};

export function ExtractionDetail({ invoice, onChange }: ExtractionDetailProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="rounded-[1.4rem] border border-border/70 bg-background/80 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {invoice.reference}
            </p>
            <h3 className="mt-1 font-heading text-2xl">{invoice.vendor}</h3>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Extracted total
            </p>
            <p className="mt-1 font-heading text-2xl">
              {formatCurrency(invoice.amount, invoice.currency)}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-muted/60 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Confidence
            </p>
            <p className="mt-1 text-lg font-semibold">{invoice.confidence}%</p>
          </div>
          <div className="rounded-2xl bg-muted/60 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Status
            </p>
            <p className="mt-1 text-lg font-semibold">
              {statusLabel(invoice.status)}
            </p>
          </div>
          <div className="rounded-2xl bg-muted/60 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Route
            </p>
            <p className="mt-1 text-lg font-semibold">{invoice.route}</p>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        className="mt-4 min-h-0 flex-1 overflow-hidden"
      >
        <TabsList
          variant="line"
          className="w-full justify-start overflow-x-auto"
        >
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lines">Line Items</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="min-h-0 overflow-y-auto pr-1 pt-4"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={invoice.vendor}
                onChange={(event) => onChange({ vendor: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Input
                id="customer"
                value={invoice.customerName}
                onChange={(event) =>
                  onChange({ customerName: event.target.value })
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice number</Label>
                <Input
                  id="invoice-number"
                  value={invoice.invoiceNumber}
                  onChange={(event) =>
                    onChange({ invoiceNumber: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={invoice.status}
                  onValueChange={(value) =>
                    onChange({ status: value as LogisticsInvoice["status"] })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="review">Needs review</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Extraction notes</Label>
              <Textarea
                id="notes"
                value={invoice.notes}
                onChange={(event) => onChange({ notes: event.target.value })}
                className="min-h-28"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="lines"
          className="min-h-0 overflow-y-auto pr-1 pt-4"
        >
          <div className="space-y-3">
            {invoice.lineItems.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.2rem] border border-border/70 bg-background/75 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Qty {item.quantity} x{" "}
                      {formatCurrency(item.unitPrice, invoice.currency)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(item.total, invoice.currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="audit"
          className="min-h-0 overflow-y-auto pr-1 pt-4"
        >
          <div className="space-y-3 rounded-[1.3rem] border border-border/70 bg-background/75 p-4 text-sm">
            <div className="flex items-start gap-3">
              <WandSparkles className="mt-0.5 size-4 text-primary" />
              <div>
                <p className="font-medium">AI extraction summary</p>
                <p className="mt-1 text-muted-foreground">
                  Vendor identity, invoice number, and route were matched
                  against the mock logistics contract set.
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <FileSearch className="mt-0.5 size-4 text-primary" />
              <div>
                <p className="font-medium">Document evidence</p>
                <p className="mt-1 text-muted-foreground">
                  3 fields came from OCR, 2 from email body parsing, 1 from lane
                  memory in the mocked workspace.
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-4 text-primary" />
              <div>
                <p className="font-medium">Review controls</p>
                <p className="mt-1 text-muted-foreground">
                  Keep low-confidence invoices in review, or mark them ready
                  once finance confirms the extracted lane and surcharge mix.
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => onChange({ status: "review" })}
                className="flex-1"
              >
                Hold for review
              </Button>
              <Button
                onClick={() => onChange({ status: "ready" })}
                className="flex-1"
              >
                Mark ready
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
