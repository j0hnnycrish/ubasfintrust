import { useEffect } from "react";

// Minimal window typings for Smartsupp globals
declare global {
  interface Window {
    _smartsupp?: { key?: string } & Record<string, any>;
    smartsupp?: ((...args: any[]) => void) & { _: any[] };
  }
}

/**
 * Dynamically inject Smartsupp chat widget in PRODUCTION only.
 * Reads the key from VITE_SMARTSUPP_KEY.
 */
export default function SmartsuppChat() {
  useEffect(() => {
    const enableDev = (import.meta.env.VITE_SMARTSUPP_ENABLE_DEV === 'true');
    const isProd = import.meta.env.PROD;

    // Decide whether to enable
    if (!isProd && !enableDev) return;

    // Choose key: dev key first, then prod key
    const smartsuppKey = (
      (!isProd && import.meta.env.VITE_SMARTSUPP_KEY_DEV) ||
      import.meta.env.VITE_SMARTSUPP_KEY
    ) as string | undefined;

    if (!smartsuppKey) {
      console.warn("Smartsupp key missing. Set VITE_SMARTSUPP_KEY (prod) or VITE_SMARTSUPP_KEY_DEV (dev).");
      return;
    }

    // Avoid double-injection
    if (window.smartsupp) return;

    // Inject Smartsupp loader
    (function (d: Document) {
      let s = d.getElementsByTagName("script")[0];
      const c = d.createElement("script");
      const o = (window.smartsupp = function (...args: any[]) {
        // queue calls until script loads
        (o._ as any[]).push(args);
      }) as any;
      o._ = [];
      c.type = "text/javascript";
      c.charset = "utf-8";
      c.async = true;
      c.src = "https://www.smartsuppchat.com/loader.js?";
      s.parentNode?.insertBefore(c, s);
    })(document);

    // Set the key
    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = smartsuppKey;
  }, []);

  return null;
}