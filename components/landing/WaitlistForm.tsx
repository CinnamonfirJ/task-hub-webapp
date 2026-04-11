"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { scaleOnHover } from "@/utils/landing-animations";

interface WaitlistFormProps {
  variant?: "hero" | "final-cta";
  placeholder?: string;
  buttonText?: string;
}

export default function WaitlistForm({
  variant = "hero",
  buttonText = "Sign up now",
}: WaitlistFormProps) {
  const isHero = variant === "hero";

  return (
    <div className={`w-full flex ${isHero ? "mb-6" : "mb-4 max-w-xl mx-auto justify-center"}`}>
      <Link href="/register" className="w-full sm:w-auto">
        <motion.button
          variants={scaleOnHover}
          initial='initial'
          whileHover='hover'
          whileTap='tap'
          className={`px-8 py-4 rounded-full font-semibold transition-colors whitespace-nowrap flex items-center justify-center gap-2 text-[15px] shadow-lg w-full ${
            isHero
              ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-purple-200 px-12"
              : "bg-[#1F2937] text-white hover:bg-[#111827] px-12"
          }`}
        >
          {buttonText}
          <ArrowRight className={isHero ? "w-5 h-5" : "w-4 h-4"} />
        </motion.button>
      </Link>
    </div>
  );
}
