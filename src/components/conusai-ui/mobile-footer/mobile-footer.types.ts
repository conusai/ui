import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type FooterTab = {
  id: string;
  label: string;
  icon: LucideIcon;
  ariaLabel?: string;
  asChild?: boolean;
  children?: ReactNode;
};

export type MobileFooterProps = Omit<
  ComponentPropsWithoutRef<"nav">,
  "onChange"
> & {
  items: FooterTab[];
  activeItem: string;
  onChange: (id: string) => void;
  surface?: "floating" | "flush";
  renderItem?: (
    item: FooterTab,
    state: { active: boolean; index: number }
  ) => ReactNode;
};
