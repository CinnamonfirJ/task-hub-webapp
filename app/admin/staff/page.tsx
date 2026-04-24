"use client";

import { useState } from "react";
import {
  Search,
  UserPlus,
  X,
  Filter,
  Loader2,
  MoreVertical,
  ExternalLink,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import Link from "next/link";
import {
  useStaffStats,
  useAdminStaffList,
  useCreateStaff,
} from "@/hooks/useAdmin";
import { format } from "date-fns";

export default function StaffPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Form state for invite
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "operations" as const,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(Page => 1);
  };

  const { data: stats, isLoading: statsLoading } = useStaffStats();
  const { data: staffData, isLoading: staffLoading } = useAdminStaffList({
    page,
    limit,
    status: activeFilter === "All" ? undefined : activeFilter.toLowerCase(),
    search: searchQuery,
  });
  const { mutate: inviteAdmin, isPending: isInviting } = useCreateStaff();

  const totalRecords = staffData?.pagination?.totalStaff || (staffData as any)?.totalRecords || (staffData as any)?.count || 0;
  const totalPages = (staffData as any)?.totalPages || Math.ceil(totalRecords / limit);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inviteAdmin(inviteForm, {
      onSuccess: () => {
        setIsInviteModalOpen(false);
        setInviteForm({ email: "", role: "operations" });
      },
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-700";
      case "operations":
        return "bg-blue-100 text-blue-700";
      case "trust_safety":
        return "bg-orange-100 text-orange-700";
      case "finance":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const displayStats = [
    { label: "Total Admin", value: stats?.totalAdmin?.toString() || "0" },
    {
      label: "Active Today",
      value: stats?.activeToday?.toString() || "0",
      color: "text-green-600",
    },
    {
      label: "Super Admin",
      value: stats?.superAdmin?.toString() || "0",
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Staff & Admin Management
          </h1>
          <p className='text-sm text-gray-500'>
            Manage administrative users and permissions
          </p>
        </div>
        <Button
          onClick={() => setIsInviteModalOpen(true)}
          className='bg-[#6B46C1] hover:bg-[#5a3da1] text-white gap-2'
        >
          <UserPlus size={18} /> Invite Admin
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {statsLoading
          ? [1, 2, 3].map((i) => (
              <Card key={i} className='border shadow-sm animate-pulse'>
                <CardContent className='p-6 h-24 bg-gray-50/50' />
              </Card>
            ))
          : displayStats.map((stat, idx) => (
              <Card key={idx} className='border shadow-sm'>
                <CardContent className='p-6'>
                  <div
                    className={`text-3xl font-bold ${stat.color || "text-gray-900"}`}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={`text-[10px] mt-1 font-semibold uppercase tracking-wider text-gray-500`}
                  >
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className='bg-white p-4 rounded-lg shadow-sm border'>
        <AdminSearchFilter
          searchPlaceholder='Search name or email...'
          searchTerm={searchQuery}
          onSearch={handleSearch}
          filterOptions={["All", "Active", "Inactive"]}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className='space-y-4'>
        <h2 className='text-lg font-bold text-gray-900'>Admin Users</h2>
        <div className='grid gap-4'>
          {staffLoading ? (
            <div className='flex justify-center p-8'>
              <Loader2 className='animate-spin text-purple-600' size={32} />
            </div>
          ) : staffData?.staff.length === 0 ? (
            <div className='text-center p-8 text-gray-500'>
              No staff members found.
            </div>
          ) : (
            staffData?.staff.map((user, index) => (
              <div key={user._id} className='relative group'>
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-400 z-10 border border-white">
                  {(page - 1) * limit + index + 1}
                </div>
                <Link href={`/admin/staff/${user._id}`}>
                  <Card className='hover:shadow-md transition-shadow cursor-pointer border-gray-100'>
                    <CardContent className='p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                      <div className='flex items-center gap-4'>
                        <div className='h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold shrink-0'>
                          {user.name?.charAt(0) || "?"}
                        </div>
                        <div className='space-y-1'>
                          <div className='font-semibold text-gray-900'>
                            {user.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {user.email}
                          </div>
                          <div className='flex flex-wrap items-center gap-2 text-xs'>
                            <span
                              className={`px-2 py-0.5 rounded-full uppercase tracking-wider font-bold text-[10px] ${getRoleBadgeColor(user.role)}`}
                            >
                              {user.role.replace("_", " ")}
                            </span>
                            <span className='text-gray-400'>
                              Joined{" "}
                              {format(new Date(user.createdAt), "MM/dd/yyyy")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-4'>
                        <Badge
                          variant='secondary'
                          className={`${
                            user.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          } font-medium mr-10 md:mr-0`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <div className='absolute right-4 top-1/2 -translate-y-1/2'>
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
                      <Link href={`/admin/staff/${user._id}`}>
                        <DropdownMenuItem className='gap-2 cursor-pointer font-bold text-xs'>
                          <ExternalLink size={14} /> View Details
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem className='gap-2 cursor-pointer text-red-600 focus:text-red-600 font-bold text-xs'>
                        {user.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalRecords={totalRecords}
          label='staff'
          className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
        />
      </div>

      {/* Invite Admin Modal */}
      {isInviteModalOpen && (
        <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg shadow-xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto no-scrollbar'>
            <form onSubmit={handleInviteSubmit}>
              <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
                <div>
                  <h2 className='text-xl font-bold text-gray-900'>
                    Invite Admin
                  </h2>
                  <p className='text-sm text-gray-500 mt-1'>
                    Send an invitation to add a new administrator.
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => setIsInviteModalOpen(false)}
                  className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors'
                >
                  <X size={20} />
                </button>
              </div>

              <div className='p-6 space-y-5'>

                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-gray-900'>
                    Email Address
                  </label>
                  <Input
                    required
                    type='email'
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm({
                        ...inviteForm,
                        email: e.target.value,
                      })
                    }
                    placeholder='Enter email address'
                    className='bg-gray-50/50 border-gray-200 focus-visible:ring-purple-200 h-11'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-gray-900'>
                    Role
                  </label>
                  <select
                    required
                    value={inviteForm.role}
                    onChange={(e) =>
                      setInviteForm({
                        ...inviteForm,
                        role: e.target.value as any,
                      })
                    }
                    className="w-full h-11 px-3 rounded-md bg-gray-50/50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-size-[20px_20px] bg-no-repeat bg-position-[right_10px_center] pr-10"
                  >
                    <option value='operations'>Operations Admin</option>
                    <option value='trust_safety'>Trust & Safety Admin</option>
                    <option value='finance'>Finance Admin</option>
                    <option value='super_admin'>Super Admin</option>
                  </select>
                </div>
              </div>

              <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsInviteModalOpen(false)}
                  className='font-semibold text-gray-600 bg-white'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={isInviting}
                  className='bg-[#6B46C1] hover:bg-[#5a3da1] text-white font-semibold flex gap-2'
                >
                  {isInviting && <Loader2 size={16} className='animate-spin' />}
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
