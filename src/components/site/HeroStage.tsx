"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { swatches } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { pop, ScrambleText } from "@/components/anim/Anim";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <StageLoading />,
});

export function StageLoading() {
  return (
    <div className="absolute inset-0 grid place-items-center" role="status">
      <span className="eyebrow animate-pulse text-ink-3">Loading 3D bag…</span>
    </div>
  );
}

const heroSwatches = swatches.filter((s) =>
  ["Chalk", "Saffron", "Navy", "Olive", "Maroon"].includes(s.name),
);

export function HeroStage() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (reduced || pinned) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % heroSwatches.length),
      3200,
    );
    return () => window.clearInterval(id);
  }, [reduced, pinned]);

  const current = heroSwatches[index];

  return (
    <div className="relative h-full w-full">
      <HeroScene color={current.hex} />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-2">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-paper/80 p-1.5 shadow-[0_1px_0_var(--color-line)] backdrop-blur">
          {heroSwatches.map((s, i) => (
            <button
              key={s.name}
              type="button"
              onClick={(e) => {
                setIndex(i);
                setPinned(true);
                pop(e.currentTarget, 0.7);
              }}
              aria-label={`Show the bag in ${s.name}`}
              aria-pressed={i === index}
              className={`size-7 rounded-full border border-ink/15 transition-transform ${
                i === index ? "scale-110 ring-2 ring-ink ring-offset-2 ring-offset-paper" : "hover:scale-105"
              }`}
              style={{ background: s.hex }}
            />
          ))}
        </div>
        <p className="eyebrow text-ink-3">
          Fabric — <ScrambleText text={current.name.toUpperCase()} />
          <span className="hidden md:inline"> · Drag to turn</span>
        </p>
      </div>
    </div>
  );
}
