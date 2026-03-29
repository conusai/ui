"use client";

import { motion } from "framer-motion";

import { createTapMotion } from "@/components/conusai-ui/motion";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

import type { MobileFooterProps } from "./mobile-footer.types";

export function MobileFooter({
  items,
  activeItem,
  onChange,
  className,
}: MobileFooterProps) {
  const shouldReduceMotion = useReducedMotionPreference();
  const tapMotion = createTapMotion(shouldReduceMotion);

  return (
    <nav
      className={cn(
        "safe-pb absolute inset-x-4 bottom-4 z-20 rounded-[1.8rem] border border-border/70 bg-card/90 p-2 shadow-lg backdrop-blur-xl",
        className
      )}
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
