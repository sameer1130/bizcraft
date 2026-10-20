"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { animate, stagger } from "animejs";
import { EASE } from "@/components/anim/Anim";
import { prefersReducedMotion } from "@/components/anim/useAnime";

const links = [
  { href: "#solutions", label: "Solutions" },
  { href: "#configure", label: "Configure" },
  { href: "#range", label: "Range" },
  { href: "#factory", label: "Factory" },
  { href: "#story", label: "About" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open || prefersReducedMotion()) return;
    const anim = animate("#mobile-menu li, #mobile-menu > a", {
      opacity: [0, 1],
      y: [28, 0],
      duration: 800,
      ease: EASE,
      delay: stagger(55),
    });
    return () => {
      anim.revert();
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-paper transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open
          ? "bg-night/90 shadow-[0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 md:px-8"
      >
        <a href="#top" aria-label="Bizcraft home" className="shrink-0">
          <Image
            src="/brand/logo.png"
            alt="Bizcraft — delivering bags with excellence"
            width={216}
            height={93}
            priority
            className="h-9 w-auto"
          />
        </a>

        <ul className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="eyebrow block rounded-full px-4 py-2 text-white/70 transition-colors hover:bg-white/10 hover:text-paper"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="tel:+912226127744"
            className="eyebrow hidden text-white/60 hover:text-paper xl:block"
          >
            +91 22 2612 7744
          </a>
          <a href="#contact" className="btn btn-accent hidden h-11 sm:inline-flex">
            Get a quote <ArrowUpRight size={15} aria-hidden />
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-white/20 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-4.5rem)] border-t border-white/10 bg-night px-5 pt-6 lg:hidden"
      >
        <ul className="flex flex-col">
          {[...links, { href: "#contact", label: "Contact" }].map((l, i) => (
            <li key={l.href} className="border-b border-white/10">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="display flex items-baseline gap-4 py-4 text-3xl uppercase"
              >
                <span className="eyebrow text-accent">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="btn btn-accent mt-8 w-full justify-center"
        >
          Get a quote
        </a>
      </div>
    </header>
  );
}
