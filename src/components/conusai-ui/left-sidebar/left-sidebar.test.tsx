import { Home } from "lucide-react";
import { renderWithTheme } from "@/test/render";
import { LeftSidebar } from "./left-sidebar";

describe("LeftSidebar", () => {
  it("matches snapshot", () => {
    const { container } = renderWithTheme(
      <LeftSidebar
        open
        variant="inline"
        items={[{ id: "overview", label: "Overview", icon: Home }]}
        activeItem="overview"
        onClose={() => undefined}
        onSelect={() => undefined}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
