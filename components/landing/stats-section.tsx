"use client";

import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    { value: "30+", label: "Task Completed", description: "and growing daily" },
    { value: "300+", label: "Verified Taskers", description: "across all categories" },
    { value: "200+", label: "Active Users", description: "Across Nigeria" }
  ];

  return (
    <section className="py-24 px-4 md:px-8 max-w-6xl mx-auto bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
          BY THE NUMBERS
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Trust Built on{" "}
          <span className="font-instrument font-light text-[#6B46C1]">Real Results.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex flex-col p-8 md:p-10 bg-[#F9FAFB] rounded-2xl"
          >
            <h3 className="text-5xl md:text-6xl font-medium text-gray-900 mb-4 tracking-tight">
              {stat.value}
            </h3>
            <p className="text-gray-900 font-bold text-sm mb-8">{stat.label}</p>
            <p className="text-gray-400 font-medium text-sm">{stat.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}