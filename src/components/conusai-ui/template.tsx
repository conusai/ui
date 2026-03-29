"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const conusComponentVariants = cva("", {
  variants: {
    surface: {
      default: "",
    },
  },
  defaultVariants: {
    surface: "default",
  },
});

export interface ConusComponentTemplateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof conusComponentVariants> {}

const ConusComponentTemplate = React.forwardRef<
  HTMLDivElement,
  ConusComponentTemplateProps
>(({ className, surface, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(conusComponentVariants({ surface }), className)}
      {...props}
    />
  );
});

ConusComponentTemplate.displayName = "ConusComponentTemplate";

export { ConusComponentTemplate, conusComponentVariants };
