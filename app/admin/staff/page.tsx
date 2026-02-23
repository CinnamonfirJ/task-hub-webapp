"use client";

import { useState } from "react";
import { Search, UserPlus, X, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import Link from "next/link";

// Mock data for stats
const stats = [
  { label: "Total Admin", value: "7" },
  { label: "Active Today", value: "7", color: "text-green-600" },
  { label: "Super Admin", value: "1" },
];

// Mock data for admin users
const adminUsers = [
  {
    id: 1,
    name: "Adewale Thompson",
    email: "adewale.t@example.com",
    role: "Administrator",
    roleColor: "bg-purple-100 text-purple-700",
    joinDate: "11/15/2025",
    status: "Active",
  },
  {
    id: 2,
    name: "Adewale Thompson",
    email: "adewale.t@example.com",
    role: "Operations Admin",
    roleColor: "bg-purple-100 text-purple-700",
    joinDate: "11/15/2025",
    status: "Active",
  },
  {
    id: 3,
    name: "Adewale Thompson",
    email: "adewale.t@example.com",
    role: "Verification Admin",
    roleColor: "bg-purple-100 text-purple-700",
    joinDate: "11/15/2025",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Adewale Thompson",
    email: "adewale.t@example.com",
    role: "Support Admin",
    roleColor: "bg-purple-100 text-purple-700",
    joinDate: "11/15/2025",
    status: "Active",
  },
];

export default function StaffPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

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
        {stats.map((stat, idx) => (
          <Card key={idx} className='border shadow-sm'>
            <CardContent className='p-6'>
              <div className='text-3xl font-bold text-gray-900'>
                {stat.value}
              </div>
              <div className={`text-sm mt-1 ${stat.color || "text-gray-500"}`}>
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='bg-white p-4 rounded-lg shadow-sm border'>
        <AdminSearchFilter
          searchPlaceholder='Search name or email...'
          filterOptions={["All", "Active", "Suspended", "Verified"]}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      <div className='space-y-4'>
        <h2 className='text-lg font-bold text-gray-900'>Admin Users</h2>
        <ExpandableTableContainer>
          <div className='grid gap-4'>
            {adminUsers.map((user) => (
              <Link href={`/admin/staff/${user.id}`} key={user.id}>
                <Card className='hover:shadow-md transition-shadow cursor-pointer border-gray-100'>
                  <CardContent className='p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                    <div className='flex items-center gap-4'>
                      <div className='h-12 w-12 rounded-full bg-gray-200 shrink-0' />
                      <div className='space-y-1'>
                        <div className='font-semibold text-gray-900'>
                          {user.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {user.email}
                        </div>
                        <div className='flex flex-wrap items-center gap-2 text-xs'>
                          <span
                            className={`px-2 py-0.5 rounded-full ${user.roleColor}`}
                          >
                            {user.role}
                          </span>
                          <span className='text-gray-400'>
                            Joined {user.joinDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Badge
                        variant='secondary'
                        className={`${
                          user.status === "Active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        } font-medium`}
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </ExpandableTableContainer>
      </div>

      {/* Invite Admin Modal */}
      {isInviteModalOpen && (
        <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200'>
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
                onClick={() => setIsInviteModalOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors'
              >
                <X size={20} />
              </button>
            </div>

            <div className='p-6 space-y-5'>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-900'>
                  Full Name
                </label>
                <Input
                  placeholder='Enter full name'
                  className='bg-gray-50/50 border-gray-200 focus-visible:ring-purple-200 h-11'
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-900'>
                  Email Address
                </label>
                <Input
                  type='email'
                  placeholder='Enter email address'
                  className='bg-gray-50/50 border-gray-200 focus-visible:ring-purple-200 h-11'
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-900'>
                  Role
                </label>
                <select className="w-full h-11 px-3 rounded-md bg-gray-50/50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-size-[20px_20px] bg-no-repeat bg-position-[right_10px_center] pr-10">
                  <option value='' disabled selected>
                    Select Role
                  </option>
                  <option value='Administrator'>Administrator</option>
                  <option value='Operations Admin'>Operations Admin</option>
                  <option value='Verification Admin'>Verification Admin</option>
                  <option value='Support Admin'>Support Admin</option>
                </select>
              </div>
            </div>

            <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setIsInviteModalOpen(false)}
                className='font-semibold text-gray-600 bg-white'
              >
                Cancel
              </Button>
              <Button
                className='bg-[#6B46C1] hover:bg-[#5a3da1] text-white font-semibold'
                onClick={() => setIsInviteModalOpen(false)}
              >
                Send Invitation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
