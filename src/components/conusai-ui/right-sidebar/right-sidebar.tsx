"use client";

import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Trash2 } from "lucide-react";
import * as React from "react";

import { createPanelVariants } from "@/components/conusai-ui/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

import type { EditableTodo, RightSidebarProps } from "./right-sidebar.types";

function SidebarPanel({
  todo,
  onClose,
  onChange,
  onDelete,
  panelEyebrow,
  panelTitle,
  backLabel,
  showDeleteButton,
  emptyState,
  children,
  inline,
}: {
  todo: EditableTodo | null;
  onClose: () => void;
  onChange?: (patch: Partial<EditableTodo>) => void;
  onDelete?: () => void;
  panelEyebrow: string;
  panelTitle: string;
  backLabel: string;
  showDeleteButton: boolean;
  emptyState?: React.ReactNode;
  children?: React.ReactNode;
  inline: boolean;
}) {
  const priorityVariants = cva(
    "touch-target rounded-2xl border px-3 py-2 text-sm font-medium",
    {
      variants: {
        active: {
          true: "border-primary bg-primary text-primary-foreground",
          false: "border-border bg-background hover:bg-muted",
        },
      },
    }
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="touch-target"
          >
            <ArrowLeft />
            {backLabel}
          </Button>
          {inline ? (
            <div>
              <p className="font-heading text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {panelEyebrow}
              </p>
              <h2 className="mt-1 text-lg font-semibold">{panelTitle}</h2>
            </div>
          ) : null}
        </div>
        {showDeleteButton ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            aria-label="Delete task"
            disabled={!todo && !onDelete}
            className="touch-target"
          >
            <Trash2 className="text-destructive" />
          </Button>
        ) : null}
      </div>

      {children ? (
        <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      ) : todo ? (
        <>
          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={todo.title}
                onChange={(event) => onChange?.({ title: event.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <textarea
                id="task-description"
                value={todo.description}
                onChange={(event) =>
                  onChange?.({ description: event.target.value })
                }
                className="min-h-32 w-full rounded-[1.15rem] border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["Low", "Medium", "High"] as const).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => onChange?.({ priority })}
                    className={cn(
                      priorityVariants({ active: todo.priority === priority })
                    )}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto rounded-[1.4rem] border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
            Editing stays local to the demo. This panel exists to prove the
            component library can handle focused, detail-heavy workflows across
            device sizes.
          </div>
        </>
      ) : (
        (emptyState ?? (
          <div className="my-auto rounded-[1.6rem] border border-dashed border-border/80 bg-background/70 p-5 text-sm text-muted-foreground">
            Select a task to inspect how the detail panel adapts on larger
            layouts.
          </div>
        ))
      )}
    </div>
  );
}

const rightSidebarVariants = cva("flex flex-col border-l backdrop-blur-2xl", {
  variants: {
    variant: {
      inline: "h-full w-[320px] shrink-0 border-border/70 bg-card/88 p-4",
      overlay:
        "absolute inset-y-0 right-0 z-30 w-[88%] border-border/70 bg-card/96 p-4",
    },
  },
  defaultVariants: {
    variant: "overlay",
  },
});

const RightSidebar = React.forwardRef<HTMLElement, RightSidebarProps>(
  (
    {
      open,
      todo = null,
      onClose,
      onChange,
      onDelete,
      variant = "overlay",
      className,
      panelEyebrow = "Inspector",
      panelTitle = "Task detail",
      backLabel = "Back",
      showDeleteButton = true,
      emptyState,
      children,
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotionPreference();
    const panelVariants = createPanelVariants(shouldReduceMotion);
    const hasContent = Boolean(todo || children);

    if (variant === "inline") {
      if (!open || !hasContent) {
        return null;
      }

      return (
        <AnimatePresence initial={false}>
          <motion.aside
            ref={ref}
            initial="closed"
            animate="open"
            exit="closed"
            variants={panelVariants}
            data-slot="conus-right-sidebar"
            data-variant={variant}
            className={cn(rightSidebarVariants({ variant }), className)}
          >
            <SidebarPanel
              todo={todo}
              onClose={onClose}
              onChange={onChange}
              onDelete={onDelete}
              panelEyebrow={panelEyebrow}
              panelTitle={panelTitle}
              backLabel={backLabel}
              showDeleteButton={showDeleteButton}
              emptyState={emptyState}
              inline
            >
              {children}
            </SidebarPanel>
          </motion.aside>
        </AnimatePresence>
      );
    }

    return (
      <AnimatePresence>
        {open && hasContent ? (
          <>
            <motion.button
              type="button"
              aria-label="Close task inspector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 z-20 bg-[rgba(9,17,31,0.2)] backdrop-blur-[2px]"
            />
            <motion.aside
              ref={ref}
              initial="closed"
              animate="open"
              exit="closed"
              variants={panelVariants}
              data-slot="conus-right-sidebar"
              data-variant={variant}
              className={cn(rightSidebarVariants({ variant }), className)}
            >
              <SidebarPanel
                todo={todo}
                onClose={onClose}
                onChange={onChange}
                onDelete={onDelete}
                panelEyebrow={panelEyebrow}
                panelTitle={panelTitle}
                backLabel={backLabel}
                showDeleteButton={showDeleteButton}
                emptyState={emptyState}
                inline={false}
              >
                {children}
              </SidebarPanel>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    );
  }
);

RightSidebar.displayName = "RightSidebar";

export { RightSidebar };
