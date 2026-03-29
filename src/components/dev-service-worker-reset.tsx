"use client";

import { useEffect } from "react";

const RESET_FLAG = "conusai-dev-sw-reset";

export function DevServiceWorkerReset() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let cancelled = false;

    const resetServiceWorkers = async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      const hasRegistrations = registrations.length > 0;

      if (hasRegistrations) {
        await Promise.all(
          registrations.map((registration) => registration.unregister())
        );
      }

      if ("caches" in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((cacheKey) => caches.delete(cacheKey)));
      }

      if (cancelled || !hasRegistrations) {
        return;
      }

      if (window.sessionStorage.getItem(RESET_FLAG) === "done") {
        return;
      }

      window.sessionStorage.setItem(RESET_FLAG, "done");
      window.location.reload();
    };

    void resetServiceWorkers();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
