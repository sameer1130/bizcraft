# Bizcraft website

Redesign of [bizcraft.co.in](https://www.bizcraft.co.in), built with Next.js 16 (App Router), Tailwind CSS 4, React Three Fiber, GSAP (ScrollTrigger) and anime.js v4. It includes an interactive 3D backpack and a configurator: fabric colour, logo upload, and spec-to-enquiry.

See [`docs/REDESIGN.md`](docs/REDESIGN.md) for the strategy, design system and open items.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Where things live

| Path | What |
| --- | --- |
| `src/app/page.tsx` | Page composition (all sections) |
| `src/lib/content.ts` | All copy and data: clients, products, process, timeline, swatches |
| `src/components/site/` | Page sections, nav, configurator UI, contact form |
| `src/components/intro/` | Unzip intro: GSAP pin/scrub orchestration (`IntroExperience`) and the 3D scene (`IntroScene`) |
| `src/lib/intro.ts` | Shared intro state (rig values, phase) between GSAP, R3F and React |
| `src/components/anim/` | anime.js layer: `useAnime` scope hook, Reveal, SplitHeading, Seam, CountUp, Scramble, Magnetic, Marquee |
| `src/components/three/Bag.tsx` | GLB loading, fabric-tint shader, logo decal |
| `src/components/three/*Scene.tsx` | Hero and configurator canvases |
| `public/models/backpack.glb` | Optimised 3D model (1.3 MB) |

## Re-optimising a 3D model

```bash
npx @gltf-transform/cli optimize input.glb public/models/backpack.glb \
  --compress meshopt --texture-compress webp --texture-size 2048
```

The fabric-tint shader expects light, neutral-grey fabric texels (around sRGB 161) in the base-colour map. Dark and saturated texels are left alone.
