import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import {
  clients,
  company,
  factoryFacts,
  process,
  solutions,
  timeline,
} from "@/lib/content";
import { Configurator } from "./Configurator";
import { ContactForm } from "./ContactForm";
import { RangeIndex } from "./RangeIndex";
import {
  CountUp,
  Drift,
  Marquee,
  Reveal,
  ScrambleOnView,
  Seam,
  SplitHeading,
} from "@/components/anim/Anim";

const wrap = "mx-auto max-w-[1440px] px-5 md:px-8";

export function SectionHead({
  index,
  eyebrow,
  title,
  intro,
  tone = "light",
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-9">
        <Reveal>
          <p
            className={`eyebrow flex items-center gap-3 ${dark ? "text-white/60" : "text-ink-3"}`}
          >
            <span className={dark ? "text-accent" : "text-accent-ink"}>({index})</span>
            {eyebrow}
            <span className={`h-px w-12 ${dark ? "bg-white/25" : "bg-ink/25"}`} />
          </p>
        </Reveal>
        <SplitHeading className="display mt-6 text-[clamp(2.1rem,4.3vw,4.2rem)] font-semibold leading-[1]">
          {title}
        </SplitHeading>
      </div>
      {intro ? (
        <Reveal delay={0.25} className="lg:col-span-3">
          <p
            className={`text-lg leading-relaxed ${dark ? "text-white/70" : "text-ink-2"}`}
          >
            {intro}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Clients: two crossed tapes on the seam between the hero and the page       */
/* -------------------------------------------------------------------------- */

const tape = ["Cut", "Stitch", "Check", "Pack", "Deliver"];

export function ClientStrip() {
  const names = [...clients, ...clients];
  const words = [...tape, ...tape, ...tape, ...tape];
  return (
    <section
      id="clients"
      aria-labelledby="clients-title"
      className="grain relative overflow-x-clip bg-[linear-gradient(to_bottom,var(--color-night)_50%,var(--color-paper)_50%)] py-24 md:py-28"
    >
      <h2 id="clients-title" className="sr-only">
        Trusted by 120+ companies, including
      </h2>

      {/* Back tape: the process, running the other way. */}
      <Marquee
        reverse
        duration={60000}
        className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[7deg] overflow-hidden bg-chalk md:rotate-[3.4deg] py-3 text-ink shadow-[0_10px_30px_-14px_rgb(0_0_0/0.45)]"
      >
        <ul aria-hidden className="flex w-max items-center">
          {words.map((w, i) => (
            <li
              key={i}
              className="eyebrow flex items-center gap-6 pr-6 text-[0.8rem] whitespace-nowrap"
            >
              {w}
              <span className="text-accent-ink">✦</span>
            </li>
          ))}
        </ul>
      </Marquee>

      {/* Front tape: client names. */}
      <Marquee className="relative mx-[-5%] -rotate-[4deg] overflow-hidden md:-rotate-[2.4deg] bg-accent py-4 text-ink shadow-[0_18px_40px_-18px_rgb(0_0_0/0.6)] md:py-5">
        <ul className="flex w-max items-center">
          {names.map((name, i) => (
            <li
              key={`${name}-${i}`}
              aria-hidden={i >= clients.length}
              className="display flex items-center gap-8 whitespace-nowrap pr-8 text-[clamp(1.25rem,2.4vw,2rem)] font-semibold uppercase tracking-[-0.03em]"
            >
              {i % clients.length === 0 ? (
                <span className="eyebrow rounded-full border border-ink/40 px-3 py-1 text-[0.65rem] tracking-[0.04em]">
                  120+ clients
                </span>
              ) : null}
              {name}
              <Plus size={18} strokeWidth={3} aria-hidden />
            </li>
          ))}
        </ul>
      </Marquee>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Solutions: an index of rows that flood orange on hover                      */
/* -------------------------------------------------------------------------- */

export function Solutions() {
  return (
    <section id="solutions" className="bg-paper pb-24 pt-8 text-ink md:pb-36 md:pt-10">
      <div className={wrap}>
        <SectionHead
          index="01"
          eyebrow="What we do"
          title="One factory. Four ways to work with us."
          intro="Whether it's kits for a new joiners' batch or a production partner for your own label, the same team cuts, stitches and checks every bag."
        />

        <Reveal as="ol" stagger={90} className="mt-14 border-t border-ink lg:mt-20">
          {solutions.map((s) => (
            <li key={s.code} className="border-b border-ink/15">
              <a
                href="#contact"
                className="group relative grid grid-cols-[3rem_1fr_auto] items-center gap-x-4 gap-y-3 overflow-hidden py-7 md:grid-cols-12 md:gap-6 md:py-10"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                />
                <span className="eyebrow relative text-ink-3 group-hover:text-ink md:col-span-1">
                  {s.code}
                </span>
                <h3 className="display relative text-[clamp(1.5rem,3.3vw,3.2rem)] font-semibold uppercase leading-none tracking-[-0.04em] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-3 md:col-span-6">
                  {s.title}
                </h3>
                <p className="relative col-span-2 col-start-2 max-w-md leading-relaxed text-ink-2 group-hover:text-ink md:col-span-4 md:col-start-auto">
                  {s.body}
                </p>
                <span className="relative row-start-1 col-start-3 grid size-11 place-items-center justify-self-end rounded-full border border-ink/20 transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-accent md:col-span-1 md:col-start-auto md:row-start-auto">
                  <ArrowUpRight size={18} aria-hidden />
                  <span className="sr-only">Talk to us about {s.title}</span>
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function ConfigureSection() {
  return (
    <section id="configure" className="grain bg-night py-24 text-paper md:py-36">
      <div className={wrap}>
        <SectionHead
          tone="dark"
          index="02"
          eyebrow="Configurator"
          title={
            <>
              Design it before
              <br /> we make it.
            </>
          }
          intro="Pick a fabric colour, drop in your logo and send us the spec. We'll come back with a physical sample and a quote."
        />
        <div className="mt-14 lg:mt-20">
          <Configurator />
        </div>
      </div>
    </section>
  );
}

export function Range() {
  return (
    <section id="range" className="bg-paper py-24 text-ink md:py-36">
      <div className={wrap}>
        <SectionHead
          index="03"
          eyebrow="The range"
          title="Nine categories, all made to order."
          intro="Every product can be made in your colours and finished with your branding. Tell us the category — we'll take it from there."
        />
        <RangeIndex />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Factory                                                                     */
/* -------------------------------------------------------------------------- */

export function Factory() {
  return (
    <section
      id="factory"
      className="grain relative overflow-hidden bg-night py-24 text-paper md:py-36"
    >
      <Drift className="display pointer-events-none absolute left-0 top-[50%] select-none whitespace-nowrap text-[24vw] uppercase leading-none tracking-[-0.05em] text-white/[0.045]">
        Bhiwandi — Bhiwandi —
      </Drift>

      <div className={`relative ${wrap}`}>
        <SectionHead
          tone="dark"
          index="04"
          eyebrow="Factory · Bhiwandi"
          title={
            <>
              Made on our
              <br /> own floor.
            </>
          }
          intro="Our factory sits in Asmeeta Textile Park, Bhiwandi — a 5-star MIDC property. Cutting, stitching, checking and packing happen under one roof, so quality and timelines stay in our hands."
        />

        <Reveal
          stagger={110}
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2 lg:mt-24 lg:grid-cols-12"
        >
          <div className="flex flex-col justify-between gap-10 bg-night-2 p-7 md:p-10 lg:col-span-5">
            <p className="eyebrow text-white/55">Machines on the floor</p>
            <p className="display text-[clamp(6rem,13vw,12rem)] leading-[0.8] tracking-[-0.06em] text-accent tabular-nums">
              <CountUp value={120} />
            </p>
          </div>
          <div className="flex flex-col justify-between gap-10 bg-night-2 p-7 md:p-10 lg:col-span-3">
            <p className="eyebrow text-white/55">Women on the floor — our hiring goal</p>
            <p className="display text-[clamp(3.5rem,5.3vw,5rem)] leading-[0.85] tracking-[-0.05em] tabular-nums">
              <CountUp value={70} suffix="%+" />
            </p>
          </div>
          <div className="bg-night-2 p-7 md:col-span-2 md:p-10 lg:col-span-4">
            <p className="eyebrow text-white/55">Under one roof</p>
            <ul className="mt-6 divide-y divide-white/10">
              {factoryFacts.map((f) => (
                <li key={f} className="flex items-center gap-3 py-3 text-white/85">
                  <span className="size-1.5 shrink-0 bg-accent" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-white/55">
          We train people on the floor rather than only hiring ready-made skills.
        </p>

        <div className="mt-24 lg:mt-32">
          <Reveal>
            <p className="eyebrow text-white/60">From brief to delivery</p>
          </Reveal>
          <div className="relative mt-10">
            <Seam className="absolute inset-x-0 top-[22px] hidden h-7 -translate-y-1/2 text-white/35 lg:block" />
            <Seam
              vertical
              className="absolute bottom-6 left-[calc(1.375rem-10px)] top-6 w-5 text-white/35 lg:hidden"
            />
            <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-8">
              {process.map((p) => (
                <li key={p.step}>
                  <Reveal className="flex gap-6 lg:flex-col lg:gap-8">
                    <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-white/25 bg-night font-mono text-xs text-accent">
                      {p.step}
                    </span>
                    <div className="pt-1.5 lg:pt-0">
                      <h3 className="display text-xl font-semibold uppercase tracking-[-0.03em]">
                        {p.title}
                      </h3>
                      <p className="mt-3 max-w-md leading-relaxed text-white/65">
                        {p.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Story + purpose                                                             */
/* -------------------------------------------------------------------------- */

export function Story() {
  return (
    <>
      <section id="story" className="bg-paper py-24 text-ink md:py-36">
        <div className={wrap}>
          <SectionHead
            index="05"
            eyebrow="Our story"
            title={
              <>
                Twenty-three years
                <br /> of stitching.
              </>
            }
          />
          <Reveal
            as="ol"
            stagger={120}
            className="mt-14 grid border-t border-ink sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
          >
            {timeline.map((t) => {
              const next = t.year === "Next";
              return (
                <li
                  key={t.year}
                  className="border-b border-ink/15 py-8 sm:odd:pr-8 sm:even:border-l sm:even:pl-8 lg:border-b-0 lg:border-l lg:px-7 lg:py-10 lg:first:border-l-0 lg:first:pl-0"
                >
                  <p
                    className={`display text-[clamp(3.6rem,6.4vw,6rem)] leading-none tracking-[-0.06em] tabular-nums ${
                      next ? "text-accent-ink" : "outline-text"
                    }`}
                  >
                    <ScrambleOnView text={t.year} chars={next ? "a-zA-Z" : "0-9"} />
                  </p>
                  <h3 className="mt-10 text-xl font-semibold">{t.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-2">{t.body}</p>
                </li>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section aria-label="Our purpose" className="bg-accent py-24 text-ink md:py-36">
        <div className={wrap}>
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              (06) Our purpose <span className="h-px w-12 bg-ink/40" />
            </p>
          </Reveal>
          <blockquote className="mt-8">
            <SplitHeading
              as="p"
              className="display max-w-[22ch] text-[clamp(2rem,5.2vw,5.2rem)] font-semibold uppercase leading-[0.98] tracking-[-0.045em]"
            >
              “To touch the heart and soul of the people — and make them feel
              precious.”
            </SplitHeading>
            <Reveal as="ul" stagger={70} delay={0.4} className="mt-12 flex flex-wrap gap-2">
              {["Excellence", "Versatility", "Resourcefulness", "Passion", "Commitment"].map(
                (v) => (
                  <li
                    key={v}
                    className="eyebrow rounded-full border border-ink/35 px-4 py-2"
                  >
                    {v}
                  </li>
                ),
              )}
            </Reveal>
          </blockquote>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Contact + footer                                                            */
/* -------------------------------------------------------------------------- */

export function Contact() {
  return (
    <section id="contact" className="grain bg-night py-24 text-paper md:py-36">
      <div className={`grid gap-14 lg:grid-cols-12 ${wrap}`}>
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-white/60">
              <span className="text-accent">(07)</span> Get a quote
              <span className="h-px w-12 bg-white/25" />
            </p>
          </Reveal>
          <SplitHeading className="display mt-6 text-[clamp(2.4rem,4.6vw,4.4rem)] font-semibold leading-[1]">
            Tell us what you need to carry.
          </SplitHeading>
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              Share a rough brief — we&apos;ll suggest constructions, make a
              sample and send a quote.
            </p>
          </Reveal>
          <Reveal
            as="dl"
            stagger={90}
            delay={0.35}
            className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2"
          >
            <div className="bg-night-2 p-6">
              <dt className="eyebrow text-white/55">Call</dt>
              <dd className="mt-3">
                <a href={company.phoneHref} className="text-lg font-medium hover:text-accent">
                  {company.phone}
                </a>
              </dd>
            </div>
            <div className="bg-night-2 p-6">
              <dt className="eyebrow text-white/55">Email</dt>
              <dd className="mt-3">
                <a href={`mailto:${company.email}`} className="text-lg font-medium hover:text-accent">
                  {company.email}
                </a>
              </dd>
            </div>
            {[company.office, company.factory].map((a) => (
              <div key={a.label} className="bg-night-2 p-6">
                <dt className="eyebrow text-white/55">{a.label}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-white/75">
                  {a.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden border-t border-white/10 bg-night text-paper">
      <div className={`grid gap-12 py-16 md:grid-cols-12 md:py-20 ${wrap}`}>
        <div className="md:col-span-4">
          <Image
            src="/brand/logo.png"
            alt="Bizcraft"
            width={216}
            height={93}
            className="h-10 w-auto"
          />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">
            {company.name} Custom bags for companies, brands and the forces —
            made in Bhiwandi since {company.founded}.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow text-white/55">Explore</p>
          <ul className="mt-5 space-y-2.5 text-white/80">
            {[
              ["#solutions", "Solutions"],
              ["#configure", "Configure a bag"],
              ["#range", "Product range"],
              ["#factory", "Factory"],
              ["#story", "About"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="hover:text-accent">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-5">
          <p className="eyebrow text-white/55">Talk to us</p>
          <a
            href={`mailto:${company.email}`}
            className="display mt-5 block text-[clamp(1.5rem,2.6vw,2.4rem)] font-semibold tracking-[-0.04em] hover:text-accent"
          >
            {company.email}
          </a>
          <a
            href={company.phoneHref}
            className="eyebrow mt-4 block text-white/70 hover:text-accent"
          >
            {company.phone}
          </a>
        </div>
      </div>

      <p
        aria-hidden
        className="display pointer-events-none select-none whitespace-nowrap text-center text-[16.4vw] uppercase leading-[0.8] tracking-[-0.07em] text-white/[0.06]"
      >
        Bizcraft
      </p>

      <div className="border-t border-white/10">
        <div className={`flex flex-wrap justify-between gap-4 py-6 text-white/55 ${wrap}`}>
          <p className="eyebrow">
            © {new Date().getFullYear()} {company.name}
          </p>
          <p className="eyebrow">Mumbai · Bhiwandi · India</p>
        </div>
      </div>
    </footer>
  );
}
