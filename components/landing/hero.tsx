"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const PROFESSIONS = [
  "Plumbing",
  "Tutoring",
  "Cleaning",
  "Delivery",
  "Repairs",
  "Errands",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % PROFESSIONS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-20 pb-12 md:pt-28 md:pb-20 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      
      {/* Comment #13: Ambient Radial Overlay background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(107,70,193,0.05),transparent_60%)] pointer-events-none -z-10" />

      {/* Headlines & Main Content Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto w-full"
      >
        {/* Comment #11: Fully optimized & responsive top badge pill layout */}
        <div className="mx-auto mb-6 flex items-center gap-2 rounded-full border border-[#683ab72b] bg-purple-50/60 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 w-fit backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#673AB7]"></span>
          </span>
          <p>Trusted by students, businesses & everyday people</p>
        </div>

        {/* Comment #12: Perfect line spacing, weights, and premium Instrument serif italic styles */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold text-gray-1000 tracking-tight leading-[1.1] mb-6">
          Hire smarter.{" "}
          <span className="font-instrument font-light italic text-gray-800">Work faster.</span>
          <br className="hidden md:block" />
          <span className="flex items-center justify-center gap-x-3 flex-wrap mt-1">
            Get{" "}
            <span className="relative inline-flex h-[1.1em] font-light font-instrument italic overflow-hidden justify-center min-w-40 sm:min-w-60">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={index}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute text-[#6B46C1] font-instrument font-light italic"
                >
                  {PROFESSIONS[index]}
                </motion.span>
              </AnimatePresence>
            </span>{" "}
            done
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed font-medium">
          TaskHub connects you to verified people for local services, digital
          gigs, campus jobs, and everyday tasks, faster, safer, stress-free.
        </p>

        {/* Comment #10: Reduced container gaps & updated clean interactive buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
          <Link href="/register?type=user" className="w-full sm:w-auto">
            <Button className="h-10 px-8 text-sm font-medium rounded-full bg-[#1F1F1F] hover:bg-[#6B46C1] text-white  w-32 transition-all duration-300 hover:scale-[1.01] gap-2 shadow-sm">
              Post a Task
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/register?type=tasker" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-11 px-6 text-sm font-semibold rounded-full border-gray-200 text-gray-700 hover:text-[#6B46C1] hover:border-[#6B46C1] hover:bg-purple-50/30 w-full transition-all duration-300 hover:scale-[1.01] shadow-sm"
            >
              Become a Tasker
            </Button>
          </Link>
        </div>

        {/* Comment #9: Cleaned up social proof with fixed Tailwind layout & metrics */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <div className="flex -space-x-2.5">
            <img
              src="/assets/person-1.png"
              alt="User 1"
              className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
            />
            <img
              src="/assets/person-2.png"
              alt="User 2"
              className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
            />
            <img
              src="/assets/person-3.png"
              alt="User 3"
              className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
            />
          </div>
          <div className="text-sm text-gray-600 font-medium flex items-center gap-1">
            <span className="text-gray-900 font-bold text-base">2,500+</span>
            <span>tasks completed</span>
          </div>
        </div>
      </motion.div>

      {/* Hero Showcase Media Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden relative shadow-xl border border-gray-100"
      >
        <img
          src="/assets/hero-video.gif"
          alt="People working and studying on campus"
          className="w-full h-auto object-cover max-h-125"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent pointer-events-none" />
      </motion.div>
    </section>
  );
}