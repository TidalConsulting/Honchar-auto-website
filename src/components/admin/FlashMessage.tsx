"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const MESSAGES: Record<string, string> = {
  created: "Vehicle added and live on the website.",
  updated: "Changes saved.",
  deleted: "Vehicle removed.",
};

function FlashMessageInner() {
  const params = useSearchParams();
  const key = Object.keys(MESSAGES).find((entry) => params.get(entry) === "1");

  // Storing the dismissed key (rather than a boolean) means a new message
  // shows again without needing to reset state in an effect.
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!key) return;
    const timer = setTimeout(() => setDismissedKey(key), 6000);
    return () => clearTimeout(timer);
  }, [key]);

  if (!key || dismissedKey === key) return null;

  return (
    <div className="mb-6 flex items-center gap-3 rounded-card border border-green-200 bg-green-50 px-4 py-3">
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-green-600" fill="none">
        <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-sm font-semibold text-green-900">{MESSAGES[key]}</p>
      <button
        type="button"
        onClick={() => setDismissedKey(key)}
        className="ml-auto text-sm font-semibold text-green-700 hover:underline"
      >
        Dismiss
      </button>
    </div>
  );
}

export function FlashMessage() {
  return (
    <Suspense fallback={null}>
      <FlashMessageInner />
    </Suspense>
  );
}
