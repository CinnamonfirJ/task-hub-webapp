"use client";

import { useTaskDetails, useTaskerTasks } from "@/hooks/useTaskDetails";
import { Task } from "@/types/task";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { bidsApi } from "@/lib/api/bids";
import { getCategoryName } from "@/hooks/useHome";
import { ChevronLeft, ChevronRight, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api/tasks";
import { Button } from "@/components/ui/button";
import { ActivityItem } from "@/components/ActivityItem";

type StatusFilter =
  | "all"
  | "assigned"
  | "in-progress"
  | "completed"
  | "cancelled";

export default function HistoryPage() {
  const { user } = useAuth();
  const isTasker = user?.role === "tasker";
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const limit = 9;

  const filters: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "assigned", label: "Pending" },
    { key: "in-progress", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  // Fetch tasker tasks from new endpoint
  const {
    data: taskerData,
    isLoading: isTaskerLoading,
    isError: isTaskerError,
  } = useTaskerTasks(
    {
      status: activeFilter,
      page,
      limit,
    },
    { enabled: isTasker }
  );

  // Keep legacy fetch for users (poster)
  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["userTasks"],
    queryFn: () => tasksApi.getUserTasks(),
    enabled: !isTasker,
  });

  const isLoading = isTasker ? isTaskerLoading : isUserLoading;
  const isError = isTasker ? isTaskerError : isUserError;

  // Normalize items to a common format
  const currentItems = isTasker
    ? taskerData?.tasks || []
    : (userData || []).filter((item: any) => {
        if (activeFilter === "all") return true;
        // User (poster) side filtering logic using current status strings
        const status = (item.status || "").toLowerCase();
        if (activeFilter === "assigned") return status === "assigned";
        if (activeFilter === "in-progress")
          return (
            status === "in-progress" ||
            status === "inprogress" ||
            status === "in_progress"
          );
        if (activeFilter === "completed") return status === "completed";
        if (activeFilter === "cancelled")
          return status === "cancelled" || status === "canceled";
        return false;
      });

  const totalPages = isTasker ? taskerData?.totalPages || 1 : 1;

  const isEmpty = !isLoading && currentItems.length === 0;

  return (
    <div className='p-4 md:p-8 space-y-6 md:space-y-8 max-w-6xl'>
      {/* Header */}
      <div>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
          Task History
        </h1>
        <p className='text-sm md:text-base text-gray-600 mt-1'>
          View all your previous tasks
        </p>
      </div>

      {/* Filter Tabs */}
      <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-none'>
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => {
              setActiveFilter(filter.key);
              setPage(1); // Reset to first page on filter change
            }}
            className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === filter.key
                ? "bg-[#6B46C1] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className='flex justify-center py-20'>
          <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
        </div>
      ) : isError ? (
        <div className='text-center py-20 text-red-500'>
          Failed to load tasks. Please try again.
        </div>
      ) : isEmpty ? (
        <div className='flex flex-col items-center justify-center py-20 space-y-6'>
          <div className='bg-purple-100 p-6 rounded-full'>
            <FileText className='h-12 w-12 text-[#6B46C1]' />
          </div>
          <div className='text-center space-y-2'>
            <h2 className='text-2xl font-bold text-gray-900'>
              No{" "}
              {activeFilter === "in-progress"
                ? "Active"
                : filters.find((f) => f.key === activeFilter)?.label}{" "}
              Tasks
            </h2>
            <p className='text-gray-600 max-w-md'>
              {activeFilter === "all"
                ? "You haven't posted or applied for any tasks yet."
                : activeFilter === "assigned"
                  ? "Tasks assigned will appear here."
                  : activeFilter === "in-progress"
                    ? "Tasks currently being worked on will appear here."
                    : activeFilter === "completed"
                      ? "Completed tasks will appear here."
                      : "Cancelled tasks will appear here."}
            </p>
          </div>
          {!isTasker && (
            <Link href='/post-task'>
              <Button className='bg-[#6B46C1] hover:bg-[#553C9A] text-white px-8 py-2 rounded-lg'>
                Post a Task
              </Button>
            </Link>
          )}
        </div>
      ) : (
        // FIX 1: Removed `space-y-4` — it was adding margin-top on every child,
        //         fighting `gap-4` and making vertical spacing uneven.
        // FIX 2: Changed gap-4 → gap-6 for consistent spacing on both axes.
        // FIX 3: Added h-full to Link so it fills the grid cell height.
        // FIX 4: Passed className="h-full" into ActivityItem so it stretches too.
        <div className='space-y-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {currentItems.map((item: any) => {
              // Item is a Task directly from the new API for Taskers
              const task = item;
              const displayTitle = task?.title || "Untitled Task";
              const displayCategory = getCategoryName(task);
              const displayStatus = task.status;

              return (
                <Link
                  key={item._id}
                  href={`/tasks/${task?._id || item._id}`}
                  className='h-full'
                >
                  <ActivityItem
                    id={item._id}
                    title={displayTitle}
                    category={displayCategory}
                    description={task?.description || ""}
                    date={item.createdAt}
                    status={displayStatus}
                    amount={task.budget}
                    className='h-full'
                  />
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {isTasker && totalPages > 1 && (
            <div className='flex items-center justify-center gap-4 pt-4'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className='flex items-center gap-1'
              >
                <ChevronLeft className='h-4 w-4' />
                Previous
              </Button>
              <div className='flex items-center gap-2'>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        page === p
                          ? "bg-[#6B46C1] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className='flex items-center gap-1'
              >
                Next
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
