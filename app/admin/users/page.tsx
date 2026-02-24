"use client";

import { useState } from "react";
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
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import Link from "next/link";
import { useAdminUsers, useUserStats, useExportUsers } from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";

export default function UsersManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
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
    status: activeFilter === "All" ? undefined : activeFilter.toLowerCase(),
    verified: activeFilter === "Verified" ? true : undefined,
  });

  // Update visible users when new data comes in
  useEffect(() => {
    if (usersData?.users) {
      if (page === 1) {
        setVisibleUsers(usersData.users);
      } else {
        setVisibleUsers((prev) => {
          // Prevent duplicates
          const existingIds = new Set(prev.map((u) => u._id));
          const newUsers = usersData.users.filter(
            (u) => !existingIds.has(u._id),
          );
          return [...prev, ...newUsers];
        });
      }
      setHasMore(usersData.pagination.hasNext);
    }
  }, [usersData, page]);

  const { mutate: exportUsers, isPending: isExporting } = useExportUsers();

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
    { label: "Total Users", value: stats?.total.toLocaleString() || "0" },
    {
      label: "Active",
      value: stats?.active.toLocaleString() || "0",
      color: "text-green-500",
    },
    { label: "Inactive", value: stats?.inactive.toLocaleString() || "0" },
    {
      label: "Verified",
      value: stats?.verified.toLocaleString() || "0",
      color: "text-blue-500",
    },
    {
      label: "Suspended",
      value: stats?.locked.toLocaleString() || "0",
      color: "text-red-500",
    },
    {
      label: "KYC Verified",
      value: stats?.kyc_verified.toLocaleString() || "0",
      color: "text-emerald-500",
    },
    {
      label: "Unverified",
      value: stats?.unverified.toLocaleString() || "0",
      color: "text-gray-400",
    },
    {
      label: "Growth (Week)",
      value: `+${stats?.growth.this_week || 0}`,
      color: "text-indigo-500",
    },
    {
      label: "Growth (Month)",
      value: `+${stats?.growth.this_month || 0}`,
      color: "text-indigo-600",
    },
    {
      label: "Deleted",
      value: stats?.deleted.toLocaleString() || "0",
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
              filterOptions={["All", "Active", "Locked", "Verified"]}
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
                    <th className='px-6 py-4'>STATS</th>
                    <th className='px-6 py-4'>WALLET</th>
                    <th className='px-6 py-4'>STATUS</th>
                    <th className='px-6 py-4'>VERIFICATION</th>
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
                      <td className='px-6 py-4'>
                        <div className='text-[10px] space-y-0.5'>
                          <div className='text-gray-500 flex justify-between gap-4'>
                            Tasks:{" "}
                            <span className='font-bold text-gray-900'>
                              {user.stats?.totalTasks || 0}
                            </span>
                          </div>
                          <div className='text-gray-500 flex justify-between gap-4'>
                            Spent:{" "}
                            <span className='font-bold text-gray-900'>
                              {formatCurrency(user.stats?.totalSpent || 0)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-xs font-bold text-gray-900'>
                        {formatCurrency(user.wallet || 0)}
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            user.isLocked
                              ? "bg-red-50 text-red-500"
                              : user.isActive
                                ? "bg-green-50 text-green-500"
                                : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          {user.isLocked
                            ? "Locked"
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
                      <td className='px-6 py-4 text-right'>
                        <Link href={`/admin/users/${user._id}`}>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 px-3 text-[#6B46C1] hover:text-[#553C9A] hover:bg-purple-50 font-bold text-xs gap-2'
                          >
                            <ExternalLink size={14} /> View
                          </Button>
                        </Link>
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

              {/* Load More Button Integrated via ExpandableTableContainer logic if possible, 
                  but here we manually inject if it's simpler or expected outside the table */}
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
    </div>
  );
}
