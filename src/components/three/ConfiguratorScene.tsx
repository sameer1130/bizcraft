"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Bag, makePlaceholderLogo } from "./Bag";
import { Studio } from "./Studio";
import { LoopKick } from "./LoopKick";
import { useInView } from "@/lib/hooks";

export type Capture = () => string;

/** Renders one frame on demand and hands back a PNG data URL. */
function CaptureBridge({ onReady }: { onReady: (fn: Capture) => void }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    onReady(() => {
      gl.render(scene, camera);
      return gl.domElement.toDataURL("image/png");
    });
  }, [gl, scene, camera, onReady]);
  return null;
}

export default function ConfiguratorScene({
  color,
  logo,
  logoSize,
  onCaptureReady,
}: {
  color: string;
  logo: THREE.Texture | "placeholder";
  logoSize: number;
  onCaptureReady: (fn: Capture) => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap);
  // Placeholder artwork flips to light ink on dark fabrics.
  const placeholders = useMemo(
    () => ({ dark: makePlaceholderLogo("#16181c"), light: makePlaceholderLogo("#f4f1ea") }),
    [],
  );
  useEffect(
    () => () => {
      placeholders.dark.dispose();
      placeholders.light.dispose();
    },
    [placeholders],
  );
  const placeholder =
    new THREE.Color(color).getHSL({ h: 0, s: 0, l: 0 }, THREE.SRGBColorSpace).l < 0.45
      ? placeholders.light
      : placeholders.dark;

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [2.3, 0.55, 7], fov: 30 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        style={{ touchAction: "pan-y" }}
      >
        <LoopKick active={inView} />
        <Suspense fallback={null}>
          <Bag
            color={color}
            logo={logo === "placeholder" ? placeholder : logo}
            logoSize={logoSize}
          />
          <Studio shadowOpacity={0.5} />
        </Suspense>
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          minPolarAngle={Math.PI * 0.32}
          maxPolarAngle={Math.PI * 0.56}
          rotateSpeed={0.8}
        />
        <CaptureBridge onReady={onCaptureReady} />
      </Canvas>
    </div>
  );
}
