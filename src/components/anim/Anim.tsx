"use client";

import {
  createElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  animate,
  createAnimatable,
  createDrawable,
  onScroll,
  scrambleText,
  splitText,
  spring,
  stagger,
  utils,
} from "animejs";
import { prefersReducedMotion, useAnime } from "./useAnime";

// One feel across the site: quick start, long soft landing.
export const EASE = "outExpo";

/** Play once when the element's top crosses ~10% above the viewport bottom. */
export const onView = (target: Element, offset = "10%") =>
  onScroll({
    target: target as HTMLElement,
    enter: `bottom-=${offset} top`,
    sync: "play",
    repeat: false,
  });

/* -------------------------------------------------------------------------- */
/* Reveal                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Fades + lifts its content into view on scroll. With `stagger`, each direct
 * child animates in turn instead of the wrapper as a whole.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  stagger: step,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "div" | "ol" | "ul" | "dl";
}) {
  const ref = useAnime<HTMLElement>((el) => {
    const targets = step ? Array.from(el.children) : el;
    utils.set(targets, { opacity: 0, y: 32 });
    animate(targets, {
      opacity: 1,
      y: 0,
      duration: 1100,
      ease: EASE,
      delay: step ? stagger(step, { start: delay * 1000 }) : delay * 1000,
      autoplay: onView(el),
    });
  });
  return createElement(
    as,
    { ref, className, "data-reveal": step ? "children" : "" },
    children,
  );
}

/* -------------------------------------------------------------------------- */
/* SplitHeading                                                                */
/* -------------------------------------------------------------------------- */

/** Headline whose words rise out of a clipped baseline as it scrolls in. */
export function SplitHeading({
  children,
  className,
  as = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "p";
}) {
  const ref = useAnime<HTMLElement>((el) => {
    const split = splitText(el, { words: { wrap: "clip" } });
    utils.set(split.words, { y: "110%" });
    utils.set(el, { opacity: 1 });
    animate(split.words, {
      y: "0%",
      duration: 1200,
      ease: EASE,
      delay: stagger(70),
      autoplay: onView(el, "6%"),
    });
    return () => split.revert();
  });
  return createElement(as, { ref, className, "data-split": "" }, children);
}

/* -------------------------------------------------------------------------- */
/* Seam                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * A dashed stitch line that sews itself across the page in step with scroll.
 * The dashed path is revealed through a mask whose path anime.js draws.
 */
export function Seam({
  className,
  vertical = false,
}: {
  className?: string;
  vertical?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const d = vertical
    ? "M10 0 C 2 160, 18 340, 10 500 S 2 840, 10 1000"
    : "M0 14 C 220 2, 380 26, 600 14 S 980 2, 1200 14";
  const ref = useAnime<SVGSVGElement>((svg) => {
    const drawables = createDrawable(svg.querySelectorAll("[data-draw]"));
    utils.set(drawables, { draw: "0 0" });
    animate(drawables, {
      draw: "0 1",
      ease: "linear",
      autoplay: onScroll({
        target: svg as unknown as HTMLElement,
        enter: "bottom top",
        leave: vertical ? "center bottom" : "top+=55% bottom",
        sync: 0.35,
      }),
    });
  });
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={vertical ? "0 0 20 1000" : "0 0 1200 28"}
      preserveAspectRatio="none"
      className={className}
      fill="none"
    >
      <mask id={id} maskUnits="userSpaceOnUse">
        <path data-draw d={d} stroke="white" strokeWidth={vertical ? 24 : 30} />
      </mask>
      <path
        d={d}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeDasharray="9 7"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        mask={`url(#${id})`}
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Numbers & text                                                              */
/* -------------------------------------------------------------------------- */

/** Counts up from 0 when scrolled into view. SSR renders the final value. */
export function CountUp({
  value,
  suffix = "",
  className,
  duration = 1800,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const final = `${value.toLocaleString("en-IN")}${suffix}`;
  const ref = useAnime<HTMLSpanElement>((el) => {
    const counter = { n: 0 };
    el.textContent = `0${suffix}`;
    animate(counter, {
      n: value,
      duration,
      ease: "outQuart",
      modifier: utils.round(0),
      onUpdate: () => {
        el.textContent = `${counter.n.toLocaleString("en-IN")}${suffix}`;
      },
      autoplay: onView(el),
    });
    return () => {
      el.textContent = final;
    };
  });
  return (
    <span ref={ref} className={className}>
      {final}
    </span>
  );
}

/** Scrambles through digits/letters before settling, when scrolled into view. */
export function ScrambleOnView({
  text,
  chars = "0-9",
  className,
}: {
  text: string;
  chars?: string;
  className?: string;
}) {
  const ref = useAnime<HTMLSpanElement>((el) => {
    animate(el, {
      innerHTML: scrambleText({ chars, cursor: false, perturbation: 0.4 }),
      duration: 1100,
      autoplay: onView(el),
    });
    return () => {
      el.textContent = text;
    };
  });
  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}

/**
 * Text that scrambles into its new value whenever `text` changes — used for
 * live labels like the selected fabric colour. React only ever renders the
 * first value; anime.js owns the node after that.
 */
export function ScrambleText({
  text,
  className,
  chars = "A-Z",
}: {
  text: string;
  className?: string;
  chars?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [first] = useState(text);
  const shown = useRef(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown.current === text) return;
    shown.current = text;
    if (prefersReducedMotion()) {
      el.textContent = text;
      return;
    }
    const anim = animate(el, {
      innerHTML: scrambleText({ text, chars, cursor: false }),
      duration: 650,
    });
    return () => {
      anim.cancel();
      el.textContent = text;
    };
  }, [text, chars]);

  return (
    <span ref={ref} className={className}>
      {first}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Interaction                                                                 */
/* -------------------------------------------------------------------------- */

/** Pulls its child gently toward the pointer, springing back on leave. */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useAnime<HTMLSpanElement>((el) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const pull = createAnimatable(el, {
      x: 500,
      y: 500,
      ease: "outElastic(1, .45)",
    });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pull.x((e.clientX - (r.left + r.width / 2)) * strength);
      pull.y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      pull.x(0);
      pull.y(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  });
  return (
    <span ref={ref} className={`inline-flex ${className ?? ""}`}>
      {children}
    </span>
  );
}

/** Springy "pop" on an element — for selections and confirmations. */
export function pop(el: Element | null, from = 0.82) {
  if (!el || prefersReducedMotion()) return;
  animate(el, {
    scale: [from, 1],
    ease: spring({ stiffness: 320, damping: 11 }),
  });
}

/** Infinite ticker that eases down to a crawl on hover. */
export function Marquee({
  children,
  className,
  duration = 52000,
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  /** Run left-to-right instead. */
  reverse?: boolean;
}) {
  const ref = useAnime<HTMLDivElement>((wrap) => {
    const track = wrap.firstElementChild as HTMLElement;
    const loop = animate(track, {
      x: reverse ? ["-50%", "0%"] : "-50%",
      duration,
      ease: "linear",
      loop: true,
    });
    const slow = () => animate(loop, { speed: 0.12, duration: 700, ease: "outQuad" });
    const resume = () => animate(loop, { speed: 1, duration: 900, ease: "inOutQuad" });
    wrap.addEventListener("pointerenter", slow);
    wrap.addEventListener("pointerleave", resume);
    return () => {
      wrap.removeEventListener("pointerenter", slow);
      wrap.removeEventListener("pointerleave", resume);
    };
  });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Oversized background type that slides sideways as its section scrolls by. */
export function Drift({
  children,
  className,
  distance = "-30%",
}: {
  children: ReactNode;
  className?: string;
  distance?: string;
}) {
  const ref = useAnime<HTMLParagraphElement>((el) => {
    animate(el, {
      x: ["0%", distance],
      ease: "linear",
      autoplay: onScroll({
        target: el,
        enter: "bottom top",
        leave: "top bottom",
        sync: 0.5,
      }),
    });
  });
  return (
    <p ref={ref} aria-hidden className={className}>
      {children}
    </p>
  );
}
