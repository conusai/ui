export type ViewportPreset = {
  id: string;
  label: string;
  width: number;
  height: number;
};

export const viewports: Record<string, ViewportPreset> = {
  mobile: { id: "mobile", label: "Mobile", width: 1440, height: 900 },
  tablet: { id: "tablet", label: "Tablet", width: 1440, height: 1024 },
  desktop: { id: "desktop", label: "Desktop", width: 1920, height: 1200 },
};
