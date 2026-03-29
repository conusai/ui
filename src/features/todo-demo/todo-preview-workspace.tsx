"use client";

import {
  Header,
  LeftSidebar,
  Loader,
  MobileFooter,
  MobilePreviewFrame,
  RightSidebar,
} from "@/components/conusai-ui";
import { cn } from "@/lib/utils";

import { appNavItems, footerTabs, languages } from "./todo-demo.constants";
import type { TodoDemoController } from "./todo-demo.types";
import { TodoTaskList } from "./todo-task-list";

type TodoPreviewWorkspaceProps = {
  demo: TodoDemoController;
};

export function TodoPreviewWorkspace({ demo }: TodoPreviewWorkspaceProps) {
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
            language={demo.language}
            languages={languages}
            onLanguageChange={demo.setLanguage}
            onMenuClick={demo.toggleLeftSidebar}
            showMenuButton={demo.isMobilePreview}
            languagePresentation={demo.isMobilePreview ? "sheet" : "dropdown"}
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
              todo={demo.selectedTodo}
              onClose={demo.closeInspector}
              onChange={demo.updateSelected}
              onDelete={demo.deleteSelected}
              className={cn(
                demo.isDesktopPreview
                  ? "w-[34rem] max-w-[34rem] bg-card/92 shadow-[-28px_0_90px_-46px_rgba(10,16,31,0.72)]"
                  : !demo.isMobilePreview &&
                      "w-[28rem] max-w-[28rem] bg-card/92 shadow-[-28px_0_90px_-46px_rgba(10,16,31,0.72)]"
              )}
            />
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
