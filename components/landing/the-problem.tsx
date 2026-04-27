"use client"

import {
  FragmentedPlatformsIcon,
  OverpricedServicesIcon,
  TrustSafetyIcon,
  SlowResponseIcon,
} from "./problem-icons";
import BeforeAfterComparison from "./before-after";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/utils/landing-animations";

export default function TheProblem() {
  return (
    <section className="px-6 py-20 max-w-7xl mx-auto">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-16 px-4"
      >
        <motion.span variants={fadeInUp} className="inline-block text-[#8B5CF6] font-semibold text-xs mb-4 uppercase tracking-[0.2em]">
          THE PROBLEM
        </motion.span>
        <motion.h2 variants={fadeInUp} className="text-3xl md:text-[48px] font-semibold text-[#1F2937] mb-6 leading-tight tracking-tight">
          Finding Reliable help shouldn't <span className="text-[#F43F5E]">be this Hard</span>
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-[#4B5563] text-lg md:text-[18px] max-w-[720px] mx-auto font-medium leading-relaxed">
          We've all been there endless searching, confusing quotes, and hoping the person 
          who shows up is actually qualified.
        </motion.p>
      </motion.div>

      {/* Problem cards grid */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20 px-4"
      >
        {[
          {
            title: "Fragmented Platforms",
            description:
              "Jumping between apps to find the right service is exhausting.",
            bg: "bg-[#EEF2FF]",
            iconBg: "bg-[#F43F5E]",
            Icon: FragmentedPlatformsIcon,
          },
          {
            title: "Overpriced Services",
            description: "Hidden fees and middlemen inflate costs unfairly.",
            bg: "bg-[#FFF7ED]",
            iconBg: "bg-[#F59E0B]",
            Icon: OverpricedServicesIcon,
          },
          {
            title: "Trust and Safety Gaps",
            description:
              "No way to verify who you're hiring or their track record.",
            bg: "bg-[#EEF2FF]",
            iconBg: "bg-[#F43F5E]",
            Icon: TrustSafetyIcon,
          },
          {
            title: "Slow Response Times",
            description: "Waiting days for quotes when you need help now.",
            bg: "bg-[#FFF7ED]",
            iconBg: "bg-[#64748B]",
            Icon: SlowResponseIcon,
          },
        ].map((problem, idx) => {
          const { Icon } = problem;
          return (
            <motion.div
              variants={fadeInUp}
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${problem.bg} rounded-[24px] p-8 transition-transform cursor-default`}
            >
              <div
                className={`w-12 h-12 ${problem.iconBg} rounded-[12px] flex items-center justify-center mb-8 shadow-sm`}
              >
                <Icon />
              </div>
              <h3 className="text-[18px] font-bold text-[#1F2937] mb-3">
                {problem.title}
              </h3>
              <p className="text-[#4B5563] text-[14px] leading-relaxed font-medium">
                {problem.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Before/After section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <BeforeAfterComparison />
      </motion.div>
    </section>
  )
}
