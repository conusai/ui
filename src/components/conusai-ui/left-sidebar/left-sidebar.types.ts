import type { LucideIcon } from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  meta?: string;
  icon?: LucideIcon;
};

export type LeftSidebarProps = {
  open: boolean;
  items: NavItem[];
  activeItem: string;
  onClose: () => void;
  onSelect: (id: string) => void;
  variant?: "overlay" | "inline";
  className?: string;
};
