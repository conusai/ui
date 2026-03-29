"use client";

import { Camera, FileUp, Mail, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { channelLabel } from "../logistix-demo.constants";
import type { InvoiceChannel, UploadQueueItem } from "../logistix-demo.types";

type UploadDropzoneProps = {
  queue: UploadQueueItem[];
  gmailConnected: boolean;
  onUpload: (fileName: string, channel: InvoiceChannel) => void;
  onSyncInbox: () => void;
};

const uploadButtons: Array<{
  label: string;
  fileName: string;
  channel: InvoiceChannel;
  icon: typeof FileUp;
}> = [
  {
    label: "Upload freight PDF",
    fileName: "Baltic Freight March.pdf",
    channel: "upload",
    icon: FileUp,
  },
  {
    label: "Scan customs receipt",
    fileName: "Customs mobile capture.jpg",
    channel: "camera",
    icon: Camera,
  },
];

export function UploadDropzone({
  queue,
  gmailConnected,
  onUpload,
  onSyncInbox,
}: UploadDropzoneProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="border-border/70 bg-card/76 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">
            Inbox to invoice in under a minute
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-[1.6rem] border border-dashed border-primary/35 bg-[radial-gradient(circle_at_top,rgba(110,204,255,0.22),transparent_46%)] p-6 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/14 text-primary">
              <Sparkles className="size-6" />
            </div>
            <h3 className="mt-4 font-heading text-2xl">Mock AI intake zone</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Simulate the production flow: upload PDFs, scan paper invoices in
              the yard, or pull unread billing emails straight into extraction.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {uploadButtons.map((action) => {
                const Icon = action.icon;

                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="lg"
                    onClick={() => onUpload(action.fileName, action.channel)}
                    className="w-full justify-start rounded-[1.25rem] border-border/70 bg-background/78"
                  >
                    <Icon data-icon="inline-start" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
            <Button
              variant={gmailConnected ? "default" : "outline"}
              size="lg"
              onClick={onSyncInbox}
              className="mt-3 w-full rounded-[1.25rem] sm:w-auto"
            >
              <Mail data-icon="inline-start" />
              {gmailConnected ? "Sync Gmail again" : "Connect Gmail and import"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/76 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">Live intake queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {queue.length ? (
            queue.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="rounded-[1.3rem] border border-border/70 bg-background/72 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.fileName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {channelLabel(item.channel)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-[11px] font-medium",
                      item.status === "complete"
                        ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                        : item.status === "processing"
                          ? "bg-sky-500/12 text-sky-700 dark:text-sky-300"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.4rem] border border-dashed border-border/80 bg-background/70 p-5 text-sm text-muted-foreground">
              No files in motion yet. Trigger one of the mocked upload actions
              to watch extraction, confidence scoring, and review-ready states
              appear.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
