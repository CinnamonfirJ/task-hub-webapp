"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityItem } from "@/components/ActivityItem";
import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api/tasks";
import { Task } from "@/types/task";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { bidsApi } from "@/lib/api/bids";
import { getCategoryName } from "@/hooks/useHome";

type StatusFilter =
  | "all"
  | "open"
  | "assigned"
  | "inProgress"
  | "completed"
  | "canceled"
  | "rejected";

export default function HistoryPage() {
  const { user } = useAuth();
  const isTasker = user?.role === "tasker";
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  const filters: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "open", label: "Open" },
    { key: "assigned", label: "Assigned" },
    { key: "inProgress", label: "In progress" },
    { key: "completed", label: "Completed" },
    { key: "canceled", label: "Canceled" },
  ];
  
  // Add Rejected filter for taskers
  if (isTasker) {
    filters.push({ key: "rejected", label: "Rejected" });
  }

  // Fetch all user tasks or tasker bids
  const {
    data: items,
    isLoading,
    isError,
  } = useQuery({
    queryKey: isTasker ? ["taskerBids"] : ["userTasks"],
    queryFn: () => (isTasker ? bidsApi.getMyBids() : tasksApi.getUserTasks()) as Promise<any[]>,
  });

  // Normalize items to a common format (or handle separately)
  const currentItems = (items as any[] || []).filter((item: any) => {
    // If Tasker, item is a Bid. If User, item is a Task.
    const status = (isTasker ? (item.status || 'pending') : (item.status || "")).toLowerCase();
    const taskStatus = (isTasker && item.task && typeof item.task === 'object' ? item.task.status : item.status || "").toLowerCase();

    if (activeFilter === "all") return true;

    switch (activeFilter) {
      case "open":
        return isTasker ? status === "pending" : (status === "open" || status === "pending");
      case "assigned":
        return isTasker ? status === "accepted" : (status === "assigned");
      case "inProgress":
        // For tasker, check task status if bid was accepted
        return isTasker 
          ? (status === "accepted" && (taskStatus === "in_progress" || taskStatus === "inprogress"))
          : (status === "in_progress" || status === "inprogress");
      case "completed":
        return isTasker ? (status === "accepted" && taskStatus === "completed") : (status === "completed");
      case "canceled":
        return isTasker ? taskStatus === "cancelled" : (status === "canceled" || status === "cancelled");
      case "rejected":
        return isTasker && status === "rejected";
      default:
        return false;
    }
  });

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
            onClick={() => setActiveFilter(filter.key)}
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
              {activeFilter === "inProgress"
                ? "In Progress"
                : filters.find((f) => f.key === activeFilter)?.label}{" "}
              Tasks
            </h2>
            <p className='text-gray-600 max-w-md'>
              {activeFilter === "open"
                ? "Tasks with open status will appear here."
                : activeFilter === "assigned"
                  ? "Tasks assigned to you will appear here."
                  : activeFilter === "inProgress"
                    ? "Tasks you are working on will appear here."
                    : activeFilter === "completed"
                      ? "Your completed tasks will appear here."
                      : "Canceled tasks will appear here."}
            </p>
          </div>
          <Link href='/post-task'>
            <Button className='bg-[#6B46C1] hover:bg-[#553C9A] text-white px-8 py-2 rounded-lg'>
              Post a Task
            </Button>
          </Link>
        </div>
      ) : (
        // FIX 1: Removed `space-y-4` — it was adding margin-top on every child,
        //         fighting `gap-4` and making vertical spacing uneven.
        // FIX 2: Changed gap-4 → gap-6 for consistent spacing on both axes.
        // FIX 3: Added h-full to Link so it fills the grid cell height.
        // FIX 4: Passed className="h-full" into ActivityItem so it stretches too.
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {currentItems.map((item: any) => {
            const isBid = isTasker;
            const task = isBid ? (typeof item.task === 'object' ? item.task : null) : item;
            const displayTitle = task?.title || (isBid ? "Task" : "Untitled Task");
            const displayCategory = getCategoryName(task);
            const displayStatus = isBid ? (item.status || "Applied") : task.status;
            
            return (
              <Link key={item._id} href={`/tasks/${task?._id || item._id}`} className='h-full'>
                <ActivityItem
                  id={item._id}
                  title={displayTitle}
                  category={displayCategory}
                  description={task?.description || ""}
                  date={item.createdAt}
                  status={displayStatus}
                  amount={isBid ? item.amount : task.budget}
                  className='h-full'
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
