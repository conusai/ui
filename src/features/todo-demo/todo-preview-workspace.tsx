"use client";

import { Menu, MoonStar, SunMedium } from "lucide-react";

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
import { cn } from "@/lib/utils";

import { TodoEditPanel } from "./components/todo-edit-panel";
import { appNavItems, footerTabs, languages } from "./todo-demo.constants";
import type { TodoDemoController } from "./todo-demo.types";
import { TodoTaskList } from "./todo-task-list";

type TodoPreviewWorkspaceProps = {
  demo: TodoDemoController;
};

export function TodoPreviewWorkspace({ demo }: TodoPreviewWorkspaceProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <MobilePreviewFrame
      mode={demo.previewMode}
      className={cn(
        !demo.isMobilePreview &&
          "lg:justify-self-end lg:scale-[1.02] xl:scale-100"
      )}
    >
      <div className="relative flex h-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(110,204,255,0.18),transparent_28%)]">
        <Loader visible={demo.showLoader} />

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header
            title="TodoList Showcase"
            subtitle="ConusAI"
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
          />

          <div className="relative flex min-h-0 flex-1 overflow-hidden">
            <LeftSidebar
              variant={demo.isMobilePreview ? "overlay" : "inline"}
              open={demo.isMobilePreview ? demo.leftOpen : true}
              items={appNavItems}
              activeItem={demo.activeTab}
              onClose={demo.closeLeftSidebar}
              onSelect={(id) => demo.selectAppTab(id as typeof demo.activeTab)}
              className={cn(
                !demo.isMobilePreview &&
                  "w-[300px] max-w-[300px] bg-sidebar/90 shadow-[0_28px_90px_-46px_rgba(10,16,31,0.72)]"
              )}
            />

            <TodoTaskList demo={demo} />

            <RightSidebar
              variant={demo.isDesktopPreview ? "inline" : "overlay"}
              open={demo.inspectorOpen && Boolean(demo.selectedTodo)}
              onClose={demo.closeInspector}
              eyebrow="Inspector"
              title="Task detail"
              backLabel="Back"
              className={cn(
                demo.isDesktopPreview
                  ? "w-[34rem] max-w-[34rem] bg-card/92 shadow-[-28px_0_90px_-46px_rgba(10,16,31,0.72)]"
                  : !demo.isMobilePreview &&
                      "w-[28rem] max-w-[28rem] bg-card/92 shadow-[-28px_0_90px_-46px_rgba(10,16,31,0.72)]"
              )}
            >
              {demo.selectedTodo ? (
                <TodoEditPanel
                  todo={demo.selectedTodo}
                  onChange={demo.updateSelected}
                  onDelete={demo.deleteSelected}
                />
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
