"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NAV_LINKS = [
    { href: "./#who-is-it-for", label: "Who Is It For" },
    { href: "./#why-join", label: "Why Join" },
    { href: "./#earnings", label: "Earnings" },
    { href: "./#how-it-works", label: "How it Works" },
    { href: "./#faq", label: "FAQ" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md h-[70px] shadow-sm" : "bg-white h-[78px]"
        }`}
    >
      <nav className="flex items-center justify-between h-full px-6 max-w-7xl mx-auto w-full">
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer flex-shrink-0">
          <Image
            src="/assets/taskhub-logo.svg"
            alt="TaskHub"
            width={130}
            height={40}
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Right Side: Navigation Links & CTA Combined */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] font-light text-gray-700 hover:text-black transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link href="/register">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-[14px] font-medium text-white bg-[#111111] px-5 py-2.5 rounded-full hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              Sign up
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="w-6 h-6 text-gray-900" />
        </motion.button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-[78px] left-0 right-0 w-full bg-white border-t border-gray-100 p-5 flex flex-col gap-4 md:hidden z-50 shadow-lg"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-2">
                <Link
                  href="/register"
                  className="w-full text-center font-medium text-white bg-[#111111] hover:bg-black px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign up <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}