"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import {
  createFadeUpVariants,
  createSidebarVariants,
  createTapMotion,
} from "@/components/conusai-ui/motion";
import { Button } from "@/components/ui/button";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

import type { LeftSidebarProps, NavItem } from "./left-sidebar.types";

function SidebarContent({
  items,
  activeItem,
  onClose,
  onSelect,
  showCloseButton,
  fadeUpVariants,
  tapMotion,
}: {
  items: NavItem[];
  activeItem: string;
  onClose: () => void;
  onSelect: (id: string) => void;
  showCloseButton: boolean;
  fadeUpVariants: ReturnType<typeof createFadeUpVariants>;
  tapMotion: ReturnType<typeof createTapMotion>;
}) {
  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Library Nav
          </p>
          <h2 className="mt-1 text-lg font-semibold">Workspace</h2>
        </div>
        {showCloseButton ? (
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={onClose}
            className="touch-target"
          >
            <X />
          </Button>
        ) : null}
      </div>
      <div className="grid gap-2">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            custom={index}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            {...tapMotion}
            onClick={() => onSelect(item.id)}
            className={cn(
              "touch-target rounded-[1.35rem] border px-4 py-3 text-left transition-colors",
              item.id === activeItem
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 bg-background/80 hover:bg-muted"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                {item.icon ? <item.icon className="size-4" /> : null}
                <span className="font-medium">{item.label}</span>
              </span>
              {item.meta ? (
                <span className="text-xs opacity-72">{item.meta}</span>
              ) : null}
            </div>
          </motion.button>
        ))}
      </div>
      <div className="mt-auto rounded-[1.6rem] border border-border/70 bg-background/85 p-4">
        <p className="font-heading text-xs uppercase tracking-[0.24em] text-muted-foreground">
          ConusAI Notes
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          App-level navigation lives here. Task filters stay inside the task
          page, closer to the content they actually change.
        </p>
      </div>
    </>
  );
}

export function LeftSidebar({
  open,
  items,
  activeItem,
  onClose,
  onSelect,
  variant = "overlay",
  className,
}: LeftSidebarProps) {
  const shouldReduceMotion = useReducedMotionPreference();
  const fadeUpVariants = createFadeUpVariants(shouldReduceMotion);
  const sidebarVariants = createSidebarVariants(shouldReduceMotion);
  const tapMotion = createTapMotion(shouldReduceMotion);

  if (variant === "inline") {
    return (
      <aside
        className={cn(
          "flex h-full w-64 shrink-0 flex-col border-r border-border/70 bg-sidebar/90 px-4 pb-4 pt-5 backdrop-blur-2xl",
          className
        )}
      >
        <SidebarContent
          items={items}
          activeItem={activeItem}
          onClose={onClose}
          onSelect={onSelect}
          showCloseButton={false}
          fadeUpVariants={fadeUpVariants}
          tapMotion={tapMotion}
        />
      </aside>
    );
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-20 bg-[rgba(9,17,31,0.24)] backdrop-blur-[2px]"
          />
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className={cn(
              "absolute inset-y-0 left-0 z-30 flex w-[78%] max-w-[280px] flex-col border-r border-border/70 bg-sidebar/95 px-4 pb-4 pt-5 backdrop-blur-2xl",
              className
            )}
          >
            <SidebarContent
              items={items}
              activeItem={activeItem}
              onClose={onClose}
              onSelect={onSelect}
              showCloseButton
              fadeUpVariants={fadeUpVariants}
              tapMotion={tapMotion}
            />
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
