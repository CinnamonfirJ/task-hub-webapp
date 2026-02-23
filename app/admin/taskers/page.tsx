"use client";

import { useState } from "react";
import {
  MoreVertical,
  Search,
  UserCircle2,
  ExternalLink,
  Ban,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";
import Link from "next/link";

const summaryMetrics = [
  { label: "Total Taskers", value: "7" },
  { label: "Active", value: "7", color: "text-green-500" },
  { label: "Inactive", value: "30" },
  { label: "Verified", value: "67", color: "text-blue-500" },
  { label: "Suspended", value: "7", color: "text-red-500" },
  { label: "Pending KYC", value: "7", color: "text-yellow-500" },
  { label: "Total Tasks completed", value: "7" },
  { label: "Categories", value: "30" },
  { label: "Average Ratings", value: "4.7", color: "text-orange-500" },
  { label: "Disputes", value: "7", color: "text-red-500" },
];

const taskers = [
  {
    id: 1,
    name: "Adewale Thompson",
    email: "adewale.t@example.com",
    categories: ["Plumbing", "Electrical repairs"],
    status: "Active",
    verification: "Verified",
    lastActive: "7:25PM, 11/15/2025",
  },
  {
    id: 2,
    name: "Adewale Thompson",
    email: "adewale.t@example.com",
    categories: ["Graphics Design", "Furniture"],
    status: "Suspended",
    verification: "Verified",
    lastActive: "7:25PM, 11/15/2025",
  },
  {
    id: 3,
    name: "Ibrahim Yusuf",
    email: "ibrahim.y@example.com",
    categories: ["Plumbing", "Carpentry"],
    status: "Active",
    verification: "Not verified",
    lastActive: "7:25PM, 11/15/2025",
  },
  {
    id: 4,
    name: "Ngozi Adekunle",
    email: "ngozi.a@example.com",
    categories: ["Graphics Design"],
    status: "Active",
    verification: "Pending",
    lastActive: "7:25PM, 11/15/2025",
  },
];

export default function TaskersManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Taskers Management
          </h1>
          <p className='text-sm text-gray-500'>Manage all registered taskers</p>
        </div>
        <div className='flex gap-18 md:gap-3'>
          <Button variant='outline' className='text-sm h-10 px-4 gap-2'>
            <MoreVertical size={16} /> Default
          </Button>
          <Button variant='outline' className='text-sm h-10 px-4 gap-2'>
            <Download size={16} /> Export
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        {summaryMetrics.map((metric, idx) => (
          <Card key={idx} className='border-none shadow-sm'>
            <CardContent className='p-4'>
              <div className='text-xl font-bold'>{metric.value}</div>
              <div
                className={`text-[10px] mt-1 ${metric.color || "text-gray-500"}`}
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
              filterOptions={[
                "All",
                "Active",
                "Suspended",
                "Ratings",
                "Verified",
              ]}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          <ExpandableTableContainer>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-y bg-gray-50/30 text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                    <th className='px-6 py-4'>TASKERS</th>
                    <th className='px-6 py-4'>CATEGORIES</th>
                    <th className='px-6 py-4'>STATUS</th>
                    <th className='px-6 py-4'>VERIFICATION</th>
                    <th className='px-6 py-4'>LAST ACTIVE</th>
                    <th className='px-6 py-4 text-right'>ACTION</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {taskers.map((tasker) => (
                    <tr
                      key={tasker.id}
                      className='group hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400'>
                            <UserCircle2 size={24} />
                          </div>
                          <div>
                            <div className='font-bold text-gray-900'>
                              {tasker.name}
                            </div>
                            <div className='text-xs text-gray-500'>
                              {tasker.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex flex-col gap-1'>
                          {tasker.categories.map((cat, i) => (
                            <span key={i} className='text-[10px] text-gray-500'>
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                            tasker.status === "Active"
                              ? "bg-green-50 text-green-500"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {tasker.status}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                            tasker.verification === "Verified"
                              ? "bg-blue-50 text-blue-500"
                              : tasker.verification === "Pending"
                                ? "bg-yellow-50 text-yellow-500"
                                : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {tasker.verification}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-xs text-gray-500'>
                        {tasker.lastActive}
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
                            <Link href={`/admin/taskers/${tasker.id}`}>
                              <DropdownMenuItem className='gap-2 cursor-pointer'>
                                <ExternalLink size={14} /> View Details
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className='gap-2 cursor-pointer text-red-600 focus:text-red-600'>
                              <Ban size={14} /> Suspend User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ExpandableTableContainer>
        </CardContent>
      </Card>
    </div>
  );
}
