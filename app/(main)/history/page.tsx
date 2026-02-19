"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityItem } from "@/components/ActivityItem";
import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api/tasks";
import { Task } from "@/types/task";
import Link from "next/link";

type StatusFilter =
  | "open"
  | "assigned"
  | "inProgress"
  | "completed"
  | "canceled";

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("open");

  const filters: { key: StatusFilter; label: string }[] = [
    { key: "open", label: "Open" },
    { key: "assigned", label: "Assigned" },
    { key: "inProgress", label: "In progress" },
    { key: "completed", label: "Completed" },
    { key: "canceled", label: "Canceled" },
  ];

  // Fetch all user tasks
  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userTasks"],
    queryFn: () => tasksApi.getUserTasks(),
  });

  // Filter tasks based on active tabs
  // API statuses might differ slightly, so we normalize
  const currentTasks = (tasks || []).filter((task: Task) => {
    const status = task.status?.toLowerCase() || "";

    switch (activeFilter) {
      case "open":
        return status === "open";
      case "assigned":
        return status === "assigned";
      case "inProgress":
        return status === "in_progress" || status === "inprogress";
      case "completed":
        return status === "completed";
      case "canceled":
        return status === "canceled" || status === "cancelled";
      default:
        return false;
    }
  });

  const isEmpty = !isLoading && currentTasks.length === 0;

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
        <div className='space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {currentTasks.map((task) => (
            <Link href={`/tasks/${task._id}`}>
              <ActivityItem
                key={task._id}
                id={task._id}
                title={task.title}
                // Handle category object or string
                category={
                  typeof task.categories?.[0] === "string"
                    ? task.categories[0]
                    : task.categories?.[0]?.displayName ||
                      task.categories?.[0]?.name ||
                      "General"
                }
                description={task.description}
                date={task.createdAt}
                status={task.status}
                amount={task.budget}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
