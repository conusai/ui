import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import type { MobilePreviewFrameProps } from "./mobile-preview-frame.types";

const frameRootVariants = cva("relative mx-auto w-full", {
  variants: {
    mode: {
      mobile: "max-w-[420px]",
      tablet: "max-w-[1120px]",
      desktop: "max-w-[1480px]",
    },
  },
  defaultVariants: {
    mode: "mobile",
  },
});

const MobilePreviewFrame = React.forwardRef<
  HTMLDivElement,
  MobilePreviewFrameProps
>(
  (
    {
      children,
      className,
      mode = "mobile",
      screenshotCrop = false,
      screenClassName,
      frameClassName,
      chromeLabel = "conusai.app/demo",
      ...props
    },
    ref
  ) => {
    const viewportClassName = cn(
      screenshotCrop && "overflow-hidden rounded-none border-none shadow-none",
      screenClassName
    );

    if (mode === "tablet") {
      return (
        <div
          ref={ref}
          data-screenshot="preview-frame"
          data-screenshot-crop={screenshotCrop}
          data-preview-mode="tablet"
          data-slot="conus-mobile-preview-frame"
          className={cn(frameRootVariants({ mode }), className)}
          {...props}
        >
          <div className="pointer-events-none absolute inset-x-12 top-0 z-10 h-20 rounded-b-[2.5rem] bg-[linear-gradient(180deg,rgba(9,17,31,0.45),rgba(9,17,31,0.02))] blur-3xl" />
          <div
            className={cn(
              "relative rounded-[2.4rem] border border-foreground/10 bg-[linear-gradient(180deg,rgba(9,17,31,0.95),rgba(17,29,52,0.98))] p-4 shadow-[0_36px_120px_-46px_rgba(10,16,31,0.7)]",
              frameClassName,
              screenshotCrop &&
                "rounded-none border-none bg-transparent p-0 shadow-none"
            )}
          >
            <div
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-[1.8rem] border border-white/8 bg-background",
                viewportClassName
              )}
            >
              {children}
            </div>
          </div>
        </div>
      );
    }

    if (mode === "desktop") {
      return (
        <div
          ref={ref}
          data-screenshot="preview-frame"
          data-screenshot-crop={screenshotCrop}
          data-preview-mode="desktop"
          data-slot="conus-mobile-preview-frame"
          className={cn(frameRootVariants({ mode }), className)}
          {...props}
        >
          <div className="pointer-events-none absolute inset-x-16 top-2 z-10 h-24 rounded-b-[2.5rem] bg-[linear-gradient(180deg,rgba(9,17,31,0.42),rgba(9,17,31,0.02))] blur-3xl" />
          <div
            className={cn(
              "relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-[linear-gradient(180deg,rgba(251,253,255,0.88),rgba(240,246,255,0.68))] p-2 shadow-[0_42px_120px_-56px_rgba(10,16,31,0.72)] dark:bg-[linear-gradient(180deg,rgba(9,17,31,0.95),rgba(17,29,52,0.98))]",
              frameClassName,
              screenshotCrop &&
                "rounded-none border-none bg-transparent p-0 shadow-none"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2 border-b border-border/70 px-4 py-3",
                screenshotCrop && "hidden"
              )}
            >
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <div className="ml-3 rounded-full border border-border/70 bg-background/80 px-4 py-1 text-xs text-muted-foreground">
                {chromeLabel}
              </div>
            </div>
            <div
              className={cn(
                "relative aspect-[16/10] overflow-hidden rounded-[1.3rem] border border-white/8 bg-background",
                viewportClassName
              )}
            >
              {children}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-screenshot="preview-frame"
        data-screenshot-crop={screenshotCrop}
        data-preview-mode="mobile"
        data-slot="conus-mobile-preview-frame"
        className={cn(frameRootVariants({ mode }), className)}
        {...props}
      >
        <div className="pointer-events-none absolute inset-x-6 top-0 z-10 h-16 rounded-b-[2rem] bg-[linear-gradient(180deg,rgba(9,17,31,0.85),rgba(9,17,31,0.65))] blur-2xl" />
        <div
          className={cn(
            "relative rounded-[2.8rem] border border-foreground/10 bg-[linear-gradient(180deg,rgba(9,17,31,0.95),rgba(17,29,52,0.98))] p-3 shadow-[0_36px_120px_-42px_rgba(10,16,31,0.85)]",
            frameClassName,
            screenshotCrop &&
              "rounded-none border-none bg-transparent p-0 shadow-none"
          )}
        >
          <div
            className={cn(
              "absolute left-1/2 top-3 h-6 w-32 -translate-x-1/2 rounded-full bg-black/70",
              screenshotCrop && "hidden"
            )}
          />
          <div
            className={cn(
              "relative aspect-[375/812] overflow-hidden rounded-[2.2rem] border border-white/8 bg-background",
              viewportClassName
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);

MobilePreviewFrame.displayName = "ConusMobilePreviewFrame";

export { MobilePreviewFrame };
