"use client";

import { ArrowRight } from "lucide-react";
import { createTimeline, spring, splitText, stagger, utils } from "animejs";
import { EASE, Magnetic } from "@/components/anim/Anim";
import { useAnime } from "@/components/anim/useAnime";
import { whenRevealed } from "@/lib/intro";

/**
 * Hero copy with an anime.js intro: eyebrow → headline letters → body → CTAs.
 * On large screens the headline frames the 3D bag — first line top-left, second
 * bottom-right — and the bag canvas sits between it and the copy (see Hero).
 */
export function HeroCopy() {
  const ref = useAnime<HTMLDivElement>((root) => {
    const q = (s: string) => root.querySelector<HTMLElement>(s)!;
    const [eyebrow, dot, title, body, ctas] = [
      q("[data-eyebrow]"),
      q("[data-dot]"),
      q("h1"),
      q("[data-body]"),
      q("[data-ctas]"),
    ];
    const split = splitText(title, {
      words: { wrap: "clip" },
      chars: true,
    });

    utils.set(split.chars, { y: "115%" });
    // Animate the links, not the Magnetic wrappers (they own their own x/y).
    const buttons = ctas.querySelectorAll("a");
    utils.set([eyebrow, body, ...buttons], { opacity: 0, y: 18 });
    utils.set(dot, { scale: 0 });
    utils.set([title, ctas], { opacity: 1 });

    // Held until the unzip intro opens onto the site.
    const tl = createTimeline({ autoplay: false, defaults: { ease: EASE, duration: 1100 } })
      .add(eyebrow, { opacity: 1, y: 0, duration: 900 }, 80)
      .add(dot, { scale: 1, rotate: [45, 0], ease: spring({ stiffness: 260, damping: 9 }) }, 200)
      .add(split.chars, { y: "0%", duration: 1250, delay: stagger(22) }, 160)
      // The paragraph is the LCP element — start it early so LCP isn't held
      // back by the intro; it still lands after the headline visually.
      .add(body, { opacity: 1, y: 0, duration: 1300 }, 180)
      .add(buttons, { opacity: 1, y: 0, delay: stagger(90) }, 380);
    const off = whenRevealed(() => tl.play());

    return () => {
      off();
      split.revert();
    };
  });

  return (
    <div ref={ref} className="contents">
      <p
        data-eyebrow
        data-hero
        className="eyebrow order-none flex items-center gap-3 text-white/70 lg:absolute lg:left-8 lg:top-[100px] lg:z-20"
      >
        <span data-dot className="inline-block size-2 bg-accent" />
        Bag manufacturer · Mumbai · Est. 2003
      </p>
      <h1
        data-hero
        className="display order-1 mt-5 text-[clamp(2.5rem,11.2vw,5rem)] uppercase leading-[0.92] tracking-[-0.045em] lg:pointer-events-none lg:absolute lg:inset-x-8 lg:top-[132px] lg:bottom-12 lg:z-0 lg:mt-0 lg:flex lg:flex-col lg:justify-between lg:text-[min(8.4vw,15.5svh)] lg:leading-[0.86]"
      >
        <span className="block">Bags built</span>
        <span className="block lg:self-end">
          to your <br className="sm:hidden" />
          <span className="text-accent">brief.</span>
        </span>
      </h1>
      <div className="relative order-3 lg:absolute lg:left-8 lg:top-1/2 lg:z-20 lg:max-w-[25rem] lg:-translate-y-1/2">
        <p
          data-body
          data-hero
          className="text-[1.05rem] leading-relaxed text-white/75 md:text-lg"
        >
          Bizcraft designs and manufactures custom backpacks, laptop, travel
          and duffle bags for 120+ companies — from employee kits to OEM
          production — on our own factory floor in Bhiwandi.
        </p>
        <div data-ctas data-hero className="mt-7 flex flex-wrap gap-2 sm:gap-3 md:mt-9">
          <Magnetic>
            <a href="#configure" className="btn btn-accent">
              Design your bag <ArrowRight size={16} aria-hidden />
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" className="btn btn-ghost">
              Request a quote
            </a>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}
