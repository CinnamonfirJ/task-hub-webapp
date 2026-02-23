"use client";

import { ArrowLeft, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ReportDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/reports'>
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
              Report Details
            </h1>
            <p className='text-xs md:text-sm text-gray-500 mt-1'>
              Review and manage user report
            </p>
          </div>
        </div>
        <div className='flex gap-3'>
          <span className='bg-green-50 text-green-600 text-xs font-semibold px-3 py-1.5 rounded h-fit self-center'>
            Resolved
          </span>
        </div>
      </div>

      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <CardContent className='p-6 md:p-8'>
          <div className='flex items-center justify-between gap-6'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0'>
                <Flag size={20} />
              </div>
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Report type
                </div>
                <h2 className='text-lg font-bold text-gray-900'>
                  Inappropriate Behavior
                </h2>
              </div>
            </div>
            <div className='text-right shrink-0'>
              <div className='text-xs md:text-sm text-gray-500 font-medium tracking-wide'>
                Submitted
              </div>
              <div className='text-sm md:text-base font-bold text-gray-900 mt-1'>
                10/02/2026, 11:12:47 AM
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl h-full'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Report Information
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-6'>
            <div className='space-y-1.5'>
              <div className='text-xs md:text-sm text-gray-500 font-medium'>
                Report ID
              </div>
              <div className='text-sm md:text-base font-bold text-gray-900'>
                0045
              </div>
            </div>
            <div className='space-y-1.5'>
              <div className='text-xs md:text-sm text-gray-500 font-medium'>
                Description
              </div>
              <div className='text-sm md:text-base font-bold text-gray-900 leading-relaxed'>
                User sent inappropriate messages during task discussion
              </div>
            </div>
            <div className='space-y-1.5'>
              <div className='text-xs md:text-sm text-gray-500 font-medium'>
                Related Task
              </div>
              <div className='text-sm md:text-base font-bold text-gray-900'>
                N/A
              </div>
            </div>
            <div className='space-y-1.5'>
              <div className='text-xs md:text-sm text-gray-500 font-medium'>
                Related message
              </div>
              <div className='text-sm md:text-base font-bold text-gray-900'>
                N/A
              </div>
            </div>
            <div className='space-y-1.5'>
              <div className='text-xs md:text-sm text-gray-500 font-medium'>
                Submitted
              </div>
              <div className='text-sm md:text-base font-bold text-gray-900'>
                1/29/2026, 10:41:44 AM
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl h-full'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Users Involved
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-4'>
            <div className='p-5 bg-blue-50/50 border border-blue-100 rounded-xl'>
              <div className='text-xs text-gray-500 font-medium mb-2'>
                Reporter
              </div>
              <div className='font-bold text-gray-900 text-sm md:text-base mb-4'>
                fatima.h@example.com
              </div>
              <Button
                variant='secondary'
                className='bg-white hover:bg-gray-50 text-xs font-semibold h-8 shadow-sm'
              >
                View profile
              </Button>
            </div>

            <div className='p-5 bg-red-50/30 border border-red-100 rounded-xl'>
              <div className='text-xs text-gray-500 font-medium mb-2'>
                Reported User
              </div>
              <div className='font-bold text-gray-900 text-sm md:text-base mb-4'>
                tunde.bak@example.com
              </div>
              <Button
                variant='secondary'
                className='bg-white hover:bg-gray-50 text-xs font-semibold h-8 shadow-sm'
              >
                View profile
              </Button>
            </div>

            <div className='p-5 bg-green-50/30 border border-green-100 rounded-xl'>
              <div className='text-xs text-gray-500 font-medium mb-1'>
                Resolved by
              </div>
              <div className='font-bold text-gray-900 text-sm md:text-base'>
                Segun Johnson
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <CardHeader className='p-6 md:p-8 pb-4'>
          <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
            Manage Report Status
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6 md:p-8 pt-0 space-y-6'>
          <div className='space-y-3'>
            <div className='text-sm text-gray-500 font-medium'>
              Change status
            </div>
            <div className='flex flex-wrap items-center gap-3'>
              <Button
                variant='outline'
                className='bg-white text-gray-700 h-9 font-medium'
              >
                Mark as pending
              </Button>
              <Button
                variant='outline'
                className='bg-white text-gray-700 h-9 font-medium'
              >
                Mark as Investigating
              </Button>
              <Button className='bg-[#22C55E] hover:bg-[#16A34A] text-white h-9 font-semibold'>
                Mark as resolved
              </Button>
              <Button
                variant='outline'
                className='bg-white text-gray-700 h-9 font-medium'
              >
                Dismiss report
              </Button>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='text-sm text-gray-500 font-medium'>Admin notes</div>
            <textarea
              className='w-full min-h-[120px] p-4 text-sm bg-gray-50/30 border border-gray-200 rounded-xl focus:ring-1 focus:ring-purple-200 outline-none resize-y'
              defaultValue='Reviewing task completion photos'
            />
          </div>

          <Button className='bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg px-6'>
            Save Notes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
