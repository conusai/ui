import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type LanguageOption = {
  value: string;
  label: string;
  flag: string;
};

export type LanguagePickerPresentation = "sheet" | "dropdown";

export type LanguagePickerProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "onChange" | "children"
> & {
  options: LanguageOption[];
  value: string;
  onChange: (value: string) => void;
  presentation?: LanguagePickerPresentation;
  triggerVariant?: "outline" | "ghost";
  ariaLabel?: string;
  asChild?: boolean;
  children?: ReactNode;
  title?: string;
};
