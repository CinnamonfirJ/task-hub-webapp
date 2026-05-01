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
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";
import { ExportModal } from "@/components/admin/ExportModal";
import { SendEmailModal } from "@/components/admin/users/SendEmailModal";
import { SendBulkEmailModal } from "@/components/admin/users/SendBulkEmailModal";
import { Mail, Users } from "lucide-react";
import Link from "next/link";
import {
  useAdminTaskers,
  useAdminDashboard,
  useExportTaskers,
  useLockTasker,
  useUnlockTasker,
} from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";

export default function TaskersManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [selectedTasker, setSelectedTasker] = useState<{ id: string; name: string; email: string } | null>(null);
  const limit = 20;

  // Fetch dashboard stats for summary metrics
  const { data: dashboardStats } = useAdminDashboard();

  // Fetch taskers with filters
  const { data: taskersData, isLoading: taskersLoading, error } = useAdminTaskers({
    page,
    limit,
    search: searchQuery || undefined,
    status:
      activeFilter === "All" ||
      activeFilter === "Verified" ||
      activeFilter === "Unverified"
        ? undefined
        : activeFilter.toLowerCase(),
    verified: activeFilter === "Verified" ? true : undefined,
  });

  const { mutate: lockTasker } = useLockTasker();
  const { mutate: unlockTasker } = useUnlockTasker();

  const taskers = taskersData?.taskers ?? [];
  const pagination = taskersData?.pagination;
  const totalRecords = pagination?.totalTaskers || (taskersData as any)?.totalRecords || (taskersData as any)?.count || 0;
  const totalPages = pagination?.totalPages || (taskersData as any)?.totalPages || Math.ceil(totalRecords / limit);

  // Process taskers for client-side filter validation (e.g. strict Locked time check, Unverified check fallback)
  const processedTaskers = taskers.filter((tasker) => {
    // 1. Unverified Filter
    if (activeFilter === "Unverified") {
      return tasker.verifyIdentity === false;
    }

    // // 2. Locked Filter
    // if (activeFilter === "Locked") {
    //   if (!tasker.lockUntil) return false;
    //   const lockDate = new Date(tasker.lockUntil);
    //   return !isNaN(lockDate.getTime()) && lockDate > new Date();
    // }

    // 3. Active Filter (Exclude locked taskers)
    if (activeFilter === "Active") {
      if (tasker.lockUntil) {
        const lockDate = new Date(tasker.lockUntil);
        if (!isNaN(lockDate.getTime()) && lockDate > new Date()) {
          return false; // Tasker is locked, so they shouldn't be in the Active list
        }
      }
      return true; // Rely on the API's isActive filtering for the rest
    }

    // 4. Verified Filter
    if (activeFilter === "Verified") {
      return tasker.verifyIdentity === true;
    }

    // 5. All (Rely on API)
    return true;
  });
  const summaryMetrics = [
    {
      label: "Total Taskers",
      value: dashboardStats?.cards?.totalTaskers?.toLocaleString() || "0",
    },
    {
      label: "Active Tasks",
      value: dashboardStats?.cards?.activeTasks?.toLocaleString() || "0",
      color: "text-green-500",
    },
    {
      label: "Pending KYC",
      value: dashboardStats?.cards?.pendingKyc?.toLocaleString() || "0",
      color: "text-yellow-500",
    },
    {
      label: "Growth",
      value: dashboardStats?.growth ? `+${dashboardStats.growth}%` : "0%",
      color: "text-purple-500",
    },
    {
      label: "Revenue",
      value: formatCurrency(dashboardStats?.cards?.totalRevenue || 0),
      color: "text-emerald-500",
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
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        type="taskers" 
      />
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Taskers Management
          </h1>
          <p className='text-sm text-gray-500'>Manage all registered taskers</p>
        </div>
        <div className='flex gap-3'>
          <Button
            onClick={() => setIsBulkEmailModalOpen(true)}
            variant='outline'
            className='text-sm h-10 px-4 gap-2 border-gray-200 text-purple-600 hover:text-purple-700'
          >
            <Users size={16} />
            Bulk Email
          </Button>
          <Button
            onClick={() => setIsExportModalOpen(true)}
            variant='outline'
            className='text-sm h-10 px-4 gap-2 border-gray-200'
          >
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        {summaryMetrics.map((metric, idx) => (
          <Card key={idx} className='border-none shadow-sm'>
            <CardContent className='p-4'>
              <div
                className={`text-xl font-bold ${metric.color || "text-gray-900"}`}
              >
                {metric.value}
              </div>
              <div className='text-[10px] mt-1 font-semibold uppercase tracking-wider text-gray-500'>
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
              filterOptions={["All", "Active", "Verified", "Unverified"]}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className='overflow-x-auto min-h-[400px] relative'>
            {(taskersLoading || error) && (
              <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
                {taskersLoading ? (
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
                    <th className='px-6 py-4'>TASKERS</th>
                    <th className='px-6 py-4'>CATEGORIES</th>
                    <th className='px-6 py-4'>RATING</th>
                    <th className='px-6 py-4'>STATUS</th>
                    <th className='px-6 py-4'>VERIFICATION</th>
                    {/* <th className='px-6 py-4'>LAST ACTIVE</th> */}
                    <th className='px-6 py-4 text-right'>ACTION</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {processedTaskers.map((tasker, index) => (
                    <tr
                      key={tasker._id}
                      className='group hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-4 text-xs font-medium text-gray-400'>
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 shrink-0'>
                             {tasker.profilePicture ? (
                                  <img src={tasker.profilePicture} alt="Profile" className="w-full h-full items-center"/>
                                ) : (
                                  <UserCircle2 size={24} />
                                )}
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
                              {cat.name}
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
                          {tasker.averageRating?.toFixed(1) ?? "—"}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                            tasker.lockUntil &&
                            new Date(tasker.lockUntil) > new Date()
                              ? "bg-red-50 text-red-500"
                              : tasker.isActive
                                ? "bg-green-50 text-green-500"
                                : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          {tasker.lockUntil &&
                          new Date(tasker.lockUntil) > new Date()
                            ? "Locked"
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
                      {/* <td className='px-6 py-4 text-xs text-gray-500'>
                        {tasker.lastLogin
                          ? new Date(tasker.lastLogin).toLocaleDateString()
                          : "—"}
                      </td> */}
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
                            <DropdownMenuItem
                              className='gap-2 cursor-pointer text-purple-600 focus:text-purple-600 font-bold text-xs'
                              onClick={() => {
                                setSelectedTasker({
                                  id: tasker._id,
                                  name: `${tasker.firstName} ${tasker.lastName}`,
                                  email: tasker.emailAddress,
                                });
                                setIsEmailModalOpen(true);
                              }}
                            >
                              <Mail size={14} /> Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className='gap-2 cursor-pointer text-red-600 focus:text-red-600 font-bold text-xs'
                              onClick={() => {
                                if (tasker.lockUntil) {
                                  unlockTasker(tasker._id);
                                } else {
                                  lockTasker({
                                    id: tasker._id,
                                    reason: "Locked by admin",
                                  });
                                }
                              }}
                            >
                              <Ban size={14} /> 
                              {tasker.lockUntil ? "Unlock" : "Lock Account"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {!taskersLoading && processedTaskers.length === 0 && (
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
            </div>

            <AdminPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalRecords={totalRecords}
              label='taskers'
            />
        </CardContent>
      </Card>
      {selectedTasker && (
        <SendEmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          userId={selectedTasker.id}
          userName={selectedTasker.name}
          userEmail={selectedTasker.email}
          type="tasker"
        />
      )}
      <SendBulkEmailModal
        isOpen={isBulkEmailModalOpen}
        onClose={() => setIsBulkEmailModalOpen(false)}
        type="tasker"
      />
    </div>
  );
}
