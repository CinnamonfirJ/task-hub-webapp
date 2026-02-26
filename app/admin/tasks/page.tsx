"use client";

import { useState } from "react";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
  ExternalLink,
  Ban,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import Link from "next/link";
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";
import { useAdminTasks, useTaskStats, useExportTasks } from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";

export default function TasksManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const statusParam =
    activeFilter === "All"
      ? undefined
      : activeFilter === "In-progress"
        ? "in_progress"
        : activeFilter.toLowerCase();

  const { data: taskStats } = useTaskStats();
  const { data: tasksData, isLoading } = useAdminTasks({
    page,
    limit,
    search: searchQuery || undefined,
    status: statusParam,
  });

  const { mutate: exportTasks, isPending: isExporting } = useExportTasks();

  const handleExport = () => {
    exportTasks(
      {
        status: statusParam,
      },
      {
        onSuccess: (data) => {
          if (data.downloadUrl) {
            window.open(data.downloadUrl, "_blank");
          } else {
            const blob = new Blob([JSON.stringify(data, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `tasks_export_${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        },
      },
    );
  };

  const tasks = tasksData?.tasks ?? [];
  const pagination = tasksData?.pagination;

  const taskMetrics = [
    { label: "Total Tasks", value: String(taskStats?.total ?? "—") },
    {
      label: "Open Tasks",
      value: String(taskStats?.open ?? "—"),
      color: "text-green-500",
    },
    {
      label: "In-Progress",
      value: String(taskStats?.inProgress ?? "—"),
    },
    {
      label: "Completed",
      value: String(taskStats?.completed ?? "—"),
    },
    {
      label: "Cancelled",
      value: String(taskStats?.cancelled ?? "—"),
    },
  ];

  const statusColor: Record<string, string> = {
    open: "text-green-500 bg-green-50",
    in_progress: "text-blue-500 bg-blue-50",
    completed: "text-emerald-500 bg-emerald-50",
    cancelled: "text-red-500 bg-red-50",
    assigned: "text-orange-500 bg-orange-50",
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Tasks Management</h1>
          <p className='text-sm text-gray-500'>Monitor and manage all tasks</p>
        </div>
        <Button
          disabled={isExporting}
          onClick={handleExport}
          variant='outline'
          className='text-sm h-10 px-4 gap-2'
        >
          {isExporting ? (
            <Loader2 size={16} className='animate-spin' />
          ) : (
            <Download size={16} />
          )}
          Export
        </Button>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        {taskMetrics.map((metric, idx) => (
          <Card key={idx} className='border border-gray-100 shadow-sm'>
            <CardContent className='p-4'>
              <div
                className={`text-xl font-bold ${metric.color || "text-gray-900"}`}
              >
                {metric.value}
              </div>
              <div className='text-[10px] mt-1 font-semibold uppercase tracking-wider text-gray-400'>
                {metric.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className='border border-gray-100 shadow-sm overflow-hidden'>
        <CardContent className='p-0'>
          <div className='p-6 border-b border-gray-100'>
            <AdminSearchFilter
              searchPlaceholder='Search task title...'
              searchTerm={searchQuery}
              onSearch={handleSearch}
              filterOptions={[
                "All",
                "Open",
                "In-progress",
                "Completed",
                "Cancelled",
              ]}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className='overflow-x-auto min-h-[400px] relative'>
            {isLoading && (
              <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
              </div>
            )}
            <ExpandableTableContainer>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-y bg-gray-50/30 text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                    <th className='px-6 py-4'>TASK</th>
                    <th className='px-6 py-4'>POSTED BY</th>
                    <th className='px-6 py-4'>CATEGORY</th>
                    <th className='px-6 py-4'>BUDGET</th>
                    <th className='px-6 py-4'>STATUS</th>
                    <th className='px-6 py-4'>DATE</th>
                    <th className='px-6 py-4 text-right'>ACTION</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {tasks.map((task) => (
                    <tr
                      key={task._id}
                      className='group hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-5'>
                        <Link
                          href={`/admin/tasks/${task._id}`}
                          className='font-bold text-gray-900 hover:text-[#6B46C1] transition-colors'
                        >
                          {task.title}
                        </Link>
                      </td>
                      <td className='px-6 py-5 text-gray-500 font-medium text-xs'>
                        {task.user.emailAddress}
                      </td>
                      <td className='px-6 py-5'>
                        {task.categories.map((cat) => (
                          <span
                            key={cat._id}
                            className='text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100 font-medium mr-1'
                          >
                            {cat.displayName}
                          </span>
                        ))}
                      </td>
                      <td className='px-6 py-5 font-bold text-gray-900'>
                        {formatCurrency(task.budget)}
                      </td>
                      <td className='px-6 py-5'>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold ${statusColor[task.status] || "text-gray-500 bg-gray-50"}`}
                        >
                          {task.status
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </td>
                      <td className='px-6 py-5 text-gray-500 font-medium text-xs'>
                        {new Date(task.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-5 text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 text-gray-400'
                            >
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='w-40'>
                            <Link href={`/admin/tasks/${task._id}`}>
                              <DropdownMenuItem className='gap-2 cursor-pointer font-bold text-xs'>
                                <ExternalLink size={14} /> View Details
                              </DropdownMenuItem>
                            </Link>
                            {task.status !== "cancelled" &&
                              task.status !== "completed" && (
                                <DropdownMenuItem className='gap-2 cursor-pointer text-red-600 focus:text-red-600 font-bold text-xs'>
                                  <Ban size={14} /> Force Cancel
                                </DropdownMenuItem>
                              )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {!isLoading && tasks.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className='py-12 text-center text-gray-400 font-medium'
                      >
                        No tasks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ExpandableTableContainer>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className='flex items-center justify-between px-6 py-4 border-t border-gray-100'>
              <p className='text-xs text-gray-500'>
                Page {pagination.currentPage} of {pagination.totalPages} (
                {pagination.totalTasks} tasks)
              </p>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrev}
                  className='h-8 w-8 p-0'
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNext}
                  className='h-8 w-8 p-0'
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
