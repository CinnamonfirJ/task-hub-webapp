"use client";

import { useState } from "react";
import {
  Search,
  Download,
  MoreVertical,
  ExternalLink,
  CheckCircle,
  XCircle,
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
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import Link from "next/link";

const kycMetrics = [
  { label: "Total Submissions", value: "14" },
  { label: "Pending Review", value: "14" },
  { label: "Approved", value: "14" },
  { label: "Rejected", value: "14" },
  { label: "Verified Users", value: "14" },
  { label: "Verified Taskers", value: "14" },
];

const kycSubmissions = [
  {
    id: "1",
    user: { name: "Adewale Thompson", email: "adewale.t@example.com" },
    type: "USER",
    nin: "12345678901",
    status: "Pending",
    submissionDate: "7:25PM, 11/15/2025",
  },
  {
    id: "2",
    user: { name: "Adewale Thompson", email: "adewale.t@example.com" },
    type: "TASKER",
    nin: "12345678901",
    status: "Verified",
    submissionDate: "7:25PM, 11/15/2025",
  },
  {
    id: "3",
    user: { name: "Adewale Thompson", email: "adewale.t@example.com" },
    type: "TASKER",
    nin: "12345678901",
    status: "Not verified",
    submissionDate: "7:25PM, 11/15/2025",
  },
  {
    id: "4",
    user: { name: "Adewale Thompson", email: "adewale.t@example.com" },
    type: "TASKER",
    nin: "12345678901",
    status: "Verified",
    submissionDate: "7:25PM, 11/15/2025",
  },
];

export default function KYCManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            KYC / Verification Management
          </h1>
          <p className='text-sm text-gray-500'>
            Review and manage identity verifications
          </p>
        </div>
        <div className='flex gap-26 md:gap-3'>
          <Button
            variant='outline'
            className='text-sm h-10 px-4 gap-2 border-gray-200 text-gray-600'
          >
            Default
          </Button>
          <Button
            variant='outline'
            className='text-sm h-10 px-4 gap-2 border-gray-200 text-gray-600'
          >
            <Download size={16} /> Export
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
        {kycMetrics.map((metric, idx) => (
          <Card key={idx} className='border border-gray-100 shadow-sm'>
            <CardContent className='p-4'>
              <div className='text-[10px] text-gray-400 font-medium text-center md:text-left'>
                {metric.label}
              </div>
              <div className='text-xl font-bold mt-1 text-center md:text-left'>
                {metric.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className='border border-gray-100 shadow-sm'>
        <CardContent className='p-0'>
          <div className='p-6 border-b border-gray-100'>
            <AdminSearchFilter
              searchPlaceholder='Search name, email or NIN...'
              filterOptions={["All", "Pending", "Approved", "Rejected"]}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          <ExpandableTableContainer>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-b border-gray-100/50 bg-white text-[10px] text-gray-900 font-bold uppercase tracking-wider'>
                    <th className='px-6 py-4'>USER</th>
                    <th className='px-6 py-4'>TYPE</th>
                    <th className='px-6 py-4'>NIN</th>
                    <th className='px-6 py-4'>STATUS</th>
                    <th className='px-6 py-4'>SUBMISSION</th>
                    <th className='px-6 py-4 text-right'>ACTION</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100/50'>
                  {kycSubmissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className='group hover:bg-gray-50/50 transition-colors'
                    >
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0' />
                          <div>
                            <div className='font-bold text-gray-900 text-sm'>
                              {submission.user.name}
                            </div>
                            <div className='text-xs text-gray-500 font-medium'>
                              {submission.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='text-[10px] bg-gray-50 text-gray-600 px-2 py-1.5 rounded-md border border-gray-100 font-semibold uppercase'>
                          {submission.type}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='text-xs bg-gray-50/50 text-gray-900 px-3 py-2 rounded-lg font-bold'>
                          {submission.nin}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold ${
                            submission.status === "Pending"
                              ? "bg-yellow-50 text-yellow-600"
                              : submission.status === "Verified"
                                ? "bg-blue-50 text-blue-500"
                                : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-xs font-semibold text-gray-500'>
                        {submission.submissionDate}
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 text-gray-400 hover:text-gray-900'
                            >
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align='end'
                            className='w-48 rounded-xl p-2'
                          >
                            <Link href={`/admin/verification/${submission.id}`}>
                              <DropdownMenuItem className='gap-2 cursor-pointer text-xs font-medium rounded-lg p-2 hover:bg-gray-50'>
                                <ExternalLink
                                  size={14}
                                  className='text-gray-500'
                                />{" "}
                                View Details
                              </DropdownMenuItem>
                            </Link>
                            {submission.status === "Pending" && (
                              <>
                                <DropdownMenuItem className='gap-2 cursor-pointer text-xs font-medium rounded-lg p-2 text-green-600 hover:text-green-700 hover:bg-green-50 focus:text-green-700 focus:bg-green-50 mt-1'>
                                  <CheckCircle size={14} /> Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem className='gap-2 cursor-pointer text-xs font-medium rounded-lg p-2 text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 mt-1'>
                                  <XCircle size={14} /> Reject
                                </DropdownMenuItem>
                              </>
                            )}
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
