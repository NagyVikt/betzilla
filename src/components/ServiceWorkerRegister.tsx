// components/ServiceWorkerRegister.tsx
"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js") // or "/service-worker.js" depending on your config
          .then((reg) => {
            console.log("SW registered:", reg);
          })
          .catch((err) => {
            console.error("SW registration failed:", err);
          });
      });
    }
  }, []);
  return null;
}
