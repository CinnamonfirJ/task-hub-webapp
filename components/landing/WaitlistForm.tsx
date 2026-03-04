"use client";

import { useJoinWaitlist } from "@/hooks/useWaitlist";
import { scaleOnHover } from "@/utils/landing-animations";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

interface WaitlistFormProps {
  variant?: "hero" | "final-cta";
  placeholder?: string;
  buttonText?: string;
}

export default function WaitlistForm({
  variant = "hero",
  placeholder = "Jessica@email.com",
  buttonText = "Get early access",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const {
    mutate: joinWaitlist,
    isPending: isLoading,
    error: joinError,
  } = useJoinWaitlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    joinWaitlist(email);
  };

  const error = joinError ? joinError.message : null;

  const isHero = variant === "hero";

  return (
    <div className='w-full'>
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col sm:flex-row gap-3 ${isHero ? "mb-6" : "mb-4 max-w-xl mx-auto"}`}
      >
        <div className='flex-1 relative'>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className={`w-full px-6 py-4 rounded-full border focus:outline-none focus:ring-2 transition-all text-[15px] shadow-sm disabled:opacity-70 ${
              isHero
                ? "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-[#7C3AED] focus:border-transparent"
                : "bg-white text-gray-900 placeholder:text-gray-400 border-0 focus:ring-white"
            }`}
            required
          />
        </div>
        <motion.button
          variants={scaleOnHover}
          initial='initial'
          whileHover={isLoading ? "initial" : "hover"}
          whileTap={isLoading ? "initial" : "tap"}
          disabled={isLoading}
          type='submit'
          className={`px-8 py-4 rounded-full font-semibold transition-colors whitespace-nowrap flex items-center justify-center gap-2 text-[15px] shadow-lg disabled:opacity-80 ${
            isHero
              ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-purple-200"
              : "bg-[#1F2937] text-white hover:bg-[#111827] w-full sm:w-auto"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className='w-5 h-5 animate-spin' />
              Joining...
            </>
          ) : (
            <>
              {buttonText}
              <ArrowRight className={isHero ? "w-5 h-5" : "w-4 h-4"} />
            </>
          )}
        </motion.button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='flex items-center gap-2 text-red-500 text-[14px] mt-2 px-2'
          >
            <AlertCircle className='w-4 h-4' />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
