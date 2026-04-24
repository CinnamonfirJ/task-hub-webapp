import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface AdminSearchFilterProps {
  searchPlaceholder?: string;
  searchTerm?: string;
  onSearch?: (value: string) => void;
  filterOptions: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function AdminSearchFilter({
  searchPlaceholder = "Search...",
  searchTerm,
  onSearch,
  filterOptions,
  activeFilter,
  onFilterChange,
}: AdminSearchFilterProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm || "");

  useEffect(() => {
    setLocalSearch(searchTerm || "");
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchTerm) {
        onSearch?.(localSearch);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [localSearch, onSearch, searchTerm]);

  return (
    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 w-full'>
      <div className='relative w-full md:max-w-md'>
        <Search
          className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          size={18}
        />
        <Input
          type='search'
          placeholder={searchPlaceholder}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className='pl-10 h-11 w-full bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-[#6B46C1] text-sm'
        />
      </div>

      {/* Desktop Filter Options */}
      <div className='hidden md:flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide'>
        {filterOptions.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Mobile Filter Options */}
      <div className='md:hidden flex justify-end'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors'>
              <Filter size={16} />
              {activeFilter}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-2'
          >
            {filterOptions.map((filter) => (
              <DropdownMenuItem
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`flex rounded-lg px-3 py-2 text-sm cursor-pointer mb-1 last:mb-0 ${
                  activeFilter === filter
                    ? "bg-gray-900 text-white font-medium hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
                    : "text-gray-600 hover:bg-gray-50 focus:bg-gray-50"
                }`}
              >
                {filter}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
