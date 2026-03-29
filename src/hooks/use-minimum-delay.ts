"use client";

import { useEffect, useRef, useState } from "react";

export function useMinimumDelay(active: boolean, minimumMs = 1000) {
  const [visible, setVisible] = useState(active);
  const startedAtRef = useRef<number | null>(active ? Date.now() : null);

  useEffect(() => {
    if (active) {
      startedAtRef.current = Date.now();
      setVisible(true);
      return;
    }

    const elapsed = startedAtRef.current
      ? Date.now() - startedAtRef.current
      : minimumMs;
    const timeout = window.setTimeout(
      () => setVisible(false),
      Math.max(minimumMs - elapsed, 0)
    );

    return () => window.clearTimeout(timeout);
  }, [active, minimumMs]);

  return visible;
}
