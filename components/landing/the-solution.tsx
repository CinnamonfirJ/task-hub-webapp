"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, UserCheck, Briefcase, CheckCircle2, UserPlus, Search, Pickaxe, Banknote } from "lucide-react";

export default function TheSolution() {
  const [activeTab, setActiveTab] = useState<"poster" | "tasker">("poster");

  const posterSteps = [
    {
      number: "01",
      title: "Post your task",
      description: "Describe what you need, set your budget, and choose a category. Takes less than 2 minutes."
    },
    {
      number: "02",
      title: "Receive verified bids",
      description: "Only ID-verified taskers can bid. Browse ratings, reviews, and pricing side-by-side."
    },
    {
      number: "03",
      title: "Hire & track",
      description: "Pick your tasker, pay securely through escrow, and track progress in real-time."
    },
    {
      number: "04",
      title: "Confirm & release",
      description: "Once you're happy with the result, confirm completion and funds are released to the tasker."
    }
  ];

  const taskerSteps = [
    {
      number: "01",
      title: "Create a profile",
      description: "Sign up, verify your identity, and set up your profile with your skills and experience."
    },
    {
      number: "02",
      title: "Browse & bid",
      description: "Find tasks that match your skills. Submit competitive bids to win jobs."
    },
    {
      number: "03",
      title: "Do the work",
      description: "Complete the task and communicate with the poster. Build your reputation."
    },
    {
      number: "04",
      title: "Get paid",
      description: "Once approved, funds are released directly to your wallet securely and fast."
    }
  ];

  const currentSteps = activeTab === "poster" ? posterSteps : taskerSteps;

  return (
    <section className="py-24 px-4 md:px-8 max-w-6xl mx-auto bg-[#FAFAFA]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
          THE SOLUTION
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          One Platform.{" "}
          <span className="font-instrument font-light text-[#6B46C1]">Verified People.</span>
          <br />Real Work Done.
        </h2>
        <p className="text-gray-500 mt-4 text-sm md:text-base max-w-2xl mx-auto font-medium">
          Whether it's a campus errand or a home repair, finding someone you can actually trust feels impossible.
        </p>
        
        {/* Tabs */}
        <div className="mt-10 inline-flex items-center p-1 bg-white border border-gray-200 rounded-full shadow-sm">
          <button
            onClick={() => setActiveTab("poster")}
            className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all ${
              activeTab === "poster"
                ? "bg-[#0F172A] text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Poster
          </button>
          <button
            onClick={() => setActiveTab("tasker")}
            className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all ${
              activeTab === "tasker"
                ? "bg-[#0F172A] text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Tasker
          </button>
        </div>
      </motion.div>

      <div className="relative min-h-[250px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {currentSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-sm font-bold text-[#6B46C1] mb-6 block">{step.number}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}