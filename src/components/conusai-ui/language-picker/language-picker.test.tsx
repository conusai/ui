import { renderWithTheme } from "@/test/render";
import { LanguagePicker } from "./language-picker";

describe("LanguagePicker", () => {
  it("matches snapshot", () => {
    const { container } = renderWithTheme(
      <LanguagePicker
        value="en"
        options={[{ value: "en", label: "English", flag: "US" }]}
        onChange={() => undefined}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
