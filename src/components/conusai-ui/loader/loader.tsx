"use client";

import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

import { createLoaderVariants } from "@/components/conusai-ui/motion";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

import type { LoaderProps } from "./loader.types";

const loaderVariantsClass = cva(
  "absolute inset-0 z-50 flex items-center justify-center",
  {
    variants: {
      tone: {
        default:
          "bg-[radial-gradient(circle_at_top,rgba(110,204,255,0.24),transparent_34%),linear-gradient(180deg,rgba(9,17,31,0.96),rgba(12,24,44,0.92))]",
        soft: "bg-[radial-gradient(circle_at_top,rgba(110,204,255,0.18),transparent_34%),linear-gradient(180deg,rgba(9,17,31,0.9),rgba(12,24,44,0.86))]",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  }
);

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      visible,
      tone = "default",
      className,
      children,
      label = "ConusAI",
      description = "Calibrating the mobile demo",
      indicator,
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotionPreference();
    const loaderVariants = createLoaderVariants(shouldReduceMotion);

    return (
      <AnimatePresence>
        {visible ? (
          <motion.div
            ref={ref}
            key="conus-loader"
            data-slot="conus-loader"
            data-tone={tone}
            variants={loaderVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(loaderVariantsClass({ tone }), className)}
          >
            {children ?? (
              <div className="flex flex-col items-center gap-4 text-center text-primary-foreground">
                {indicator ?? (
                  <motion.div
                    animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : {
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 2.8,
                            ease: "linear",
                          }
                    }
                    className="relative flex size-20 items-center justify-center rounded-full border border-white/10 bg-white/6"
                  >
                    <div className="absolute inset-2 rounded-full border border-[color:var(--conus-aurora)]/35" />
                    <div className="size-10 rounded-[1rem] bg-[linear-gradient(135deg,rgba(110,204,255,1),rgba(255,211,126,0.95))] shadow-[0_0_40px_rgba(110,204,255,0.35)]" />
                  </motion.div>
                )}
                <div className="space-y-1">
                  <p className="font-heading text-lg uppercase tracking-[0.24em]">
                    {label}
                  </p>
                  <p className="text-sm text-white/72">{description}</p>
                </div>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }
);

Loader.displayName = "ConusLoader";

export { Loader };
