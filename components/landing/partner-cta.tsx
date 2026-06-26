"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function PartnerCTA() {
  return (
    <section className="py-24 px-4 md:px-8 max-w-[1200px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-[32px] overflow-hidden relative shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #4c2b9a 0%, #1a0e35 40%, #301763 100%)",
        }}
      >
        {/* Abstract Blur Effect */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6C3BFF] opacity-30 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
        
        <div className="relative z-10 px-8 py-16 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-[11px] font-bold tracking-[0.15em] uppercase">
                LIMITED TIME OPPORTUNITY
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-[52px] font-serif text-white mb-6 leading-[1.15] font-normal tracking-tight">
              Founding Business <br className="hidden md:block" />
              Partner Programme
            </h2>
            
            <p className="text-[#E2E8F0] text-[15px] md:text-[16px] leading-relaxed mb-10 max-w-[480px] mx-auto lg:mx-0 font-medium opacity-90">
              To support our expansion across Nigeria, selected providers who join through our partnership programme will enjoy a reduced commission rate for life.
            </p>
            
            <Link 
              href="/register?type=provider" 
              className="inline-flex items-center justify-center bg-white text-[#111111] hover:bg-gray-100 transition-colors rounded-full px-8 py-4 font-semibold text-[15px] shadow-lg"
            >
              Claim Your Spot
            </Link>
          </div>

          {/* Right Content */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="text-center mb-8">
              <div className="text-[100px] md:text-[140px] leading-[0.9] font-serif text-white tracking-tighter mb-4">
                10<span className="text-[70px] md:text-[90px] font-light">%</span>
              </div>
              <div className="text-[#E2E8F0] text-[16px] md:text-[18px] font-medium tracking-wide">
                Lifetime Commission Rate
              </div>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 pl-5 backdrop-blur-md">
                <span className="text-[#94A3B8] text-[13px] md:text-sm line-through mr-4 font-medium tracking-wide">
                  15% Standard Rate
                </span>
                <span className="bg-[#6C3BFF] text-white text-[13px] md:text-sm font-bold px-5 py-2 rounded-full shadow-md">
                  Save 5%
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#94A3B8] text-[13px] font-medium">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                Limited spots available
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
