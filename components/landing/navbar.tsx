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

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md py-3 shadow-sm" : "bg-white py-5"
      }`}
    >
      <nav className="flex items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/assets/taskhub-logo.svg"
            alt="TaskHub"
            width={140}
            height={45}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "/#categories", label: "Categories" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group text-[15px] font-medium text-[#4B5563] hover:text-[#1F2937] transition-colors"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#7C3AED] transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Right Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-[15px] font-semibold text-[#1F2937] px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Login
            </motion.div>
          </Link>
          <Link href="/register">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-[15px] font-semibold text-white bg-black px-6 py-2.5 rounded-full hover:bg-[#7C3AED] transition-colors flex items-center gap-2 cursor-pointer"
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
              className="absolute top-20 left-0 right-0 w-full bg-white border-t border-gray-100 p-4 flex flex-col gap-4 md:hidden z-50 shadow-lg"
            >
              <Link
                href="#categories"
                className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col gap-3 mt-2">
                <Link
                  href="/login"
                  className="w-full text-center font-semibold text-[#1F2937] bg-[#1F1F1F] px-6 py-3 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center font-semibold text-white bg-black hover:bg-[#7C3AED] px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-colors"
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