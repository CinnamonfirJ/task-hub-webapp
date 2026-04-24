"use client";

import { useEffect, useState } from "react";
import {
  MoreVertical,
  Search,
  UserCircle2,
  ExternalLink,
  Ban,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import { ExportModal } from "@/components/admin/ExportModal";
import Link from "next/link";
import {
  useAdminUsers,
  useUserStats,
  useExportUsers,
  useLockUser,
  useUnlockUser,
} from "@/hooks/useAdmin";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function UsersManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const limit = 20;

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useUserStats();

  // Fetch users with filters
  const { data: usersData, isLoading: usersLoading, error } = useAdminUsers({
    page,
    limit,
    search: searchQuery,
    status:
      activeFilter === "All" ||
      activeFilter === "Suspended" ||
      activeFilter === "Verified"
        ? undefined
        : activeFilter.toLowerCase(),
    verified: activeFilter === "Verified" ? true : undefined,
  });

  const users = usersData?.users || [];
  const pagination = usersData?.pagination;

  // Calculate total pages accurately
  const totalRecords = pagination?.totalUsers || (usersData as any)?.totalRecords || (usersData as any)?.count || 0;
  const totalPages = pagination?.totalPages || (usersData as any)?.totalPages || Math.ceil(totalRecords / limit);

  // Process users for client-side filter (e.g. Suspended)
  const processedUsers =
    activeFilter === "Suspended"
      ? users.filter((user) => {
          if (!user.lockUntil) return false;
          return new Date(user.lockUntil) > new Date();
        })
      : users;

  const { mutate: lockUser } = useLockUser();
  const { mutate: unlockUser } = useUnlockUser();

  const summaryMetrics = [
    { label: "Total Users", value: stats?.totalUsers?.toLocaleString() || "0" },
    {
      label: "Active",
      value: stats?.active?.toLocaleString() || "0",
      color: "text-green-500",
    },
    { label: "Inactive", value: stats?.inactive?.toLocaleString() || "0" },
    {
      label: "Verified",
      value: stats?.verified?.toLocaleString() || "0",
      color: "text-blue-500",
    },
    {
      label: "Suspended",
      value: stats?.suspended?.toLocaleString() || "0",
      color: "text-red-500",
    },
    {
      label: "Pending KYC",
      value: stats?.kyc_verified?.toLocaleString() || "0",
      color: "text-yellow-500",
    },
    {
      label: "Total Tasks Posted",
      value: stats?.totalTasksPosted?.toLocaleString() || "0",
      color: "text-green-500",
    },
    {
      label: "Completed Tasks",
      value: stats?.completedTasks?.toLocaleString() || "0",
    },
    {
      label: "Unverified",
      value: stats?.unverified?.toLocaleString() || "0",
      color: "text-blue-400",
    },
    {
      label: "Deleted",
      value: stats?.deleted?.toLocaleString() || "0",
      color: "text-red-400",
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on search
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1); // Reset to first page on filter change
  };

  if (statsLoading && page === 1) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Users Management</h1>
          <p className='text-sm text-gray-500'>
            Manage and monitor user accounts and activity
          </p>
        </div>
        <div className='flex gap-3'>
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
                className={`text-xl font-bold ${metric.color || "text-gray-500"}`}
              >
                {metric.value}
              </div>
              <div className='text-[10px] mt-1 font-semibold uppercase tracking-wider'>
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
              filterOptions={[
                "All",
                "Active",
                // "Inactive",
                "Suspended",
                "Verified",
              ]}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
            />
          </div>

          <div className='overflow-x-auto min-h-[400px] relative border-t border-gray-100'>
            {(usersLoading || error) && page === 1 && (
              <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
                {usersLoading ? (
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
                    <th className='px-6 py-4'>USER</th>
                    <th className='px-6 py-4'>CONTACT</th>
                    <th className='px-6 py-4'>STATUS</th>
                    <th className='px-6 py-4'>VERIFICATION</th>
                    <th className='px-6 py-4'>LAST ACTIVE</th>
                    <th className='px-6 py-4 text-right'>ACTION</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {processedUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className='group hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-4 text-xs font-medium text-gray-400'>
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-[#6B46C1] overflow-hidden border border-purple-100'>
                              <UserCircle2 size={24} />
                          </div>
                          <div>
                            <div className='font-bold text-gray-900'>
                              {user.fullName}
                            </div>
                            <div className='text-xs text-gray-500'>
                              {user.emailAddress}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>{user.phoneNumber || "N/A"}</td>

                      <td className='px-6 py-4'>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            user.lockUntil &&
                            new Date(user.lockUntil) > new Date()
                              ? "bg-red-50 text-red-500"
                              : user.isActive
                                ? "bg-green-50 text-green-500"
                                : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          {user.lockUntil &&
                          new Date(user.lockUntil) > new Date()
                            ? "Suspended"
                            : user.isActive
                              ? "Active"
                              : "Inactive"}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex flex-col gap-1'>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase w-fit ${
                              user.isEmailVerified
                                ? "bg-blue-50 text-blue-500"
                                : "bg-gray-50 text-gray-400"
                            }`}
                          >
                            Email: {user.isEmailVerified ? "Verified" : "No"}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase w-fit ${
                              user.isKYCVerified
                                ? "bg-emerald-50 text-emerald-500"
                                : "bg-gray-50 text-gray-400"
                            }`}
                          >
                            KYC: {user.isKYCVerified ? "Verified" : "No"}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-xs font-bold text-gray-900'>
                        <div className='flex justify-center items-center'>
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : "—"}
                        </div>
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
                            <Link href={`/admin/users/${user._id}`}>
                              <DropdownMenuItem className='gap-2 cursor-pointer font-bold text-xs'>
                                <ExternalLink size={14} /> View Details
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              className='gap-2 cursor-pointer text-red-600 focus:text-red-600 font-bold text-xs'
                              onClick={() => {
                                if (user.lockUntil) {
                                  unlockUser(user._id);
                                } else {
                                  lockUser({
                                    id: user._id,
                                    reason: "Suspended by admin",
                                  });
                                }
                              }}
                            >
                              <Ban size={14} />{" "}
                              {user.lockUntil ? "Unlock" : "Lock Account"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {!usersLoading && processedUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className='py-20 text-center text-gray-400 font-medium'
                      >
                        <UserCircle2
                          size={40}
                          className='mx-auto mb-4 opacity-20'
                        />
                        <p>No users found matching your criteria</p>
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
              label='users'
            />
        </CardContent>
      </Card>
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        type="users" 
      />
    </div>
  );
}
