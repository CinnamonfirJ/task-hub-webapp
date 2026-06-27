import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import ProvidersGrid from "@/components/landing/providers-grid";
import Benefits from "@/components/landing/benefits";
import Earnings from "@/components/landing/earnings";
import HowItWorks from "@/components/landing/how-it-works";
import ServicesGrid from "@/components/landing/services-grid";
import TrustAndSafety from "@/components/landing/trust-and-safety";
import PartnerCTA from "@/components/landing/partner-cta";
import VerificationProcess from "@/components/landing/verification-process";
import FAQ from "@/components/landing/faq";
import BottomCTA from "@/components/landing/bottom-cta";
import Footer from "@/components/landing/footer";
import { GuestGuard } from "@/components/auth/GuestGuard";

export default function Page() {
  return (
    <GuestGuard>
      <main className="bg-white min-h-screen selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden">
        <Navbar />
        <Hero />
        <div id="categories">
          <ProvidersGrid />
        </div>
        <div id="about">
          <Benefits />
          <Earnings />
          <HowItWorks />
          <ServicesGrid />
        </div>
        <div id="contact">
          <TrustAndSafety />
        </div>
        <PartnerCTA />
        <VerificationProcess />
        <FAQ />
        <BottomCTA />
        <Footer />
      </main>
    </GuestGuard>
  );
}

