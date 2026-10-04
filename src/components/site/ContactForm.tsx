"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { company, products } from "@/lib/content";
import { animate, stagger } from "animejs";
import { SPEC_EVENT, type SpecDetail } from "@/lib/spec";
import { EASE } from "@/components/anim/Anim";
import { prefersReducedMotion } from "@/components/anim/useAnime";

const quantities = ["Under 250", "250–1,000", "1,000–5,000", "5,000+", "Not sure yet"];

export function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const banner = useRef<HTMLParagraphElement>(null);
  const [fromConfigurator, setFromConfigurator] = useState(false);
  const [specCount, setSpecCount] = useState(0);
  const [sent, setSent] = useState(false);

  // Prefill from the configurator's "Send this spec" button.
  useEffect(() => {
    const onSpec = (e: Event) => {
      const { product, quantity, message } = (e as CustomEvent<SpecDetail>).detail;
      const f = form.current;
      if (!f) return;
      (f.elements.namedItem("product") as HTMLSelectElement).value = product;
      (f.elements.namedItem("quantity") as HTMLSelectElement).value = quantity;
      (f.elements.namedItem("message") as HTMLTextAreaElement).value = message;
      setFromConfigurator(true);
      setSpecCount((n) => n + 1);
      setSent(false);
      window.setTimeout(
        () => (f.elements.namedItem("name") as HTMLInputElement).focus({ preventScroll: true }),
        600,
      );
    };
    window.addEventListener(SPEC_EVENT, onSpec);
    return () => window.removeEventListener(SPEC_EVENT, onSpec);
  }, []);

  // Confirm the hand-off: banner drops in, then each filled field glows once.
  useEffect(() => {
    const f = form.current;
    if (!specCount || !f || prefersReducedMotion()) return;
    const fields = f.querySelectorAll<HTMLElement>(
      "[name=product], [name=quantity], [name=message]",
    );
    const anims = [
      animate(banner.current!, { opacity: [0, 1], y: [-10, 0], duration: 700, ease: EASE, delay: 450 }),
      animate(fields, {
        borderColor: ["#e85d1f", "#d8d1c4"],
        boxShadow: ["0 0 0 4px rgb(232 93 31 / 0.25)", "0 0 0 0px rgb(232 93 31 / 0)"],
        duration: 1600,
        ease: "outQuad",
        delay: stagger(120, { start: 650 }),
        onComplete: (a) => a.revert(),
      }),
    ];
    return () => anims.forEach((a) => a.revert());
  }, [specCount]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const subject = `Enquiry: ${get("product")} — ${get("company") || get("name")}`;
    const body = [
      `Name: ${get("name")}`,
      `Company: ${get("company")}`,
      `Email: ${get("email")}`,
      `Phone: ${get("phone")}`,
      `Product: ${get("product")}`,
      `Quantity: ${get("quantity")}`,
      "",
      get("message"),
    ].join("\n");
    // TODO: replace with a server action that stores the lead and emails
    // sales once a destination (CRM / inbox / sheet) is chosen.
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form
      ref={form}
      onSubmit={onSubmit}
      className="rounded-3xl bg-paper p-6 shadow-[0_1px_0_var(--color-line)] md:p-10"
    >
      {fromConfigurator ? (
        <p
          ref={banner}
          className="eyebrow mb-6 flex items-center gap-2 rounded-full bg-accent/15 px-4 py-2 text-accent-ink"
        >
          <Check size={14} aria-hidden /> Your configurator spec is added below
        </p>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" autoComplete="name" required />
        <Field label="Company" name="company" autoComplete="organization" required />
        <Field label="Work email" name="email" type="email" autoComplete="email" required />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">What do you need?</span>
          <select name="product" className="field" defaultValue="Backpacks">
            {products.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
            <option>Employee kit (mixed)</option>
            <option>Something else</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Quantity</span>
          <select name="quantity" className="field" defaultValue="Not sure yet">
            {quantities.map((q) => (
              <option key={q}>{q}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-semibold">Tell us about the project</span>
          <textarea
            name="message"
            rows={5}
            className="field resize-y"
            placeholder="Use, timeline, budget, branding — anything that helps us quote."
          />
        </label>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-sm text-sm text-ink-3" aria-live="polite">
          {sent
            ? "Your email app should now be open with everything filled in — just hit send."
            : `Prefer to talk? Call ${company.phone}.`}
        </p>
        <button type="submit" className="btn btn-accent">
          Send enquiry <ArrowRight size={18} aria-hidden />
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">
        {label}
        {props.required ? <span className="text-accent-ink"> *</span> : null}
      </span>
      <input className="field" {...props} />
    </label>
  );
}
