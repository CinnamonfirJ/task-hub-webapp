"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black/40" />
      </div>

      {/* Right Side - Content */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
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
      </div>
    </div>
  );
}
