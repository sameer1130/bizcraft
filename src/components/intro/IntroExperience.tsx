"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { animate } from "animejs";
import { ArrowDown } from "lucide-react";
import { intro, setPhase } from "@/lib/intro";
import { ScrambleText, SplitHeading } from "@/components/anim/Anim";
import { useAnime } from "@/components/anim/useAnime";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

const IntroScene = dynamic(() => import("./IntroScene"), { ssr: false });

const STEPS = ["01 — Unzip", "02 — Step inside", "03 — Welcome to Bizcraft"];

// Timeline is authored on a 0 → 1 scale; ScrollTrigger maps it to the pin.
const T = {
  copyOut: 0,
  turn: 0,
  push: 0.02,
  zip: 0.12,
  widen: 0.42,
  dive: 0.5,
  lining: 0.71,
  slide: 0.76,
  part: 0.89,
  site: 0.8,
};

/**
 * Pins the hero and lays the unzip intro over it:
 * bag turns → slider opens the pocket → camera dives into the lining →
 * a full-screen zipper opens onto the site.
 * Scroll scrubs it; a click plays it; reduced-motion users skip it.
 */
export function IntroExperience({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const playing = useRef(false);

  useGSAP(
    () => {
      const root = wrap.current!;
      const header = document.querySelector<HTMLElement>("header");
      const q = gsap.utils.selector(root);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPhase("site");
        return;
      }

      ScrollTrigger.config({ ignoreMobileResize: true });

      // 2D zipper that opens the lining onto the site.
      const unzip = { sx: 0, part: 0 };
      const [top, bottom] = q("[data-panel]");
      const line = (name: string) =>
        Array.from(root.querySelectorAll<SVGPolylineElement>(`[data-line="${name}"]`));
      const [lipTop, lipBottom, closed] = [line("top"), line("bottom"), line("closed")];
      const teeth = root.querySelector<SVGSVGElement>("[data-teeth]")!;
      const slider = q("[data-slider]")[0];
      const SLOPE = 0.42;
      const set = (els: SVGPolylineElement[], pts: string) =>
        els.forEach((el) => el.setAttribute("points", pts));
      const labels = q(".intro-label");
      const placeLabels = () => {
        const r = intro.labelRect;
        if (!r) return;
        labels.forEach((el) => {
          Object.assign(el.style, {
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: `${r.w}px`,
            height: `${r.h}px`,
          });
        });
      };
      const drawUnzip = () => {
        placeLabels();
        const sx = unzip.sx;
        // Same visual angle on any screen shape (slope is in % of each axis).
        const open = sx * SLOPE * Math.min(1, innerWidth / innerHeight / 1.6);
        const shift = unzip.part * 60;
        top.style.clipPath = `polygon(0 0,100% 0,100% 50%,${sx}% 50%,0 ${50 - open}%)`;
        bottom.style.clipPath = `polygon(0 ${50 + open}%,${sx}% 50%,100% 50%,100% 100%,0 100%)`;
        top.style.transform = `translateY(${-shift}%)`;
        bottom.style.transform = `translateY(${shift}%)`;
        set(lipTop, `0,${50 - open} ${sx},50`);
        set(lipBottom, `0,${50 + open} ${sx},50`);
        set(closed, `${sx},50 100,50`);
        teeth.style.opacity = String(Math.max(0, 1 - unzip.part * 3));
        slider.style.left = `${sx}%`;
        slider.style.opacity = String(Math.max(0, 1 - unzip.part * 3));
      };
      drawUnzip();

      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.to(q("[data-intro-copy]"), { autoAlpha: 0, y: -40, duration: 0.07 }, T.copyOut)
        .to(q("[data-intro-hint]"), { autoAlpha: 0, duration: 0.04 }, T.copyOut)
        .to(intro.rig, { turn: 1, duration: 0.14, ease: "power2.inOut" }, T.turn)
        .to(intro.rig, { push: 1, duration: 0.42, ease: "power1.inOut" }, T.push)
        .to(intro.rig, { zip: 1, duration: 0.32, ease: "power1.inOut" }, T.zip)
        .to(intro.rig, { widen: 1, duration: 0.14, ease: "power2.in" }, T.widen)
        .to(intro.rig, { dive: 1, duration: 0.19, ease: "power2.in" }, T.dive)
        .to(q("[data-step]"), { color: "#faf8f3", duration: 0.03 }, T.lining)
        .fromTo(
          q("[data-lining]"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.04, onStart: placeLabels, onUpdate: placeLabels },
          T.lining,
        )
        // Once the 2D lining covers it, drop the 3D stage so the zipper opens onto the site.
        .to(q("[data-intro-stage]"), { autoAlpha: 0, duration: 0.005 }, T.lining + 0.04)
        .to(unzip, { sx: 100, duration: 0.13, ease: "power1.inOut", onUpdate: drawUnzip }, T.slide)
        .to(unzip, { part: 1, duration: 0.1, ease: "power2.in", onUpdate: drawUnzip }, T.part)
        .to(q("[data-intro-chrome]"), { autoAlpha: 0, duration: 0.05 }, T.part)
        .set(q("[data-intro]"), { autoAlpha: 0 }, 0.995)
        .set({}, {}, 1);
      if (header) tl.fromTo(header, { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.92);

      tl.eventCallback("onUpdate", () => {
        const p = tl.progress();
        setPhase(p >= T.site ? "site" : "intro");
        setStep(p < 0.42 ? 0 : p < 0.7 ? 1 : 2);
      });

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "+=320%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        animation: tl,
        // start/end are only known after ScrollTrigger measures the page.
        onRefresh: (self) => {
          intro.endScroll = self.end;
        },
      });
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __bzIntro: unknown }).__bzIntro = { st, tl, intro };
      }

      // Deep links (#contact…) were resolved before the pin added height.
      if (location.hash) {
        const el = document.querySelector(location.hash);
        if (el) requestAnimationFrame(() => el.scrollIntoView());
      }

      return () => {
        gsap.killTweensOf(window);
        if (header) gsap.set(header, { clearProps: "all" });
      };
    },
    { scope: wrap },
  );

  const introTrigger = () =>
    ScrollTrigger.getAll().find((s) => s.trigger === wrap.current);

  // Click anywhere: glide the scroll through the whole intro.
  function play() {
    if (playing.current) return;
    const st = introTrigger();
    if (!st || window.scrollY >= st.end - 4) return;
    playing.current = true;
    // CSS smooth scrolling would make each GSAP step lag, which autoKill reads
    // as the user taking over. Use instant scrolling for the glide.
    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    const done = () => {
      playing.current = false;
      html.style.scrollBehavior = "";
    };
    gsap.to(window, {
      scrollTo: { y: st.end, autoKill: true },
      duration: 5.2,
      ease: "power1.inOut",
      onComplete: done,
      onInterrupt: done,
    });
  }

  function skip() {
    const st = introTrigger();
    if (!st) return;
    gsap.killTweensOf(window);
    window.scrollTo({ top: st.end, behavior: "instant" });
    st.animation?.progress(1);
  }

  return (
    <div ref={wrap} className="relative">
      {children}

      <div
        data-intro
        className="absolute inset-x-0 top-0 z-40 h-[100svh] cursor-pointer overflow-hidden"
        onClick={play}
      >
        <div data-intro-stage className="absolute inset-0 bg-canvas">
          <div className="mat pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_50%,black_25%,transparent_75%)]" />
          <p
            aria-hidden
            className="display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[22vw] leading-none text-ink/[0.035]"
          >
            bizcraft
          </p>
          <div className="absolute inset-0">
            <IntroScene />
          </div>
        </div>

        <div data-intro-chrome>
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 md:px-8 md:py-6">
            <Image
              src="/brand/logo-dark.png"
              alt="Bizcraft"
              width={216}
              height={93}
              priority
              className="h-10 w-auto"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                skip();
              }}
              className="eyebrow rounded-full border-[1.5px] border-ink/20 bg-paper/70 px-4 py-2.5 text-ink-2 backdrop-blur transition-colors hover:border-ink hover:text-ink"
            >
              Skip intro
            </button>
          </div>

          <div
            data-intro-copy
            className="pointer-events-none absolute bottom-36 left-5 max-w-[22rem] md:bottom-24 md:left-8 md:max-w-xl"
          >
            <p className="eyebrow text-ink-3">Bizcraft · Bag makers since 2003</p>
            <SplitHeading
              as="p"
              className="display mt-3 text-[clamp(2.2rem,5vw,4.4rem)]"
            >
              Every bag has a story inside.
            </SplitHeading>
          </div>

          <button
            type="button"
            data-intro-hint
            onClick={(e) => {
              e.stopPropagation();
              play();
            }}
            className="eyebrow absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 whitespace-nowrap text-ink-2"
          >
            <span className="md:hidden">Scroll or tap to unzip</span>
            <span className="hidden md:inline">Scroll or click to unzip</span>
            <HintArrow />
          </button>

          <p
            data-step
            className="eyebrow pointer-events-none absolute bottom-8 right-5 hidden text-ink-2 md:right-8 md:block"
            aria-hidden
          >
            <ScrambleText text={STEPS[step]} />
          </p>
        </div>

        {/* Inside the bag: lining that unzips onto the site */}
        <div data-lining className="invisible absolute inset-0 opacity-0">
          {/* Same woven label as the 3D one, pinned to its projected rect,
              so the zipper splits it in two as it opens. */}
          {[0, 1].map((i) => (
            <div key={i} data-panel className="lining absolute inset-0">
              <div className="intro-label" aria-hidden>
                <LabelArt />
              </div>
            </div>
          ))}
          <svg
            data-teeth
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {(["top", "bottom", "closed"] as const).map((name) => (
              <g key={name}>
                {/* tape */}
                <polyline
                  data-line={name}
                  fill="none"
                  stroke="#16171a"
                  strokeWidth={name === "closed" ? 22 : 16}
                  vectorEffect="non-scaling-stroke"
                />
                {/* teeth */}
                <polyline
                  data-line={name}
                  fill="none"
                  stroke="#d6bd7f"
                  strokeWidth={name === "closed" ? 12 : 8}
                  strokeDasharray={name === "closed" ? "3 2" : "4 4"}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </svg>
          <div data-slider className="zip-slider absolute top-1/2" aria-hidden>
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Woven label artwork. Same coordinates, fonts and sizes as the canvas texture
 * in IntroScene (1024×380), so the 3D → 2D hand-off doesn't shift a pixel.
 */
function LabelArt() {
  return (
    <svg viewBox="0 0 1024 380" className="h-full w-full">
      <rect width="1024" height="380" fill="#f4efe4" />
      <rect
        x="26"
        y="26"
        width="972"
        height="328"
        fill="none"
        stroke="#b9ad97"
        strokeWidth="6"
        strokeDasharray="22 14"
      />
      <text
        x="512"
        y="205"
        textAnchor="middle"
        fill="#16181c"
        style={{ font: "800 150px Arial, Helvetica, sans-serif" }}
      >
        bizcraft
      </text>
      <text
        x="512"
        y="290"
        textAnchor="middle"
        fill="#e85d1f"
        style={{ font: "600 40px ui-monospace, Menlo, monospace", whiteSpace: "pre" }}
      >
        {"EST. 2003  ·  MADE IN BHIWANDI"}
      </text>
    </svg>
  );
}

/** The "unzip" hint arrow: a slow anime.js bob, like a pull being tugged. */
function HintArrow() {
  const ref = useAnime<HTMLSpanElement>((el) => {
    animate(el, {
      y: [0, 7],
      duration: 850,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
  });
  return (
    <span ref={ref} className="grid size-9 place-items-center rounded-full bg-accent text-ink">
      <ArrowDown size={16} aria-hidden />
    </span>
  );
}
