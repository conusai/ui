import { renderWithTheme } from "@/test/render";
import { Header } from "./header";

describe("Header", () => {
  it("matches snapshot", () => {
    const { container } = renderWithTheme(
      <Header title="Operations" subtitle="ConusAI" />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
