"use client";

import { motion } from "framer-motion";
import { Users, Clock, Banknote, UserCheck, Shield, BadgeCheck } from "lucide-react";

export default function Benefits() {
  return (
    <section className="py-24 overflow-hidden bg-white px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto" id="why-join">
      <div className="text-center mb-16">
        <h2 className="text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-[#555555] mb-6">
          WHY JOIN TASKHUB
        </h2>
        <h3 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-[#111111] tracking-tight leading-[1.15]">
          Everything you need to <span className="text-[#673AB7] italic font-serif font-light">Grow</span><br />
          <span className="text-[#673AB7] italic font-serif font-light">Your Business</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1: Image Cards */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative h-[300px] rounded-3xl overflow-hidden group shadow-sm flex flex-col justify-end p-8"
          >
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop"
              alt="More Customers"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-semibold text-white mb-2">More Customers</h4>
              <p className="text-white/80 text-[15px] leading-relaxed">
                Receive requests from customers actively looking for services in your area.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative h-[300px] rounded-3xl overflow-hidden group shadow-sm flex flex-col justify-end p-8"
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
              alt="Flexible Work"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-semibold text-white mb-2">Flexible Work</h4>
              <p className="text-white/80 text-[15px] leading-relaxed">
                Accept jobs that fit your schedule and availability. You're in full control of your workload.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Column 2: Solid Cards */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#FAFAFA] rounded-3xl p-10 h-[300px] flex flex-col justify-center"
          >
            <Banknote className="w-8 h-8 text-[#111111] mb-6" />
            <h4 className="text-2xl font-semibold text-[#111111] mb-3">No Upfront Fees</h4>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Join for free and only pay a commission when you successfully complete a job.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-[#FAFAFA] rounded-3xl p-10 h-[300px] flex flex-col justify-center"
          >
            <UserCheck className="w-8 h-8 text-[#111111] mb-6" />
            <h4 className="text-2xl font-semibold text-[#111111] mb-3">Verified Customers</h4>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Every customer is verified, creating a safer working environment for providers.
            </p>
          </motion.div>
        </div>

        {/* Column 3: Solid Cards */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-[#FAFAFA] rounded-3xl p-10 h-[300px] flex flex-col justify-center"
          >
            <Shield className="w-8 h-8 text-[#111111] mb-6" fill="currentColor" />
            <h4 className="text-2xl font-semibold text-[#111111] mb-3">Secure Payments</h4>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Customers pay before work begins. We hold payment securely until work is confirmed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-[#FAFAFA] rounded-3xl p-10 h-[300px] flex flex-col justify-center"
          >
            <BadgeCheck className="w-8 h-8 text-[#111111] mb-6" fill="currentColor" />
            <h4 className="text-2xl font-semibold text-[#111111] mb-3">Build Reputation</h4>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Earn reviews from satisfied customers and grow your professional profile.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
