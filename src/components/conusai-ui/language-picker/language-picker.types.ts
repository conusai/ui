export type LanguageOption = {
  value: string;
  label: string;
  flag: string;
};

export type LanguagePickerPresentation = "auto" | "sheet" | "dropdown";

export type LanguagePickerProps = {
  options: LanguageOption[];
  value: string;
  onChange: (value: string) => void;
  presentation?: LanguagePickerPresentation;
  className?: string;
};
