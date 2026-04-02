import { renderWithTheme } from "@/test/render";
import { RightSidebar } from "./right-sidebar";

describe("RightSidebar", () => {
  it("matches snapshot", () => {
    const { container } = renderWithTheme(
      <RightSidebar
        open
        variant="inline"
        eyebrow="Inspector"
        title="Task detail"
        onClose={() => undefined}
      >
        <p>Panel content</p>
      </RightSidebar>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
