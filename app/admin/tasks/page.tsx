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
import { AdminPagination } from "@/components/admin/AdminPagination";
import { ApiError } from "@/lib/api";
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
import { useAdminTasks, useTaskStats } from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";
import { ExportModal } from "@/components/admin/ExportModal";

export default function TasksManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const statusParam =
    activeFilter === "All"
      ? undefined
      : activeFilter === "In-progress"
        ? "in_progress"
        : activeFilter.toLowerCase();

  const { data: taskStats } = useTaskStats();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { data: tasksData, isLoading, error } = useAdminTasks({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusParam,
  });

  const tasks = tasksData?.tasks ?? [];
  const totalRecords = tasksData?.totalRecords ?? 0;
  const totalPages = tasksData?.totalPages ?? Math.ceil(totalRecords / limit);

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
    setSearchTerm(value);
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
          onClick={() => setIsExportModalOpen(true)}
          variant='outline'
          className='text-sm h-10 px-4 gap-2'
        >
          <Download size={16} />
          Export
        </Button>
      </div>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        type="tasks" 
      />

      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        {taskMetrics.map((metric: { label: string; value: string; color?: string }, idx: number) => (
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
              searchTerm={searchTerm}
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
            {(isLoading || error) && (
              <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
                {isLoading ? (
                  <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
                ) : (
                  <div className='text-center p-6 bg-white rounded-xl shadow-lg border border-red-50 max-w-sm mx-auto'>
                    <div className='w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <div className='w-6 h-6 text-red-500 font-bold'>!</div>
                    </div>
                    <p className='text-gray-900 font-bold mb-1'>{(error as any)?.message || "Request failed"}</p>
                    <p className='text-gray-500 text-xs mb-4'>Please check your connection or try again later.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.location.reload()}
                      className="border-red-100 text-red-600 hover:bg-red-50"
                    >
                      Try again
                    </Button>
                  </div>
                )}
              </div>
            )}
            <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-y bg-gray-50/30 text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                    <th className='px-6 py-4 w-12'>#</th>
                    <th className='px-6 py-4'>TASK</th>
                    <th className='px-6 py-4'>POSTED BY</th>
                    <th className='px-6 py-4'>ASSIGNED TASKER</th>
                    <th className='px-6 py-4'>CATEGORY</th>
                    <th className='px-6 py-4'>BUDGET</th>
                    <th className='px-6 py-4'>STATUS</th>
                    <th className='px-6 py-4 text-right'>ACTION</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {tasks.map((task: any, index: number) => (
                    <tr
                      key={task._id}
                      className='group hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-4 text-xs font-medium text-gray-400'>
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className='px-6 py-5'>
                        <div className='flex flex-col gap-1'>
                          <Link
                            href={`/admin/tasks/${task._id}`}
                            className='font-bold text-gray-900 hover:text-[#6B46C1] transition-colors line-clamp-1'
                          >
                            {task.title}
                          </Link>
                          <div className='flex items-center gap-2'>
                            <span className='text-[10px] text-gray-400 font-medium'>
                              {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                            {task.university && (
                              <span className='text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase font-semibold'>
                                Uni Member
                              </span>
                            )}
                            {task.images && task.images.length > 0 && (
                              <span className='text-[10px] text-[#6B46C1] font-medium'>
                                {task.images.length} {task.images.length === 1 ? 'image' : 'images'}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <Link 
                          href={`/admin/users/${task.user?._id || task.user?.id || task.userId}`}
                          className='flex items-center gap-3 group/user'
                        >
                          <div className='w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#6B46C1] overflow-hidden border border-purple-100 shrink-0'>
                            {task.user?.profilePicture ? (
                              <img src={task.user.profilePicture} alt="User" className="w-full h-full object-cover"/>
                            ) : (
                              <span className='text-[10px] font-bold uppercase'>{(task.user?.fullName || "U").charAt(0)}</span>
                            )}
                          </div>
                          <div className='flex flex-col'>
                            <span className='text-xs font-bold text-gray-900 group-hover/user:text-[#6B46C1] group-hover/user:underline'>
                              {task.user?.fullName || "Unknown User"}
                            </span>
                            <span className='text-[10px] text-gray-500 font-medium'>
                              {task.user?.emailAddress || "—"}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className='px-6 py-5'>
                        {task.assignedTo ? (
                          <Link 
                            href={`/admin/taskers/${task.assignedTo._id || task.assignedTo.id || task.taskerId}`}
                            className='flex items-center gap-3 group/tasker'
                          >
                            <div className='w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 overflow-hidden border border-emerald-100 shrink-0'>
                              {task.assignedTo.profilePicture ? (
                                <img src={task.assignedTo.profilePicture} alt="Tasker" className="w-full h-full object-cover"/>
                              ) : (
                                <span className='text-[10px] font-bold uppercase'>{(task.assignedTo.firstName || "T").charAt(0)}</span>
                              )}
                            </div>
                            <div className='flex flex-col'>
                              <span className='text-xs font-bold text-gray-900 group-hover/tasker:text-[#6B46C1] group-hover/tasker:underline'>
                                {task.assignedTo.firstName} {task.assignedTo.lastName}
                              </span>
                              <span className='text-[10px] text-gray-500 font-medium'>
                                {task.assignedTo.emailAddress}
                              </span>
                            </div>
                          </Link>
                        ) : (
                          <span className='text-xs text-gray-400 italic font-medium'>Unassigned</span>
                        )}
                      </td>
                      <td className='px-6 py-5'>
                        <div className='flex flex-wrap gap-1'>
                          {task.mainCategory?.name && (
                            <span className='text-[10px] bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200 font-medium uppercase tracking-tight'>
                              {task.mainCategory.name}
                            </span>
                          )}
                          {task.subCategory?.name && (
                            <span className='text-[10px] bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 font-medium uppercase tracking-tight'>
                              {task.subCategory.name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-5 font-bold text-gray-900'>
                        {formatCurrency(task.budget)}
                      </td>
                      <td className='px-6 py-5'>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold ${statusColor[task.status || ""] || "text-gray-500 bg-gray-50"}`}
                        >
                          {(task.status || "unknown")
                            .replace("_", " ")
                            .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </span>
                      </td>
                      <td className='px-6 py-5 text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 text-gray-400 hover:text-gray-600'
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
                        colSpan={7}
                        className='py-12 text-center text-gray-400 font-medium'
                      >
                        No tasks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <AdminPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalRecords={totalRecords}
              label='tasks'
            />
        </CardContent>
      </Card>
    </div>
  );
}
