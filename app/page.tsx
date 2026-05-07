import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import ServicesMarquee from "@/components/landing/services-marquee";
import TheProblem from "@/components/landing/the-problem";
import TheSolution from "@/components/landing/the-solution";
import StatsSection from "@/components/landing/stats-section";
import FoundationSection from "@/components/landing/foundation-section";
import Testimonials from "@/components/landing/testimonials";
import FinalCTA from "@/components/landing/final-cta";
import Footer from "@/components/landing/footer";
import { GuestGuard } from "@/components/auth/GuestGuard";

export default function Page() {
  return (
    <GuestGuard>
      <main className="bg-white min-h-screen selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden">
        <Navbar />
        <Hero />
        <div id="categories">
          <ServicesMarquee />
        </div>
        <div id="about">
          <TheProblem />
          <TheSolution />
          <StatsSection />
          <FoundationSection />
        </div>
        <div id="contact">
          <Testimonials />
        </div>
        <FinalCTA />
        <Footer />
      </main>
    </GuestGuard>
  );
}
