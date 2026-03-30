"use client";

import {
  ChartColumnBig,
  Clock3,
  Home,
  Inbox,
  Languages,
  Settings,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import type { FooterTab, NavItem } from "@/components/conusai-ui";
import {
  ComponentPreview,
  Header,
  LeftSidebar,
  Loader,
  MobileFooter,
  MobilePreviewFrame,
} from "@/components/conusai-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const languages = [
  { value: "en", label: "English", flag: "US" },
  { value: "lt", label: "Lithuanian", flag: "LT" },
  { value: "de", label: "German", flag: "DE" },
];

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", meta: "Intro", icon: Home },
  { id: "tasks", label: "Tasks", meta: "24", icon: Inbox },
  { id: "insights", label: "Insights", meta: "Live", icon: ChartColumnBig },
  { id: "automation", label: "Automation", meta: "Beta", icon: Sparkles },
];

const footerItems: FooterTab[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "activity", label: "Activity", icon: Clock3 },
  { id: "lang", label: "Locales", icon: Languages },
  { id: "settings", label: "Settings", icon: Settings },
];

export function HeaderPreview() {
  const [language, setLanguage] = useState("en");

  return (
    <ComponentPreview>
      <Header
        title="ConusAI"
        subtitle="Operations Center"
        language={language}
        languages={languages}
        onLanguageChange={setLanguage}
        onMenuClick={() => undefined}
      />
    </ComponentPreview>
  );
}

export function LeftSidebarPreview() {
  const [activeItem, setActiveItem] = useState("tasks");

  return (
    <ComponentPreview className="h-[540px] bg-sidebar/50">
      <LeftSidebar
        open
        variant="inline"
        items={navItems}
        activeItem={activeItem}
        onClose={() => undefined}
        onSelect={setActiveItem}
      />
    </ComponentPreview>
  );
}

export function MobilePreviewFramePreview() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <MobilePreviewFrame>
        <div className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(251,253,255,0.92),rgba(241,247,255,0.75))] p-4 dark:bg-[linear-gradient(180deg,rgba(10,18,30,0.98),rgba(15,26,44,0.98))]">
          <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-4 shadow-sm">
            <p className="font-heading text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground">
              Daily Focus
            </p>
            <h3 className="mt-2 text-lg font-semibold">
              Surface task velocity
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Wrap any mobile screen in a hardware frame without changing its
              internal layout.
            </p>
          </div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[1.25rem] border border-border/70 bg-background/90 p-4">
              <p className="text-sm font-medium">Inbox Review</p>
              <p className="mt-1 text-sm text-muted-foreground">
                14 unresolved updates
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-border/70 bg-background/90 p-4">
              <p className="text-sm font-medium">Sprint Health</p>
              <p className="mt-1 text-sm text-muted-foreground">
                3 milestones are trending ahead
              </p>
            </div>
          </div>
        </div>
      </MobilePreviewFrame>

      <MobilePreviewFrame mode="desktop">
        <div className="grid h-full grid-cols-[280px_minmax(0,1fr)] bg-background">
          <div className="border-r border-border/70 bg-sidebar/70 p-5">
            <p className="font-heading text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Navigation
            </p>
            <div className="mt-4 grid gap-2">
              {navItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-sm",
                    item.id === "insights"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/70 bg-card/80 text-muted-foreground"
                  )}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-5 lg:col-span-2">
                <p className="font-heading text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Workspace
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  Desktop scale without rebuilding the mock
                </h3>
                <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                  The same content can be staged in mobile, tablet, or desktop
                  framing depending on the documentation story.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-5">
                <p className="text-sm text-muted-foreground">
                  Responsive modes
                </p>
                <p className="mt-2 text-3xl font-semibold">3</p>
              </div>
            </div>
          </div>
        </div>
      </MobilePreviewFrame>
    </div>
  );
}

export function MobileFooterPreview() {
  const [activeItem, setActiveItem] = useState("activity");

  return (
    <ComponentPreview className="relative h-[340px] bg-[linear-gradient(180deg,rgba(251,253,255,0.92),rgba(241,247,255,0.78))] p-4 dark:bg-[linear-gradient(180deg,rgba(10,18,30,0.98),rgba(15,26,44,0.98))]">
      <div className="rounded-[1.6rem] border border-dashed border-border/80 bg-background/70 p-5 text-sm text-muted-foreground">
        Keep primary navigation anchored to the thumb zone while the rest of the
        screen scrolls freely.
      </div>
      <MobileFooter
        items={footerItems}
        activeItem={activeItem}
        onChange={setActiveItem}
      />
    </ComponentPreview>
  );
}

export function LoaderPreview() {
  const [visible, setVisible] = useState(true);

  return (
    <ComponentPreview className="overflow-hidden">
      <div className="relative h-[360px] bg-[linear-gradient(180deg,rgba(251,253,255,0.9),rgba(241,247,255,0.75))] p-5 dark:bg-[linear-gradient(180deg,rgba(10,18,30,0.98),rgba(15,26,44,0.98))]">
        <div className="flex h-full flex-col justify-between rounded-[1.75rem] border border-border/70 bg-card/80 p-5">
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Loading State
            </p>
            <h3 className="mt-2 text-xl font-semibold">Motion-first overlay</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              The loader keeps brand color and motion language consistent while
              async work completes.
            </p>
          </div>
          <Button onClick={() => setVisible((current) => !current)}>
            {visible ? "Hide" : "Show"} loader
          </Button>
        </div>
        <Loader visible={visible} />
      </div>
    </ComponentPreview>
  );
}
