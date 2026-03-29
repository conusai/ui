import type { ComponentPropsWithoutRef } from "react";

import type {
  LanguageOption,
  LanguagePickerPresentation,
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
  surface?: "default" | "elevated";
};
