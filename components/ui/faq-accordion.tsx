"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
  return (
    <div className={cn(
      "border-b border-gray-100 last:border-0 transition-all duration-300",
      isOpen ? "bg-purple-50/30" : "bg-transparent"
    )}>
      <button
        onClick={onClick}
        className="w-full py-6 px-4 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <span className={cn(
          "text-base md:text-lg font-semibold transition-colors duration-300",
          isOpen ? "text-[#6B46C1]" : "text-gray-900 group-hover:text-[#6B46C1]"
        )}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "shrink-0 ml-4 p-1 rounded-full",
            isOpen ? "text-[#6B46C1] bg-purple-100" : "text-gray-400 group-hover:text-[#6B46C1]"
          )}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-6 text-gray-600 leading-relaxed text-sm md:text-base">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FAQAccordionProps {
  items: { question: string; answer: string }[];
  allowMultiple?: boolean;
  className?: string;
}

export const FAQAccordion = ({ items, allowMultiple = false, className }: FAQAccordionProps) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const handleToggle = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes(prev => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes(prev => prev.includes(index) ? [] : [index]);
    }
  };

  return (
    <div className={cn("w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50", className)}>
      {items.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndexes.includes(index)}
          onClick={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};
