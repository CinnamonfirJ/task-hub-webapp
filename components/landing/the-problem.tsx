"use client";

import { motion } from "framer-motion";
import { Users, ShieldOff, Clock, AlertTriangle, EyeOff, Frown } from "lucide-react";

export default function TheProblem() {
  const problems = [
    {
      number: "01",
      title: "Unreliable People",
      description: "Service providers showing up late, or not at all. No accountability or verified track record.",
      icon: <Users className="w-5 h-5 text-red-400" />
    },
    {
      number: "02",
      title: "Zero Verification",
      description: "No way to confirm if the person you hired is who they say they are. Trust feels impossible.",
      icon: <ShieldOff className="w-5 h-5 text-red-400" />
    },
    {
      number: "03",
      title: "Endless Delays",
      description: "Taskers miss deadlines, leave work unfinished, and you're left waiting with no recourse.",
      icon: <Clock className="w-5 h-5 text-red-400" />
    },
    {
      number: "04",
      title: "Scams & Fraud",
      description: "Fake profiles, ghost contractors, and your money disappears with no one held accountable.",
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />
    },
    {
      number: "05",
      title: "Hidden Costs",
      description: "Quotes that balloon into something unrecognizable. You never know what you're actually paying.",
      icon: <EyeOff className="w-5 h-5 text-red-400" />
    },
    {
      number: "06",
      title: "Poor Experience",
      description: "No platform, no support, no standard. Just strangers, guesswork, and frustration every time.",
      icon: <Frown className="w-5 h-5 text-red-400" />
    }
  ];

  return (
    <section className="py-24 px-4 md:px-8 max-w-6xl mx-auto bg-white">
      <div className="mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4"
        >
          THE PROBLEM
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
        >
          Hiring today is{" "}
          <span className="font-instrument font-light text-[#6B46C1]">Stressful, Risky,</span>
          <br />and Broken
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-500 mt-4 text-lg max-w-2xl font-medium"
        >
          Whether it's a campus errand or a complex repair. Finding someone you can actually trust feels impossible.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {problems.map((problem, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="flex flex-col p-8 rounded-sm border border-gray-100 bg-white  transition-shadow group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="group-hover:scale-110 transition-transform origin-left">
                {problem.icon}
              </div>
              <span className="text-xs font-bold text-gray-200">{problem.number}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{problem.title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">
              {problem.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}