"use client";

import { motion } from "framer-motion";

const SERVICES = [
  { name: "Cleaning Services", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop" },
  { name: "Hair & Beauty", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop" },
  { name: "Photography", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop" },
  { name: "Catering", image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=400&auto=format&fit=crop" },
  { name: "Laundry Services", image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=400&auto=format&fit=crop" },
  { name: "Dispatch & Delivery", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=400&auto=format&fit=crop" },
  { name: "Tutoring", image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=400&auto=format&fit=crop" },
  { name: "Electrical Services", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop" },
  { name: "Event Decoration", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop" },
  { name: "Plumbing", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=400&auto=format&fit=crop" },
  { name: "Makeup & Beauty", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=400&auto=format&fit=crop" },
  { name: "Other Services", image: "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=400&auto=format&fit=crop" },
];

export default function ServicesGrid() {
  return (
    <section className="py-24 overflow-hidden bg-white px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-[#673AB7] mb-6">
          CATEGORIES WE ACCEPT
        </h2>
        <h3 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-[#111111] tracking-tight leading-[1.15]">
          <span className="text-[#673AB7] italic font-serif font-light">Services</span> we're looking for.
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5 max-w-6xl mx-auto">
        {SERVICES.map((service, index) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="relative h-48 md:h-56 lg:h-[220px] rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer shadow-sm"
          >
            <img
              src={service.image}
              alt={service.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 md:bottom-5 left-4 md:left-5 right-4">
              <p className="text-white font-semibold text-[13px] md:text-[15px] leading-tight drop-shadow-md">
                {service.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
