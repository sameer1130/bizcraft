"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * R3F doesn't restart its render loop on its own when `frameloop` flips from
 * "never" back to "always" (e.g. a canvas scrolling back into view, or the
 * hero waking up after the intro). Nudge it.
 */
export function LoopKick({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!active) return;
    // Wait a frame so the Canvas has applied the new frameloop before we
    // invalidate — R3F ignores invalidate() while frameloop is still "never".
    const id = requestAnimationFrame(() => invalidate());
    return () => cancelAnimationFrame(id);
  }, [active, invalidate]);
  return null;
}
