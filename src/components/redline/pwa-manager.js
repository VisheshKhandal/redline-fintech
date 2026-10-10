"use client";
import { useEffect, useState } from "react";

export default function PwaManager() {
  const [prompt, setPrompt] = useState(null);
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
    }
    const onInstall = (event) => { event.preventDefault(); setPrompt(event); };
    const onInstalled = () => setPrompt(null);
    window.addEventListener("beforeinstallprompt", onInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onInstall); window.removeEventListener("appinstalled", onInstalled); };
  }, []);
  if (!prompt) return null;
  return <div className="pwa-install">
    <button onClick={async () => { await prompt.prompt(); await prompt.userChoice; setPrompt(null); }}>Install Redline <span aria-hidden="true">↗</span></button>
    <button onClick={() => setPrompt(null)} aria-label="Dismiss installation suggestion">×</button>
  </div>;
}
