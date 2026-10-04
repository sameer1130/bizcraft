# Bizcraft website redesign

The plan and decisions behind the new bizcraft.co.in, plus what's still needed from the Bizcraft team.

## 1. What's wrong with the current site

| Area | Today | Effect |
| --- | --- | --- |
| Hero | BS95 face-mask promo (2020) under a brown overlay, with text you can barely read | First impression is out of date and says nothing about bags |
| Value proposition | "Delivering bags with Excellence", with no audience, no proof and no next step | A procurement or HR buyer can't tell what Bizcraft does for them |
| Proof | 20 client logos as low-res JPEGs; testimonials from consumers ("must buy for college boys") | Strong clients (SBI, Hyundai, Saint-Gobain…) are buried; testimonials don't fit a B2B buyer |
| Content | OEM page says "Coming soon"; Employee Kits page has photos but no text; stats say "16+ years" | Looks neglected; key services have nothing on them |
| Conversion | One "Get in touch" link and nothing else | No way to share a brief, quantity or branding |
| Tech | Classic ASP, © 2020, heavy images, no structured metadata | Slow, hard to update, weak SEO |

## 2. Who the site is for

1. **HR / admin teams** buying employee onboarding and milestone kits
2. **Marketing teams** buying promotional and event bags
3. **Brands** looking for an OEM / private-label manufacturer
4. **Institutions** (armed forces, police) buying to specification

All four want the same things: *can you make it, can you brand it, can you deliver at my volume, and can I trust you?*

## 3. Positioning

> **Bags built to your brief.** A manufacturer since 2003 with its own factory floor in Bhiwandi, making custom bags for 120+ companies.

Proof points, all taken from the current site: since 2003 · 120 machines · 120+ client accounts (mostly MNCs) · 50+ team · own compliant factory with cutting software, QC rooms, an R&D centre and a testing centre.

## 4. Information architecture

A single long page for launch (built), with one anchor per buyer question:

1. **Hero**: positioning, an interactive 3D bag that cycles fabric colours, and stats
2. **Clients**: marquee of client names
3. **Solutions**: employee kits, promotional, OEM, defence & forces
4. **Configurator**: pick a colour, upload a logo, set logo size and quantity, then "Send this spec" (which prefills the enquiry form) or "Save preview image"
5. **Range**: all 9 product categories
6. **Factory**: Bhiwandi facility, compliance, and the 5-step process from brief to delivery
7. **Story**: 2003 → 2010 → 2016 → the 1,000-machine goal, plus the purpose statement
8. **Contact**: enquiry form, phone, email, office and factory addresses

Phase 2 pages: one page per category with photography, an OEM landing page, case studies, and a blog (only if someone will keep it updated).

## 5. Visual system

- **Canvas** `#f2eee6` (unbleached cotton), **Ink** `#121417`, one accent, **Saffron** `#e85d1f`, taken from the orange in the Bizcraft wing mark.
- **Type:** Archivo variable at 116% width and weight 800 for headlines (industrial, confident); IBM Plex Mono for labels, like a tech pack or care label.
- **Motifs from the craft:** dashed *stitch* outlines on cards, a *cutting-mat* grid behind product stages, and "spec sheet" language in the configurator.
- **Motion:** [anime.js v4](https://animejs.com) drives all UI animation (see §6a). The bag sways gently, and everything is turned off under `prefers-reduced-motion`.

## 6. 3D implementation

- Source `Final.glb` is **64.9 MB** (the normal map alone is a 57 MB, 16-bit, 4K PNG). After `gltf-transform optimize` with meshopt, WebP textures and 2K resolution it is **1.32 MB** in `public/models/backpack.glb`, about 98% smaller with no visible loss at web sizes.
- **Recolouring:** the mockup has one material. A small shader patch (`src/components/three/Bag.tsx`) tints only the light, unsaturated fabric texels, so straps, stitching, buckles and gold zips keep their original look.
- **Logo:** a projected decal on the lower front pocket. The position is found by raycasting at load time. Uploads (PNG/JPG/WEBP/SVG, up to 8 MB) are rasterised in the browser and never leave the device.
- **Performance:** three.js (about 258 KB gzipped) is code-split and loads after first paint. Lighting is built in code (no HDRI download). Each canvas stops rendering when it's off-screen, and both scenes share one GLB fetch.
- Measured on a local production build: Lighthouse Accessibility, Best Practices and SEO are all **100**. LCP is 104 ms and CLS is 0 (desktop, no throttling).

## 6a. Animation system (anime.js)

All animation goes through `src/components/anim/`. `useAnime` wraps anime.js `createScope`, so every animation, scroll observer and text split is cleaned up on unmount.

| Where | Effect | anime.js API |
| --- | --- | --- |
| Hero intro | Headline letters rise out of a clipped baseline. The eyebrow dot springs in. Copy and CTAs follow. | `splitText`, `createTimeline`, `stagger`, `spring` |
| Hero stats | "2003" scrambles through digits; 120 / 120+ / 50+ count up | `scrambleText`, `animate` on an object + `utils.round` |
| Section dividers | A dashed **stitch seam** sews itself across the page in step with scroll | `createDrawable` (SVG mask) + `onScroll({ sync })` |
| Section headings | Words rise in sequence as they scroll in | `splitText` + `onScroll` |
| Cards, range grid, timeline | Staggered fade/lift | `animate` + `stagger` + `onScroll` |
| Factory | Vertical seam stitches down the 5-step process; 120 and 70%+ count up | `createDrawable`, `onScroll` |
| Client ticker | Infinite marquee that slows to a crawl on hover | `animate` loop, tweening the animation's `speed` |
| CTAs | Magnetic pull toward the cursor, elastic return (fine pointers only) | `createAnimatable` |
| Configurator | Colour name scrambles to the new value; swatches and options spring on select | `scrambleText`, `spring` |
| Spec → form | Banner drops in; prefilled fields glow in sequence | `animate` + `stagger` |
| Mobile menu | Links cascade in | `animate` + `stagger` |

**Safeguards**
- An inline script adds `html.js` before first paint, so animated elements start hidden instead of flashing.
- If anime.js hasn't started within 4 s, the script removes the class and everything is shown.
- Under `prefers-reduced-motion`, CSS forces the final state and no animations run.
- The hero paragraph (the LCP element) starts its fade early. LCP is 344 ms on a local production build.

## 6b. Unzip intro (GSAP + anime.js)

The site opens on the 3D bag. Scrolling (or one click) unzips the front pocket, dives through the opening into the lining, and a second zipper opens onto the website.

| Stage | Timeline | What happens | Driven by |
| --- | --- | --- | --- |
| Turn | 0–14% | Bag swings from a 3/4 view to face front; intro copy fades | GSAP → `intro.rig.turn` |
| Unzip | 12–44% | Gold slider rides the measured zipper path; a shader cuts a lens-shaped opening with teeth on both lips; lining and woven label appear inside | GSAP → `rig.zip` → `Bag.tsx` uniforms |
| Dive | 50–69% | Opening widens; camera flies through it into the lining; FOV opens 30°→82° | GSAP → `rig.widen`, `rig.dive` |
| Hand-off | 71–75% | A pixel-matched DOM copy of the lining + label takes over from WebGL | GSAP + analytic label projection |
| Unzip onto site | 76–100% | 2D zipper opens in a V across the label and reveals the hero; panels part; nav returns; hero intro plays | GSAP (clip-path + SVG), anime.js (hero) |

- **GSAP** (ScrollTrigger + ScrollToPlugin) pins the hero for 3.2 screen-heights, scrubs a single master timeline, and plays it on click. Scrolling back up re-zips the bag.
- **anime.js** handles text: the split intro headline, the scrambling step captions ("01 — Unzip" → "02 — Step inside" → "03 — Welcome to Bizcraft"), the hint bob, and the hero intro once you're "inside".
- **Escape hatches:** a *Skip intro* button; reduced-motion users skip it entirely; if the animation layer never starts, a CSS failsafe hides the overlay after 4 s; visitors without JS never see it.
- **Cost:** the intro canvas stops rendering once the 2D lining covers it, and the hero canvas sleeps until the site is revealed. Lighthouse is still 100/100/100, and LCP is 120 ms on a local production build.
- The zipper path, the baked slider footprint and the interior volume were measured from the mesh. They live in `ZIP` in `src/components/three/Bag.tsx`; re-measure them if the model changes.

## 7. Blockers and decisions needed

| # | Item | Why it matters | Owner |
| --- | --- | --- | --- |
| 1 | **Where enquiries go** (email inbox, CRM, Google Sheet…) | The form currently opens the visitor's email app (`mailto:`). It works, but it is fragile and we can't receive the logo file. A server action plus an email/CRM provider fixes both. | Bizcraft |
| 2 | **Vector logo** (SVG/AI) | Only a 216×93 PNG exists online. It is fine for now but blurry on large or retina screens. | Bizcraft |
| 3 | **Client logo permission + SVGs** | Clients are shown as text wordmarks until logos are supplied and cleared for use. | Bizcraft |
| 4 | **Photography**: factory floor, team, products by category | The Range and Factory sections are typographic placeholders, and real photos will lift trust a lot. | Bizcraft + photographer |
| 5 | **Facts to confirm** | Branding methods offered (print, embroidery, labels), MOQ, typical lead times, certifications by name, current team size (the site says 50+), and whether the "70% women" figure is a goal or the current share. | Bizcraft |
| 6 | **B2B testimonials or case studies** | The current testimonials are consumer quotes and were left off the new page on purpose. | Bizcraft |
| 7 | **More 3D models** (laptop bag, duffle, tote) | The configurator supports any GLB with a light fabric base, so each new model adds a style. | 3D artist |
| 7a | **A rigged version of the backpack** (for a real unzip) | The supplied GLB is one static mesh: no separate slider, no teeth geometry, no animation or morph targets, and no interior. The intro *simulates* the unzip with a shader and our own slider. For fabric that physically parts, ask a 3D artist for: a separate slider + pull, the pocket opening as a shape key (open/closed), a modelled lining, all exported as GLB with an animation clip. GSAP would then scrub that clip instead. | 3D artist |
| 7b | **Low-end phones** | Three WebGL scenes (intro, hero, configurator) are heavy for budget Android devices. A static poster or a "lite" intro under a device-capability check is recommended before launch. | Pixeldust |
| 7c | **Measure the intro** | A pinned 3-screen intro adds friction. Track the skip rate and the drop-off before the site appears, and shorten the pin if needed. | Bizcraft / Pixeldust |
| 8 | **Hosting / domain** | Vercel is recommended (Next.js 16, static page). DNS for bizcraft.co.in is needed to go live. | Bizcraft / Pixeldust |

## 8. Suggested next steps

1. Confirm the facts in §7.5, then wire up the enquiry backend (§7.1).
2. Photo shoot at Bhiwandi, then add photography to the Factory and Range sections.
3. Add 2–3 more bag models to the configurator, plus a "style" selector.
4. Phase 2 pages: per-category pages, OEM landing page, case studies.
5. Analytics, plus conversion tracking on "Send this spec" and enquiry submissions.
