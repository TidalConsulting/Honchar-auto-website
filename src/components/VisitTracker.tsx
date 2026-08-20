"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const SESSION_KEY = "honchar:visit-session";

function randomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * A session lasts as long as the browser tab. sessionStorage rather than a
 * cookie, so there is nothing to disclose and nothing that follows anyone
 * between visits.
 */
function sessionId() {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = randomId();
    window.sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return randomId();
  }
}

/** Records the page view, then how long the visitor stayed, when they leave. */
export function VisitTracker() {
  const pathname = usePathname();
  const viewId = useRef<string | null>(null);
  const startedAt = useRef<number>(0);
  const sent = useRef(false);

  useEffect(() => {
    const id = randomId();
    viewId.current = id;
    startedAt.current = Date.now();
    sent.current = false;

    const payload = JSON.stringify({
      type: "view",
      id,
      sessionId: sessionId(),
      path: pathname,
    });
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Never let analytics surface an error to a shopper.
    });

    const flush = () => {
      if (sent.current || !viewId.current) return;
      sent.current = true;
      const body = JSON.stringify({
        type: "dwell",
        id: viewId.current,
        ms: Date.now() - startedAt.current,
      });
      // sendBeacon survives the page being closed, which fetch does not.
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
          return;
        }
      } catch {
        // fall through to fetch
      }
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    };

    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };

    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);

    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
      // Navigating to another page in the app ends this view too.
      flush();
    };
  }, [pathname]);

  return null;
}
