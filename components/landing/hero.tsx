"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Headlines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-medium text-gray-900 tracking-tight leading-[1.1] mb-6">
          Hire smarter.{" "}
          <span className="font-instrument font-light">Work faster.</span>
          <br className="hidden md:block" />
          <span className="flex items-center justify-center gap-3 flex-wrap mt-2">
            Get
            <div className="relative inline-flex h-[1.1em] font-light font-instrument overflow-hidden justify-center min-w-40 md:min-w-70">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute text-[#6B46C1] font-instrument"
                >
                  {PROFESSIONS[index]}
                </motion.span>
              </AnimatePresence>
            </div>
            done
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-center  text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          TaskHub connects you to verified people for local services, digital
          gigs, campus jobs, and everyday tasks, faster, safer, stress-free.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link href="/register?type=user">
            <Button className="h-14 px-8 text-lg font-bold rounded-full bg-[#6B46C1] hover:bg-[#553C9A] text-white w-full sm:w-auto transition-all hover:scale-[1.02]">
              Post a Task
            </Button>
          </Link>
          <Link href="/register?type=tasker">
            <Button
              variant="outline"
              className="h-14 px-8 text-lg font-bold rounded-full border-gray-200 text-gray-700 hover:bg-gray-50 w-full sm:w-auto transition-all hover:scale-[1.02]"
            >
              Become a Tasker
            </Button>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <div className="flex -space-x-3">
            <img
              src="/assets/person-1.png"
              alt="User 1"
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
            <img
              src="/assets/person-2.png"
              alt="User 2"
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
            <img
              src="/assets/person-3.png"
              alt="User 3"
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center text-white text-xs font-bold z-10">
              5k+
            </div>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex gap-1 text-yellow-400 text-sm">★★★★★</div>
            <p className="text-sm text-gray-600 font-medium">
              Join 10,000+ others already using TaskHub
            </p>
          </div>
        </div>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-6xl mx-auto rounded-2xl overflow-hidden  relative"
      >
        <img
          src="/assets/hero-video.gif"
          alt="People working and studying on campus"
          className="w-full h-auto object-cover max-h-150"
        />
        {/* //assets/hero-video.gif */}
        <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none" />
      </motion.div>
    </section>
  );
}
