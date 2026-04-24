import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalRecords?: number;
  label?: string;
  className?: string;
}

export function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  label = "records",
  className,
}: AdminPaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5; // Number of page buttons to show

    const validTotalPages = Math.max(0, Math.floor(Number(totalPages) || 0));
    if (validTotalPages <= 0) return null;

    if (validTotalPages <= showMax) {
      for (let i = 1; i <= validTotalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(validTotalPages - 1, currentPage + 1);

      // Adjust start/end to always show 3 middle pages if possible
      if (currentPage <= 2) {
        end = Math.min(validTotalPages - 1, 4);
      } else if (currentPage >= validTotalPages - 1) {
        start = Math.max(2, validTotalPages - 3);
      }

      if (start > 2) pages.push("...");

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < validTotalPages - 1) pages.push("...");

      // Always show last page
      pages.push(validTotalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const validTotalPages = Math.max(0, Math.floor(Number(totalPages) || 0));
  const validTotalRecords = Math.max(0, Math.floor(Number(totalRecords) || 0));

  if (!pageNumbers || (validTotalPages <= 1 && validTotalRecords === 0)) return null;

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 gap-4", className)}>
      <div className="text-xs text-gray-500 font-medium">
        Page <span className="text-gray-900 font-bold">{currentPage}</span> of{" "}
        <span className="text-gray-900 font-bold">{validTotalPages}</span>
        {totalRecords !== undefined && (
          <>
            {" "}(<span className="text-gray-900 font-bold">{validTotalRecords}</span> {label})
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50 hover:text-[#6B46C1] transition-colors"
        >
          <ChevronLeft size={16} />
        </Button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) => (
            <React.Fragment key={idx}>
              {p === "..." ? (
                <span className="px-2 text-gray-400">...</span>
              ) : (
                <Button
                  variant={currentPage === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(p as number)}
                  className={cn(
                    "h-8 min-w-[32px] px-2 text-xs font-bold transition-all",
                    currentPage === p
                      ? "bg-[#6B46C1] hover:bg-[#553C9A] text-white border-transparent shadow-sm"
                      : "border-gray-200 text-gray-600 hover:border-[#6B46C1] hover:text-[#6B46C1] bg-white"
                  )}
                >
                  {p}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50 hover:text-[#6B46C1] transition-colors"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
