"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BottomCTA() {
  return (
    <section className="py-24 px-4 md:px-8 max-w-[1200px] mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <h2 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-[#111111] tracking-tight leading-[1.15] mb-6">
          <span className="text-[#673AB7] italic font-serif font-light">Start Earning</span> from the skills you<br className="hidden md:block" /> already have.
        </h2>
        <p className="text-gray-500 text-[16px] md:text-[18px] mb-10 font-medium">
          Your next customer could already be looking for you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/register?type=provider" className="w-full sm:w-auto">
            <Button
              className="h-14 w-full sm:w-[200px] text-[16px] font-semibold rounded-full bg-[#673AB7] hover:bg-[#5e35a6] text-white transition-all duration-300 shadow-md"
            >
              Become a Provider
            </Button>
          </Link>
          <Link href="https://wa.me/2347075979682" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-14 w-full sm:w-[200px] text-[16px] font-semibold rounded-full text-[#111111] bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300 shadow-sm"
            >
              Chat With Us
            </Button>
          </Link>
        </div>

        <div className="w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-[32px] overflow-hidden shadow-2xl relative">
          <img
            src="/assets/bottom-cta.png"
            alt="Diverse professionals standing together"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
