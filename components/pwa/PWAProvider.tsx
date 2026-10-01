"use client";

import { useEffect, useRef, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PWAProvider() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [updateReady, setUpdateReady] = useState<ServiceWorker | null>(null);
  const reloadingRef = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => setInstallPrompt(null);
    const handleControllerChange = () => {
      if (reloadingRef.current) return;
      reloadingRef.current = true;
      window.location.reload();
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    let active = true;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((registration) => {
        if (!active) return;
        if (registration.waiting) setUpdateReady(registration.waiting);
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateReady(worker);
            }
          });
        });
      })
      .catch((error) => console.warn("PWA service worker registration failed:", error));

    return () => {
      active = false;
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const applyUpdate = () => updateReady?.postMessage({ type: "SKIP_WAITING" });

  if (!installPrompt && !updateReady) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-full border border-white/15 bg-black/90 px-4 py-3 text-white shadow-2xl shadow-black/50 backdrop-blur-xl">
      <span className="h-2 w-2 shrink-0 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
      <p className="font-[family-name:var(--font-inter)] text-xs tracking-wide text-white/75">
        {updateReady ? "A new version is ready" : "Install the Philosophy app"}
      </p>
      <button
        type="button"
        onClick={updateReady ? applyUpdate : installApp}
        className="rounded-full bg-white px-4 py-2 font-[family-name:var(--font-inter)] text-xs font-semibold text-black transition hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {updateReady ? "Update" : "Install"}
      </button>
    </div>
  );
}
