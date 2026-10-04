"use client";

import { Suspense, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PresentationControls } from "@react-three/drei";
import { Bag } from "./Bag";
import { Studio } from "./Studio";
import { LoopKick } from "./LoopKick";
import {
  useCoarsePointer,
  useInView,
  usePrefersReducedMotion,
} from "@/lib/hooks";
import { intro, usePhase } from "@/lib/intro";

/** Idle sway plus a quarter-turn as the hero scrolls away. */
function ScrollSpin({
  children,
  reduced,
}: {
  children: ReactNode;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    // Measured from the end of the pinned intro, not the top of the page.
    const end = Number.isFinite(intro.endScroll) ? intro.endScroll : 0;
    const scrolled = Math.max(0, window.scrollY - end);
    const progress = Math.min(scrolled / window.innerHeight, 1.5);
    const sway = reduced ? 0 : Math.sin(clock.elapsedTime * 0.35) * 0.45;
    group.current.rotation.y = -0.45 + sway + progress * 1.6;
  });
  return <group ref={group}>{children}</group>;
}

export default function HeroScene({ color }: { color: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap);
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const phase = usePhase();

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={inView && phase === "site" ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 0.05, 7.6], fov: 28 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ touchAction: "pan-y" }}
        aria-hidden
      >
        <LoopKick active={inView && phase === "site"} />
        <Suspense fallback={null}>
          <PresentationControls
            enabled={!coarse}
            global={false}
            cursor
            snap
            speed={1.5}
            polar={[-0.12, 0.2]}
            azimuth={[-Math.PI, Math.PI]}
          >
            <ScrollSpin reduced={reduced}>
              <Float
                enabled={!reduced}
                speed={1.4}
                rotationIntensity={0.12}
                floatIntensity={0.35}
                floatingRange={[-0.04, 0.06]}
              >
                <Bag color={color} />
              </Float>
            </ScrollSpin>
          </PresentationControls>
          <Studio />
        </Suspense>
      </Canvas>
    </div>
  );
}
