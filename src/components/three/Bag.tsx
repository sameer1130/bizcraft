"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Decal, useGLTF } from "@react-three/drei";
import { useFrame, type ThreeElements } from "@react-three/fiber";

export const BAG_URL = "/models/backpack.glb";

/** Height of the bag in scene units after normalisation. */
export const BAG_HEIGHT = 2.4;

// Linear luminance of the mockup's light fabric panels (sRGB 161 → 0.356).
const FABRIC_LUMA = 0.356;

/**
 * The front-pocket zipper, measured on the normalised mesh (front = +Z).
 * The mockup is a single static mesh with no rig, so the "unzip" is faked:
 * a shader cuts a lens-shaped opening behind a slider we add ourselves, and
 * paints over the slider baked into the texture.
 */
export const ZIP = {
  y: -0.312,
  /** Where the baked-in slider sits (right end) — our slider starts here. */
  xStart: 0.68,
  /** Where the slider stops when fully open (left end). */
  xEnd: -0.6,
  /** Right edge of the cuttable opening (just left of the baked slider). */
  lensEnd: 0.645,
  /** Bounding box of the baked slider + leather tab, removed while unzipping. */
  bakedPull: { min: [0.638, -0.648, 0.6], max: [0.722, -0.262, 2] },
  /**
   * Interior volume hollowed out while unzipping (the mesh has inner walls
   * that would otherwise hide the lining). Matches the intro's lining box.
   */
  hollow: { min: [-0.6, -0.95, -0.42], max: [0.6, 0.15, 0.54] },
  /** Front-surface depth and normal (x component) along the zipper, by x. */
  path: [
    [-0.65, 0.884, -0.82],
    [-0.6, 0.94, -0.64],
    [-0.55, 0.974, -0.44],
    [-0.5, 0.995, -0.38],
    [-0.4, 1.026, -0.14],
    [-0.3, 1.024, -0.05],
    [-0.2, 1.029, -0.05],
    [-0.1, 1.033, -0.02],
    [0, 1.034, 0.02],
    [0.1, 1.032, 0.03],
    [0.2, 1.027, 0.06],
    [0.3, 1.022, 0.02],
    [0.4, 1.015, 0.12],
    [0.5, 1.004, 0.22],
    [0.55, 0.977, 0.5],
    [0.6, 0.943, 0.65],
    [0.65, 0.884, 0.84],
    [0.7, 0.8, 0.9],
  ] as const,
};

/** Front-surface depth (z) and facing (normal.x) of the zipper at `x`. */
export function zipSurfaceAt(x: number) {
  const p = ZIP.path;
  if (x <= p[0][0]) return { z: p[0][1], nx: p[0][2] };
  for (let i = 1; i < p.length; i++) {
    if (x <= p[i][0]) {
      const t = (x - p[i - 1][0]) / (p[i][0] - p[i - 1][0]);
      return {
        z: THREE.MathUtils.lerp(p[i - 1][1], p[i][1], t),
        nx: THREE.MathUtils.lerp(p[i - 1][2], p[i][2], t),
      };
    }
  }
  const last = p[p.length - 1];
  return { z: last[1], nx: last[2] };
}

/** Mutable zip state, written by GSAP and read every frame. */
export type ZipState = { zip: number; widen: number };

const f = (n: number) => n.toFixed(3);

/**
 * The mockup ships a single material: light-grey fabric panels, near-black
 * straps/back panel and gold zip pulls. We recolour only the light, unsaturated
 * texels so straps, stitching and hardware keep their original look. The same
 * shader carries the (normally inactive) zipper-opening effect.
 */
function makeTintedMaterial(source: THREE.MeshStandardMaterial) {
  const material = source.clone();
  const uniforms = {
    uTint: { value: new THREE.Color("#ECE9E2") },
    uZip: { value: 0 },
    uWiden: { value: 0 },
  };
  material.userData.uniforms = uniforms;
  const [bMin, bMax] = [ZIP.bakedPull.min, ZIP.bakedPull.max];
  const [hMin, hMax] = [ZIP.hollow.min, ZIP.hollow.max];
  const v3 = (v: readonly number[]) => `vec3(${f(v[0])}, ${f(v[1])}, ${f(v[2])})`;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vBzPos;")
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvBzPos = transformed;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform vec3 uTint;\nuniform float uZip;\nuniform float uWiden;\nvarying vec3 vBzPos;",
      )
      .replace(
        "#include <map_fragment>",
        /* glsl */ `#include <map_fragment>
        float bzLum = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
        float bzMax = max(max(diffuseColor.r, diffuseColor.g), diffuseColor.b);
        float bzMin = min(min(diffuseColor.r, diffuseColor.g), diffuseColor.b);
        float bzSat = (bzMax - bzMin) / max(bzMax, 1e-4);
        float bzMask = smoothstep(0.08, 0.2, bzLum) * (1.0 - smoothstep(0.1, 0.25, bzSat));
        vec3 bzFabric = uTint * (bzLum / ${f(FABRIC_LUMA)});
        diffuseColor.rgb = mix(diffuseColor.rgb, bzFabric, bzMask);

        if (uZip > 0.0) {
          vec3 p = vBzPos;
          // Hollow out the inside (with a margin that also catches inner walls
          // hugging the lining) so the lining is what you see through the zip.
          if (all(greaterThan(p, ${v3(hMin)} - 0.06)) && all(lessThan(p, ${v3(hMax)} + 0.06))) discard;
          // Remove the slider baked into the mesh (its gold + leather texels);
          // the fabric behind it stays. Ours replaces it.
          if (bzMask < 0.5 &&
              all(greaterThan(p, vec3(${f(bMin[0])}, ${f(bMin[1])}, ${f(bMin[2])}))) &&
              all(lessThan(p, vec3(${f(bMax[0])}, ${f(bMax[1])}, ${f(bMax[2])})))) {
            discard;
          }
          // Lens-shaped opening between our slider and the end of the zip.
          float xPull = mix(${f(ZIP.xStart)}, ${f(ZIP.xEnd)}, uZip);
          float span = max(${f(ZIP.lensEnd)} - xPull, 1e-3);
          float s = (p.x - xPull) / span;
          if (s > 0.0 && s < 1.0 && p.z > 0.25) {
            float lens = pow(sin(3.14159 * s), 0.55);
            float h = (0.03 + 0.1 * pow(uZip, 0.6) + 0.12 * uWiden) * lens;
            float dy = abs(p.y - ${f(ZIP.y)});
            if (dy < h) discard;
            // Teeth on both lips: gold teeth on dark tape.
            if (dy < h + 0.024 && p.z > 0.6) {
              float tooth = step(0.45, fract(p.x * 85.0));
              float onTeeth = step(dy, h + 0.012);
              diffuseColor.rgb = mix(vec3(0.012), mix(vec3(0.02), vec3(0.55, 0.45, 0.2), tooth), onTeeth);
            }
          }
        }`,
      );
  };
  material.customProgramCacheKey = () => "bizcraft-fabric-tint-zip";
  return material;
}

/** meshopt/quantised attributes → float32 so DecalGeometry can read them. */
function dequantize(geometry: THREE.BufferGeometry) {
  const out = geometry.clone();
  for (const name of Object.keys(out.attributes)) {
    const attr = out.getAttribute(name) as THREE.BufferAttribute;
    if (attr.array instanceof Float32Array) continue;
    const data = new Float32Array(attr.count * attr.itemSize);
    for (let i = 0; i < attr.count; i++) {
      for (let c = 0; c < attr.itemSize; c++) {
        data[i * attr.itemSize + c] = attr.getComponent(i, c);
      }
    }
    out.setAttribute(name, new THREE.BufferAttribute(data, attr.itemSize));
  }
  return out;
}

type BagAsset = {
  geometry: THREE.BufferGeometry;
  source: THREE.MeshStandardMaterial;
  decalPosition: THREE.Vector3;
  decalRotation: THREE.Euler;
  width: number;
};

// Normalising + dequantising the mesh is the expensive part; do it once and
// share the result between the hero, intro and configurator scenes.
const assets = new WeakMap<THREE.Object3D, BagAsset>();

function prepare(scene: THREE.Object3D): BagAsset {
  const cached = assets.get(scene);
  if (cached) return cached;

  let source: THREE.Mesh | undefined;
  scene.traverse((o) => {
    if (!source && (o as THREE.Mesh).isMesh) source = o as THREE.Mesh;
  });
  if (!source) throw new Error("backpack.glb has no mesh");
  scene.updateMatrixWorld(true);

  const geometry = dequantize(source.geometry);
  geometry.applyMatrix4(source.matrixWorld);
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = BAG_HEIGHT / size.y;
  geometry.translate(-center.x, -center.y, -center.z);
  geometry.scale(scale, scale, scale);
  // The mockup is authored with the straps facing +Z; turn the front pocket
  // towards the camera.
  geometry.rotateY(Math.PI);
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  // Find the lower front pocket (below the zip) by casting a ray at it.
  const probe = new THREE.Mesh(geometry);
  const ray = new THREE.Raycaster(
    new THREE.Vector3(0, -BAG_HEIGHT * 0.27, 10),
    new THREE.Vector3(0, 0, -1),
  );
  const hit = ray.intersectObject(probe)[0];
  const decalPosition = hit
    ? hit.point.clone()
    : new THREE.Vector3(0, -BAG_HEIGHT * 0.27, geometry.boundingBox!.max.z);
  // Project along the surface normal with the artwork's up kept upright.
  const normal = hit?.face?.normal.clone() ?? new THREE.Vector3(0, 0, 1);
  const aim = new THREE.Object3D();
  aim.position.copy(decalPosition);
  aim.lookAt(decalPosition.clone().add(normal));

  const asset: BagAsset = {
    geometry,
    source: source.material as THREE.MeshStandardMaterial,
    decalPosition,
    decalRotation: aim.rotation.clone(),
    width: size.x * scale,
  };
  assets.set(scene, asset);
  return asset;
}

type BagProps = ThreeElements["group"] & {
  color: string;
  logo?: THREE.Texture | null;
  /** Logo width as a fraction of the bag's width. */
  logoSize?: number;
  /** When given, drives the zipper-opening effect (intro only). */
  zip?: ZipState;
};

export function Bag({ color, logo, logoSize = 0.34, zip, ...props }: BagProps) {
  const { scene } = useGLTF(BAG_URL, false, true);
  const bag = useMemo(() => prepare(scene), [scene]);
  const material = useMemo(() => makeTintedMaterial(bag.source), [bag]);
  useEffect(() => () => material.dispose(), [material]);

  const target = useMemo(() => new THREE.Color(color), [color]);
  useFrame((_, dt) => {
    const u = material.userData.uniforms;
    (u.uTint.value as THREE.Color).lerp(target, 1 - Math.exp(-dt * 7));
    if (zip) {
      u.uZip.value = zip.zip;
      u.uWiden.value = zip.widen;
    }
  });

  const logoAspect = useMemo(() => {
    const img = logo?.image as { width?: number; height?: number } | undefined;
    return img?.width && img?.height ? img.height / img.width : 0.5;
  }, [logo]);
  const decalW = bag.width * logoSize;

  return (
    <group {...props} dispose={null}>
      <mesh geometry={bag.geometry} material={material}>
        {logo ? (
          <Decal
            position={bag.decalPosition}
            rotation={bag.decalRotation}
            scale={[decalW, decalW * logoAspect, 0.35]}
            depthTest
          >
            <meshStandardMaterial
              map={logo}
              transparent
              roughness={0.75}
              polygonOffset
              polygonOffsetFactor={-10}
              depthWrite={false}
            />
          </Decal>
        ) : null}
      </mesh>
    </group>
  );
}

useGLTF.preload(BAG_URL, false, true);

/** Placeholder artwork shown before a buyer uploads their own logo. */
export function makePlaceholderLogo(ink = "#16181c") {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 14;
  ctx.setLineDash([34, 22]);
  ctx.strokeRect(24, 24, 976, 464);
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 150px Arial, Helvetica, sans-serif";
  ctx.fillText("YOUR", 512, 196);
  ctx.fillText("LOGO", 512, 340);
  return finishTexture(new THREE.CanvasTexture(canvas));
}

/** Rasterise an uploaded PNG/JPG/SVG into a decal-ready texture. */
export async function textureFromFile(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    const w = img.naturalWidth || 1024;
    const h = img.naturalHeight || 1024;
    const scale = 1024 / Math.max(w, h);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return finishTexture(new THREE.CanvasTexture(canvas));
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function finishTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
