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
import { formatCurrency } from "@/lib/utils";
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";

export default function UsersManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const limit = 10;

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useUserStats();

  // Local state for users for "Load more" functionality
  const [visibleUsers, setVisibleUsers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(false);

  // Fetch users with filters
  const { data: usersData, isLoading: usersLoading } = useAdminUsers({
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

  // Update visible users when new data comes in
  useEffect(() => {
    if (usersData?.users) {
      // client-side filter for "Suspended" until backend is updated
      const processedUsers =
        activeFilter === "Suspended"
          ? usersData.users.filter((user) => {
              if (!user.lockUntil) return false;
              return new Date(user.lockUntil) > new Date();
            })
          : usersData.users;

      if (page === 1) {
        setVisibleUsers(processedUsers);
      } else {
        setVisibleUsers((prev) => {
          // Prevent duplicates
          const existingIds = new Set(prev.map((u) => u._id));
          const newUsers = processedUsers.filter(
            (u) => !existingIds.has(u._id),
          );
          return [...prev, ...newUsers];
        });
      }
      setHasMore(usersData.pagination?.hasNext ?? false);
    }
  }, [usersData, page, activeFilter]);

  const { mutate: exportUsers, isPending: isExporting } = useExportUsers();
  const { mutate: lockUser } = useLockUser();
  const { mutate: unlockUser } = useUnlockUser();

  const handleExport = () => {
    exportUsers(undefined, {
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
          link.download = `users_export_${new Date().getTime()}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      },
    });
  };

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

  const handleLoadMore = () => {
    if (hasMore && !usersLoading) {
      setPage((prev) => prev + 1);
    }
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
            className='text-sm h-10 px-4 gap-2'
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

          <div className='overflow-x-auto relative'>
            {usersLoading && page === 1 && (
              <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
              </div>
            )}
            <ExpandableTableContainer>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-y bg-gray-50/30 text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                    <th className='px-6 py-4'>USER</th>
                    <th className='px-6 py-4'>CONTACT</th>
                    <th className='px-6 py-4'>STATUS</th>
                    <th className='px-6 py-4'>VERIFICATION</th>
                    <th className='px-6 py-4'>LAST ACTIVE</th>
                    <th className='px-6 py-4 text-right'>ACTION</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {visibleUsers.map((user) => (
                    <tr
                      key={user._id}
                      className='group hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-[#6B46C1] overflow-hidden border border-purple-100'>
                            {user.profilePicture ? (
                              <img
                                src={user.profilePicture}
                                alt=''
                                className='w-full h-full object-cover'
                              />
                            ) : (
                              <UserCircle2 size={24} />
                            )}
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
                  {!usersLoading && visibleUsers.length === 0 && (
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

              {hasMore && (
                <div className='p-6 flex justify-center border-t border-gray-100'>
                  <Button
                    onClick={handleLoadMore}
                    disabled={usersLoading}
                    className='bg-[#6B46C1] hover:bg-[#553C9A] text-white px-8 rounded-lg text-sm font-semibold h-10 transition-colors'
                  >
                    {usersLoading ? (
                      <Loader2 size={18} className='animate-spin mr-2' />
                    ) : null}
                    Load more
                  </Button>
                </div>
              )}
            </ExpandableTableContainer>
          </div>
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
