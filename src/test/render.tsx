import { render } from "@testing-library/react";

import { ThemeProvider } from "@/components/theme-provider";

export function renderWithTheme(ui: React.ReactNode) {
  return render(<ThemeProvider defaultTheme="light">{ui}</ThemeProvider>);
}
