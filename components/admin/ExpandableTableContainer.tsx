"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ExpandableTableContainerProps {
  children: React.ReactNode;
}

export function ExpandableTableContainer({
  children,
}: ExpandableTableContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`flex flex-col transition-all duration-300 ${isExpanded ? "h-[800px]" : "h-auto"}`}
    >
      <div className={`flex-1 overflow-auto ${isExpanded ? "mb-6" : ""}`}>
        {children}
      </div>

      <div className='p-6 flex justify-center border-t border-gray-100/50 shrink-0 bg-white rounded-b-2xl'>
        {!isExpanded ? (
          <Button
            onClick={() => setIsExpanded(true)}
            className='bg-[#6B46C1] hover:bg-[#553C9A] text-white px-8 rounded-lg text-sm font-semibold h-10 transition-colors'
          >
            Load more
          </Button>
        ) : (
          <div className='flex items-center gap-1 mt-4 mb-2'>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                  page === 1
                    ? "bg-[#6B46C1] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <span className='w-8 h-8 flex items-center justify-center text-gray-400'>
              ...
            </span>
            <button className='w-8 h-8 flex items-center justify-center rounded bg-white text-gray-600 border border-gray-100 hover:bg-gray-50 text-sm font-medium transition-colors'>
              20
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
