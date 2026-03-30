import { Home } from "lucide-react";
import { renderWithTheme } from "@/test/render";
import { MobileFooter } from "./mobile-footer";

describe("MobileFooter", () => {
  it("matches snapshot", () => {
    const { container } = renderWithTheme(
      <MobileFooter
        items={[{ id: "home", label: "Home", icon: Home }]}
        activeItem="home"
        onChange={() => undefined}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
