"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExpandableTableContainerProps {
  children: React.ReactNode;
  maxHeight?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function ExpandableTableContainer({
  children,
  maxHeight = "450px",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: ExpandableTableContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Pagination logic: Show 1, ..., cur-1, cur, cur+1, ..., total
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;
    
    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className='flex flex-col w-full'>
      <div 
        className={cn(
          "overflow-x-auto transition-all duration-500 ease-in-out relative",
          !isExpanded ? "overflow-hidden" : "max-h-fit"
        )}
        style={{ maxHeight: !isExpanded ? maxHeight : 'none' }}
      >
        {children}
        
        {!isExpanded && (
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-white via-white/90 to-transparent pointer-events-none z-10" />
        )}
      </div>

      <div className={cn(
        "p-8 flex justify-center border-t border-gray-100/50 bg-white rounded-b-2xl relative z-20",
        !isExpanded ? "-mt-6" : ""
      )}>
        {!isExpanded ? (
          <Button
            onClick={() => setIsExpanded(true)}
            className='bg-[#6B46C1] hover:bg-[#553C9A] text-white px-10 rounded-xl text-sm font-bold h-12 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5'
          >
            Load more
          </Button>
        ) : (
          <div className='flex items-center gap-2'>
            {pageNumbers.map((p, idx) => (
              <React.Fragment key={idx}>
                {p === "..." ? (
                  <span className='px-2 text-gray-400 font-bold'>...</span>
                ) : (
                  <button
                    onClick={() => onPageChange?.(Number(p))}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all border shadow-sm",
                      currentPage === p
                        ? "bg-[#6B46C1] text-white border-[#6B46C1] shadow-[#6B46C1]/20"
                        : "bg-white text-gray-600 hover:bg-gray-50 border-gray-100"
                    )}
                  >
                    {p}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
