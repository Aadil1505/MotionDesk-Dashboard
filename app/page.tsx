import Hero from "@/components/global/hero";
import ThemeShowcase from "@/components/global/theme-showcase";
import Features from "@/components/global/features";
import Pricing from "@/components/global/pricing";
import Footer from "@/components/global/footer";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="-mt-8 overflow-hidden">
        <MacbookScroll
          src="https://images.unsplash.com/photo-1485470733090-0aae1788d5af?q=80&w=2117&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          title={
              "See your Mac come to life"
          }
        />
      </div>
      <ThemeShowcase />
      <Features />
      <Pricing />
      <Footer />
    </>
  );
}
