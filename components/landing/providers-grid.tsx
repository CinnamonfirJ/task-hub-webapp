"use client";

import { motion } from "framer-motion";

const PROVIDERS = [
  { name: "Electricians", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop" },
  { name: "Cleaners", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop" },
  { name: "Laundry Providers", image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=400&auto=format&fit=crop" },
  { name: "Dispatch Riders", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=400&auto=format&fit=crop" },
  { name: "Tutors", image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=400&auto=format&fit=crop" },
  { name: "Graphic Designers", image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=400&auto=format&fit=crop" },
  { name: "Photographers", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop" },
  { name: "Web Designers", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&auto=format&fit=crop" },
  { name: "Plumbers", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=400&auto=format&fit=crop" },
  { name: "Hair Stylists", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop" },
  { name: "Caterers", image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=400&auto=format&fit=crop" },
  { name: "Handymen", image: "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=400&auto=format&fit=crop" },
];

export default function ProvidersGrid() {
  return (
    <section className="py-24 overflow-hidden bg-white px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto" id="who-is-it-for">
      <div className="text-center mb-16">
        <h2 className="text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-[#673AB7] mb-6">
          WHO IS THIS FOR?
        </h2>
        <h3 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-[#111111] tracking-tight leading-[1.15]">
          Built for people who already<br />
          have a <span className="text-[#673AB7] italic ont-light">Skill</span>
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
        {PROVIDERS.map((provider, i) => (
          <motion.div
            key={provider.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="relative h-48 md:h-56 lg:h-64 rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer shadow-sm"
          >
            <img
              src={provider.image}
              alt={provider.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 md:bottom-5 left-4 md:left-5 right-4">
              <p className="text-white font-semibold text-[13px] md:text-[15px] leading-tight">
                {provider.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
