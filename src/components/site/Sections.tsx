import Image from "next/image";
import {
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Factory as FactoryIcon,
  Megaphone,
  Shield,
} from "lucide-react";
import {
  clients,
  company,
  factoryFacts,
  process,
  products,
  solutions,
  timeline,
} from "@/lib/content";
import { Configurator } from "./Configurator";
import { ContactForm } from "./ContactForm";
import {
  CountUp,
  Marquee,
  Reveal,
  ScrambleOnView,
  Seam,
  SplitHeading,
} from "@/components/anim/Anim";

const solutionIcons = [Briefcase, Megaphone, FactoryIcon, Shield];

function SectionHead({
  eyebrow,
  title,
  intro,
  tone = "light",
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div>
      <Seam
        className={`mb-10 h-7 w-full md:mb-14 ${
          tone === "dark" ? "text-white/30" : "text-ink/25"
        }`}
      />
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Reveal>
            <p
              className={`eyebrow ${tone === "dark" ? "text-white/60" : "text-ink-3"}`}
            >
              {eyebrow}
            </p>
          </Reveal>
          <SplitHeading className="display mt-4 text-[clamp(2.4rem,5.4vw,4.8rem)]">
            {title}
          </SplitHeading>
        </div>
        {intro ? (
          <Reveal delay={0.25} className="lg:col-span-5">
            <p
              className={`text-lg leading-relaxed ${
                tone === "dark" ? "text-white/70" : "text-ink-2"
              }`}
            >
              {intro}
            </p>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}

export function ClientStrip() {
  const row = [...clients, ...clients];
  return (
    <section
      id="clients"
      aria-label="Clients"
      className="border-y border-line bg-paper py-10"
    >
      <p className="eyebrow mx-auto max-w-[1320px] px-5 text-ink-3 md:px-8">
        Trusted by 120+ companies, including
      </p>
      <Marquee className="mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <ul className="flex w-max items-center gap-12 pr-12">
          {row.map((name, i) => (
            <li
              key={`${name}-${i}`}
              aria-hidden={i >= clients.length}
              className="flex items-center gap-12 whitespace-nowrap text-[clamp(1.4rem,2.6vw,2.2rem)] font-bold tracking-tight text-ink/55 [font-stretch:108%]"
            >
              {name}
              <span className="text-[0.6em] text-accent" aria-hidden>
                ✕
              </span>
            </li>
          ))}
        </ul>
      </Marquee>
    </section>
  );
}

export function Solutions() {
  return (
    <section id="solutions" className="py-24 md:py-36">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <SectionHead
          eyebrow="What we do"
          title={
            <>
              One factory.
              <br />
              Four ways to work with us.
            </>
          }
          intro="Whether it's kits for a new joiners' batch or a production partner for your own label, the same team cuts, stitches and checks every bag."
        />

        <Reveal
          stagger={110}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
        >
          {solutions.map((s, i) => {
            const Icon = solutionIcons[i];
            return (
                <article key={s.code} className="stitch group flex h-full flex-col rounded-2xl bg-paper p-8 transition-colors duration-300 hover:bg-ink hover:text-paper">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-ink-3 group-hover:text-white/60">
                      {s.code}
                    </span>
                    <Icon
                      size={22}
                      className="text-accent"
                      aria-hidden
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="display mt-16 min-h-[1.84em] text-3xl">{s.title}</h3>
                  <p className="mt-4 leading-relaxed text-ink-2 group-hover:text-white/70">
                    {s.body}
                  </p>
                  <a
                    href="#contact"
                    className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-semibold"
                  >
                    Talk to us
                    <span className="sr-only"> about {s.title}</span>
                    <ArrowUpRight
                      size={16}
                      aria-hidden
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

export function Range() {
  return (
    <section id="range" className="border-t border-line bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <SectionHead
          eyebrow="The range"
          title="Nine categories, all made to order."
          intro="Every product can be made in your colours and finished with your branding. Tell us the category — we'll take it from there."
        />
        <Reveal
          as="ol"
          stagger={70}
          className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
        >
          {products.map((p, i) => (
            <li key={p.name} className="border-b border-r border-line">
              <a
                href="#contact"
                className="group relative flex h-full min-h-56 flex-col justify-between p-7 transition-colors duration-300 hover:bg-canvas md:p-9"
              >
                <span className="eyebrow text-ink-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="display text-[clamp(1.9rem,3vw,2.6rem)] transition-colors group-hover:text-accent-ink">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-ink-2">{p.note}</p>
                </div>
                <ArrowUpRight
                  size={22}
                  aria-hidden
                  className="absolute right-7 top-7 text-ink-3 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent md:right-9 md:top-9"
                />
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Factory() {
  return (
    <section
      id="factory"
      className="relative overflow-hidden bg-night py-24 text-paper md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative mx-auto max-w-[1320px] px-5 md:px-8">
        <SectionHead
          tone="dark"
          eyebrow="Factory · Bhiwandi"
          title={
            <>
              Made on our
              <br />
              own floor.
            </>
          }
          intro="Our factory sits in Asmeeta Textile Park, Bhiwandi — a 5-star MIDC property. Cutting, stitching, checking and packing happen under one roof, so quality and timelines stay in our hands."
        />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10">
              <div className="bg-night-2 p-7">
                <p className="display text-6xl tabular-nums text-accent">
                  <CountUp value={120} />
                </p>
                <p className="eyebrow mt-3 text-white/60">Machines</p>
              </div>
              <div className="bg-night-2 p-7">
                <p className="display text-6xl tabular-nums">
                  <CountUp value={70} suffix="%+" />
                </p>
                <p className="eyebrow mt-3 text-white/60">
                  Women — our hiring goal
                </p>
              </div>
            </div>
            <Reveal as="ul" stagger={80} delay={0.2} className="mt-8 space-y-4">
              {factoryFacts.map((f) => (
                <li key={f} className="flex items-start gap-3 text-white/80">
                  <BadgeCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-accent"
                    aria-hidden
                    strokeWidth={1.75}
                  />
                  {f}
                </li>
              ))}
            </Reveal>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-white/55">
              We train people on the floor rather than only hiring ready-made
              skills.
            </p>
          </Reveal>

          <div className="relative lg:col-span-6 lg:col-start-7">
            <Seam
              vertical
              className="absolute bottom-6 left-[calc(1.375rem-10px)] top-6 w-5 text-white/40"
            />
          <ol className="relative">
            {process.map((p) => (
              <li key={p.step} className="relative pb-10 last:pb-0">
                <Reveal className="flex gap-6">
                  <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-[1.5px] border-white/25 bg-night font-mono text-sm">
                    {p.step}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="display text-2xl">{p.title}</h3>
                    <p className="mt-2 max-w-md leading-relaxed text-white/65">
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

export function Story() {
  return (
    <section id="story" className="py-24 md:py-36">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <SectionHead
          eyebrow="Our story"
          title={
            <>
              Twenty-three years
              <br />
              of stitching.
            </>
          }
        />
        <Reveal
          as="ol"
          stagger={120}
          className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
        >
          {timeline.map((t) => (
            <li key={t.year} className="bg-canvas p-7 md:p-8">
              <p
                className={`display text-5xl tabular-nums ${
                  t.year === "Next" ? "text-accent" : ""
                }`}
              >
                <ScrambleOnView
                  text={t.year}
                  chars={t.year === "Next" ? "a-zA-Z" : "0-9"}
                />
              </p>
              <h3 className="mt-6 text-lg font-bold">{t.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-2">{t.body}</p>
            </li>
          ))}
        </Reveal>

        <div className="mt-20 grid gap-8 lg:mt-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow text-ink-3">Our purpose</p>
          </Reveal>
          <blockquote className="lg:col-span-9">
            <SplitHeading
              as="p"
              className="text-[clamp(1.8rem,3.6vw,3.2rem)] font-semibold leading-[1.12] tracking-tight [font-stretch:104%]"
            >
              “To touch the heart and soul of the people — and make them feel
              precious.”
            </SplitHeading>
            <Reveal delay={0.5}>
              <footer className="eyebrow mt-6 text-ink-3">
                Excellence · Versatility · Resourcefulness · Passion ·
                Commitment
              </footer>
            </Reveal>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-night text-paper">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-16 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <Image
            src="/brand/logo.png"
            alt="Bizcraft"
            width={216}
            height={93}
            className="h-11 w-auto"
          />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">
            {company.name}. Custom bags for companies, brands and the forces —
            made in Bhiwandi since {company.founded}.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow text-white/50">Explore</p>
          <ul className="mt-4 space-y-2 text-white/80">
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
          <p className="eyebrow text-white/50">Talk to us</p>
          <a
            href={`mailto:${company.email}`}
            className="display mt-4 block text-3xl hover:text-accent md:text-4xl"
          >
            {company.email}
          </a>
          <a
            href={company.phoneHref}
            className="mt-3 block font-mono text-white/70 hover:text-accent"
          >
            {company.phone}
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1320px] flex-wrap justify-between gap-4 px-5 py-6 text-sm text-white/60 md:px-8">
          <p>
            © {new Date().getFullYear()} {company.name}
          </p>
          <p>Mumbai · Bhiwandi · India</p>
        </div>
      </div>
    </footer>
  );
}

export function ConfigureSection() {
  return (
    <section id="configure" className="pb-24 md:pb-36">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <SectionHead
          eyebrow="Configurator"
          title={
            <>
              Design it before
              <br />
              we make it.
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

export function Contact() {
  return (
    <section id="contact" className="border-t border-line bg-canvas py-24 md:py-36">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow text-ink-3">Get a quote</p>
          </Reveal>
          <SplitHeading className="display mt-4 text-[clamp(2.4rem,4.4vw,4.2rem)]">
            Tell us what you need to carry.
          </SplitHeading>
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">
              Share a rough brief — we&apos;ll suggest constructions, make a
              sample and send a quote.
            </p>
          </Reveal>
          <Reveal
            as="dl"
            stagger={90}
            delay={0.35}
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-1"
          >
            <div>
              <dt className="eyebrow text-ink-3">Call</dt>
              <dd className="mt-2">
                <a href={company.phoneHref} className="text-xl font-semibold hover:text-accent-ink">
                  {company.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-3">Email</dt>
              <dd className="mt-2">
                <a href={`mailto:${company.email}`} className="text-xl font-semibold hover:text-accent-ink">
                  {company.email}
                </a>
              </dd>
            </div>
            {[company.office, company.factory].map((a) => (
              <div key={a.label}>
                <dt className="eyebrow text-ink-3">{a.label}</dt>
                <dd className="mt-2 leading-relaxed text-ink-2">
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
