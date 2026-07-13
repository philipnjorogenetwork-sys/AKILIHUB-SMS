import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Prevent service worker registration errors in development
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register("./sw.js").catch(() => {
    // Silently fail if service worker registration fails
  });
}

createRoot(document.getElementById("root")!).render(<App />);
