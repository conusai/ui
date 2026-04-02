"use client";

import { Menu, MoonStar, SunMedium, Trash2 } from "lucide-react";

import {
  Header,
  LanguagePicker,
  LeftSidebar,
  Loader,
  MobileFooter,
  MobilePreviewFrame,
  RightSidebar,
} from "@/components/conusai-ui";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { ExtractionDetail } from "./components/extraction-detail";
import { InvoiceCard } from "./components/invoice-card";
import { ReInvoicePreview } from "./components/re-invoice-preview";
import { SettingsForm } from "./components/settings-form";
import { UploadDropzone } from "./components/upload-dropzone";
import {
  appNavItems,
  footerTabs,
  languages,
  statusOptions,
} from "./logistix-demo.constants";
import type { LogistixDemoController } from "./logistix-demo.types";

type LogistixDemoWorkspaceProps = {
  demo: LogistixDemoController;
};

function tabTitle(tab: LogistixDemoController["activeTab"]) {
  if (tab === "upload") {
    return "AI Intake";
  }

  if (tab === "invoices") {
    return "Invoices";
  }

  if (tab === "reinvoice") {
    return "Re-Invoice";
  }

  return "Settings";
}

export function LogistixDemoWorkspace({ demo }: LogistixDemoWorkspaceProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const navItems = appNavItems.map((item) => {
    if (item.id === "upload") {
      return {
        ...item,
        meta: String(demo.summary.processingCount).padStart(2, "0"),
      };
    }

    if (item.id === "invoices") {
      return {
        ...item,
        meta: String(demo.summary.totalInvoices).padStart(2, "0"),
      };
    }

    if (item.id === "reinvoice") {
      return {
        ...item,
        meta: String(demo.selectedReinvoiceIds.length).padStart(2, "0"),
      };
    }

    return item;
  });

  return (
    <MobilePreviewFrame
      mode={demo.previewMode}
      className={cn(
        !demo.isMobilePreview &&
          "lg:justify-self-end lg:scale-[1.02] xl:scale-100"
      )}
    >
      <div className="relative flex h-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(110,204,255,0.18),transparent_28%)]">
        <Loader visible={demo.showLoader} tone="soft" />

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header
            title={tabTitle(demo.activeTab)}
            subtitle="Logistix AI"
            leading={
              demo.isMobilePreview ? (
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="touch-target border-border/70 bg-background/80"
                  onClick={demo.toggleLeftSidebar}
                  aria-label="Open navigation"
                >
                  <Menu />
                </Button>
              ) : undefined
            }
            trailing={
              <>
                <LanguagePicker
                  options={languages}
                  value={demo.language}
                  onChange={demo.setLanguage}
                  presentation={demo.isMobilePreview ? "sheet" : "dropdown"}
                  triggerVariant="outline"
                />
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="touch-target border-border/70 bg-background/80"
                  onClick={() => setTheme(nextTheme)}
                  aria-label="Toggle theme"
                >
                  {resolvedTheme === "dark" ? <SunMedium /> : <MoonStar />}
                </Button>
                <Avatar className="ring-1 ring-border/60">
                  <AvatarFallback className="bg-[linear-gradient(135deg,rgba(110,204,255,0.32),rgba(255,211,126,0.38))] text-foreground">
                    CA
                  </AvatarFallback>
                </Avatar>
              </>
            }
            surface="elevated"
          />

          <div className="relative flex min-h-0 flex-1 overflow-hidden">
            <LeftSidebar
              variant={demo.isMobilePreview ? "overlay" : "inline"}
              open={demo.isMobilePreview ? demo.leftOpen : true}
              items={navItems}
              activeItem={demo.activeTab}
              onClose={demo.closeLeftSidebar}
              onSelect={(id) => demo.selectAppTab(id as typeof demo.activeTab)}
              className={cn(
                !demo.isMobilePreview &&
                  "w-[300px] max-w-[300px] bg-sidebar/90 shadow-[0_28px_90px_-46px_rgba(10,16,31,0.72)]"
              )}
            />

            <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-24 pt-4 sm:px-5">
              {demo.activeTab === "upload" ? (
                <div className="space-y-4">
                  <Card className="border-border/70 bg-card/76 shadow-none">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        Operational snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[1.3rem] bg-background/80 p-4">
                        <p className="text-sm text-muted-foreground">
                          Processing now
                        </p>
                        <p className="mt-1 font-heading text-3xl">
                          {demo.summary.processingCount}
                        </p>
                      </div>
                      <div className="rounded-[1.3rem] bg-background/80 p-4">
                        <p className="text-sm text-muted-foreground">
                          Ready to bill
                        </p>
                        <p className="mt-1 font-heading text-3xl">
                          {demo.summary.readyCount}
                        </p>
                      </div>
                      <div className="rounded-[1.3rem] bg-background/80 p-4">
                        <p className="text-sm text-muted-foreground">
                          Needs review
                        </p>
                        <p className="mt-1 font-heading text-3xl">
                          {demo.summary.flaggedCount}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <UploadDropzone
                    queue={demo.uploadQueue}
                    gmailConnected={demo.settings.gmailConnected}
                    onUpload={demo.simulateUpload}
                    onSyncInbox={demo.syncInbox}
                  />
                </div>
              ) : null}

              {demo.activeTab === "invoices" ? (
                <div className="space-y-4">
                  <Card className="border-border/70 bg-card/76 shadow-none">
                    <CardContent className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_220px]">
                      <Input
                        value={demo.searchQuery}
                        onChange={(event) =>
                          demo.setSearchQuery(event.target.value)
                        }
                        placeholder="Search vendor, lane, customer, reference..."
                        className="h-11 rounded-[1rem] bg-background/80"
                      />
                      <Select
                        value={demo.statusFilter}
                        onValueChange={(value) =>
                          demo.setStatusFilter(
                            value as typeof demo.statusFilter
                          )
                        }
                      >
                        <SelectTrigger className="h-11 w-full rounded-[1rem] bg-background/80">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 2xl:grid-cols-2">
                    {demo.visibleInvoices.map((invoice) => (
                      <InvoiceCard
                        key={invoice.id}
                        invoice={invoice}
                        onOpen={demo.openInvoice}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {demo.activeTab === "reinvoice" ? (
                <ReInvoicePreview
                  invoices={demo.invoices.filter(
                    (invoice) => invoice.status === "ready"
                  )}
                  selectedIds={demo.selectedReinvoiceIds}
                  marginPercent={demo.marginPercent}
                  onToggle={demo.toggleReinvoice}
                  onMarginChange={demo.setMarginPercent}
                />
              ) : null}

              {demo.activeTab === "settings" ? (
                <SettingsForm
                  settings={demo.settings}
                  onUpdate={demo.updateSettings}
                  onSyncInbox={demo.syncInbox}
                />
              ) : null}
            </main>

            <RightSidebar
              variant={demo.isDesktopPreview ? "inline" : "overlay"}
              open={demo.inspectorOpen && Boolean(demo.selectedInvoice)}
              onClose={demo.closeInspector}
              eyebrow="Extraction review"
              title="Invoice detail"
              backLabel="Back"
              className={cn(
                demo.isDesktopPreview
                  ? "w-[34rem] max-w-[34rem] bg-card/92 shadow-[-28px_0_90px_-46px_rgba(10,16,31,0.72)]"
                  : !demo.isMobilePreview &&
                      "w-[30rem] max-w-[30rem] bg-card/92 shadow-[-28px_0_90px_-46px_rgba(10,16,31,0.72)]"
              )}
            >
              {demo.selectedInvoice ? (
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="mb-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={demo.removeSelectedInvoice}
                      aria-label="Delete invoice"
                      className="touch-target"
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                  <ExtractionDetail
                    invoice={demo.selectedInvoice}
                    onChange={demo.updateSelectedInvoice}
                  />
                </div>
              ) : null}
            </RightSidebar>
          </div>

          {demo.isMobilePreview ? (
            <MobileFooter
              items={footerTabs}
              activeItem={demo.activeTab}
              onChange={(id) => demo.selectAppTab(id as typeof demo.activeTab)}
            />
          ) : null}
        </div>
      </div>
    </MobilePreviewFrame>
  );
}
