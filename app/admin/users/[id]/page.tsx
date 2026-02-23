"use client";

import { ArrowLeft, Ban, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function UserDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/users'>
            <Button
              variant='outline'
              size='icon'
              className='h-10 w-10 border-gray-200'
            >
              <ArrowLeft size={18} className='text-gray-500' />
            </Button>
          </Link>
          <div>
            <h1 className='text-xl md:text-2xl font-bold text-gray-900'>
              User Details
            </h1>
            <p className='text-xs md:text-sm text-gray-500'>
              View and manage User Information
            </p>
          </div>
        </div>
        <Button className='bg-[#EF4444] hover:bg-[#DC2626] text-white gap-2 h-10 px-6 font-semibold rounded-xl'>
          <Ban size={18} /> Suspend User
        </Button>
      </div>

      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
        <CardContent className='p-6 md:p-8'>
          <div className='flex flex-col md:flex-row items-center gap-6'>
            <div className='w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 shrink-0' />
            <div className='flex-1 text-center md:text-left space-y-4 md:space-y-6 w-full'>
              <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                <div className='flex flex-wrap items-center justify-center md:justify-start gap-3'>
                  <h2 className='text-xl md:text-2xl font-bold text-gray-900'>
                    Adewale Thompson
                  </h2>
                  <span className='bg-blue-50 text-[#3B82F6] text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide'>
                    VERIFIED
                  </span>
                  <span className='bg-green-50 text-[#10B981] text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide'>
                    ACTIVE
                  </span>
                </div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 text-sm'>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <Mail size={16} className='text-gray-400' />
                  <span>adewale.t@example.com</span>
                </div>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <Phone size={16} className='text-gray-400' />
                  <span>+234 803 456 7890</span>
                </div>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <MapPin size={16} className='text-gray-400' />
                  <span>Lagos, Nigeria</span>
                </div>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <Calendar size={16} className='text-gray-400' />
                  <span>Joined 11/15/2025</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='pb-4'>
            <CardTitle className='text-sm md:text-base font-bold text-gray-900'>
              KYC Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-5'>
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-500 font-medium'>NIN</div>
              <div className='text-sm font-bold text-gray-900'>12345678901</div>
            </div>
            <div className='space-y-2'>
              <div className='text-xs text-gray-500 font-medium'>
                Verification Status
              </div>
              <div>
                <span className='bg-blue-50 text-[#3B82F6] text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full inline-block'>
                  Verified
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='pb-4'>
            <CardTitle className='text-sm md:text-base font-bold text-gray-900'>
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Total Tasks</span>
              <span className='font-bold text-gray-900'>0</span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Active Tasks</span>
              <span className='font-bold text-gray-900'>0</span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Completed Tasks</span>
              <span className='font-bold text-gray-900'>0</span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>
                Total Transaction
              </span>
              <span className='font-bold text-gray-900'>0</span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Current balance</span>
              <span className='font-bold text-gray-900'>0</span>
            </div>
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='pb-4'>
            <CardTitle className='text-sm md:text-base font-bold text-gray-900'>
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-5'>
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-500 font-medium'>User ID</div>
              <div className='text-sm font-bold text-gray-900'>Demo1</div>
            </div>
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-500 font-medium'>Role</div>
              <div className='text-sm font-bold text-gray-900'>User</div>
            </div>
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-500 font-medium'>
                Last Updated
              </div>
              <div className='text-sm font-bold text-gray-900'>
                1/20/2026, 3:15:00 PM
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
        <CardHeader>
          <CardTitle className='text-sm md:text-base font-bold text-gray-900'>
            Address
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1.5'>
            <div className='text-xs text-gray-500 font-medium'>Location</div>
            <div className='text-sm font-bold text-gray-900'>Lagos Nigeria</div>
          </div>
          <div className='space-y-1.5'>
            <div className='text-xs text-gray-500 font-medium'>
              Last Updated
            </div>
            <div className='text-sm font-bold text-gray-900'>
              1/20/2026, 3:15:00 PM
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] overflow-hidden'>
        <CardHeader className='flex flex-row items-center justify-between p-6 md:p-8 pb-4'>
          <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
            Posted Tasks (3)
          </CardTitle>
          <Button
            variant='ghost'
            className='text-xs md:text-sm text-gray-500 hover:text-gray-900 font-medium'
          >
            See all
          </Button>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm whitespace-nowrap'>
              <thead className='bg-white'>
                <tr className='border-b border-gray-100 text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider'>
                  <th className='py-4 px-6 md:px-8 font-medium'>TITLE</th>
                  <th className='py-4 px-6 font-medium'>BUDGET</th>
                  <th className='py-4 px-6 font-medium'>STATUS</th>
                  <th className='py-4 px-6 md:px-8 font-medium'>DATE</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50 text-xs md:text-sm'>
                {[
                  {
                    title: "House Cleaning",
                    budget: "₦15,000",
                    status: "In progress",
                    date: "12/12/2025, 12:20:00 PM",
                    statusColor: "text-[#3B82F6] bg-blue-50",
                  },
                  {
                    title: "Plumbing Repair",
                    budget: "₦25,000",
                    status: "Completed",
                    date: "12/12/2025, 12:20:00 PM",
                    statusColor: "text-[#10B981] bg-green-50",
                  },
                  {
                    title: "Graphic Design Project",
                    budget: "₦50,000",
                    status: "Open",
                    date: "12/12/2025, 12:20:00 PM",
                    statusColor: "text-[#10B981] bg-green-50",
                  },
                ].map((task, idx) => (
                  <tr
                    key={idx}
                    className='group hover:bg-gray-50/50 transition-colors'
                  >
                    <td className='py-5 px-6 md:px-8 font-semibold text-gray-900'>
                      {task.title}
                    </td>
                    <td className='py-5 px-6 font-bold text-gray-900'>
                      {task.budget}
                    </td>
                    <td className='py-5 px-6'>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold inline-block ${task.statusColor}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className='py-5 px-6 md:px-8 text-gray-500'>
                      {task.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] overflow-hidden'>
        <CardHeader className='flex flex-row items-center justify-between p-6 md:p-8 pb-4'>
          <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
            Transaction History
          </CardTitle>
          <Button
            variant='ghost'
            className='text-xs md:text-sm text-gray-500 hover:text-gray-900 font-medium'
          >
            See all
          </Button>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm whitespace-nowrap'>
              <thead className='bg-white'>
                <tr className='border-b border-gray-100 text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider'>
                  <th className='py-4 px-6 md:px-8 font-medium'>DESCRIPTION</th>
                  <th className='py-4 px-6 font-medium'>TYPE</th>
                  <th className='py-4 px-6 font-medium'>AMOUNT</th>
                  <th className='py-4 px-6 md:px-8 font-medium'>DATE</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50 text-xs md:text-sm'>
                {[
                  {
                    desc: "Payment for completed task",
                    type: "Credit",
                    typeColor: "bg-green-50 text-[#10B981]",
                    amount: "₦15,000",
                    date: "12/12/2025, 12:20:00 PM",
                  },
                  {
                    desc: "Wallet funding",
                    type: "Credit",
                    typeColor: "bg-green-50 text-[#10B981]",
                    amount: "₦55,000",
                    date: "12/12/2025, 12:20:00 PM",
                  },
                  {
                    desc: "Task payment to tasker",
                    type: "Debit",
                    typeColor: "bg-red-50 text-[#EF4444]",
                    amount: "₦25,000",
                    date: "12/12/2025, 12:20:00 PM",
                  },
                ].map((tx, idx) => (
                  <tr
                    key={idx}
                    className='group hover:bg-gray-50/50 transition-colors'
                  >
                    <td className='py-5 px-6 md:px-8 font-medium text-gray-700'>
                      {tx.desc}
                    </td>
                    <td className='py-5 px-6'>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold inline-block ${tx.typeColor}`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className='py-5 px-6 font-bold text-gray-900'>
                      {tx.amount}
                    </td>
                    <td className='py-5 px-6 md:px-8 text-gray-500'>
                      {tx.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
        <CardHeader className='flex flex-row items-center justify-between p-6 md:p-8 pb-4'>
          <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
            Activity Log
          </CardTitle>
          <Button
            variant='ghost'
            className='text-xs md:text-sm text-gray-500 hover:text-gray-900 font-medium'
          >
            See all
          </Button>
        </CardHeader>
        <CardContent className='p-6 md:p-8 pt-2'>
          <div className='space-y-6 md:space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-purple-100 before:bg-linear-to-b before:from-purple-500 before:via-purple-200 before:to-transparent'>
            {[
              {
                title: "Login",
                detail: "Logged in from Lagos, Nigeria",
                date: "1/29/2026, 11:12:47 AM",
              },
              {
                title: "Task posted",
                detail: "Posted new task: Graphic Design Project",
                date: "1/28/2026, 10:15:00 AM",
              },
              {
                title: "Payment Made",
                detail: "Made payment of ₦25,000",
                date: "1/20/2026, 4:45:00 PM",
              },
              {
                title: "Profile Update",
                detail: "Updated profile information",
                date: "1/15/2026, 1:00:00 PM",
              },
              {
                title: "Login",
                detail: "Logged in from Lagos, Nigeria",
                date: "1/29/2026, 11:12:47 AM",
              },
            ].map((activity, idx) => (
              <div key={idx} className='relative flex items-start pl-8 md:pl-0'>
                <div className='absolute left-[3px] md:left-[50%] md:-translate-x-1/2 top-1 w-4 h-4 rounded-full bg-[#6B46C1] md:bg-white border-4 border-white md:border-[#6B46C1] shadow-sm z-10' />

                <div className='md:w-1/2 md:pr-12 md:text-right md:pl-0 hidden md:block' />

                <div className='md:w-1/2 md:pl-12 w-full space-y-1'>
                  <div className='text-sm font-bold text-gray-900'>
                    {activity.title}
                  </div>
                  <div className='text-sm text-gray-500'>{activity.detail}</div>
                  <div className='text-xs text-gray-400 font-medium pt-1'>
                    {activity.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
