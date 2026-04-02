"use client";

import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Slot } from "radix-ui";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import {
  cnMotionProps,
  createFadeUpVariants,
  createSidebarVariants,
  createTapVariants,
} from "@/lib/motion-variants";
import { cn } from "@/lib/utils";

import type { LeftSidebarProps, NavItem } from "./left-sidebar.types";

function SidebarContent({
  items,
  activeItem,
  onClose,
  onSelect,
  showCloseButton,
  eyebrow,
  title,
  note,
  closeButtonAsChild,
  closeButtonChild,
  closeButtonLabel,
  renderItem,
  fadeUpVariants,
  tapMotion,
}: {
  items: NavItem[];
  activeItem: string;
  onClose: () => void;
  onSelect: (id: string) => void;
  showCloseButton: boolean;
  eyebrow: string;
  title: string;
  note?: React.ReactNode;
  closeButtonAsChild: boolean;
  closeButtonChild?: React.ReactNode;
  closeButtonLabel: string;
  renderItem?: (
    item: NavItem,
    state: { active: boolean; index: number }
  ) => React.ReactNode;
  fadeUpVariants: ReturnType<typeof createFadeUpVariants>;
  tapMotion: ReturnType<typeof createTapVariants>;
}) {
  const navItemVariants = cva(
    "touch-target rounded-[1.35rem] border px-4 py-3 text-left transition-colors",
    {
      variants: {
        active: {
          true: "border-primary bg-primary text-primary-foreground",
          false: "border-border/60 bg-background/80 hover:bg-muted",
        },
      },
    }
  );

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.28em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-semibold">{title}</h2>
        </div>
        {showCloseButton ? (
          <Button
            asChild={closeButtonAsChild && Boolean(closeButtonChild)}
            size="icon-sm"
            variant="ghost"
            onClick={onClose}
            className="touch-target"
            aria-label={closeButtonLabel}
          >
            {closeButtonChild ?? <X />}
          </Button>
        ) : null}
      </div>
      <div className="grid gap-2">
        {items.map((item, index) =>
          renderItem ? (
            <React.Fragment key={item.id}>
              {renderItem(item, {
                active: item.id === activeItem,
                index,
              })}
            </React.Fragment>
          ) : item.asChild && item.children ? (
            <Slot.Root
              key={item.id}
              className={cn(
                navItemVariants({ active: item.id === activeItem })
              )}
              aria-label={item.ariaLabel ?? item.label}
              onClick={() => onSelect(item.id)}
            >
              {item.children}
            </Slot.Root>
          ) : (
            <motion.button
              key={item.id}
              type="button"
              custom={index}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              {...cnMotionProps(tapMotion)}
              onClick={() => onSelect(item.id)}
              aria-label={item.ariaLabel ?? item.label}
              className={cn(
                navItemVariants({ active: item.id === activeItem })
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
          )
        )}
      </div>
      {note ?? (
        <div className="mt-auto rounded-[1.6rem] border border-border/70 bg-background/85 p-4">
          <p className="font-heading text-xs uppercase tracking-[0.24em] text-muted-foreground">
            ConusAI Notes
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            App-level navigation lives here. Task filters stay inside the task
            page, closer to the content they actually change.
          </p>
        </div>
      )}
    </>
  );
}

const leftSidebarVariants = cva("flex flex-col backdrop-blur-2xl", {
  variants: {
    variant: {
      inline:
        "h-full w-64 shrink-0 border-r border-border/70 bg-sidebar/90 px-4 pb-4 pt-5",
      overlay:
        "absolute inset-y-0 left-0 z-30 w-[78%] max-w-[280px] border-r border-border/70 bg-sidebar/95 px-4 pb-4 pt-5",
    },
  },
  defaultVariants: {
    variant: "overlay",
  },
});

const LeftSidebar = React.forwardRef<HTMLElement, LeftSidebarProps>(
  (
    {
      open,
      items,
      activeItem,
      onClose,
      onSelect,
      variant = "overlay",
      eyebrow = "Library Nav",
      title = "Workspace",
      note,
      closeButtonAsChild = false,
      closeButtonChild,
      closeButtonLabel = "Close navigation",
      renderItem,
      className,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotionPreference();
    const fadeUpVariants = createFadeUpVariants(shouldReduceMotion);
    const sidebarMotionVariants = createSidebarVariants(shouldReduceMotion);
    const tapMotion = createTapVariants(shouldReduceMotion);

    if (variant === "inline") {
      return (
        <aside
          ref={ref}
          data-slot="conus-left-sidebar"
          data-variant={variant}
          className={cn(leftSidebarVariants({ variant }), className)}
          {...props}
        >
          <SidebarContent
            items={items}
            activeItem={activeItem}
            onClose={onClose}
            onSelect={onSelect}
            showCloseButton={false}
            eyebrow={eyebrow}
            title={title}
            note={note}
            closeButtonAsChild={closeButtonAsChild}
            closeButtonChild={closeButtonChild}
            closeButtonLabel={closeButtonLabel}
            renderItem={renderItem}
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
              ref={ref}
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarMotionVariants}
              data-slot="conus-left-sidebar"
              data-variant={variant}
              className={cn(leftSidebarVariants({ variant }), className)}
            >
              <SidebarContent
                items={items}
                activeItem={activeItem}
                onClose={onClose}
                onSelect={onSelect}
                showCloseButton
                eyebrow={eyebrow}
                title={title}
                note={note}
                closeButtonAsChild={closeButtonAsChild}
                closeButtonChild={closeButtonChild}
                closeButtonLabel={closeButtonLabel}
                renderItem={renderItem}
                fadeUpVariants={fadeUpVariants}
                tapMotion={tapMotion}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    );
  }
);

LeftSidebar.displayName = "ConusLeftSidebar";

export { LeftSidebar };
