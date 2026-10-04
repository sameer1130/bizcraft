import { Hero } from "@/components/site/Hero";
import { IntroExperience } from "@/components/intro/IntroExperience";
import { Nav } from "@/components/site/Nav";
import {
  ClientStrip,
  ConfigureSection,
  Contact,
  Factory,
  Footer,
  Range,
  Solutions,
  Story,
} from "@/components/site/Sections";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <IntroExperience>
          <Hero />
        </IntroExperience>
        <ClientStrip />
        <Solutions />
        <ConfigureSection />
        <Range />
        <Factory />
        <Story />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
