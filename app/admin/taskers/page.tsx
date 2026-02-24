"use client";

import { useState } from "react";
import {
  MoreVertical,
  UserCircle2,
  ExternalLink,
  Ban,
  Download,
  Loader2,
  Star,
  ChevronLeft,
  ChevronRight,
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
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";
import Link from "next/link";
import {
  useAdminTaskers,
  useAdminDashboard,
  useExportTaskers,
} from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";

export default function TaskersManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Fetch dashboard stats for summary metrics
  const { data: dashboardStats } = useAdminDashboard();

  // Fetch taskers with filters
  const { data: taskersData, isLoading: taskersLoading } = useAdminTaskers({
    page,
    limit,
    search: searchQuery || undefined,
    status:
      activeFilter === "All"
        ? undefined
        : activeFilter === "Suspended"
          ? "suspended"
          : activeFilter === "Active"
            ? "active"
            : undefined,
    verified: activeFilter === "Verified" ? true : undefined,
  });

  const { mutate: exportTaskers, isPending: isExporting } = useExportTaskers();

  const handleExport = () => {
    exportTaskers(undefined, {
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
          link.download = `taskers_export_${new Date().getTime()}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      },
    });
  };

  const taskers = taskersData?.taskers ?? [];
  const pagination = taskersData?.pagination;
  const tStats = dashboardStats?.taskers;

  const summaryMetrics = [
    { label: "Total Taskers", value: String(tStats?.total ?? "—") },
    {
      label: "Active",
      value: String(tStats?.active ?? "—"),
      color: "text-green-500",
    },
    {
      label: "Verified",
      value: String(tStats?.verified ?? "—"),
      color: "text-blue-500",
    },
    {
      label: "Suspended",
      value: String(tStats?.suspended ?? "—"),
      color: "text-red-500",
    },
    {
      label: "Pending KYC",
      value: String(tStats?.pending_verification ?? "—"),
      color: "text-yellow-500",
    },
  ];

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
          <h1 className='text-2xl font-bold text-gray-900'>
            Taskers Management
          </h1>
          <p className='text-sm text-gray-500'>Manage all registered taskers</p>
        </div>
        <div className='flex gap-3'>
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
      </div>

      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        {summaryMetrics.map((metric, idx) => (
          <Card key={idx} className='border-none shadow-sm'>
            <CardContent className='p-4'>
              <div className='text-xl font-bold'>{metric.value}</div>
              <div
                className={`text-[10px] mt-1 font-semibold uppercase tracking-wider ${metric.color || "text-gray-500"}`}
              >
                {metric.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className='border-none shadow-sm overflow-hidden'>
        <CardContent className='p-0'>
          <div className='p-6 border-b border-gray-100'>
            <AdminSearchFilter
              searchPlaceholder='Search name or email...'
              searchTerm={searchQuery}
              onSearch={handleSearch}
              filterOptions={["All", "Active", "Suspended", "Verified"]}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className='overflow-x-auto min-h-[400px] relative'>
            {taskersLoading && (
              <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
              </div>
            )}

            <ExpandableTableContainer>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-y bg-gray-50/30 text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                    <th className='px-6 py-4'>TASKERS</th>
                    <th className='px-6 py-4'>CATEGORIES</th>
                    <th className='px-6 py-4'>RATING</th>
                    <th className='px-6 py-4'>STATUS</th>
                    <th className='px-6 py-4'>VERIFICATION</th>
                    <th className='px-6 py-4'>LAST ACTIVE</th>
                    <th className='px-6 py-4 text-right'>ACTION</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {taskers.map((tasker) => (
                    <tr
                      key={tasker._id}
                      className='group hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 shrink-0'>
                            <UserCircle2 size={24} />
                          </div>
                          <div>
                            <div className='font-bold text-gray-900'>
                              {tasker.firstName} {tasker.lastName}
                            </div>
                            <div className='text-xs text-gray-500'>
                              {tasker.emailAddress}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex flex-wrap gap-1'>
                          {tasker.categories.slice(0, 2).map((cat) => (
                            <span
                              key={cat._id}
                              className='px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] rounded-full font-medium border border-gray-100'
                            >
                              {cat.displayName}
                            </span>
                          ))}
                          {tasker.categories.length > 2 && (
                            <span className='px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] rounded-full font-medium'>
                              +{tasker.categories.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='flex items-center gap-1 text-sm font-bold text-gray-900'>
                          <Star
                            size={14}
                            className='fill-[#F59E0B] text-[#F59E0B]'
                          />
                          {tasker.rating?.toFixed(1) ?? "—"}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                            tasker.isSuspended
                              ? "bg-red-50 text-red-500"
                              : tasker.isActive
                                ? "bg-green-50 text-green-500"
                                : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          {tasker.isSuspended
                            ? "Suspended"
                            : tasker.isActive
                              ? "Active"
                              : "Inactive"}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                            tasker.verifyIdentity
                              ? "bg-blue-50 text-blue-500"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {tasker.verifyIdentity ? "Verified" : "Not verified"}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-xs text-gray-500'>
                        {tasker.lastActive
                          ? new Date(tasker.lastActive).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className='px-6 py-4 text-right'>
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
                            <Link href={`/admin/taskers/${tasker._id}`}>
                              <DropdownMenuItem className='gap-2 cursor-pointer'>
                                <ExternalLink size={14} /> View Details
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className='gap-2 cursor-pointer text-red-600 focus:text-red-600'>
                              <Ban size={14} /> Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {!taskersLoading && taskers.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className='py-12 text-center text-gray-400 font-medium'
                      >
                        No taskers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ExpandableTableContainer>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className='flex items-center justify-between px-6 py-4 border-t border-gray-100'>
              <p className='text-xs text-gray-500'>
                Showing page {pagination.currentPage} of {pagination.totalPages}{" "}
                ({pagination.totalTaskers} taskers)
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
