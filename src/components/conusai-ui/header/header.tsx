"use client";

import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import type { HeaderProps } from "./header.types";

const headerVariants = cva(
  "safe-pt flex items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur-xl",
  {
    variants: {
      surface: {
        default: "border-border/60 bg-background/70",
        elevated:
          "border-border/70 bg-card/85 shadow-[0_18px_40px_-28px_rgba(10,16,31,0.55)]",
      },
    },
    defaultVariants: {
      surface: "default",
    },
  }
);

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
      title,
      subtitle,
      leading,
      trailing,
      surface = "default",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <header
        ref={ref}
        data-slot="conus-header"
        data-surface={surface}
        className={cn(headerVariants({ surface }), className)}
        {...props}
      >
        <div className="flex min-w-0 items-center gap-3">
          {leading ?? null}
          <div className="min-w-0">
            {subtitle ? (
              <p className="truncate font-heading text-[0.95rem] uppercase tracking-[0.18em] text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
            <h1 className="truncate text-base font-semibold">{title}</h1>
          </div>
        </div>
        {trailing ? (
          <div className="flex items-center gap-2">{trailing}</div>
        ) : null}
      </header>
    );
  }
);

Header.displayName = "ConusHeader";

export { Header };
