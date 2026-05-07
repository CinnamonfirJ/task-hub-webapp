"use client";

import { motion } from "framer-motion";
import { Sparkles, PenTool, Wrench, Paintbrush, Camera, Truck, BookOpen, Scissors, Code } from "lucide-react";

const CATEGORIES = [
  { name: "Plumbing", icon: <Wrench className="w-4 h-4" /> },
  { name: "Electrical", icon: <Sparkles className="w-4 h-4" /> },
  { name: "Cleaning", icon: <Paintbrush className="w-4 h-4" /> },
  { name: "Moving", icon: <Truck className="w-4 h-4" /> },
  { name: "Photography", icon: <Camera className="w-4 h-4" /> },
  { name: "Tutoring", icon: <BookOpen className="w-4 h-4" /> },
  { name: "Hair Styling", icon: <Scissors className="w-4 h-4" /> },
  { name: "Tech Support", icon: <Code className="w-4 h-4" /> },
  { name: "Errands", icon: <Truck className="w-4 h-4" /> },
  { name: "Handyman", icon: <PenTool className="w-4 h-4" /> },
];

export default function ServicesMarquee() {
  return (
    <section className="py-20 overflow-hidden bg-white">
      <div className="text-center mb-10 px-4">
        <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-2">
          For everyone who tasks
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
          Every task, <span className="font-instrument font-light text-[#6B46C1]">One Platform.</span>
        </h3>
        <p className="text-gray-500 mt-3 font-medium">
          From campus errands to home repairs to digital gigs — TaskHub covers it all.
        </p>
      </div>

      <div className="relative w-full flex flex-col gap-4 overflow-x-hidden pt-4 pb-8">
        {/* Left Gradient Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />

        {/* Top Row: Moves Right to Left */}
        <motion.div
          className="flex gap-4 px-4 shrink-0 w-max"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            ease: "linear",
            duration: 20,
            repeat: Infinity,
          }}
        >
          {[...CATEGORIES, ...CATEGORIES, ...CATEGORIES].map((category, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-6 py-3 shrink-0 hover:border-purple-200 hover:bg-purple-50 transition-colors cursor-pointer shadow-sm"
            >
              <div className="text-[#6B46C1]">{category.icon}</div>
              <span className="font-bold text-gray-700">{category.name}</span>
            </div>
          ))}
        </motion.div>

        {/* Bottom Row: Moves Left to Right */}
        <motion.div
          className="flex gap-4 px-4 shrink-0 w-max"
          animate={{ x: ["-33.33%", "0%"] }}
          transition={{
            ease: "linear",
            duration: 20,
            repeat: Infinity,
          }}
        >
          {/* Reverse categories for variety or just duplicate */}
          {[...CATEGORIES].reverse().concat([...CATEGORIES].reverse()).concat([...CATEGORIES].reverse()).map((category, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-6 py-3 shrink-0 hover:border-purple-200 hover:bg-purple-50 transition-colors cursor-pointer shadow-sm"
            >
              <div className="text-[#6B46C1]">{category.icon}</div>
              <span className="font-bold text-gray-700">{category.name}</span>
            </div>
          ))}
        </motion.div>

        {/* Right Gradient Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
