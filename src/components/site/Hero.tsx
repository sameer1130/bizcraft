import { CountUp, ScrambleOnView } from "@/components/anim/Anim";
import { HeroCopy } from "./HeroCopy";
import { HeroStage } from "./HeroStage";

const stats = [
  { label: "Making bags since", node: <ScrambleOnView text="2003" /> },
  { label: "Machines on our floor", node: <CountUp value={120} /> },
  { label: "Client accounts, mostly MNCs", node: <CountUp value={120} suffix="+" /> },
  { label: "People on the team", node: <CountUp value={50} suffix="+" /> },
];

export function Hero() {
  return (
    <section id="top" className="grain relative overflow-hidden bg-night text-paper">
      {/* Studio spotlight: the pool of light the bag stands in. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_46%_52%_at_50%_50%,#2b2d33_0%,#17181c_48%,transparent_78%)]"
      />

      <div className="relative mx-auto flex max-w-[1440px] flex-col px-5 pt-24 md:px-8 lg:block lg:h-[100svh] lg:max-h-[1100px] lg:min-h-[740px] lg:pt-0">
        <HeroCopy />
        <div className="relative order-2 -mx-5 h-[420px] sm:h-[560px] md:-mx-8 lg:absolute lg:inset-0 lg:z-10 lg:mx-0 lg:h-auto">
          <HeroStage />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-8">
        <dl className="grid grid-cols-2 border-t border-white/15 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col gap-3 py-7 md:py-10 ${i % 2 === 1 ? "border-l border-white/15 pl-5" : ""} ${
                i > 0 ? "md:border-l md:border-white/15 md:pl-8" : ""
              } ${i > 1 ? "border-t border-white/15 md:border-t-0" : ""}`}
            >
              <dt className="eyebrow order-2 text-white/55">
                <span className="mr-2 text-accent">0{i + 1}</span>
                {s.label}
              </dt>
              <dd className="display order-1 text-[clamp(2.2rem,4.4vw,4rem)] tabular-nums">
                {s.node}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
