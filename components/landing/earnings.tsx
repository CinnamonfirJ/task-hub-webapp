"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const JOB_VALUES = [10000, 20000, 50000, 100000];
const COMMISSION_RATE = 0.1; // 10%

export default function Earnings() {
  const [jobValue, setJobValue] = useState<number>(20000);

  const commission = jobValue * COMMISSION_RATE;
  const youReceive = jobValue - commission;

  return (
    <section className="py-24 overflow-hidden bg-white px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto" id="earnings">
      <div className="text-center mb-16">
        <h2 className="text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-[#673AB7] mb-6">
          PROVIDERS EARNING
        </h2>
        <h3 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-[#111111] tracking-tight leading-[1.15]">
          See what you could <span className="text-[#673AB7] italic font-serif font-light">Earn</span>
        </h3>
      </div>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#F9FAFB] rounded-[32px] overflow-hidden shadow-sm border border-gray-100"
        >
          {/* Top Section */}
          <div className="p-8 md:p-12 pb-8">
            <div className="mb-2">
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                JOB VALUE
              </span>
            </div>
            <div className="mb-8">
              <span className="text-4xl md:text-[56px] font-bold text-[#111111]">
                <span className="text-gray-400 font-normal mr-1">₦</span>
                {jobValue.toLocaleString()}
              </span>
            </div>

            {/* Pill Buttons */}
            <div className="flex flex-wrap gap-3">
              {JOB_VALUES.map((value) => (
                <button
                  key={value}
                  onClick={() => setJobValue(value)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${jobValue === value
                    ? "bg-[#673AB7] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  ₦{value.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="bg-purple-50 text-[#673AB7] rounded-full p-1 border border-purple-100">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Commission Section */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-[#111111] uppercase tracking-wider mb-1">
                  TASKHUB COMMISSION
                </span>
                <span className="text-[14px] text-gray-400 font-medium">
                  Founding Partner Rate (10%)
                </span>
              </div>
              <div className="text-xl md:text-2xl font-semibold text-red-500">
                -₦{commission.toLocaleString()}
              </div>
            </div>

            {/* Separator */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="bg-purple-50 text-[#673AB7] rounded-full p-1 border border-purple-100">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bg-[#111111] p-8 md:p-12 text-white">
            <div className="mb-2">
              <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                YOU RECEIVE
              </span>
            </div>
            <div>
              <span className="text-4xl md:text-[56px] font-bold">
                <span className="text-gray-400 font-serif italic mr-1">₦</span>
                {youReceive.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <p className="text-[#673AB7] font-semibold text-[15px] mb-1">
            You only pay when you earn.
          </p>
          <p className="text-gray-500 text-[14px]">
            No monthly fees. No subscription charges.
          </p>
        </div>
      </div>
    </section>
  );
}
