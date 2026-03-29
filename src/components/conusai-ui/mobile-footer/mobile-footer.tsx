"use client";

import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import * as React from "react";

import { cnMotionProps, createTapMotion } from "@/components/conusai-ui/motion";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

import type { MobileFooterProps } from "./mobile-footer.types";

const mobileFooterVariants = cva(
  "safe-pb inset-x-4 bottom-4 z-20 rounded-[1.8rem] border p-2 backdrop-blur-xl",
  {
    variants: {
      surface: {
        floating: "absolute border-border/70 bg-card/90 shadow-lg",
        flush: "relative border-transparent bg-card/80 shadow-none",
      },
    },
    defaultVariants: {
      surface: "floating",
    },
  }
);

const MobileFooter = React.forwardRef<HTMLElement, MobileFooterProps>(
  (
    { items, activeItem, onChange, surface = "floating", className, ...props },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotionPreference();
    const tapMotion = cnMotionProps(createTapMotion(shouldReduceMotion));

    return (
      <nav
        ref={ref}
        data-slot="conus-mobile-footer"
        data-surface={surface}
        className={cn(mobileFooterVariants({ surface }), className)}
        {...props}
      >
        <ul className="grid grid-cols-4 gap-1">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.id}>
                <motion.button
                  type="button"
                  {...tapMotion}
                  onClick={() => onChange(item.id)}
                  className={cn(
                    "touch-target flex w-full flex-col items-center gap-1 rounded-[1.15rem] px-2 py-2 text-[0.7rem] font-medium transition-colors",
                    item.id === activeItem
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
);

MobileFooter.displayName = "MobileFooter";

export { MobileFooter };
