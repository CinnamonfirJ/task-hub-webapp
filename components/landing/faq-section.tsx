"use client";

import { motion } from "framer-motion";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { TOP_FAQS } from "@/lib/faq-data";
import { fadeInUp, staggerContainer } from "@/utils/landing-animations";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function FAQSection() {
  return (
    <section id="faq" className="px-6 py-24 max-w-7xl mx-auto overflow-hidden">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-16"
      >
        {/* Left Side: Header */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div variants={fadeInUp} className="space-y-4">
            <span className="inline-block text-[#8B5CF6] font-semibold text-xs uppercase tracking-[0.2em]">
              Common Questions
            </span>
            <h2 className="text-4xl md:text-[48px] font-bold text-[#1F2937] leading-tight tracking-tight">
              Got <span className="text-[#8B5CF6]">Questions?</span><br />
              We&apos;ve got answers.
            </h2>
          </motion.div>
          
          <motion.p 
            variants={fadeInUp}
            className="text-[#64748B] text-lg font-medium leading-relaxed max-w-md"
          >
            Everything you need to know about TaskHub. Can&apos;t find what you&apos;re looking for? Reach out to our support team.
          </motion.p>

          <motion.div variants={fadeInUp} className="pt-4">
            <Link 
              href="/profile/faq" 
              className="inline-flex items-center gap-2 bg-[#6B46C1] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#553C9A] transition-all shadow-lg shadow-purple-100 group"
            >
              View All FAQs
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Accordion */}
        <motion.div variants={fadeInUp} className="lg:col-span-7">
          <FAQAccordion items={TOP_FAQS} />
        </motion.div>
      </motion.div>
    </section>
  );
}
