"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { FAQ_CONTENT } from "@/lib/faq-data";
import { useState } from "react";
import { motion } from "framer-motion";

export default function FAQPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = FAQ_CONTENT.filter(
    faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="bg-white border text-gray-400 rounded-xl w-12 h-12 hover:text-[#6B46C1] hover:bg-purple-50"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-none">FAQs</h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">Find answers to common questions</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#6B46C1] transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search questions or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-[#6B46C1] transition-all shadow-sm"
        />
      </div>

      {/* FAQ Content */}
      <div className="space-y-6">
        {filteredFAQs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <FAQAccordion items={filteredFAQs} allowMultiple={false} />
          </motion.div>
        ) : (
          <div className="text-center py-20 space-y-4">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <Search size={24} />
            </div>
            <p className="text-gray-500 font-medium">No results found for &quot;{searchQuery}&quot;</p>
            <Button 
              variant="link" 
              onClick={() => setSearchQuery("")}
              className="text-[#6B46C1] font-bold"
            >
              Clear search
            </Button>
          </div>
        )}
      </div>

      {/* Support CTA */}
      <div className="bg-linear-to-br from-[#6B46C1] to-[#553C9A] rounded-[2rem] p-8 text-white text-center space-y-4 shadow-xl shadow-purple-100 mt-12">
        <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto">
          <HelpCircle size={24} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Still have questions?</h3>
          <p className="text-white/80 text-sm max-w-xs mx-auto leading-relaxed">
            Can&apos;t find the answer you&apos;re looking for? Please chat with our friendly team.
          </p>
        </div>
        <Button 
          onClick={() => router.push("/profile/get-help")}
          className="bg-white text-[#6B46C1] hover:bg-white/90 font-bold px-8 py-6 rounded-xl mt-2 w-full sm:w-auto"
        >
          Contact Support
        </Button>
      </div>
    </div>
  );
}
