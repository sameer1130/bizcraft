"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open
          ? "bg-canvas/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-18 max-w-[1320px] items-center justify-between px-5 md:px-8"
      >
        <a href="#top" aria-label="Bizcraft home" className="shrink-0">
          <Image
            src="/brand/logo-dark.png"
            alt="Bizcraft — delivering bags with excellence"
            width={216}
            height={93}
            priority
            className="h-10 w-auto"
          />
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-[0.95rem] font-medium text-ink-2 transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="tel:+912226127744"
            className="hidden font-mono text-sm text-ink-2 hover:text-ink xl:block"
          >
            +91 22 2612 7744
          </a>
          <a href="#contact" className="btn btn-accent hidden h-11 sm:inline-flex">
            Get a quote
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border-[1.5px] border-ink/20 lg:hidden"
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
        className="h-[calc(100dvh-4.5rem)] border-t border-line bg-canvas px-5 pt-6 lg:hidden"
      >
        <ul className="flex flex-col">
          {[...links, { href: "#contact", label: "Contact" }].map((l) => (
            <li key={l.href} className="border-b border-line">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="display block py-4 text-4xl"
              >
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
