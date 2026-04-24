"use client"

import { Facebook, Instagram, Linkedin, MapPin, Mail } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { fadeInUp, staggerContainer } from "@/utils/landing-animations"

export default function Footer() {
  return (
    <footer className="bg-[#18181B] text-gray-400 pt-20 pb-10 px-6">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Column 1 - Brand & Contact (Span 4 columns) */}
          <motion.div variants={fadeInUp} className="md:col-span-4 space-y-8">
            <Image
              src="/assets/task-hub-logo-footer.png"
              alt="TaskHub"
              width={160}
              height={50}
              className="h-10 w-auto object-contain"
            />
            <p className="text-[14px] leading-relaxed text-gray-400 max-w-sm">
              Connecting you with trusted taskers and businesses for all your service needs. Get things done, the smarter way.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-[14px] text-gray-300">Nigeria</span>
              </div>
              <a href="mailto:hello@ngtaskhub.com" className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-[14px] text-gray-300">hello@ngtaskhub.com</span>
              </a>
            </div>
          </motion.div>

          {/* Links Columns (Span 8 columns) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Company */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-white font-semibold mb-6 text-[15px]">Company</h3>
              <ul className="space-y-4 text-[14px]">
                <li><Link href="/about" className="hover:text-white transition-colors">About us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Career</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">News</Link></li>
                <li><Link href="/legal" className="hover:text-white transition-colors">Legal Overview</Link></li>
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-white font-semibold mb-6 text-[15px]">Services</h3>
              <ul className="space-y-4 text-[14px]">
                <li><a href="#" className="hover:text-white transition-colors">Find Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Become a tasker</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Businesses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-white font-semibold mb-6 text-[15px]">Support</h3>
              <ul className="space-y-4 text-[14px]">
                <li><a href="#" className="hover:text-white transition-colors">Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-white font-semibold mb-6 text-[15px]">Legal</h3>
              <ul className="space-y-4 text-[14px]">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/data-protection" className="hover:text-white transition-colors">Data Protection</Link></li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Social Icons Row */}
        <motion.div variants={fadeInUp} className="flex justify-center md:justify-end gap-6 mb-12">
            <a href="#" className="hover:text-white transition-colors">
               {/* Custom X Logo */}
               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div variants={fadeInUp} className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center gap-6">
          <p className="text-[13px] text-gray-500">
             &copy; 2026 Taskhub
          </p>
          <div className="flex items-center gap-2 text-[13px] text-gray-500">
             <span className="w-1 h-1 rounded-full bg-gray-500"></span>
             <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
             <span className="w-1 h-1 rounded-full bg-gray-500"></span>
             <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}
