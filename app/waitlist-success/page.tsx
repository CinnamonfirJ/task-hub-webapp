"use client"

import React, { useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { CheckCircle2, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { fadeInUp, staggerContainer, scaleOnHover } from "@/utils/landing-animations"

export default function WaitlistSuccess() {
  useEffect(() => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-20 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          variants={fadeInUp}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-10 relative"
        >
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </motion.div>

        {/* Badge */}
        <motion.span
          variants={fadeInUp}
          className="inline-flex items-center gap-2 bg-[#F3E8FF] text-[#7C3AED] px-4 py-2 rounded-full text-[12px] font-semibold mb-8"
        >
          <Sparkles className="w-4 h-4 fill-[#7C3AED]" />
          You&apos;re in!
        </motion.span>

        {/* Heading */}
        <motion.h1
          variants={fadeInUp}
          className="text-4xl md:text-[52px] font-bold text-[#1F2937] mb-6 leading-tight tracking-tight"
        >
          Welcome to the <br />
          <span className="text-[#7C3AED]">TaskHub Waitlist</span>.
        </motion.h1>

        {/* Content */}
        <motion.p
          variants={fadeInUp}
          className="text-[#6B7280] text-[18px] mb-12 leading-relaxed max-w-lg mx-auto"
        >
          Thank you for joining! You&apos;re now on the priority list for early access. 
          We&apos;ll notify you as soon as we launch in Nigeria.
        </motion.p>

        {/* Actions */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <motion.button
              variants={scaleOnHover}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="px-8 py-4 rounded-full border border-gray-200 bg-white text-[#374151] font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-[15px] shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </motion.button>
          </Link>
          <motion.button
            variants={scaleOnHover}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="bg-[#7C3AED] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#6D28D9] transition-colors flex items-center justify-center gap-2 text-[15px] shadow-lg shadow-purple-200"
            onClick={() => {
              confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
              })
            }}
          >
            Celebrate again
            <Sparkles className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    </main>
  )
}
