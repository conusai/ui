import { renderWithTheme } from "@/test/render";
import { Loader } from "./loader";

describe("Loader", () => {
  it("matches snapshot", () => {
    const { container } = renderWithTheme(<Loader visible />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
