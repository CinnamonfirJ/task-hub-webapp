"use client"

import { Star, CheckCircle, Award } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, scaleOnHover } from "@/utils/landing-animations"

export default function TrustBadges() {
  const badges = [
    {
      icon: Star,
      title: "Experienced Plumbers",
      description: "Our team includes certified professionals with 10+ years of experience.",
    },
    {
      icon: CheckCircle,
      title: "Certified Services",
      description: "All professionals are background-checked and verified for safety.",
    },
    {
      icon: Award,
      title: "Easy Booking Form",
      description: "Book your service in minutes with our simple and secure platform.",
    },
  ]

  return (
    <section className="px-6 py-16 bg-gray-50">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <motion.h2 variants={fadeInUp} className="text-center text-gray-900 text-2xl font-semibold mb-2">
          Finding Reliable help shouldn't be <span className="text-primary">this Hard</span>
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-center text-gray-600 mb-12">
          Connect with trusted service providers who are vetted, certified, and ready to help.
        </motion.p>

        <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
          {badges.map((badge, idx) => {
            const Icon = badge.icon
            return (
              <motion.div 
                variants={fadeInUp}
                key={idx} 
                className="text-center"
              >
                <motion.div 
                  variants={scaleOnHover}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center"
                >
                  <Icon className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{badge.title}</h3>
                <p className="text-gray-600 text-sm">{badge.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}
