import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type PreviewMode = "mobile" | "tablet" | "desktop";

export type MobilePreviewFrameProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
  mode?: PreviewMode;
  screenshotCrop?: boolean;
  screenClassName?: string;
  frameClassName?: string;
  chromeLabel?: string;
};
