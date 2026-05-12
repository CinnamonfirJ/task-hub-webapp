"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Homeowner",
      text: "Found an amazing plumber in under 10 minutes. The escrow payment made me feel super secure. Highly recommend!",
      rating: 5,
      avatar: "S",
    },
    {
      name: "David Chen",
      role: "Student",
      text: "Needed help moving out of my dorm. The tasker arrived early and got everything done perfectly.",
      rating: 5,
      avatar: "D",
    },
    {
      name: "Michael R.",
      role: "Small Business Owner",
      text: "We use TaskHub for all our deep cleaning needs at the office. Consistent quality every single time.",
      rating: 5,
      avatar: "M",
    },
    {
      name: "Emily W.",
      role: "Event Planner",
      text: "Hired an extra pair of hands for a local event. The verified profiles made it so easy to trust who I was hiring.",
      rating: 5,
      avatar: "E",
    },
  ];

  return (
    <section className="py-24 px-4 md:px-8 max-w-6xl mx-auto bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <p className="text-xs text-[#4B5563] uppercase tracking-widest mb-4">
          Testimonial
        </p>
        <h2 className="text-4xl md:text-5xl font-medium text-gray-900 leading-tight">
          Loved by{" "}
          <span className="font-instrument font-medium text-[#6B46C1]">
            Thousands
          </span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Featured Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col"
        >
          <div className="flex gap-1 text-yellow-400 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <p className="text-2xl md:text-3xl font-medium text-gray-900 leading-snug mb-8">
            "I needed someone to paint and bind my project in a few hours. I
            posted a task and a verified campus student showed up in 30 mins.
            All on one platform!"
          </p>
          <div className="flex items-center gap-4 mt-auto">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <div>
              <p className="font-bold text-gray-900">Chioma A.</p>
              <p className="text-sm text-gray-500 font-medium">
                University Student
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Grid */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="p-6 border border-gray-100 rounded-sm bg-gray-50 hover:bg-white transition-all flex flex-col"
            >
              <div className="flex gap-1 text-yellow-400 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-sm font-medium mb-6 leading-relaxed flex-grow">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#6B46C1] rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-bold text-xs text-gray-900">
                    {review.name}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
