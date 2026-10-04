"use client";

import { useSyncExternalStore } from "react";

/**
 * Shared state for the unzip intro. GSAP writes `rig` every scroll tick (read
 * by the 3D scene in useFrame, no React renders); React only re-renders on
 * the coarse `phase` flip.
 *
 * phase "intro" — the bag overlay covers the hero
 * phase "site"  — we're inside / the site is showing
 */
export type Phase = "intro" | "site";

export const intro = {
  phase: "intro" as Phase,
  /** True once the site has been revealed at least once. */
  revealed: false,
  /** Scroll position where the pinned intro ends. */
  endScroll: 0,
  /** On-screen rect of the 3D woven label at the end of the dive (px). */
  labelRect: null as null | { x: number; y: number; w: number; h: number },
  rig: {
    /** bag turns to face the camera */
    turn: 0,
    /** camera pushes in on the zipper */
    push: 0,
    /** slider travel 0 → 1 */
    zip: 0,
    /** opening widens for the dive */
    widen: 0,
    /** camera flies through the opening */
    dive: 0,
  },
};

const listeners = new Set<() => void>();

export function setPhase(phase: Phase) {
  if (intro.phase === phase) return;
  intro.phase = phase;
  if (phase === "site") intro.revealed = true;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export const usePhase = () =>
  useSyncExternalStore(
    subscribe,
    () => intro.phase,
    () => "intro" as Phase,
  );

/** Runs `cb` the first time the site is revealed (immediately if it already was). */
export function whenRevealed(cb: () => void) {
  if (intro.revealed) {
    cb();
    return () => {};
  }
  const off = subscribe(() => {
    if (intro.revealed) {
      off();
      cb();
    }
  });
  return off;
}
