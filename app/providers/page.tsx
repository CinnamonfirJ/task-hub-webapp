import ProvidersNavbar from "@/components/landing/providers-navbar";
import ProvidersHero from "@/components/landing/providers-hero";
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

export default function ProvidersPage() {
  return (
    <GuestGuard>
      <main className="bg-white min-h-screen selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden">
        <ProvidersNavbar />
        <ProvidersHero />
        <div id="who-is-it-for">
          <ProvidersGrid />
        </div>
        <div id="why-join">
          <Benefits />
          <div id="earnings">
            <Earnings />
          </div>
          <div id="how-it-works">
            <HowItWorks />
          </div>
          <ServicesGrid />
        </div>
        <TrustAndSafety />
        <PartnerCTA />
        <VerificationProcess />
        <div id="faq">
          <FAQ />
        </div>
        <BottomCTA />
        <Footer />
      </main>
    </GuestGuard>
  );
}
