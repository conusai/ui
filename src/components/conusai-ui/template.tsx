"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
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
  ConusComponentTemplateProps & { asChild?: boolean }
>(({ asChild = false, className, surface, ...props }, ref) => {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      ref={ref}
      className={cn(conusComponentVariants({ surface }), className)}
      {...props}
    />
  );
});

ConusComponentTemplate.displayName = "ConusComponentTemplate";

export { ConusComponentTemplate, conusComponentVariants };
