import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
// import TrustBadges from "@/components/landing/trust-badges"
import HowItWorks from "@/components/landing/how-it-works";
import ServicesGrid from "@/components/landing/services-grid";
import SafetySection from "@/components/landing/safety-section";
import ProviderCTA from "@/components/landing/provider-cta";
import RewardsSection from "@/components/landing/rewards-section";
import FinalCTA from "@/components/landing/final-cta";
import Footer from "@/components/landing/footer";
import TheProblem from "@/components/landing/the-problem";
import { GuestGuard } from "@/components/auth/GuestGuard";

export default function Page() {
  return (
    <GuestGuard>
      <main>
        <Navbar />
        <Hero />
        <TheProblem />
        {/* <TrustBadges /> */}
        {/* <TrustBadges /> */}
        <HowItWorks />
        <ServicesGrid />
        <SafetySection />
        <ProviderCTA />
        <RewardsSection />
        <FinalCTA />
        <Footer />
      </main>
    </GuestGuard>
  );
}
