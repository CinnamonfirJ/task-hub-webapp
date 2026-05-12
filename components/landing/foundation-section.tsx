"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Shield,
  Lock,
  Star,
  HeadphonesIcon,
  Award,
  Wallet,
  Play,
  ThumbsUp,
  Banknote,
} from "lucide-react";

export default function FoundationSection() {
  const features = [
    {
      title: "ID Verification",
      description:
        "Every tasker is identity-verified before they can accept any jobs on the platform.",
      icon: <BadgeCheck className="w-5 h-5 text-[#9F7AEA]" />,
    },
    {
      title: "Secure Payments",
      description:
        "All transactions are encrypted and processed through our secure payment gateway.",
      icon: <Shield className="w-5 h-5 text-[#9F7AEA]" />,
    },
    {
      title: "Escrow Protection",
      description:
        "Funds are held safely in escrow until the job is completed to your satisfaction.",
      icon: <Lock className="w-5 h-5 text-[#9F7AEA]" />,
    },
    {
      title: "Verified Reviews",
      description:
        "Only completed jobs generate reviews. Read honest feedback from real customers.",
      icon: <Star className="w-5 h-5 text-[#9F7AEA]" />,
    },
    {
      title: "24/7 Support",
      description:
        "Our dedicated support team is always available to resolve any issues you face.",
      icon: <HeadphonesIcon className="w-5 h-5 text-[#9F7AEA]" />,
    },
    {
      title: "Task Guarantee",
      description:
        "If a job isn't done right, we step in to make it right. Every single time.",
      icon: <Award className="w-5 h-5 text-[#9F7AEA]" />,
    },
  ];

  const safeSteps = [
    {
      label: "You pay",
      description:
        "Agree on a price and deposit funds securely into escrow. No risk to you.",
      icon: <Wallet className="w-4 h-4 text-[#9F7AEA]" />,
    },
    {
      label: "Work begins",
      description:
        "The tasker starts and you can track progress. Funds remain safely locked.",
      icon: <Play className="w-4 h-4 text-[#9F7AEA]" />,
    },
    {
      label: "You confirm",
      description:
        "Review the completed work and approve it when you're fully satisfied.",
      icon: <ThumbsUp className="w-4 h-4 text-[#9F7AEA]" />,
    },
    {
      label: "Tasker paid",
      description:
        "Only after your approval are funds released to the tasker. Simple and safe.",
      icon: <Banknote className="w-4 h-4 text-[#9F7AEA]" />,
    },
  ];

  return (
    <section className="py-24 bg-[#0B0914] text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium text-[#5E35B1] uppercase tracking-widest mb-4">
            Safety first
          </p>
          <h2 className="text-4xl md:text-5xl font-medium leading-tight">
            One Platform.{" "}
            <span className="font-instrument font-light text-[#9F7AEA]">
              Foundation.
            </span>
          </h2>
          <p className="text-gray-400 mt-4 text-lg font-medium max-w-2xl mx-auto">
            Every layer of TaskHub is architected to protect your money, time,
            and peace of mind.
          </p>
        </motion.div>

        {/* 6 Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#13111C] border border-[#2D2A3B] p-6 rounded-sm hover:border-[#4B485A] transition-colors group"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform origin-left">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 font-medium text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* How money stays safe — 4 steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#13111C] border border-[#2D2A3B] rounded-sm p-8"
        >
          <div className="mb-8">
            <h3 className="text-[#9F7AEA] font-bold text-xs uppercase tracking-widest mb-2">
              SAFE PAYMENTS
            </h3>
            <h4 className="text-2xl font-bold">How your money stays safe</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-5 left-[8%] right-[8%] h-[1px] border-t border-dashed border-[#2D2A3B] z-0" />

            {safeSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 rounded-full bg-[#1A1825] border-2 border-[#2D2A3B] flex items-center justify-center mb-4 text-xs font-bold text-[#9F7AEA]">
                  0{idx + 1}
                </div>
                <h5 className="font-bold mb-2">{step.label}</h5>
                <p className="text-gray-400 text-sm font-medium">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
