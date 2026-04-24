"use client";

import { useState, useMemo, useEffect } from "react";
import { useNearbyTaskers } from "@/hooks/useNearbyTaskers";
import { useCategories } from "@/hooks/useCategories";
import { TaskerCard } from "@/components/taskers/TaskerCard";
import { TaskerProfileModal } from "@/components/dashboard/TaskerProfileModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  Star,
  Users,
  ChevronDown,
  X,
  SlidersHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function TaskersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("nearest"); // nearest, highest_rated, most_popular
  const [selectedTasker, setSelectedTasker] = useState<any>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  // Get geolocation
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
        }
      );
    }
  }, []);

  // Data fetching
  const { data: taskers, isLoading: isLoadingTaskers } = useNearbyTaskers(
    coords?.latitude,
    coords?.longitude,
    true
  );

  const { data: categories } = useCategories();

  // Filtering & Sorting Logic
  const processedTaskers = useMemo(() => {
    if (!taskers) return [];

    let filtered = [...taskers];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.firstName?.toLowerCase().includes(query) ||
          t.lastName?.toLowerCase().includes(query) ||
          t.primaryCategory?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (t) => t.primaryCategory === selectedCategory
      );
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter((t) => (t.averageRating || 0) >= minRating);
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === "nearest") {
        return (a.distance || 0) - (b.distance || 0);
      }
      if (sortBy === "highest_rated") {
        return (b.averageRating || 0) - (a.averageRating || 0);
      }
      if (sortBy === "most_popular") {
        return (b.completedJobs || 0) - (a.completedJobs || 0);
      }
      return 0;
    });

    return filtered;
  }, [taskers, searchQuery, selectedCategory, minRating, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setMinRating(0);
    setSortBy("nearest");
  };

  return (
    <div className="flex flex-col space-y-6 md:space-y-8 mx-auto p-4 md:p-8 w-full max-w-7xl min-h-screen">
      {/* Header & Title */}
      <div className="space-y-2">
        <h1 className="font-black text-gray-900 text-3xl md:text-4xl tracking-tight">
          Browse Taskers
        </h1>
        <p className="text-gray-500 font-medium">
          Find the best professionals for your tasks near you.
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-3 md:p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name or skill..."
              className="pl-12 h-12 bg-gray-50 border-none rounded-xl text-base focus-visible:ring-2 focus-visible:ring-purple-100 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 px-5 rounded-xl border-gray-100 font-bold gap-2 hover:bg-gray-50">
                  <Filter size={18} className="text-[#6B46C1]" />
                  <span className="hidden sm:inline">
                    {selectedCategory === "All" ? "Categories" : selectedCategory}
                  </span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl border-none">
                <DropdownMenuLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
                  Select Category
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => setSelectedCategory("All")}
                  className={cn("rounded-lg px-3 py-2 cursor-pointer font-medium", selectedCategory === "All" && "bg-purple-50 text-[#6B46C1]")}
                >
                  All Categories
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories?.slice(0, 10).map((cat: any) => (
                  <DropdownMenuItem
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat.displayName || cat.name)}
                    className={cn("rounded-lg px-3 py-2 cursor-pointer font-medium", selectedCategory === (cat.displayName || cat.name) && "bg-purple-50 text-[#6B46C1]")}
                  >
                    {cat.displayName || cat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 px-5 rounded-xl border-gray-100 font-bold gap-2 hover:bg-gray-50">
                  <ArrowUpDown size={18} className="text-[#6B46C1]" />
                  <span className="hidden sm:inline">
                    {sortBy === "nearest" ? "Nearest" : sortBy === "highest_rated" ? "Top Rated" : "Popular"}
                  </span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl border-none">
                <DropdownMenuLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
                  Sort By
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => setSortBy("nearest")}
                  className={cn("rounded-lg px-3 py-2 cursor-pointer font-medium", sortBy === "nearest" && "bg-purple-50 text-[#6B46C1]")}
                >
                  Nearest First
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy("highest_rated")}
                  className={cn("rounded-lg px-3 py-2 cursor-pointer font-medium", sortBy === "highest_rated" && "bg-purple-50 text-[#6B46C1]")}
                >
                  Highest Rated
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy("most_popular")}
                  className={cn("rounded-lg px-3 py-2 cursor-pointer font-medium", sortBy === "most_popular" && "bg-purple-50 text-[#6B46C1]")}
                >
                  Most Popular
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedCategory !== "All" || minRating > 0 || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Active Filters:</span>
            {selectedCategory !== "All" && (
              <div className="flex items-center gap-1 bg-purple-50 text-[#6B46C1] px-3 py-1 rounded-full text-xs font-bold">
                {selectedCategory}
                <X size={14} className="cursor-pointer" onClick={() => setSelectedCategory("All")} />
              </div>
            )}
            {minRating > 0 && (
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                {minRating}+ Stars
                <X size={14} className="cursor-pointer" onClick={() => setMinRating(0)} />
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="text-xs font-bold text-gray-400 hover:text-red-500"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Rating Quick Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-sm font-bold text-gray-500 whitespace-nowrap">Rating:</span>
        {[0, 4, 4.5].map((rating) => (
          <button
            key={rating}
            onClick={() => setMinRating(rating)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border",
              minRating === rating
                ? "bg-[#6B46C1] text-white border-[#6B46C1] shadow-md shadow-purple-100"
                : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
            )}
          >
            {rating === 0 ? "All Ratings" : `${rating}★ & above`}
          </button>
        ))}
      </div>

      {/* Tasker Grid */}
      {isLoadingTaskers ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : processedTaskers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {processedTaskers.map((worker) => (
            <TaskerCard
              key={worker._id}
              worker={worker}
              onClick={() => setSelectedTasker(worker)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-gray-200 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center space-y-6">
          <div className="bg-purple-50 p-6 rounded-full">
            <Users size={48} className="text-[#6B46C1] opacity-50" />
          </div>
          <div className="space-y-2 max-w-sm">
            <h2 className="text-2xl font-black text-gray-900">No Taskers Found</h2>
            <p className="text-gray-400 font-medium leading-relaxed">
              We couldn&apos;t find any taskers matching your current filters. Try adjusting your search or filters.
            </p>
          </div>
          <Button onClick={resetFilters} className="bg-[#6B46C1] hover:bg-[#5a3da1] px-8 h-12 rounded-xl font-bold shadow-lg shadow-purple-100">
            Reset All Filters
          </Button>
        </div>
      )}

      {/* Tasker Profile Modal */}
      <TaskerProfileModal
        isOpen={!!selectedTasker}
        onClose={() => setSelectedTasker(null)}
        tasker={selectedTasker}
      />
    </div>
  );
}
