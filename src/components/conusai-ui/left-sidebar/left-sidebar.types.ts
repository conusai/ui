import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

export type NavItem = {
  id: string;
  label: string;
  meta?: string;
  icon?: LucideIcon;
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
};
