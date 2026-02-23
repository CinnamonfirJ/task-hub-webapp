"use client";

import { ArrowLeft, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TaskDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/tasks'>
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
              Task Details
            </h1>
            <p className='text-xs md:text-sm text-gray-500 mt-1'>
              View and manage task information
            </p>
          </div>
        </div>
        <Button className='bg-[#EF4444] hover:bg-[#DC2626] text-white gap-2 h-10 px-6 font-semibold rounded-xl'>
          <XCircle size={18} /> Cancel task
        </Button>
      </div>

      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
        <CardContent className='p-6 md:p-8'>
          <div className='flex flex-col md:flex-row md:items-start justify-between gap-6'>
            <div className='space-y-4 md:space-y-5 flex-1'>
              <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                <h2 className='text-xl md:text-2xl font-bold text-gray-900'>
                  Fix Leaking Kitchen Sink
                </h2>
              </div>
              <div>
                <span className='bg-blue-50 text-[#3B82F6] text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full inline-block'>
                  In progress
                </span>
              </div>
              <p className='text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl'>
                Certified plumber and electrician with 10 years of professional
                experience in residential and commercial maintenance
              </p>
              <div className='flex flex-wrap gap-2 pt-1'>
                <span className='px-4 py-2 bg-white text-gray-700 text-xs font-medium rounded-lg border border-gray-200 shadow-sm'>
                  Electrical repairs
                </span>
              </div>
            </div>
            <div className='text-left md:text-right shrink-0 pt-2 md:pt-0'>
              <div className='text-xs md:text-sm text-gray-500 font-medium tracking-wide'>
                Budget
              </div>
              <div className='text-2xl md:text-3xl font-bold text-gray-900 mt-1.5 md:mt-2'>
                40,000
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Task Information
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-6'>
            <div className='space-y-2'>
              <div className='text-xs md:text-sm text-gray-500 font-medium'>
                Posted By
              </div>
              <div className='text-sm md:text-base font-bold text-gray-900 break-all'>
                aisha.musa@taskhubdemo.com
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-xs md:text-sm text-gray-500 font-medium'>
                Deadline
              </div>
              <div className='text-sm md:text-base font-bold text-gray-900'>
                2/5/2026
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-xs md:text-sm text-gray-500 font-medium'>
                Negotiable
              </div>
              <div className='text-sm md:text-base font-bold text-gray-900 uppercase'>
                YES
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-4'>
            <div className='space-y-2'>
              <div className='text-xs md:text-sm text-gray-500 font-medium'>
                Assigned Tasker
              </div>
              <div className='text-sm md:text-base font-bold text-gray-900 break-all'>
                segun.adebayo@taskhubdemo.com
              </div>
            </div>
            <div className='pt-2'>
              <span className='bg-blue-50 text-[#3B82F6] text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full inline-block'>
                In progress
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-6'>
            <div className='space-y-2'>
              <div className='text-xs md:text-sm text-gray-500 font-medium'>
                Created
              </div>
              <div className='text-sm md:text-base text-gray-900 font-bold'>
                1/29/2026, 11:12:47 AM
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-xs md:text-sm text-gray-500 font-medium'>
                Deadline
              </div>
              <div className='text-sm md:text-base text-gray-900 font-bold'>
                1/29/2026, 11:12:47 AM
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-xs md:text-sm text-gray-500 font-medium'>
                Last Updated
              </div>
              <div className='text-sm md:text-base text-gray-900 font-bold'>
                1/29/2026, 11:12:47 AM
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg md:text-xl font-bold text-gray-900 px-2'>
          Applicants/ Bids
        </h3>
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] overflow-hidden'>
          <CardContent className='p-6 md:p-8 space-y-4 md:space-y-6'>
            {[1, 2].map((i) => (
              <div
                key={i}
                className='p-5 md:p-6 border border-gray-100 rounded-[1.5rem] flex items-center justify-between gap-4 shadow-sm hover:border-gray-200 transition-colors bg-gray-50/50'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-200 shrink-0' />
                  <div className='space-y-1'>
                    <div className='text-sm md:text-base font-bold text-gray-900'>
                      Mike Tasker
                    </div>
                    <div className='text-[10px] md:text-xs text-gray-500 font-medium'>
                      Applied 2 days ago
                    </div>
                  </div>
                </div>
                <div className='text-right shrink-0'>
                  <span className='text-xs md:text-sm text-gray-500 font-medium mr-1.5 md:mr-2'>
                    Bid:
                  </span>
                  <span className='text-sm md:text-lg font-bold text-gray-900 tracking-tight'>
                    ₦13,500
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
