"use client";

import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/utils/landing-animations";

export default function SafetySection() {
  return (
    <section className='px-6 py-20 bg-linear-to-br from-[#7C3AED] to-[#6D28D9] text-white'>
      <motion.div
        variants={staggerContainer}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        className='max-w-7xl mx-auto'
      >
        {/* Header */}
        <div className='text-center mb-12'>
          <motion.span
            variants={fadeInUp}
            className='inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-[12px] font-medium mb-6'
          >
            <Shield className='w-4 h-4' />
            Trust & Safety First
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className='text-3xl md:text-[40px] font-bold mb-4 leading-tight'
          >
            Your safety is our priority
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className='text-white/90 text-[16px] max-w-2xl mx-auto'
          >
            We've built multiple layers of protection so you can focus on
            getting things done — worry-free.
          </motion.p>
        </div>

        {/* Custom 3-column layout */}
        <motion.div
          variants={staggerContainer}
          whileInView='visible'
          initial='hidden'
          viewport={{ once: true }}
          className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto'
        >
          {/* Left Column - Verified Profiles */}
          <motion.div
            variants={fadeInUp}
            className='bg-white text-gray-900 rounded-[24px] overflow-hidden shadow-lg flex flex-col'
          >
            <div className='p-8 grow'>
              <h3 className='text-[20px] font-bold mb-3 text-[#1F2937]'>
                Verified Profiles
              </h3>
              <p className='text-[#6B7280] text-[14px] leading-relaxed'>
                Every tasker and business undergoes ID verification and
                background screening before joining.
              </p>
            </div>
            <div className='w-full h-[240px]'>
              <img
                src='/assets/verified-professional-headshot.png'
                alt='Verified Professional'
                className='w-full h-full object-cover'
              />
            </div>
          </motion.div>

          {/* Middle Column - Rating and Reviews + Real-Time Updates */}
          <div className='flex flex-col h-full gap-6'>
            {/* Rating and Reviews */}
            <motion.div
              variants={fadeInUp}
              className='bg-white flex flex-col justify-center items-center h-full text-gray-900 rounded-[24px] p-8 shadow-lg'
            >
              <h3 className='text-[20px] font-bold mb-3 text-[#1F2937]'>
                Rating and Reviews
              </h3>
              <p className='text-[#6B7280] text-center text-[14px] leading-relaxed'>
                Honest feedback from real customers helps you choose the best
                service providers.
              </p>
            </motion.div>

            {/* Real-Time Updates */}
            <motion.div
              variants={fadeInUp}
              className='bg-white flex flex-col justify-center items-center h-full text-gray-900 rounded-[24px] p-8 shadow-lg'
            >
              <h3 className='text-[20px]  font-bold mb-3 text-[#1F2937]'>
                Real-Time Updates
              </h3>
              <p className='text-[#6B7280] text-center text-[14px] leading-relaxed'>
                Track your task status, receive notifications, and stay
                connected throughout.
              </p>
            </motion.div>
          </div>

          {/* Right Column - Secure Payments */}
          <motion.div
            variants={fadeInUp}
            className='bg-white text-gray-900 rounded-[24px] overflow-hidden shadow-lg flex flex-col'
          >
            <div className='p-8 grow'>
              <h3 className='text-[20px] font-bold mb-3 text-[#1F2937]'>
                Secure Payments
              </h3>
              <p className='text-[#6B7280] text-[14px] leading-relaxed'>
                Your money is protected until the job is done. Pay through our
                encrypted platform.
              </p>
            </div>
            <div className='w-full h-[240px]'>
              <img
                src='/assets/secure-payment-checkout.png'
                alt='Secure Payment'
                className='w-full h-full object-cover'
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
