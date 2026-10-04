"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

function mediaQueryStore(query: string) {
  return {
    subscribe(cb: () => void) {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    get: () => window.matchMedia(query).matches,
  };
}

export function useMediaQuery(query: string, serverValue = false) {
  const [store] = useState(() => mediaQueryStore(query));
  return useSyncExternalStore(store.subscribe, store.get, () => serverValue);
}

export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

export const useCoarsePointer = () => useMediaQuery("(pointer: coarse)");

/** True while the element is on (or near) screen — used to pause WebGL. */
export function useInView(
  ref: RefObject<Element | null>,
  rootMargin = "120px",
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
