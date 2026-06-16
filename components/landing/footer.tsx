"use client";

import { Instagram, MapPin, Mail } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0B0914] text-gray-400 pt-20 pb-10 px-6 border-t border-[#1A1825]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          {/* Column 1 - Brand & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 md:w-1/3"
          >
            <Link href="/" className="inline-block cursor-pointer">
              <Image
                src="/assets/taskhub-logo.svg"
                alt="TaskHub"
                width={160}
                height={50}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-[14px] leading-relaxed text-gray-400 max-w-sm">
              Connecting you with trusted taskers and businesses for all your
              service needs. Get things done, the smarter way.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-[14px] text-gray-400">
                  NNPC Housing estate, Eleme, Rivers state, Nigeria
                </span>
              </div>
              <a
                href="mailto:support@ngtaskhub.com"
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-[14px]">support@ngtaskhub.com</span>
              </a>
            </div>
          </motion.div>

          {/* Links Columns */}
          <div className="flex flex-wrap gap-12 md:gap-24">
            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-white font-bold mb-6 text-[15px]">Company</h3>
              <ul className="space-y-4 text-[14px]">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal"
                    className="hover:text-white transition-colors"
                  >
                    Legal Overview
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-white font-bold mb-6 text-[15px]">Support</h3>
              <ul className="space-y-4 text-[14px]">
                {/* <li><Link href="/profile/get-help" className="hover:text-white transition-colors">Help Center</Link></li> */}
                <li>
                  <Link
                    href="/legal"
                    className="hover:text-white transition-colors"
                  >
                    Safety
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-white font-bold mb-6 text-[15px]">Legal</h3>
              <ul className="space-y-4 text-[14px]">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/data-protection"
                    className="hover:text-white transition-colors"
                  >
                    Data Protection
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 border-t border-[#1A1825] pt-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-[13px] text-gray-500">&copy; 2026 TaskHub</p>
            <div className="flex items-center gap-4 text-[13px] text-gray-500">
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms
              </Link>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>

          {/* Social Icons Row */}
          <div className="flex gap-6">
            <a
              href="https://chat.whatsapp.com/HUoYs3Rb1js4H2U4WuvPWK?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/ngtaskhub/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.tiktok.com/@taskhub4?_r=1&_t=ZS-95noJzyF56b"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
