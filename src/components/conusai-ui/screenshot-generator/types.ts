export type GeminiAction = {
  type:
    | "click"
    | "scroll"
    | "scroll-up"
    | "navigate"
    | "open-sidebar"
    | "close-sidebar"
    | "tap-tab"
    | "wait";
  selector?: string;
  description: string;
};

export type GeminiExplorerResponse = {
  actions: GeminiAction[];
  screenshotLabel: string;
  done: boolean;
};

export type ScreenshotEntry = {
  filename: string;
  viewport: string;
  step: number;
  label: string;
};
