import type { ComponentPropsWithoutRef } from "react";

export type LanguageOption = {
  value: string;
  label: string;
  flag: string;
};

export type LanguagePickerPresentation = "auto" | "sheet" | "dropdown";

export type LanguagePickerProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "onChange"
> & {
  options: LanguageOption[];
  value: string;
  onChange: (value: string) => void;
  presentation?: LanguagePickerPresentation;
  triggerVariant?: "outline" | "ghost";
  ariaLabel?: string;
};
