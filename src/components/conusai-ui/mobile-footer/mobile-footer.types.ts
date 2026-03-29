import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

export type FooterTab = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export type MobileFooterProps = Omit<
  ComponentPropsWithoutRef<"nav">,
  "onChange"
> & {
  items: FooterTab[];
  activeItem: string;
  onChange: (id: string) => void;
  surface?: "floating" | "flush";
};
