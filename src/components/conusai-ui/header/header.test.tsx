import { renderWithTheme } from "@/test/render";
import { Header } from "./header";

describe("Header", () => {
  it("matches snapshot", () => {
    const { container } = renderWithTheme(
      <Header
        title="Operations"
        subtitle="ConusAI"
        language="en"
        languages={[{ value: "en", label: "English", flag: "US" }]}
        onLanguageChange={() => undefined}
        onMenuClick={() => undefined}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
