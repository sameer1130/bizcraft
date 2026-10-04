"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { createScope } from "animejs";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Runs an anime.js setup once on mount, scoped to the returned ref. Every
 * animation / scroll observer / text split created inside is reverted on
 * unmount. Skipped entirely under prefers-reduced-motion (CSS then shows the
 * final state, see globals.css).
 */
export function useAnime<T extends Element>(
  setup: (root: T) => void | (() => void),
) {
  const ref = useRef<T>(null);
  const run = useEffectEvent(setup);

  useEffect(() => {
    const root = ref.current;
    // Tells the CSS failsafe that animations are running (see globals.css).
    document.documentElement.classList.add("anim-ready");
    if (!root || prefersReducedMotion()) return;
    let cleanup: void | (() => void);
    const scope = createScope({ root: root as unknown as HTMLElement }).add(() => {
      cleanup = run(root);
    });
    return () => {
      cleanup?.();
      scope.revert();
    };
  }, []);

  return ref;
}
