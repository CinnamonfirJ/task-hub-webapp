"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ProvidersHero() {
  return (
    <section className="relative pt-32 pb-12 md:pt-40 md:pb-20 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">

      {/* Precise Figma Background Radial Gradient */}
      <div className="absolute top-[-50px] left-[-100px] md:left-[5%] w-[700px] h-[666.86px] pointer-events-none -z-10 mix-blend-normal">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(108, 61, 255, 0.12) 0%, rgba(108, 61, 255, 0) 100%)"
          }}
        />
      </div>

      {/* Headlines & Main Content Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto w-full"
      >
        {/* Top Badge */}
        <div className="mx-auto mb-8 flex items-center gap-2 border text-[#222222] rounded-full p-2 text-[11px] md:text-xs border-gray-200 font-light text-[#555555] tracking-widest uppercase w-fit">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex  rounded-full h-2 w-2 bg-[#6C3DFF]"></span>
          </span>
          FOR BUSINESS & INDEPENDENT PROVIDERS
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-[64px] font-semibold text-[#000000] tracking-tight leading-[1.15] mb-6">
          Make more money doing<br className="hidden md:block" />
          <span className="text-[#673AB7] italic font-light block md:inline mt-2 md:mt-0">
            {" "}what you already do.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-[15px] md:text-[17px] text-gray-500 max-w-[640px] mx-auto mb-10 leading-[1.6] font-normal">
          Receive customer requests from people actively looking for your services. Join for free, get paid securely, and work when you want.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          {/* Become a Provider Button */}
          <Link href="/register?type=provider" className="w-full sm:w-auto">
            <Button className="h-11 w-full sm:w-[172px] text-[14px] font-medium rounded-full bg-[#111111] hover:bg-black text-white transition-all duration-300 gap-1 pt-2 pb-2 pl-5 pr-4 border-b-[3px] border-black/20">
              Become a Provider
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>

          {/* Chat on WhatsApp Button */}
          <Link href="https://wa.me/2347075979682?text=Hello%2C%20I%20want%20to%20become%20a%20provider%20on%20TaskHub" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-11 w-full sm:w-[157px] text-[14px] font-medium rounded-full text-gray-800 bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300 gap-1 pt-2 pb-2 px-5"
            >
              Chat on WhatsApp
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Hero Showcase Media Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden relative shadow-2xl border border-gray-100"
      >
        <img
          src="/assets/hero-video.gif"
          alt="People working"
          className="w-full h-auto object-cover max-h-[600px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      </motion.div>
    </section>
  );
}