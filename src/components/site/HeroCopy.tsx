"use client";

import { ArrowRight } from "lucide-react";
import { createTimeline, spring, splitText, stagger, utils } from "animejs";
import { EASE, Magnetic } from "@/components/anim/Anim";
import { useAnime } from "@/components/anim/useAnime";
import { whenRevealed } from "@/lib/intro";

/** Hero copy with an anime.js intro: eyebrow → headline letters → body → CTAs. */
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
      .add(dot, { scale: 1, ease: spring({ stiffness: 260, damping: 9 }) }, 200)
      .add(split.chars, { y: "0%", duration: 1250, delay: stagger(24) }, 160)
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
    <div ref={ref} className="pt-8 lg:col-span-6 lg:pt-0">
      <p data-eyebrow data-hero className="eyebrow flex items-center gap-3 text-ink-2">
        <span data-dot className="inline-block size-2 rounded-full bg-accent" />
        Bag manufacturer · Mumbai · Since 2003
      </p>
      <h1
        data-hero
        className="display mt-5 text-[clamp(2.9rem,6.2vw,6.4rem)]"
      >
        Bags built
        <br />
        to your <span className="text-accent">brief.</span>
      </h1>
      <p
        data-body
        data-hero
        className="mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-ink-2 md:mt-7 md:text-xl"
      >
        Bizcraft designs and manufactures custom backpacks, laptop, travel and
        duffle bags for 120+ companies — from employee kits to OEM production —
        on our own factory floor in Bhiwandi.
      </p>
      <div data-ctas data-hero className="mt-7 flex flex-wrap gap-2 sm:gap-3 md:mt-9">
        <Magnetic>
          <a href="#configure" className="btn btn-accent">
            Design your bag <ArrowRight size={18} aria-hidden />
          </a>
        </Magnetic>
        <Magnetic>
          <a href="#contact" className="btn btn-ghost">
            Request a quote
          </a>
        </Magnetic>
      </div>
    </div>
  );
}
