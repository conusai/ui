import type { LucideIcon } from "lucide-react";

export type FooterTab = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export type MobileFooterProps = {
  items: FooterTab[];
  activeItem: string;
  onChange: (id: string) => void;
  className?: string;
};
