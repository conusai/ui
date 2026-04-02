import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type RightSidebarProps = Omit<
  ComponentPropsWithoutRef<"aside">,
  "children"
> & {
  open: boolean;
  onClose: () => void;
  variant?: "overlay" | "inline";
  /** Eyebrow label shown in the panel header (inline variant only). */
  eyebrow?: string;
  /** Title shown in the panel header (inline variant only). */
  title?: string;
  backLabel?: string;
  backButtonAsChild?: boolean;
  backButtonChild?: ReactNode;
  children?: ReactNode;
};
