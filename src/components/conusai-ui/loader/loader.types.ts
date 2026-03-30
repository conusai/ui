import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type LoaderProps = ComponentPropsWithoutRef<"div"> & {
  visible: boolean;
  tone?: "default" | "soft";
  children?: ReactNode;
  label?: string;
  description?: string;
  indicator?: ReactNode;
};
