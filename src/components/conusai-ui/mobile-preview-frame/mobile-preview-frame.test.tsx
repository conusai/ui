import { renderWithTheme } from "@/test/render";
import { MobilePreviewFrame } from "./mobile-preview-frame";

describe("MobilePreviewFrame", () => {
  it("matches snapshot", () => {
    const { container } = renderWithTheme(
      <MobilePreviewFrame mode="mobile">
        <div className="h-full bg-background" />
      </MobilePreviewFrame>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
