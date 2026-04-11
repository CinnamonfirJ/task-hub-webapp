"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Sparkles } from "lucide-react";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className='flex items-center justify-between px-6 py-4 max-w-7xl mx-auto bg-white'
    >
      {/* Logo */}
      <div className='flex items-center gap-2'>
        <Image
          src='/assets/task-hub-logo.png'
          alt='TaskHub'
          width={120}
          height={40}
          className='h-10 w-auto object-contain'
        />
      </div>

      {/* Center Links */}
      <div className='hidden md:flex items-center gap-8'>
        {[
          { href: "#how-it-works", label: "How it works" },
          { href: "#services", label: "Services" },
          { href: "#for-taskers", label: "For Taskers" },
          { href: "#for-business", label: "For Business" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className='relative group text-[15px] font-medium text-[#4B5563] hover:text-[#1F2937] transition-colors'
          >
            {link.label}
            <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-[#7C3AED] transition-all group-hover:w-full' />
          </Link>
        ))}
      </div>

      {/* Right Buttons */}
      <div className='hidden md:flex items-center gap-4'>
        <Link href='/login'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='text-[15px] font-semibold text-[#1F2937] bg-[#F9FAFB] px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors'
          >
            Sign in
          </motion.div>
        </Link>
        <Link href='/register'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='text-[15px] font-semibold text-white bg-[#7C3AED] px-6 py-2.5 rounded-full hover:bg-[#6D28D9] transition-colors flex items-center gap-2 shadow-lg shadow-purple-200'
          >
            Sign up
            <Sparkles className='w-4 h-4 fill-white' />
          </motion.div>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className='md:hidden p-2'
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className='w-6 h-6 text-gray-900' />
      </motion.button>

      {/* Mobile Menu Overlay - (Simplified for now) */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className='absolute top-20 left-0 right-0  w-full bg-white border-t border-gray-100 p-4 shadow-lg flex flex-col gap-4 md:hidden z-50'
        >
          <Link
            href='#how-it-works'
            className='text-sm font-medium text-gray-700 py-2'
          >
            How it works
          </Link>
          <Link
            href='#services'
            className='text-sm font-medium text-gray-700 py-2'
          >
            Services
          </Link>
          <Link
            href='#for-taskers'
            className='text-sm font-medium text-gray-700 py-2'
          >
            For Taskers
          </Link>
          <Link
            href='#for-business'
            className='text-sm font-medium text-gray-700 py-2'
          >
            For Business
          </Link>
          <div className='flex flex-col gap-3 mt-2'>
            <Link
              href='/login'
              className='w-full text-center font-semibold text-[#1F2937] bg-[#F9FAFB] px-6 py-3 rounded-full'
            >
              Sign in
            </Link>
            <Link
              href='/register'
              className='w-full text-center font-semibold text-white bg-[#7C3AED] px-6 py-3 rounded-full flex items-center justify-center gap-2'
            >
              Sign up <Sparkles className='w-4 h-4' />
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
