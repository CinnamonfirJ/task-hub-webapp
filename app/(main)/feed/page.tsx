"use client";

import { useState, useMemo } from "react";
import { useInfiniteTaskerFeed, getCategoryName } from "@/hooks/useHome";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function FeedPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch categories for filter
  const { data: categoriesData } = useCategories();
  const categoriesList = categoriesData || [];

  // Personalize Category Filters based on Tasker Preferences
  const groupedTaskerPreferredCategories = useMemo(() => {
    if (!user || !categoriesList.length) return new Map();

    const userCats =
      (user as any).subCategories || (user as any).categories || [];
    const selectedSubcatIds = userCats
      .map((cat: any) => {
        if (typeof cat === "string") return cat;
        return cat._id || cat.id;
      })
      .filter(Boolean);

    // Filter all subcategories to only those selected by tasker
    const selectedSubcategories = categoriesList.filter((cat) =>
      selectedSubcatIds.includes(cat._id),
    );

    // Group by Main Category
    const groups = new Map<string, { main: any; subs: any[] }>();

    selectedSubcategories.forEach((sub) => {
      const main = sub.mainCategory || sub.parentCategory;
      if (!main) return;

      const mainId = typeof main === "object" ? main._id : main;
      const mainName =
        typeof main === "object" ? main.displayName || main.name : "Other";

      if (!groups.has(mainId)) {
        groups.set(mainId, {
          main:
            typeof main === "object"
              ? main
              : { _id: mainId, displayName: mainName },
          subs: [],
        });
      }
      groups.get(mainId)?.subs.push(sub);
    });

    return groups;
  }, [user, categoriesList]);

  // Functional filters logic
  const feedParams = useMemo(() => {
    return {
      maxDistance: 200,
      status: "open",
    };
  }, []);

  // Fetch tasker feed with infinite scroll
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchTasks,
  } = useInfiniteTaskerFeed(feedParams);

  // Flatten tasks from all pages
  const tasks = useMemo(() => {
    return data?.pages.flatMap((page) => page.tasks) || [];
  }, [data]);

  // Client-side filtering
  const filteredTasks = (tasks || []).filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      task.subCategory === selectedCategory ||
      (typeof task.subCategory === "object" &&
        task.subCategory?._id === selectedCategory) ||
      (Array.isArray(task.categories) &&
        task.categories.some((cat) =>
          typeof cat === "object"
            ? cat._id === selectedCategory
            : cat === selectedCategory,
        ));

    return matchesSearch && matchesCategory;
  });

  const categoryGroups = Array.from(groupedTaskerPreferredCategories.values());

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

      {/* Personalized Category Filters */}
      <div className='flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none'>
        {/* All Categories Button */}
        <button
          onClick={() => setSelectedCategory("All")}
          className={cn(
            "px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap shrink-0",
            selectedCategory === "All"
              ? "bg-[#6B46C1] text-white shadow-md shadow-purple-100"
              : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-transparent",
          )}
        >
          All Categories
        </button>

        {/* Dynamic Category Dropdowns */}
        {categoryGroups.map((group) => {
          const isGroupActive = group.subs.some(
            (sub: any) => sub._id === selectedCategory,
          );
          const activeSub = group.subs.find(
            (sub: any) => sub._id === selectedCategory,
          );

          return (
            <DropdownMenu key={group.main._id}>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap shrink-0 border",
                    isGroupActive
                      ? "bg-purple-50 text-[#6B46C1] border-[#6B46C1]"
                      : "bg-white text-gray-500 border-gray-100 hover:border-gray-200",
                  )}
                >
                  {isGroupActive
                    ? activeSub?.displayName
                    : group.main.displayName}
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform",
                      isGroupActive ? "text-[#6B46C1]" : "text-gray-400",
                    )}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='start'
                className='rounded-2xl p-2 min-w-[200px] border-none shadow-xl'
              >
                {group.subs.map((sub: any) => (
                  <DropdownMenuItem
                    key={sub._id}
                    onClick={() => setSelectedCategory(sub._id)}
                    className={cn(
                      "rounded-xl px-4 py-2.5 text-sm font-medium cursor-pointer",
                      selectedCategory === sub._id
                        ? "bg-purple-50 text-[#6B46C1] focus:bg-purple-50 focus:text-[#6B46C1]"
                        : "text-gray-600 focus:bg-gray-50",
                    )}
                  >
                    {sub.displayName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}

        {/* Empty State for Filters */}
        {categoryGroups.length === 0 && !isLoading && (
          <p className='text-gray-400 text-xs italic px-2'>
            No categories selected in profile.
          </p>
        )}
      </div>

      {/* Task Grid */}
      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className='rounded-lg h-[340px]' />
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
          {filteredTasks.map((task: any) => {
            const categoryName = getCategoryName(task);

            const posterName = task.user?.fullName || "Task NG";
            const posterInitial = posterName
              .trim()
              .split(/\s+/)
              .map((word: string) => word[0].toUpperCase())
              .join("")
              .slice(0, 2);
            const taskIsAssigned =
              task.status === "assigned" || task.status === "in-progress";
            const isAssignedToMe =
              task.taskerBidInfo?.status === "accepted" ||
              (task.taskerBidInfo?.hasBid === true &&
                task.taskerBidInfo?.status !== "rejected" &&
                taskIsAssigned);
            const isAssignedToOther = taskIsAssigned && !isAssignedToMe;
            const isCompleted = task.status === "completed";

            return (
              <div
                key={task._id}
                className={`relative flex flex-col h-full bg-white hover:bg-gray-50/50 p-5 md:p-8 border border-gray-100 rounded-lg shadow-sm transition-all group ${
                  isAssignedToOther ? "opacity-60 grayscale-[0.5]" : ""
                }`}
              >
                {/* Card Top: Category Badge & Assignment Info */}
                <div className='flex justify-between items-start mb-4 md:mb-6'>
                  <span className='bg-purple-100/60 px-3 py-1 md:px-4 md:py-1.5 rounded-lg font-bold text-[#6B46C1] text-[8px] md:text-[10px] uppercase tracking-wider'>
                    {categoryName}
                  </span>

                  {isAssignedToMe && (
                    <span className='bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold text-[8px] md:text-[10px] uppercase tracking-wider'>
                      Assigned to you
                    </span>
                  )}
                  {isAssignedToOther && (
                    <span className='bg-gray-100 text-gray-500 px-3 py-1 rounded-lg font-bold text-[8px] md:text-[10px] uppercase tracking-wider'>
                      Assigned to someone else
                    </span>
                  )}
                  {isCompleted && (
                    <span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold text-[8px] md:text-[10px] uppercase tracking-wider'>
                      Completed
                    </span>
                  )}
                </div>

                {/* Poster Info */}
                <div className='flex items-center justify-between mb-4 md:mb-6'>
                  <div className='flex items-center gap-2 md:gap-3'>
                    <div className='flex justify-center items-center bg-[#6B46C1] rounded-full w-8 h-8 md:w-9 md:h-9 font-bold text-white text-[8px] md:text-[10px]'>
                      {posterInitial}
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-medium text-gray-400 text-[8px] md:text-[10px]'>
                        Posted by {posterName}
                      </span>
                    </div>
                  </div>

                  {/* Bid Status Badge */}
                  {task.taskerBidInfo?.hasBid && (
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[8px] md:text-[9px] uppercase tracking-wider ${
                        task.taskerBidInfo.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : task.taskerBidInfo.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-[#F5EEFF] text-[#6B46C1]"
                      }`}
                    >
                      {task.taskerBidInfo.status === "accepted"
                        ? "Accepted"
                        : task.taskerBidInfo.status === "rejected"
                          ? "Rejected"
                          : "Bid Pending"}
                    </span>
                  )}
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
                <div className='flex justify-between items-center  border-t border-gray-50 pt-4'>
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
                    {task.taskerBidInfo?.hasBid ? (
                      <div className='text-right'>
                        <div className='text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-none mb-1'>
                          Your Bid
                        </div>
                        <div>
                          ₦{task.taskerBidInfo.amount?.toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      `₦${task.budget?.toLocaleString() || "0"}`
                    )}
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
            <div className='bg-white p-4 rounded-lg shadow-sm'>
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

      {/* Load More Button */}
      {/* {hasNextPage && (
        <div className='flex justify-center pt-8'>
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className='bg-white hover:bg-gray-50 px-8 border border-gray-200 rounded-2xl h-14 font-bold text-[#6B46C1] transition-all overflow-hidden'
          >
            {isFetchingNextPage ? (
              <div className='flex items-center gap-2'>
                <Loader2 className='w-4 h-4 animate-spin' />
                <span>Loading more...</span>
              </div>
            ) : (
              "Load More Tasks"
            )}
          </Button>
        </div>
      )} */}
    </div>
  );
}
