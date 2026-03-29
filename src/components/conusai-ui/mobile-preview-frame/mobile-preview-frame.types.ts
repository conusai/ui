import type { ReactNode } from "react";

export type PreviewMode = "mobile" | "tablet" | "desktop";

export type MobilePreviewFrameProps = {
  children: ReactNode;
  className?: string;
  mode?: PreviewMode;
};
