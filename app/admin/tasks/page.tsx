"use client";

import { useState } from "react";
import { Plus, Search, MoreVertical } from "lucide-react";
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
import Link from "next/link";
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";

const taskMetrics = [
  { label: "Total Task", value: "7" },
  { label: "Open Task", value: "7", color: "text-green-500" },
  { label: "In-Progress", value: "1", color: "text-blue-500" },
  { label: "Completed Task", value: "1", color: "text-emerald-500" },
  { label: "Cancelled Tasks", value: "1", color: "text-red-500" },
];

const tasks = [
  {
    id: "t1",
    title: "Fix Leaking Kitchen Sink",
    postedBy: "aisha.musa@taskhubdemo.com",
    category: "Electrical repairs",
    budget: "N40,000",
    status: "In progress",
    statusColor: "text-blue-500 bg-blue-50",
    date: "02/02/2025",
  },
  {
    id: "t2",
    title: "Fix Leaking Kitchen Sink",
    postedBy: "aisha.musa@taskhubdemo.com",
    category: "Furniture",
    budget: "N40,000",
    status: "Open",
    statusColor: "text-green-500 bg-green-50",
    date: "02/02/2025",
  },
  {
    id: "t3",
    title: "Fix Leaking Kitchen Sink",
    postedBy: "aisha.musa@taskhubdemo.com",
    category: "Graphics Design",
    budget: "N40,000",
    status: "Completed",
    statusColor: "text-emerald-500 bg-emerald-50",
    date: "02/02/2025",
  },
  {
    id: "t4",
    title: "Fix Leaking Kitchen Sink",
    postedBy: "aisha.musa@taskhubdemo.com",
    category: "Plumbing",
    budget: "N40,000",
    status: "Assigned",
    statusColor: "text-orange-500 bg-orange-50",
    date: "02/02/2025",
  },
];

export default function TasksManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Tasks Management</h1>
          <p className='text-sm text-gray-500'>Monitor and manage all tasks</p>
        </div>
        <Button className='bg-[#6B46C1] hover:bg-[#553C9A] gap-2'>
          <Plus size={18} /> Invite Admin
        </Button>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        {taskMetrics.map((metric, idx) => (
          <Card key={idx} className='border border-gray-100 shadow-sm'>
            <CardContent className='p-4'>
              <div className='text-xl font-bold'>{metric.value}</div>
              <div
                className={`text-[10px] mt-1 font-medium ${metric.color || "text-gray-400"}`}
              >
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
              searchPlaceholder='Search name or email...'
              filterOptions={[
                "All",
                "Open",
                "In-progress",
                "Completed",
                "Cancelled",
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
                    <th className='px-6 py-4'>TASK</th>
                    <th className='px-6 py-4'>POSTED BY</th>
                    <th className='px-6 py-4'>CATEGORY</th>
                    <th className='px-6 py-4'>BUDGET</th>
                    <th className='px-6 py-4'>STATUS</th>
                    <th className='px-6 py-4'>DATE</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {tasks.map((task) => (
                    <tr
                      key={task.id}
                      className='group hover:bg-gray-50 transition-colors'
                    >
                      <Link href={`/admin/tasks/${task.id}`}>
                        <td className='px-6 py-5 font-bold text-gray-900'>
                          {task.title}
                        </td>
                      </Link>
                      <td className='px-6 py-5 text-gray-500 font-medium'>
                        {task.postedBy}
                      </td>
                      <td className='px-6 py-5'>
                        <span className='text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100 font-medium'>
                          {task.category}
                        </span>
                      </td>
                      <td className='px-6 py-5 font-bold text-gray-900'>
                        {task.budget}
                      </td>
                      <td className='px-6 py-5'>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold ${task.statusColor}`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className='px-6 py-5 text-gray-500 font-medium'>
                        {task.date}
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
