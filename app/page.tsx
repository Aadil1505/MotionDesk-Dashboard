import Features from "@/components/global/features";
import Footer from "@/components/global/footer";
import Hero from "@/components/global/hero";
import PricingGlass from "@/components/global/pricing-glass";
import ThemeShowcase from "@/components/global/theme-showcase";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

const videos = [
  { name: "Weather Field", file: "weather-1.mp4" },
  { name: "Contour Field", file: "contour-1.mp4" },
  { name: "Smoke Field", file: "smoke-1.mp4" },
  { name: "Magnetic Field", file: "magnetic-field-1.mp4" },
  { name: "Glyph Swarm", file: "glyph-swarm-1.mp4" },
  { name: "ASCII Field", file: "ascii-field-1.mp4" },
  { name: "Pulse Rings", file: "pulse-rings-1.mp4" },
];

export default function Home() {
  return (
    <>
      <Hero />
      <div className="-mt-8 overflow-hidden">
        <MacbookScroll
          videos={videos}
          title="See your Mac come to life"
        />
      </div>
      <ThemeShowcase />
      <Features />
      <PricingGlass />
      <Footer />
    </>
  );
}
