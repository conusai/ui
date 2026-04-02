import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type HeaderProps = Omit<ComponentPropsWithoutRef<"header">, "title"> & {
  title: string;
  subtitle?: string;
  /** Slot for leading content (e.g. menu button, back button). */
  leading?: ReactNode;
  /** Slot for trailing content (e.g. language picker, theme toggle, avatar). */
  trailing?: ReactNode;
  surface?: "default" | "elevated";
};
