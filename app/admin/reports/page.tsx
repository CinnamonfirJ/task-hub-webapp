"use client";

import { useState } from "react";
import { Search, Download, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import Link from "next/link";

const summaryMetrics = [
  { label: "Total Logs", value: "14" },
  { label: "Today's reviews", value: "14" },
  { label: "Admin Actions", value: "14" },
  { label: "User Reports", value: "14" },
  { label: "Pending Reports", value: "14" },
  { label: "Resolved Reports", value: "14" },
];

const activityLogs = [
  {
    id: 1,
    actionType: "Task Posted",
    description: "Approved KYC verification for Chukwudi Eze",
    date: "1/29/2026, 11:12:47 AM",
  },
  {
    id: 2,
    actionType: "Task Assigned",
    description: "Approved KYC verification for Chukwudi Eze",
    date: "1/29/2026, 11:12:47 AM",
  },
  {
    id: 3,
    actionType: "Verification Submitted",
    description: "Approved KYC verification for Chukwudi Eze",
    date: "1/29/2026, 11:12:47 AM",
  },
  {
    id: 4,
    actionType: "Task completed",
    description: "Approved KYC verification for Chukwudi Eze",
    date: "1/29/2026, 11:12:47 AM",
  },
  {
    id: 5,
    actionType: "Payment made",
    description: "Approved KYC verification for Chukwudi Eze",
    date: "1/29/2026, 11:12:47 AM",
  },
];

const userReports = [
  {
    id: 1,
    status: "Resolved",
    date: "1/29/2026, 10:41:44 AM",
    title: "Inappropriate Behavior",
    description: "User sent inappropriate messages during task discussion",
    reporter: "fatima.h@example.com",
    reported: "tunde.bak@example.com",
    statusBadgeColor: "bg-green-50 text-green-600",
  },
  {
    id: 2,
    status: "Investigating",
    date: "1/29/2026, 10:41:44 AM",
    title: "Inappropriate Behavior",
    description: "User sent inappropriate messages during task discussion",
    reporter: "fatima.h@example.com",
    reported: "tunde.bak@example.com",
    statusBadgeColor: "bg-yellow-50 text-yellow-600",
  },
  {
    id: 3,
    status: "Pending",
    date: "1/29/2026, 10:41:44 AM",
    title: "Inappropriate Behavior",
    description: "User sent inappropriate messages during task discussion",
    reporter: "fatima.h@example.com",
    reported: "tunde.bak@example.com",
    statusBadgeColor: "bg-red-50 text-red-500",
  },
];

export default function ReportsManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto'>
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Reports & Activity Logs
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Monitor system activity and user reports
          </p>
        </div>
        <div className='flex gap-18 md:gap-3'>
          <Button
            variant='outline'
            className='text-sm h-10 px-4 gap-2 border-gray-200'
          >
            Default
          </Button>
          <Button
            variant='outline'
            className='text-sm h-10 px-4 gap-2 border-gray-200'
          >
            <Download size={16} /> Export
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
        {summaryMetrics.map((metric, idx) => (
          <Card key={idx} className='border border-gray-100 shadow-sm'>
            <CardContent className='p-4 md:p-5'>
              <div className='text-xs text-gray-500 font-medium'>
                {metric.label}
              </div>
              <div className='text-2xl font-bold mt-1 text-gray-900'>
                {metric.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <div className='p-6 flex items-center justify-between'>
          <h2 className='text-lg font-bold text-gray-900'>Activity Logs</h2>
          <Button variant='ghost' className='text-sm text-gray-500 font-medium'>
            See all
          </Button>
        </div>
        <CardContent className='p-6 pt-0 space-y-6'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='relative w-full text-sm'>
              <Search
                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                size={18}
              />
              <Input
                placeholder='Search Log'
                className='pl-10 h-11 bg-gray-50/50 border border-gray-100 focus-visible:ring-1 focus-visible:ring-purple-200 rounded-xl'
              />
            </div>
            <Button
              variant='outline'
              className='h-11 px-4 gap-2 border-gray-200 rounded-xl min-w-[140px] justify-between'
            >
              All Actions <ChevronDown size={16} className='text-gray-400' />
            </Button>
          </div>

          <ExpandableTableContainer>
            <div className='space-y-4'>
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className='pb-4 border-b border-gray-50 last:border-0 last:pb-0'
                >
                  <div className='inline-block px-2.5 py-1 mb-2 bg-gray-50 text-gray-600 border border-gray-100 rounded text-[10px] font-medium'>
                    {log.actionType}
                  </div>
                  <h3 className='text-sm text-gray-900 font-medium'>
                    {log.description}
                  </h3>
                  <p className='text-xs text-gray-500 mt-1'>{log.date}</p>
                </div>
              ))}
            </div>
          </ExpandableTableContainer>
        </CardContent>
      </Card>

      <div className='mt-8 pt-4'>
        <div className='mb-6'>
          <AdminSearchFilter
            searchPlaceholder='Search Name or email..'
            filterOptions={["All", "Pending", "Investigating", "Resolved"]}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <div className='p-6 flex items-center justify-between'>
            <h2 className='text-lg font-bold text-gray-900'>User Reports</h2>
            <Button
              variant='ghost'
              className='text-sm text-gray-500 font-medium'
            >
              See all
            </Button>
          </div>
          <CardContent className='p-6 pt-0 space-y-4'>
            <ExpandableTableContainer>
              <div className='grid gap-4'>
                {userReports.map((report) => (
                  <Link key={report.id} href={`/admin/reports/${report.id}`}>
                    <div className='p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors bg-white hover:bg-gray-50/30'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-semibold ${report.statusBadgeColor}`}
                        >
                          {report.status}
                        </span>
                      </div>
                      <div className='text-xs text-gray-400 font-medium mb-3'>
                        {report.date}
                      </div>
                      <h3 className='text-base font-bold text-gray-900 mb-1'>
                        {report.title}
                      </h3>
                      <p className='text-sm text-gray-500 mb-4'>
                        {report.description}
                      </p>
                      <div className='space-y-1 text-xs'>
                        <div className='flex items-center text-gray-500'>
                          <span className='font-medium text-gray-400 w-[60px]'>
                            Reporter:
                          </span>
                          {report.reporter}
                        </div>
                        <div className='flex items-center text-gray-500'>
                          <span className='font-medium text-gray-400 w-[60px]'>
                            Reported:
                          </span>
                          {report.reported}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </ExpandableTableContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
