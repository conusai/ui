import type { ComponentPropsWithoutRef } from "react";

export type LoaderProps = ComponentPropsWithoutRef<"div"> & {
  visible: boolean;
  tone?: "default" | "soft";
};
