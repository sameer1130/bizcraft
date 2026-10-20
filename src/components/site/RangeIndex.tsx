"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { products } from "@/lib/content";
import { Reveal, ScrambleText } from "@/components/anim/Anim";

const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * The nine categories as one run of oversized type. On large screens, hovering
 * or focusing a category lights it up and shows its detail in the side card;
 * on small screens the detail sits under each name.
 */
export function RangeIndex() {
  const [active, setActive] = useState(0);
  const current = products[active];

  return (
    <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12">
      <Reveal as="ol" stagger={60} className="border-t border-ink lg:col-span-8 lg:border-0">
        {products.map((p, i) => (
          <li
            key={p.name}
            className="border-b border-ink/15 lg:border-0 lg:text-[clamp(2.2rem,4.1vw,4.3rem)]"
          >
            <a
              href="#contact"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`group flex flex-wrap items-baseline gap-x-3 gap-y-1 py-5 transition-[color,translate] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] lg:inline-flex lg:py-1.5 ${
                i === active ? "lg:translate-x-4 lg:text-accent-ink" : ""
              }`}
            >
              <span className="display text-[clamp(1.9rem,7vw,2.6rem)] font-semibold uppercase leading-none tracking-[-0.045em] lg:text-[1em] lg:leading-[1.05]">
                {p.name}
              </span>
              <sup
                className="eyebrow top-0 self-start lg:mt-[0.3em]"
              >
                {num(i)}
              </sup>
              <span className="basis-full text-ink-3 lg:sr-only">{p.note}</span>
            </a>
          </li>
        ))}
      </Reveal>

      <aside aria-hidden className="hidden lg:col-span-4 lg:block">
        <div className="sticky top-28 overflow-hidden rounded-2xl bg-ink p-9 text-paper">
          <div className="flex items-start justify-between">
            <p className="eyebrow text-white/55">Category</p>
            <ArrowUpRight size={22} className="text-accent" />
          </div>
          <p className="display outline-text mt-6 text-[9rem] leading-[0.8] tracking-[-0.06em] text-accent tabular-nums [--stroke-w:2px]">
            <ScrambleText text={num(active)} chars="0-9" />
          </p>
          <p className="display mt-10 text-3xl font-semibold uppercase tracking-[-0.04em]">
            {current.name}
          </p>
          <p className="mt-3 text-white/70">{current.note}</p>
          <div className="mt-10 flex flex-wrap gap-2 border-t border-white/10 pt-6">
            {["Your colours", "Your branding", "Made to order"].map((t) => (
              <span key={t} className="eyebrow rounded-full border border-white/20 px-3 py-1.5 text-white/70">
                {t}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
