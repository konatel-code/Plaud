"use client";

import { useEffect } from "react";

/** Zaregistruje service worker (PWA – inštalovateľnosť, offline shell). */
export function PWA() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/Plaud/sw.js", { scope: "/Plaud/" }).catch(() => undefined);
  }, []);
  return null;
}
