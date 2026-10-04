"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Bag, finishTexture, ZIP, zipSurfaceAt } from "@/components/three/Bag";

// Lining box = the hollowed interior volume from Bag.tsx.
const H = ZIP.hollow;
const LINING_SIZE = [0, 1, 2].map((i) => H.max[i] - H.min[i]) as [number, number, number];
const LINING_POS = [0, 1, 2].map((i) => (H.max[i] + H.min[i]) / 2) as [number, number, number];
import { Studio } from "@/components/three/Studio";
import { LoopKick } from "@/components/three/LoopKick";
import { intro, usePhase } from "@/lib/intro";

const { rig } = intro;
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = THREE.MathUtils.lerp;

// Camera stations, in bag space (front = +Z, zipper at y ≈ -0.31).
const START = new THREE.Vector3(0, 0.12, 7.4);
const CLOSE = new THREE.Vector3(0, -0.27, 2.25);
const INSIDE = new THREE.Vector3(0, -0.31, -0.05);
const LOOK_START = new THREE.Vector3(0, 0, 0);
const ZIP_FRONT = 1.03;

/** Where the dive ends. Portrait screens stop further back so the label fits. */
function insidePos(aspect: number, out: THREE.Vector3) {
  out.copy(INSIDE);
  out.z = Math.min(0.45, INSIDE.z + Math.max(0, 0.9 / aspect - 1) * 0.5);
  return out;
}
const LOOK_ZIP = new THREE.Vector3(0, ZIP.y, 1.0);
const LOOK_IN = new THREE.Vector3(0, ZIP.y - 0.02, -2);
const FOV_INSIDE = 82;

/** Moves the camera and turns the bag from the GSAP-driven rig values. */
function Rig({ bag }: { bag: React.RefObject<THREE.Group | null> }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const lookB = useMemo(() => new THREE.Vector3(), []);
  const start = useMemo(() => new THREE.Vector3(), []);
  const close = useMemo(() => new THREE.Vector3(), []);
  const inside = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock, pointer, viewport }) => {
    const t = clock.elapsedTime;
    const idle = 1 - rig.turn;
    const aspect = viewport.aspect;
    if (bag.current) {
      bag.current.rotation.y =
        lerp(-0.62, 0, ease(rig.turn)) + Math.sin(t * 0.4) * 0.18 * idle + pointer.x * 0.12 * idle;
      bag.current.position.y = Math.sin(t * 0.9) * 0.05 * idle;
      // On wide screens the bag sits right of the headline until it turns.
      bag.current.position.x = (aspect > 1.25 ? 0.55 : 0) * (1 - ease(rig.turn));
    }

    // Portrait screens: stand further back so the bag and zipper fit.
    start.copy(START);
    start.z *= Math.max(1, 0.95 / aspect);
    close.copy(CLOSE);
    close.z = ZIP_FRONT + (CLOSE.z - ZIP_FRONT) * Math.max(1, 1.5 / aspect);

    const push = ease(rig.push);
    const dive = rig.dive;
    pos.lerpVectors(start, close, push).lerp(insidePos(aspect, inside), dive);
    pos.x += pointer.x * 0.15 * idle;
    pos.y += pointer.y * 0.1 * idle;
    camera.position.copy(pos);

    look.lerpVectors(LOOK_START, LOOK_ZIP, push);
    lookB.copy(LOOK_IN);
    look.lerp(lookB, Math.min(1, dive * 1.6));
    camera.lookAt(look);

    const fov = lerp(30, FOV_INSIDE, dive * dive);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

/** Our own gold slider + leather pull, riding the measured zipper path. */
function ZipPull() {
  const group = useRef<THREE.Group>(null);
  const tab = useRef<THREE.Group>(null);
  const last = useRef(rig.zip);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    g.visible = rig.zip > 0.001 && rig.dive < 0.35;
    const x = lerp(ZIP.xStart, ZIP.xEnd, rig.zip);
    const { z, nx } = zipSurfaceAt(x);
    g.position.set(x, ZIP.y, z + 0.012);
    g.rotation.y = Math.asin(THREE.MathUtils.clamp(nx, -1, 1));
    // The tab swings back as the slider is pulled, then settles.
    const v = (rig.zip - last.current) / Math.max(dt, 1e-3);
    last.current = rig.zip;
    if (tab.current) {
      const target = THREE.MathUtils.clamp(v * 0.9, -0.9, 0.9);
      tab.current.rotation.z = lerp(tab.current.rotation.z, target, 1 - Math.exp(-dt * 6));
      tab.current.rotation.x = lerp(tab.current.rotation.x, -Math.abs(target) * 0.4, 1 - Math.exp(-dt * 6));
    }
  });

  return (
    <group ref={group} visible={false}>
      <RoundedBox args={[0.085, 0.056, 0.036]} radius={0.012} smoothness={3}>
        <meshStandardMaterial color="#cdb57a" metalness={0.92} roughness={0.28} />
      </RoundedBox>
      <group ref={tab} position={[0, -0.022, 0.016]}>
        <mesh position={[0, -0.018, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.014, 0.0045, 8, 20]} />
          <meshStandardMaterial color="#cdb57a" metalness={0.92} roughness={0.28} />
        </mesh>
        <RoundedBox
          args={[0.046, 0.21, 0.012]}
          radius={0.006}
          smoothness={3}
          position={[0, -0.13, 0]}
        >
          <meshStandardMaterial color="#17181a" roughness={0.55} />
        </RoundedBox>
      </group>
    </group>
  );
}

function twillTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#c4561f";
  g.fillRect(0, 0, 256, 256);
  g.strokeStyle = "rgba(0,0,0,0.07)";
  g.lineWidth = 3;
  for (let i = -256; i < 512; i += 9) {
    g.beginPath();
    g.moveTo(i, 0);
    g.lineTo(i + 256, 256);
    g.stroke();
  }
  g.strokeStyle = "rgba(255,220,180,0.06)";
  for (let i = -256; i < 512; i += 9) {
    g.beginPath();
    g.moveTo(i + 4, 0);
    g.lineTo(i + 260, 256);
    g.stroke();
  }
  const t = finishTexture(new THREE.CanvasTexture(c));
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(10, 5);
  t.anisotropy = 16;
  return t;
}

function labelTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 380;
  const g = c.getContext("2d")!;
  g.fillStyle = "#f4efe4";
  g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = "#b9ad97";
  g.lineWidth = 6;
  g.setLineDash([22, 14]);
  g.strokeRect(26, 26, c.width - 52, c.height - 52);
  g.fillStyle = "#16181c";
  g.textAlign = "center";
  g.font = "800 150px Arial, Helvetica, sans-serif";
  g.fillText("bizcraft", 512, 205);
  g.fillStyle = "#e85d1f";
  g.font = "600 40px ui-monospace, Menlo, monospace";
  g.fillText("EST. 2003  ·  MADE IN BHIWANDI", 512, 290);
  return finishTexture(new THREE.CanvasTexture(c));
}

// Raised a touch so the 2D zipper later runs between the wordmark and the subline.
const LABEL = { w: 0.5, h: 0.185, y: ZIP.y - LINING_POS[1] + 0.016, z: -LINING_SIZE[2] / 2 + 0.11 };

/**
 * Where the woven label lands on screen at the end of the dive. The DOM copy
 * of the label is placed there, so the hand-off from 3D to the 2D zipper is
 * seamless. Computed from the final camera pose, so it doesn't depend on
 * which frames happened to render during a fast scroll.
 */
function publishLabelRect(width: number, height: number) {
  const cam = new THREE.PerspectiveCamera(FOV_INSIDE, width / height, 0.01, 40);
  insidePos(width / height, cam.position);
  cam.lookAt(LOOK_IN);
  cam.updateMatrixWorld();
  const c = new THREE.Vector3();
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    c.set(
      LINING_POS[0] + (sx * LABEL.w) / 2,
      LINING_POS[1] + LABEL.y + (sy * LABEL.h) / 2,
      LINING_POS[2] + LABEL.z,
    ).project(cam);
    const x = (c.x * 0.5 + 0.5) * width;
    const y = (-c.y * 0.5 + 0.5) * height;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  intro.labelRect = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

/** The inside of the bag: a soft saffron twill pouch, a woven label and a warm light. */
function Lining() {
  const group = useRef<THREE.Group>(null);
  const size = useThree((s) => s.size);
  const [twill, label] = useMemo(() => [twillTexture(), labelTexture()], []);
  useEffect(() => publishLabelRect(size.width, size.height), [size]);
  useFrame(() => {
    if (group.current) group.current.visible = rig.zip > 0.01;
  });
  return (
    <group ref={group} visible={false} position={LINING_POS}>
      <mesh scale={LINING_SIZE.map((v) => v / 2) as [number, number, number]}>
        <sphereGeometry args={[1, 64, 40]} />
        <meshStandardMaterial
          map={twill}
          side={THREE.BackSide}
          roughness={0.95}
          envMapIntensity={0.25}
        />
      </mesh>
      <mesh position={[0, LABEL.y, LABEL.z]}>
        <planeGeometry args={[LABEL.w, LABEL.h]} />
        <meshStandardMaterial map={label} roughness={0.9} envMapIntensity={0.4} />
      </mesh>
      <pointLight position={[0, 0.3, 0.25]} intensity={2.4} distance={3} color="#ffc28f" />
    </group>
  );
}

export default function IntroScene() {
  const phase = usePhase();
  const bag = useRef<THREE.Group>(null);
  return (
    <Canvas
      frameloop={phase === "intro" ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: START.toArray(), fov: 30, near: 0.01, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <LoopKick active={phase === "intro"} />
      <Suspense fallback={null}>
        <Rig bag={bag} />
        <group ref={bag}>
          <Bag color="#ECE9E2" zip={rig} />
          <ZipPull />
          <Lining />
        </group>
        <Studio />
      </Suspense>
    </Canvas>
  );
}
