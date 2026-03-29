"use client";

import { useCallback } from "react";

export function useVibrate() {
  return useCallback((pattern: number | number[] = 16) => {
    if (typeof window === "undefined") {
      return false;
    }

    if (!("vibrate" in navigator)) {
      return false;
    }

    return navigator.vibrate(pattern);
  }, []);
}
