"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#0B0914] rounded-2xl p-12 md:p-20 relative overflow-hidden "
      >
        {/* Subtle background glow */}
        <div className="absolute -top-1 -right-1 -translate-y-1/2 w-[600px] h-[600px] bg-[#6C3BFF] blur-[150px] opacity-30 rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left text */}
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6C3BFF] mb-4">
              READY TO GET STARTED?
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Stop Searching.<br />
              <span className="font-instrument font-light text-[#9F7AEA]">Start Hiring Smarter.</span>
            </h2>
            <p className="text-gray-400 text-base font-medium">
              Join thousands of students, businesses, and everyday people who use TaskHub. Everyone can go to platform.
            </p>
          </div>

          {/* Right buttons */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link href="/register">
              <Button className="h-13 px-8 py-3.5 text-base font-bold rounded-full bg-[#6C3BFF] hover:bg-[#805AD5] text-white w-full transition-all hover:scale-[1.02]">
                Post a Task
              </Button>
            </Link>
            <Link href="/register?type=tasker">
              <Button variant="outline" className="h-13 px-8 py-3.5 text-base font-bold rounded-full border-[#2D2A3B] text-[#6C3BFF] hover:bg-[#2D2A3B] w-full transition-all hover:scale-[1.02]">
                Join as Tasker
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}