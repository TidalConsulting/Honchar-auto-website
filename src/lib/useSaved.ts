"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "honchar:saved";
const EVENT = "honchar:saved-change";

const EMPTY: string[] = [];

// Cached so getSnapshot returns a referentially stable array between renders.
let cachedRaw: string | null = null;
let cachedIds: string[] = EMPTY;

function parse(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : EMPTY;
  } catch {
    return EMPTY;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): string[] {
  const raw = window.localStorage.getItem(KEY) ?? "";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedIds = raw ? parse(raw) : EMPTY;
  }
  return cachedIds;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

const noopSubscribe = () => () => {};

/** Saved ("hearted") vehicles, kept in localStorage so shoppers don't need an account. */
export function useSaved() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // False during SSR and the first client render, true once hydrated — lets
  // callers hold off on rendering "nothing saved" before localStorage is read.
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const toggle = useCallback((id: string) => {
    const current = getSnapshot();
    const next = current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT));
  }, []);

  return { ids, ready, toggle, isSaved: (id: string) => ids.includes(id) };
}
