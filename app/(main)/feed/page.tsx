"use client";

import { useState } from "react";
import { useTaskerFeed } from "@/hooks/useHome";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

export default function FeedPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch categories for filter
  const { data: categoriesData } = useCategories();
  const categories = categoriesData || [];

  // Fetch tasker feed
  const {
    data: tasks,
    isLoading,
    isError,
    refetch: refetchTasks,
  } = useTaskerFeed({ maxDistance: 200 });

  // Client-side filtering
  const filteredTasks = (tasks || []).filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      (Array.isArray(task.categories) &&
        task.categories.some((cat) =>
          typeof cat === "object"
            ? cat._id === selectedCategory
            : cat === selectedCategory,
        ));

    return matchesSearch && matchesCategory;
  });

  const categoryFilters = [
    { _id: "All", displayName: "All" },
    ...categories.filter((cat) => cat.isActive),
  ];

  return (
    <div className='flex flex-col space-y-6 md:space-y-8 mx-auto p-4 md:p-8 w-full max-w-7xl min-h-screen'>
      {/* Header */}
      <h1 className='font-bold text-gray-900 text-2xl md:text-3xl'>
        Explore Tasks
      </h1>

      {/* Search Bar */}
      <div className='relative w-full'>
        <Search className='top-1/2 left-4 absolute w-4 h-4 md:w-5 md:h-5 text-gray-400 -translate-y-1/2' />
        <Input
          type='text'
          placeholder='Search tasks'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='bg-gray-100/80 pr-4 pl-10 md:pl-12 border-none rounded-xl h-12 md:h-14 text-sm md:text-base text-gray-600 focus-visible:ring-1 focus-visible:ring-[#6B46C1]'
        />
      </div>

      {/* Category Filters */}
      <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-none'>
        {categoryFilters.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            className={`px-4 md:px-6 py-1.5 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat._id
                ? "bg-[#6B46C1] text-white shadow-md shadow-purple-100"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {cat.displayName}
          </button>
        ))}
      </div>

      {/* Task Grid */}
      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className='rounded-[2rem] h-[340px]' />
          ))}
        </div>
      ) : isError ? (
        <div className='flex flex-col items-center justify-center py-20 text-center space-y-4'>
          <p className='font-medium text-gray-500'>
            Failed to load tasks. Please try again.
          </p>
          <Button onClick={() => refetchTasks()} className='bg-[#6B46C1]'>
            Retry
          </Button>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredTasks.map((task) => {
            const primaryCategory =
              Array.isArray(task.categories) && task.categories.length > 0
                ? task.categories[0]
                : null;
            const categoryName =
              primaryCategory && typeof primaryCategory === "object"
                ? primaryCategory.displayName || primaryCategory.name
                : "Uncategorized";

            const posterName = task.user?.fullName || "Task NG";
            const posterInitial = posterName
              .trim()
              .split(/\s+/)
              .map((word) => word[0].toUpperCase())
              .join("")
              .slice(0, 2);

            return (
              // h-full fills the grid cell so every card in a row matches the tallest one
              <div
                key={task._id}
                className='relative flex flex-col h-full bg-white hover:bg-gray-50/50 p-5 md:p-8 border border-gray-100 rounded-3xl md:rounded-[2.5rem] shadow-sm transition-all group'
              >
                {/* Card Top: Category Badge */}
                <div className='mb-4 md:mb-6'>
                  <span className='bg-purple-100/60 px-3 py-1 md:px-4 md:py-1.5 rounded-lg font-bold text-[#6B46C1] text-[8px] md:text-[10px] uppercase tracking-wider'>
                    {categoryName}
                  </span>
                </div>

                {/* Poster Info */}
                <div className='flex items-center gap-2 md:gap-3 mb-4 md:mb-6'>
                  <div className='flex justify-center items-center bg-[#6B46C1] rounded-full w-8 h-8 md:w-9 md:h-9 font-bold text-white text-[8px] md:text-[10px]'>
                    {posterInitial}
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-medium text-gray-400 text-[8px] md:text-[10px]'>
                      Posted by {posterName}
                    </span>
                  </div>
                </div>

                {/* Title & Description — flex-1 pushes footer to the bottom */}
                <div className='flex-1 space-y-2  mb-2 md:mb-4'>
                  <h3 className='group-hover:text-[#6B46C1] font-bold text-gray-900 text-lg md:text-xl transition-colors line-clamp-2'>
                    {task.title}
                  </h3>
                  <p className='text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-3'>
                    {task.description}
                  </p>
                </div>

                {/* Footer: Date & Price — pinned to bottom */}
                <div className='flex justify-between items-center  border-t border-gray-50'>
                  <div className='flex items-center gap-1.5 md:gap-2 text-gray-400 text-[10px] md:text-xs font-bold'>
                    <Calendar size={14} className='md:w-4 md:h-4' />
                    <span>
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Pending"}
                    </span>
                  </div>
                  <div className='font-black text-[#4CAF50] text-lg md:text-xl'>
                    ₦{task.budget?.toLocaleString() || "0"}
                  </div>
                </div>

                {/* Distance (if available) */}
                {task.distance !== undefined && (
                  <div className='mt-2 text-gray-400 text-xs font-medium'>
                    📍 {task.distance.toFixed(1)} miles away
                  </div>
                )}

                {/* Full-card link overlay */}
                <Link
                  href={`/tasks/${task._id}`}
                  className='inset-0 absolute rounded-[2.5rem]'
                />
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className='flex flex-col items-center justify-center py-16 md:py-32 text-center space-y-6'>
          <div className='flex justify-center items-center bg-purple-50 rounded-full w-24 h-24'>
            <div className='bg-white p-4 rounded-3xl shadow-sm'>
              <Clock className='w-10 h-10 text-[#6B46C1] animate-pulse' />
            </div>
          </div>
          <div className='space-y-2'>
            <h2 className='font-bold text-gray-900 text-2xl'>
              No Task Available
            </h2>
            <p className='text-gray-400 text-sm max-w-sm'>
              No tasks matching your categories right now. Check back soon!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
