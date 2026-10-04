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
    <section id="top" className="relative overflow-hidden pt-18">
      <div className="mat pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_45%,black_20%,transparent_70%)]" />

      <div className="relative mx-auto grid max-w-[1320px] items-center gap-6 px-5 md:px-8 lg:min-h-[calc(100svh-4.5rem-8.5rem)] lg:grid-cols-12 lg:gap-0">
        <HeroCopy />
        <div className="relative -mt-4 h-[440px] sm:h-[560px] lg:col-span-6 lg:mt-0 lg:h-[min(72svh,700px)]">
          <HeroStage />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1320px] px-5 md:px-8">
        <dl className="grid grid-cols-2 border-t border-line md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col py-6 md:py-8 ${i % 2 === 1 ? "pl-5 md:pl-8" : ""} ${
                i > 0 ? "md:border-l md:border-line md:pl-8" : ""
              } ${i === 1 || i === 3 ? "border-l border-line" : ""} ${
                i > 1 ? "border-t border-line md:border-t-0" : ""
              }`}
            >
              <dt className="eyebrow order-2 mt-2 text-ink-3">{s.label}</dt>
              <dd className="display order-1 text-4xl tabular-nums md:text-5xl">{s.node}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
