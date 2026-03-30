import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type NavItem = {
  id: string;
  label: string;
  meta?: string;
  icon?: LucideIcon;
  ariaLabel?: string;
  asChild?: boolean;
  children?: ReactNode;
};

export type LeftSidebarProps = Omit<
  ComponentPropsWithoutRef<"aside">,
  "onSelect"
> & {
  open: boolean;
  items: NavItem[];
  activeItem: string;
  onClose: () => void;
  onSelect: (id: string) => void;
  variant?: "overlay" | "inline";
  eyebrow?: string;
  title?: string;
  note?: ReactNode;
  closeButtonAsChild?: boolean;
  closeButtonChild?: ReactNode;
  closeButtonLabel?: string;
  renderItem?: (
    item: NavItem,
    state: { active: boolean; index: number }
  ) => ReactNode;
};
