import type {
  LanguageOption,
  LanguagePickerPresentation,
} from "../language-picker/language-picker.types";

export type HeaderProps = {
  title: string;
  subtitle: string;
  language: string;
  languages: LanguageOption[];
  onLanguageChange: (value: string) => void;
  onMenuClick: () => void;
  showMenuButton?: boolean;
  languagePresentation?: LanguagePickerPresentation;
  className?: string;
};
