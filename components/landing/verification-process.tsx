"use client";

import { motion } from "framer-motion";
import { Mail, Phone, CreditCard, Camera, Building2 } from "lucide-react";

const STEPS = [
  {
    title: "Email Verification",
    badge: "BASIC",
    badgeColor: "bg-purple-50 text-[#6C3BFF]",
    description: "Confirm your email address to get started.",
    icon: <Mail className="w-5 h-5 text-[#6C3BFF]" />
  },
  {
    title: "Phone Number Verification",
    badge: "BASIC",
    badgeColor: "bg-purple-50 text-[#6C3BFF]",
    description: "Verify your phone number for secure communication.",
    icon: <Phone className="w-5 h-5 text-[#6C3BFF]" />
  },
  {
    title: "Government ID",
    badge: "IDENTITY",
    badgeColor: "bg-orange-50 text-orange-500",
    description: "Upload a valid government-issued identification.",
    icon: <CreditCard className="w-5 h-5 text-[#6C3BFF]" />
  },
  {
    title: "Selfie Verification",
    badge: "IDENTITY",
    badgeColor: "bg-orange-50 text-orange-500",
    description: "Take a quick selfie to match your government ID.",
    icon: <Camera className="w-5 h-5 text-[#6C3BFF]" />
  },
  {
    title: "Business Verification",
    badge: "OPTIONAL",
    badgeColor: "bg-gray-100 text-gray-500",
    description: "Upload your CAC registration for enhanced trust.",
    icon: <Building2 className="w-5 h-5 text-gray-400" />
  }
];

export default function VerificationProcess() {
  return (
    <section className="py-24 overflow-hidden bg-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-[#673AB7] mb-6">
          VERIFICATION PROCESS
        </h2>
        <h3 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-[#111111] tracking-tight leading-[1.15]">
          <span className="text-[#673AB7] italic font-serif font-light">Build trust</span> with every verification<br className="hidden md:block"/> step.
        </h3>
      </div>

      <div className="relative max-w-2xl mx-auto pl-4 md:pl-8">
        {/* Vertical line */}
        <div className="absolute left-[39px] md:left-[59px] top-[40px] bottom-[40px] w-px bg-gray-200" />
        
        <div className="flex flex-col gap-10">
          {STEPS.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative flex items-start gap-6"
            >
              {/* Icon */}
              <div className="relative z-10 flex-shrink-0 w-14 h-14 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center">
                {step.icon}
              </div>

              {/* Content */}
              <div className="flex flex-col pt-2 md:pt-3">
                <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                  <h4 className="text-[16px] md:text-[18px] font-semibold text-[#111111]">
                    {step.title}
                  </h4>
                  <span className={`text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full ${step.badgeColor}`}>
                    {step.badge}
                  </span>
                </div>
                <p className="text-[14px] md:text-[15px] text-gray-500 font-medium">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
