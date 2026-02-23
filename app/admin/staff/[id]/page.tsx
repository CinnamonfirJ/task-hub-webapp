"use client";

import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Phone,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data for a single admin user
const adminUser = {
  id: "1",
  name: "Adewale Thompson",
  role: "Operations Admin",
  email: "adewale.t@example.com",
  phone: "+234 803 456 7890",
  location: "Lagos, Nigeria",
  joinDate: "11/15/2025",
  adminId: "Demo1",
  lastUpdated: "1/20/2026, 3:15:00 PM",
  permissions: [
    "User and Tasker management",
    "KYC Verification",
    "Task Management",
    "Payment Oversight",
    "System Logs & Reports",
  ],
};

const activities = [
  {
    title: "Admin Action",
    description: "Approved KYC verification for Chukwudi Eze",
    date: "1/29/2026, 11:12:47 AM",
    type: "action",
  },
  {
    title: "User Suspended",
    description: "Suspended user: Mohammed Bello",
    date: "1/28/2026, 10:15:00 AM",
    type: "suspension",
  },
  {
    title: "Admin Action",
    description: "Updated task status to cancelled",
    date: "1/15/2026, 1:00:00 PM",
    type: "action",
  },
  {
    title: "Admin Action",
    description: "Reviewed report #R123",
    date: "1/29/2026, 11:12:47 AM",
    type: "action",
  },
  {
    title: "Admin Action",
    description: "Reviewed report #R123",
    date: "1/29/2026, 11:12:47 AM",
    type: "action",
  },
  {
    title: "Admin Action",
    description: "Reviewed report #R123",
    date: "1/29/2026, 11:12:47 AM",
    type: "action",
  },
  {
    title: "Admin Action",
    description: "Reviewed report #R123",
    date: "1/29/2026, 11:12:47 AM",
    type: "action",
  },
];

export default function StaffDetailsPage() {
  const params = useParams();

  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/staff'>
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
              Staff & Admin Details
            </h1>
            <p className='text-xs md:text-sm text-gray-500'>
              View and manage administrator information
            </p>
          </div>
        </div>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            className='h-10 gap-2 text-sm font-semibold rounded-xl border-gray-200 text-gray-700 px-5'
          >
            <Calendar size={16} className='text-gray-500' /> Default
          </Button>
          <Button
            variant='outline'
            className='h-10 gap-2 text-sm font-semibold rounded-xl border-gray-200 text-gray-700 px-5'
          >
            <Download size={16} className='text-gray-500' /> Export
          </Button>
        </div>
      </div>

      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
        <CardContent className='p-6 md:p-8'>
          <div className='flex flex-col md:flex-row items-center gap-6'>
            <div className='w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 shrink-0' />
            <div className='flex-1 text-center md:text-left space-y-4 md:space-y-6 w-full'>
              <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                <div className='flex flex-wrap items-center justify-center md:justify-start gap-3'>
                  <h2 className='text-xl md:text-2xl font-bold text-gray-900'>
                    {adminUser.name}
                  </h2>
                  <span className='bg-purple-50 text-[#8B5CF6] text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide'>
                    {adminUser.role}
                  </span>
                </div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 text-sm'>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <Mail size={16} className='text-gray-400' />
                  <span>{adminUser.email}</span>
                </div>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <Phone size={16} className='text-gray-400' />
                  <span>{adminUser.phone}</span>
                </div>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <MapPin size={16} className='text-gray-400' />
                  <span>{adminUser.location}</span>
                </div>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <Calendar size={16} className='text-gray-400' />
                  <span>Joined {adminUser.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Permission Access
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-5'>
            {adminUser.permissions.map((permission, idx) => (
              <div
                key={idx}
                className='flex items-center gap-3 text-sm text-gray-700 font-medium'
              >
                <div className='h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_0_2px_rgba(16,185,129,0.2)]' />
                {permission}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-6'>
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-500 font-medium tracking-wide'>
                Admin ID
              </div>
              <div className='text-sm font-bold text-gray-900'>
                {adminUser.adminId}
              </div>
            </div>
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-500 font-medium tracking-wide'>
                Role
              </div>
              <div className='text-sm font-bold text-gray-900'>
                {adminUser.role}
              </div>
            </div>
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-500 font-medium tracking-wide'>
                Last Updated
              </div>
              <div className='text-sm font-bold text-gray-900'>
                {adminUser.lastUpdated}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
        <CardHeader className='flex flex-row items-center justify-between p-6 md:p-8 pb-4'>
          <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
            Recent Activities
          </CardTitle>
          <Button
            variant='ghost'
            className='text-xs md:text-sm text-gray-500 hover:text-gray-900 font-medium'
          >
            See all
          </Button>
        </CardHeader>
        <CardContent className='p-6 md:p-8 pt-2'>
          <div className='space-y-6 relative before:absolute before:left-[5px] before:top-2 before:h-[calc(100%-20px)] before:w-[2px] before:bg-gray-100'>
            {activities.map((activity, idx) => (
              <div key={idx} className='relative pl-8'>
                <div className='absolute left-0 top-1.5 h-3 w-3 rounded-full bg-[#6B46C1] shadow-[0_0_0_4px_white]' />
                <div className='flex flex-col gap-1.5'>
                  <span className='text-sm font-bold text-gray-900'>
                    {activity.title}
                  </span>
                  <span className='text-sm text-gray-600 leading-relaxed'>
                    {activity.description}
                  </span>
                  <span className='text-xs text-gray-400 font-medium pt-1'>
                    {activity.date}
                  </span>
                </div>
                {idx < activities.length - 1 && (
                  <div className='border-b border-gray-100/60 mt-6' />
                )}
              </div>
            ))}
          </div>

          <div className='flex items-center justify-center gap-2 mt-8'>
            <Button
              variant='outline'
              className='w-8 h-8 p-0 rounded-lg border-[#6B46C1] bg-[#6B46C1] text-white font-medium text-sm'
            >
              1
            </Button>
            <Button
              variant='outline'
              className='w-8 h-8 p-0 rounded-lg text-gray-500 font-medium text-sm'
            >
              2
            </Button>
            <Button
              variant='outline'
              className='w-8 h-8 p-0 rounded-lg text-gray-500 font-medium text-sm'
            >
              3
            </Button>
            <div className='w-8 h-8 flex items-end justify-center pb-2 text-gray-400'>
              ...
            </div>
            <Button
              variant='outline'
              className='w-8 h-8 p-0 rounded-lg text-gray-500 font-medium text-sm'
            >
              20
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
