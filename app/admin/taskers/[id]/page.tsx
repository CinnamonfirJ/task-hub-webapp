"use client";

import {
  ArrowLeft,
  Ban,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TaskerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/taskers'>
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
              Tasker Details
            </h1>
            <p className='text-xs md:text-sm text-gray-500'>
              View and manage User Information
            </p>
          </div>
        </div>
        <Button className='bg-[#EF4444] hover:bg-[#DC2626] text-white gap-2 h-10 px-6 font-semibold rounded-xl'>
          <Ban size={18} /> Suspend Tasker
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
              <span className='text-gray-500 font-medium'>Rating</span>
              <span className='font-bold text-gray-900 flex items-center gap-1.5'>
                <Star size={14} className='fill-[#F59E0B] text-[#F59E0B]' /> 4.5
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Completion Rate</span>
              <span className='font-bold text-gray-900'>92%</span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Completed Tasks</span>
              <span className='font-bold text-gray-900'>8</span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>
                Total Transaction
              </span>
              <span className='font-bold text-gray-900'>₦250,000</span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Current balance</span>
              <span className='font-bold text-gray-900'>₦50,000</span>
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
              <div className='text-sm font-bold text-gray-900'>Tasker</div>
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
        <CardHeader className='pb-4'>
          <CardTitle className='text-sm md:text-base font-bold text-gray-900'>
            Service Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-3'>
            <span className='px-5 py-2.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-xl border border-gray-100 shadow-sm'>
              Plumbing
            </span>
            <span className='px-5 py-2.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-xl border border-gray-100 shadow-sm'>
              Electrical repairs
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] overflow-hidden'>
        <CardHeader className='flex flex-row items-center justify-between p-6 md:p-8 pb-4'>
          <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
            Recent Reviews
          </CardTitle>
          <Button
            variant='ghost'
            className='text-xs md:text-sm text-gray-500 hover:text-gray-900 font-medium'
          >
            See all
          </Button>
        </CardHeader>
        <CardContent className='p-6 md:p-8 pt-0 space-y-4'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='p-5 border border-gray-100 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='flex items-center justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-gray-200' />
                  <div>
                    <div className='text-sm font-bold text-gray-900'>
                      John Doe
                    </div>
                    <div className='text-[10px] text-gray-400 font-medium mt-0.5'>
                      2 days Ago
                    </div>
                  </div>
                </div>
                <div className='flex gap-1 text-[#F59E0B]'>
                  <Star size={14} className='fill-[#F59E0B]' />
                  <Star size={14} className='fill-[#F59E0B]' />
                  <Star size={14} className='fill-[#F59E0B]' />
                  <Star size={14} className='fill-[#F59E0B]' />
                  <Star size={14} className='fill-[#F59E0B]' />
                </div>
              </div>
              <p className='text-sm text-gray-600 leading-relaxed'>
                Excellent work! Very professional and completed the task ahead
                of schedule.
              </p>
            </div>
          ))}
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
                title: "Task Completed",
                detail: "Completed Task: Graphic Design Project",
                date: "1/28/2026, 10:15:00 AM",
              },
              {
                title: "Profile Update",
                detail: "Updated profile information",
                date: "1/15/2026, 1:00:00 PM",
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
