"use client";

import { motion } from "framer-motion";
import { Wallet, Shield, LifeBuoy, BadgeCheck, Banknote } from "lucide-react";

const FEATURES = [
  {
    title: "Customers Pay First",
    description: "Customers pay before work begins, so you're never chasing payments.",
    icon: <Wallet className="w-5 h-5 text-[#673AB7]" />
  },
  {
    title: "Escrow Protection",
    description: "Payments are held securely until your work is completed and confirmed.",
    icon: <Shield className="w-5 h-5 text-[#673AB7]" />
  },
  {
    title: "Dispute Support",
    description: "Our team helps resolve any disagreements fairly and quickly.",
    icon: <LifeBuoy className="w-5 h-5 text-[#673AB7]" />
  },
  {
    title: "Verified Users",
    description: "Every customer is verified, creating a safer working environment.",
    icon: <BadgeCheck className="w-5 h-5 text-[#673AB7]" />
  },
  {
    title: "Secure Payouts",
    description: "Receive your earnings through reliable, secure payout methods.",
    icon: <Banknote className="w-5 h-5 text-[#673AB7]" />
  }
];

export default function TrustAndSafety() {
  return (
    <section className="py-24 overflow-hidden bg-white px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-[#673AB7] mb-6">
          WHY PROVIDERS TRUST TASKHUB
        </h2>
        <h3 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-[#111111] tracking-tight leading-[1.15]">
          <span className="text-[#673AB7] italic font-serif font-light">Payments and protection</span> <br className="hidden md:block" />
          You can rely on.
        </h3>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex items-start gap-4 p-8 bg-[#F9FAFB] rounded-2xl w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <div className="mt-1 flex-shrink-0">
              <div className="bg-white p-2.5 rounded-full shadow-sm border border-gray-100 flex items-center justify-center">
                {feature.icon}
              </div>
            </div>
            <div className="flex flex-col">
              <h4 className="text-[16px] font-semibold text-[#111111] mb-2">
                {feature.title}
              </h4>
              <p className="text-[14px] text-gray-500 leading-relaxed font-normal">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
