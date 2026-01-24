"use client"

import { Sparkles, ArrowRight, CheckCircle2, Star, MapPin, Apple } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, slideInRight, scaleOnHover } from "@/utils/landing-animations"
import WaitlistForm from "./WaitlistForm"

export default function Hero() {
  return (
    <section className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto overflow-hidden">
      {/* Subtle purple glow/gradient at bottom left */}
      <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-purple-50 via-purple-25 to-transparent opacity-60 -z-10 pointer-events-none blur-3xl" />
      
      <div className="relative grid md:grid-cols-2 gap-16 items-center">
        {/* Left Column - Content */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-xl"
        >
          {/* Badge */}
          <motion.span 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 bg-[#F3E8FF] text-[#7C3AED] px-4 py-2 rounded-full text-[12px] font-semibold mb-8"
          >
            <Sparkles className="w-4 h-4 fill-[#7C3AED]" />
            Launching in Nigeria
          </motion.span>

          {/* Heading */}
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl md:text-[52px] font-bold text-[#1F2937] mb-6 leading-[1.15] tracking-tight"
          >
            Get Trusted Services Done — <span className="text-[#7C3AED]">Fast,</span>
            <br />
            <span className="text-[#7C3AED]">Affordable</span> & Reliable.
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={fadeInUp}
            className="text-[#6B7280] text-[17px] mb-10 leading-relaxed"
          >
            Find verified taskers and businesses for cleaning, moving, events, repairs, and more — all in one app.
          </motion.p>

          {/* Email form */}
          <motion.div 
            variants={fadeInUp}
            className="mb-6"
          >
            <WaitlistForm variant="hero" />
          </motion.div>

          {/* "Want to earn?" link */}
          <motion.p 
            variants={fadeInUp}
            className="text-[15px] text-[#374151] mb-10"
          >
            Want to earn? <a href="#" className="text-[#7C3AED] hover:underline font-medium">Become a Tasker</a>
          </motion.p>

          {/* App store buttons - replaced with Coming Soon */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap gap-4 mb-12"
          >
            <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl shadow-sm">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  <img src="/assets/apple-app-store-icon.svg" alt="Apple" className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  <img src="/assets/google-play-store-icon.svg" alt="Google Play" className="w-4 h-4" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider leading-none mb-1">Coming Soon</span>
                <span className="text-[13px] text-gray-500 font-medium leading-none">on App Store & Play Store</span>
              </div>
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap gap-x-8 gap-y-4 text-[15px] text-[#4B5563]"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#EF4444]" strokeWidth={2.5} />
              <span className="font-medium">Verified Taskers</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Star className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" strokeWidth={2.5} />
              <span className="font-medium">Rated and Reviewed</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-[#7C3AED]" strokeWidth={2.5} />
              <span className="font-medium">Local Expert</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Image */}
        <div className="hidden md:block relative h-full">
          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative h-full min-h-[650px] rounded-3xl rounded-tr-[80px] rounded-bl-[80px] overflow-hidden shadow-2xl"
          >
            <img
              src="/assets/professional-plumber-working.png"
              alt="Professional working at kitchen sink"
              className="w-full h-full object-cover object-center"
            />
            {/* Optional overlay for better image contrast */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
