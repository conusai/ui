export type PreviewModeId = "mobile" | "tablet" | "desktop";

export type ViewportConfig = {
  id: PreviewModeId;
  label: string;
  width: number;
  height: number;
};

export const VIEWPORTS: ViewportConfig[] = [
  { id: "mobile", label: "Mobile", width: 1440, height: 900 },
  { id: "tablet", label: "Tablet", width: 1440, height: 1024 },
  { id: "desktop", label: "Desktop", width: 1920, height: 1200 },
];
