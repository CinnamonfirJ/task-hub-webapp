"use client"

import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer } from "@/utils/landing-animations"
import WaitlistForm from "./WaitlistForm"

export default function FinalCTA() {
  return (
    <section id="final-cta" className="px-6 py-20 bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        {/* Badge */}
        <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-[12px] font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Be a part of something new
        </motion.span>

        {/* Heading */}
        <motion.h2 variants={fadeInUp} className="text-4xl md:text-[48px] font-bold mb-4 leading-tight">
          Everything You Need. One App.
        </motion.h2>

        {/* Subtitle */}
        <motion.p variants={fadeInUp} className="text-white/90 text-[16px] mb-8 max-w-2xl mx-auto">
          Join thousands of early adopters who are ready to transform how they get things done.
        </motion.p>

        {/* Email form */}
        <motion.div variants={fadeInUp} className="mb-4">
          <WaitlistForm variant="final-cta" />
        </motion.div>

        {/* Disclaimer */}
        <motion.p variants={fadeInUp} className="text-white/70 text-[12px]">
          No spam, ever. Unsubscribe anytime.
        </motion.p>
      </motion.div>
    </section>
  )
}
