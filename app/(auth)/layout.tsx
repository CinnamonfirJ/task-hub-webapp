"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { GuestGuard } from "@/components/auth/GuestGuard";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <GuestGuard>
      <div className="flex min-h-screen w-full overflow-hidden bg-white">
      {/* Left Side - Background Image */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/assets/auth-bg.png"
          alt="Authentication Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-br from-purple-900/20 to-black/40" />
      </div>

      {/* Right Side - Content */}
      <div className="flex w-full flex-col items-center justify-between p-8 lg:w-1/2">
        <div className="w-full" /> {/* Spacer */}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-md space-y-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Footer links */}
        <div className="mt-8 flex gap-6 text-[11px] text-gray-400 font-medium">
          <Link href="/terms" className="hover:text-purple-600 transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-purple-600 transition-colors">Privacy</Link>
          <Link href="/data-protection" className="hover:text-purple-600 transition-colors">Data Protection</Link>
          <Link href="/about" className="hover:text-purple-600 transition-colors">About</Link>
        </div>
      </div>
    </div>
  </GuestGuard>
);
}
