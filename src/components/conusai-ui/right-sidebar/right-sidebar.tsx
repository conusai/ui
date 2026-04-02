"use client";

import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import { createPanelVariants } from "@/lib/motion-variants";
import { cn } from "@/lib/utils";

import type { RightSidebarProps } from "./right-sidebar.types";

function SidebarPanel({
  onClose,
  eyebrow,
  title,
  backLabel,
  backButtonAsChild,
  backButtonChild,
  children,
  inline,
}: {
  onClose: () => void;
  eyebrow: string;
  title: string;
  backLabel: string;
  backButtonAsChild: boolean;
  backButtonChild?: React.ReactNode;
  children?: React.ReactNode;
  inline: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        <Button
          asChild={backButtonAsChild && Boolean(backButtonChild)}
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="touch-target"
          aria-label={backLabel}
        >
          {backButtonChild ?? (
            <>
              <ArrowLeft />
              {backLabel}
            </>
          )}
        </Button>
        {inline ? (
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {eyebrow}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{title}</h2>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
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
      onClose,
      variant = "overlay",
      className,
      eyebrow = "Inspector",
      title = "Detail",
      backLabel = "Back",
      backButtonAsChild = false,
      backButtonChild,
      children,
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotionPreference();
    const panelVariants = createPanelVariants(shouldReduceMotion);

    if (variant === "inline") {
      if (!open) {
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
              onClose={onClose}
              eyebrow={eyebrow}
              title={title}
              backLabel={backLabel}
              backButtonAsChild={backButtonAsChild}
              backButtonChild={backButtonChild}
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
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close panel"
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
                onClose={onClose}
                eyebrow={eyebrow}
                title={title}
                backLabel={backLabel}
                backButtonAsChild={backButtonAsChild}
                backButtonChild={backButtonChild}
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

RightSidebar.displayName = "ConusRightSidebar";

export { RightSidebar };
