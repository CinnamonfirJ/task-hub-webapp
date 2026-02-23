"use client";

import {
  ArrowRight,
  Briefcase,
  Users,
  CreditCard,
  Calendar,
  TrendingUp,
  Heart,
  Target,
  Megaphone,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  listContainer,
  scaleOnHover,
} from "@/utils/landing-animations";

export default function ProviderCTA() {
  return (
    <section className='px-6 py-20 max-w-7xl mx-auto bg-white'>
      {/* Header */}
      <motion.div
        variants={staggerContainer}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        className='text-center mb-12'
      >
        <motion.span
          variants={fadeInUp}
          className='inline-flex items-center gap-2 text-[#7C3AED] font-semibold text-[10px] mb-4 uppercase tracking-[0.2em]'
        >
          <Briefcase className='w-4 h-4' />
          Earn with us
        </motion.span>
        <motion.h2
          variants={fadeInUp}
          className='text-3xl md:text-[40px] font-bold text-[#1F2937] mb-4 leading-tight'
        >
          Turn your skills into Income
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className='text-[#6B7280] text-[16px] max-w-2xl mx-auto'
        >
          Whether you're a freelancer or run a business, join our growing
          community of service providers.
        </motion.p>
      </motion.div>

      {/* Two-card layout */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto'>
        {/* Purple Card - For Taskers & Freelancers */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          id='for-taskers'
          className='bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white rounded-[24px] p-8 md:p-10 scroll-mt-24'
        >
          <span className='inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-[12px] font-medium mb-6'>
            <Briefcase className='w-4 h-4' />
            For Taskers & Freelancers
          </span>

          <h3 className='text-[28px] md:text-[32px] font-bold mb-2 leading-tight'>
            Work on your own terms.
          </h3>
          <h3 className='text-[28px] md:text-[32px] font-bold mb-8 leading-tight'>
            Get paid for your skills.
          </h3>

          <motion.div
            variants={listContainer}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='space-y-5 mb-8'
          >
            <motion.div variants={fadeInUp} className='flex items-start gap-3'>
              <div className='w-10 h-10 bg-white/20 rounded-[12px] flex items-center justify-center shrink-0'>
                <CreditCard className='w-5 h-5 text-white' />
              </div>
              <div>
                <h4 className='text-[16px] font-bold mb-1'>Flexible Income</h4>
                <p className='text-white/80 text-[14px]'>
                  Set your own rates and work on your terms
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className='flex items-start gap-3'>
              <div className='w-10 h-10 bg-white/20 rounded-[12px] flex items-center justify-center shrink-0'>
                <Calendar className='w-5 h-5 text-white' />
              </div>
              <div>
                <h4 className='text-[16px] font-bold mb-1'>Choose Your Jobs</h4>
                <p className='text-white/80 text-[14px]'>
                  Bid only on tasks that interest you
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className='flex items-start gap-3'>
              <div className='w-10 h-10 bg-white/20 rounded-[12px] flex items-center justify-center shrink-0'>
                <TrendingUp className='w-5 h-5 text-white' />
              </div>
              <div>
                <h4 className='text-[16px] font-bold mb-1'>Build Reputation</h4>
                <p className='text-white/80 text-[14px]'>
                  Earn badges and climb the leaderboard
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className='flex items-start gap-3'>
              <div className='w-10 h-10 bg-white/20 rounded-[12px] flex items-center justify-center shrink-0'>
                <Heart className='w-5 h-5 text-white' />
              </div>
              <div>
                <h4 className='text-[16px] font-bold mb-1'>
                  Keep More Earnings
                </h4>
                <p className='text-white/80 text-[14px]'>
                  Low platform fees, more in your pocket
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.button
            variants={scaleOnHover}
            initial='initial'
            whileHover='hover'
            whileTap='tap'
            className='bg-white text-[#7C3AED] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 text-[14px]'
          >
            Join as a Tasker
            <ArrowRight className='w-4 h-4' />
          </motion.button>
        </motion.div>

        {/* Orange Card - For Businesses */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          id='for-business'
          className='bg-gradient-to-br from-[#F59E0B] to-[#F97316] text-white rounded-[24px] p-8 md:p-10 scroll-mt-24'
        >
          <span className='inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-[12px] font-medium mb-6'>
            <Users className='w-4 h-4' />
            For Businesses
          </span>

          <h3 className='text-[28px] md:text-[32px] font-bold mb-2 leading-tight'>
            Grow your customer base.
          </h3>
          <h3 className='text-[28px] md:text-[32px] font-bold mb-8 leading-tight'>
            Expand your reach.
          </h3>

          <motion.div
            variants={listContainer}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='space-y-5 mb-8'
          >
            <motion.div variants={fadeInUp} className='flex items-start gap-3'>
              <div className='w-10 h-10 bg-white/20 rounded-[12px] flex items-center justify-center shrink-0'>
                <Users className='w-5 h-5 text-white' />
              </div>
              <div>
                <h4 className='text-[16px] font-bold mb-1'>
                  Reach New Customers
                </h4>
                <p className='text-white/80 text-[14px]'>
                  Access thousands of potential clients
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className='flex items-start gap-3'>
              <div className='w-10 h-10 bg-white/20 rounded-[12px] flex items-center justify-center shrink-0'>
                <Target className='w-5 h-5 text-white' />
              </div>
              <div>
                <h4 className='text-[16px] font-bold mb-1'>Targeted Leads</h4>
                <p className='text-white/80 text-[14px]'>
                  Get matched with relevant service requests
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className='flex items-start gap-3'>
              <div className='w-10 h-10 bg-white/20 rounded-[12px] flex items-center justify-center shrink-0'>
                <Megaphone className='w-5 h-5 text-white' />
              </div>
              <div>
                <h4 className='text-[16px] font-bold mb-1'>
                  Market Your Services
                </h4>
                <p className='text-white/80 text-[14px]'>
                  Showcase your portfolio and reviews
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className='flex items-start gap-3'>
              <div className='w-10 h-10 bg-white/20 rounded-[12px] flex items-center justify-center shrink-0'>
                <BarChart3 className='w-5 h-5 text-white' />
              </div>
              <div>
                <h4 className='text-[16px] font-bold mb-1'>Grow Locally</h4>
                <p className='text-white/80 text-[14px]'>
                  Expand your presence in Alabama and beyond
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.button
            variants={scaleOnHover}
            initial='initial'
            whileHover='hover'
            whileTap='tap'
            className='bg-white text-[#F59E0B] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 text-[14px]'
          >
            List Your Business
            <ArrowRight className='w-4 h-4' />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
