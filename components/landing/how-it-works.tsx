"use client";

import { motion } from "framer-motion";
import { UserPlus, ShieldCheck, BellRing, CalendarCheck, Wrench, Wallet } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up for free and set up your professional profile with your services and experience.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop",
    icon: <UserPlus className="w-4 h-4" />
  },
  {
    number: "02",
    title: "Complete Verification",
    description: "Verify your identity and credentials to build trust with potential customers.",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop",
    icon: <ShieldCheck className="w-4 h-4" />
  },
  {
    number: "03",
    title: "Receive Customer Requests",
    description: "Get notified when customers in your area are looking for your services.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
    icon: <BellRing className="w-4 h-4" />
  },
  {
    number: "04",
    title: "Accept Jobs You Want",
    description: "Review job details and accept only the jobs that fit your schedule and preferences.",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop",
    icon: <CalendarCheck className="w-4 h-4" />
  },
  {
    number: "05",
    title: "Complete the Work",
    description: "Deliver excellent service and get your work confirmed by the customer.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
    icon: <Wrench className="w-4 h-4" />
  },
  {
    number: "06",
    title: "Get Paid",
    description: "Receive your payment securely according to TaskHub's payout schedule.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600&auto=format&fit=crop",
    icon: <Wallet className="w-4 h-4" />
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 overflow-hidden bg-white px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto" id="how-it-works">
      <div className="text-center mb-16">
        <h2 className="text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-[#673AB7] mb-6">
          HOW TASKHUB WORKS
        </h2>
        <h3 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-[#111111] tracking-tight leading-[1.15]">
          Start earning in <span className="text-[#673AB7] italic font-serif font-light">Six simple steps.</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {STEPS.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex flex-col group"
          >
            {/* Image Container */}
            <div className="relative h-[240px] md:h-[220px] rounded-2xl overflow-hidden mb-6">
              <img
                src={step.image}
                alt={step.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute top-4 right-5">
                <span className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md">
                  {step.number}
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-50 text-[#673AB7] p-2 rounded-lg">
                  {step.icon}
                </div>
                <h4 className="text-[17px] font-semibold text-[#111111]">
                  {step.title}
                </h4>
              </div>
              <p className="text-[14px] text-gray-500 leading-relaxed font-normal">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
