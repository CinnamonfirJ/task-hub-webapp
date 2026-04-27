"use client";

import { Award } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/utils/landing-animations";

export default function RewardsSection() {
  return (
    <section className='relative px-6 py-20 max-w-7xl mx-auto overflow-hidden'>
      {/* Background gradient */}
      <div className='absolute inset-0 bg-linear-to-b from-white via-white to-purple-50/30 pointer-events-none' />

      <motion.div
        variants={staggerContainer}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        className='relative z-10'
      >
        {/* Header */}
        <div className='text-center mb-16'>
          <motion.span
            variants={fadeInUp}
            className='inline-flex items-center gap-2 bg-[#F3E8FF] text-[#7C3AED] px-4 py-2 rounded-full text-[12px] font-semibold uppercase tracking-wider mb-6'
          >
            <Award className='w-4 h-4' />
            Rewards and Recognition
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className='text-3xl md:text-[40px] font-bold text-[#1F2937] mb-4 leading-tight'
          >
            The more you use,{" "}
            <span className='text-transparent bg-clip-text bg-linear-to-r from-[#7C3AED] to-[#6D28D9]'>
              the more you earn
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className='text-[#6B7280] text-[16px] max-w-2xl mx-auto leading-relaxed'
          >
            Our gamified experience keeps you engaged and rewarded whether
            you're hiring or working.
          </motion.p>
        </div>

        {/* 3-column layout */}
        <motion.div
          variants={staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'
        >
          {/* Left Column - Earn points */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -10 }}
            className='bg-[#F9FAFB] rounded-[24px] p-8 flex flex-col h-full hover:shadow-lg transition-all duration-300'
          >
            <p className='text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-3'>
              Rewards
            </p>
            <h3 className='text-[20px] font-bold text-[#1F2937] mb-3 leading-snug'>
              Earn points with every booking
            </h3>
            <p className='text-[#6B7280] text-[14px] leading-relaxed mb-6'>
              Each completed task gets you closer to discounts and exclusive
              perks. The more you use Generic Service Edge, the more you save.
            </p>
            <div className='mt-auto -mx-8 -mb-8'>
              <img
                src='/assets/customer-rating-review.png'
                alt='Person earning rewards'
                className='w-full rounded-b-[24px] object-cover h-48 sm:h-56 md:h-64'
              />
            </div>
          </motion.div>

          {/* Center Column - Achievement badges */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -10 }}
            className='bg-[#F9FAFB] rounded-[24px] p-0 flex flex-col h-full hover:shadow-lg transition-all duration-300 overflow-hidden'
          >
            <div className='h-56 md:h-64'>
              <img
                src='/assets/celebration.png'
                alt='Achievement celebration'
                className='w-full h-full object-cover'
              />
            </div>
            <div className='p-8 flex flex-col grow'>
              <p className='text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-3'>
                Earned badges
              </p>
              <h3 className='text-[20px] font-bold text-[#1F2937] mb-3 leading-snug'>
                Stand out with achievement badges
              </h3>
              <p className='text-[#6B7280] text-[14px] leading-relaxed'>
                Top taskers and repeat customers unlock special badges that
                build credibility. Your reputation becomes your currency.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Repeated incentives */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -10 }}
            className='bg-[#F9FAFB] rounded-[24px] p-8 flex flex-col h-full hover:shadow-lg transition-all duration-300'
          >
            <p className='text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-3'>
              Repeated incentives
            </p>
            <h3 className='text-[20px] font-bold text-[#1F2937] mb-3 leading-snug'>
              Get rewarded for coming back
            </h3>
            <p className='text-[#6B7280] text-[14px] leading-relaxed mb-6'>
              Book with the same tasker or business and unlock special bonuses.
              Loyalty pays off in real ways.
            </p>
            <div className='mt-auto -mx-8 -mb-8'>
              <img
                src='/assets/professional-service-in-progress.png'
                alt='Loyal customer'
                className='w-full rounded-b-[24px] object-cover h-48 sm:h-56 md:h-64'
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
