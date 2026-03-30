"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type ComponentPreviewProps = React.ComponentPropsWithoutRef<"div">;

const ComponentPreview = React.forwardRef<
  HTMLDivElement,
  ComponentPreviewProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="conus-component-preview"
      className={cn(
        "overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/90 shadow-[0_32px_90px_-50px_rgba(10,16,31,0.55)]",
        className
      )}
      {...props}
    />
  );
});

ComponentPreview.displayName = "ConusComponentPreview";

export { ComponentPreview };
