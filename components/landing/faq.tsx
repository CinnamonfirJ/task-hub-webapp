"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, Mail } from "lucide-react";

const FAQS = [
  {
    question: "Is it free to join?",
    answer: "Yes, joining TaskHub is completely free. We only charge a commission on the jobs you successfully complete."
  },
  {
    question: "How much commission does TaskHub charge?",
    answer: "Our standard commission rate is 15%. However, founding partners enjoy a reduced lifetime commission rate of 10%."
  },
  {
    question: "How do payments work?",
    answer: "Customers pay into our secure escrow system before you start. Once the job is confirmed complete, the funds are released directly to your wallet."
  },
  {
    question: "Can I reject jobs?",
    answer: "Absolutely. You have full control over your schedule and can accept or reject jobs based on your availability and preferences."
  },
  {
    question: "Do I need a registered business?",
    answer: "No, you can join as an independent professional. Business registration is optional but can help build additional trust with customers."
  },
  {
    question: "How are disputes handled?",
    answer: "We have a dedicated support team that steps in to mediate and resolve any disagreements fairly, ensuring both parties are protected."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 md:px-8 max-w-4xl mx-auto" id="faq">
      <div className="text-center mb-16">
        <h2 className="text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-6">
          FAQ
        </h2>
        <h3 className="text-4xl md:text-5xl lg:text-[56px] font-light text-[#673AB7] italic font-serif  tracking-tight leading-[1.15]">
          Frequently asked questions.
        </h3>
      </div>

      <div className="flex flex-col gap-4 mb-32">
        {FAQS.map((faq, index) => (
          <div key={index} className="border-b border-gray-100 pb-2">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex items-center justify-between w-full text-left py-4 outline-none"
            >
              <span className="text-[16px] md:text-[18px] font-medium text-[#111111]">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-500 pb-6 pr-8 text-[15px] leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Support Section */}
      <div className="text-center mb-12">
        <h2 className="text-[11px] md:text-xs font-light tracking-[0.2em] uppercase text-[#673AB7] mb-4">
          PARTNERSHIP SUPPORT
        </h2>
        <h3 className="text-3xl md:text-5xl font-semibold text-[#111111] tracking-tight">
          Need Help Joining?
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* WhatsApp Card */}
        <div className="bg-[#F9FAFB] rounded-3xl p-8 md:p-10 flex flex-col items-start">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <MessageCircle className="w-7 h-7 text-green-600" />
          </div>
          <h4 className="text-[20px] font-bold text-[#111111] mb-2">WhatsApp</h4>
          <p className="text-gray-500 text-[15px] mb-8 font-medium">Chat with our partnerships team</p>
          <a href="https://wa.me/2347075979682" className="text-[#673AB7] font-semibold text-[16px] hover:underline">
            +2347075979682
          </a>
        </div>

        {/* Email Card */}
        <div className="bg-[#F9FAFB] rounded-3xl p-8 md:p-10 flex flex-col items-start">
          <div className="bg-purple-100 p-4 rounded-full mb-6">
            <Mail className="w-7 h-7 text-[#673AB7]" />
          </div>
          <h4 className="text-[20px] font-bold text-[#111111] mb-2">Email</h4>
          <p className="text-gray-500 text-[15px] mb-8 font-medium">Send us a message anytime</p>
          <a href="mailto:partnership@ngtaskhub.com" className="text-[#673AB7] font-semibold text-[16px] hover:underline">
            Partnership@ngtaskhub.com
          </a>
        </div>
      </div>
    </section>
  );
}
