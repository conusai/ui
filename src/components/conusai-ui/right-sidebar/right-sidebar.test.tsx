import { renderWithTheme } from "@/test/render";
import { RightSidebar } from "./right-sidebar";

describe("RightSidebar", () => {
  it("matches snapshot", () => {
    const { container } = renderWithTheme(
      <RightSidebar
        open
        variant="inline"
        todo={{
          id: "todo-1",
          title: "Ship package exports",
          description: "Finish the package refactor",
          priority: "High",
        }}
        onClose={() => undefined}
        onChange={() => undefined}
        onDelete={() => undefined}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
