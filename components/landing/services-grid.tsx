"use client"

import { Sparkles, Home, Calendar, Briefcase, Wrench, GraduationCap, Scissors } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer } from "@/utils/landing-animations"

export default function ServicesGrid() {
  const services = [
    {
      icon: Sparkles,
      title: "Cleaning",
      description: "Home and Office Cleaning",
    },
    {
      icon: GraduationCap,
      title: "Tutoring",
      description: "Academic and Skills Coaching",
    },
    {
      icon: Wrench,
      title: "Repairs",
      description: "Appliance and Electronics",
    },
    {
      icon: Scissors,
      title: "Beauty",
      description: "Hair, Makeup and nails",
    },
  ]

  return (
    <section id="services" className="px-6 py-20 max-w-7xl mx-auto">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <motion.span variants={fadeInUp} className="inline-block text-[#7C3AED] font-semibold text-[10px] mb-4 uppercase tracking-[0.2em]">
          SERVICES
        </motion.span>
        <motion.h2 variants={fadeInUp} className="text-3xl md:text-[40px] font-bold text-[#1F2937] mb-4 leading-tight">
          Whatever you need, <span className="text-[#7C3AED]">we've got you</span>
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-[#6B7280] text-[16px] max-w-2xl mx-auto">
          From everyday tasks to special occasions, find the right help for any situation.
        </motion.p>
      </motion.div>

      {/* Service category tabs */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        <motion.button variants={fadeInUp} className="bg-[#7C3AED] text-white px-5 py-2.5 rounded-full font-medium text-[14px] flex items-center gap-2 hover:bg-[#6D28D9] transition-colors relative shadow-md hover:shadow-lg">
          <Sparkles className="w-4 h-4" />
          Personal services
        </motion.button>
        <motion.button variants={fadeInUp} className="bg-white text-[#1F2937] px-5 py-2.5 rounded-full font-medium text-[14px] flex items-center gap-2 border border-gray-200 hover:border-gray-300 transition-colors hover:bg-gray-50">
          <Home className="w-4 h-4" />
          Home services
        </motion.button>
        <motion.button variants={fadeInUp} className="bg-white text-[#1F2937] px-5 py-2.5 rounded-full font-medium text-[14px] flex items-center gap-2 border border-gray-200 hover:border-gray-300 transition-colors hover:bg-gray-50">
          <Calendar className="w-4 h-4" />
          Event services
        </motion.button>
        <motion.button variants={fadeInUp} className="bg-white text-[#1F2937] px-5 py-2.5 rounded-full font-medium text-[14px] flex items-center gap-2 border border-gray-200 hover:border-gray-300 transition-colors hover:bg-gray-50">
          <Briefcase className="w-4 h-4" />
          Professional services
        </motion.button>
      </motion.div>

      {/* Service cards */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
      >
        {services.map((service, idx) => {
          const Icon = service.icon
          return (
            <motion.div
              variants={fadeInUp}
              key={idx}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-white border border-[#E5E7EB] rounded-[20px] p-6 transition-all cursor-pointer"
            >
              <div className="w-14 h-14 bg-[#7C3AED] rounded-[16px] flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[18px] font-bold text-[#1F2937] mb-2">
                {service.title}
              </h3>
              <p className="text-[#6B7280] text-[14px]">{service.description}</p>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center text-[#6B7280] text-[14px] mt-10"
      >
        And many more categories <span className="font-semibold">50+ service</span> types available
      </motion.p>
    </section>
  )
}
