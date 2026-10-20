"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { BAG_HEIGHT } from "./Bag";

/**
 * Self-contained studio lighting — no HDRI download, so the scene renders
 * offline and adds nothing to the network waterfall.
 */
export function Studio({
  shadowOpacity = 0.42,
  rim = false,
}: {
  shadowOpacity?: number;
  /** Warm + cool back lights that pick the bag's edges out of a dark stage. */
  rim?: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} />
      {rim ? (
        <>
          <directionalLight position={[-4, 1.5, -3]} intensity={2.6} color="#ff7a3d" />
          <directionalLight position={[4, 2.5, -3]} intensity={1.6} color="#a9bcff" />
        </>
      ) : null}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[0, 3, 4]}
          scale={[8, 3, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          position={[-5, 1, 1]}
          scale={[3, 6, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1}
          color="#ffd9b8"
          position={[5, 1, -2]}
          scale={[3, 6, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="circle"
          intensity={0.6}
          position={[0, -4, 0]}
          rotation-x={Math.PI / 2}
          scale={6}
        />
      </Environment>
      <ContactShadows
        position={[0, -BAG_HEIGHT / 2 - 0.01, 0]}
        opacity={shadowOpacity}
        scale={5}
        blur={2.4}
        far={1.6}
        resolution={512}
        color="#1b1c20"
      />
    </>
  );
}
