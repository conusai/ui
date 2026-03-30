import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type {
  LanguageOption,
  LanguagePickerPresentation,
  LanguagePickerProps,
} from "../language-picker/language-picker.types";

export type HeaderProps = Omit<ComponentPropsWithoutRef<"header">, "title"> & {
  title: string;
  subtitle: string;
  language: string;
  languages: LanguageOption[];
  onLanguageChange: (value: string) => void;
  onMenuClick: () => void;
  showMenuButton?: boolean;
  languagePresentation?: LanguagePickerPresentation;
  languagePickerProps?: Partial<
    Omit<LanguagePickerProps, "options" | "value" | "onChange">
  >;
  menuButtonAsChild?: boolean;
  menuButtonChild?: ReactNode;
  menuButtonLabel?: string;
  themeToggleAsChild?: boolean;
  themeToggleChild?: ReactNode;
  themeToggleLabel?: string;
  avatar?: ReactNode;
  surface?: "default" | "elevated";
};
