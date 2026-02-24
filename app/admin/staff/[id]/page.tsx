"use client";

import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Phone,
  Download,
  Loader2,
  ShieldCheck,
  UserX,
  UserCheck,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStaffDetails, useUpdateStaffStatus } from "@/hooks/useAdmin";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function StaffDetailsPage() {
  const { id } = useParams();
  const staffId = id as string;

  const { data: detailData, isLoading, error } = useStaffDetails(staffId);
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateStaffStatus();

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
        <Loader2 className='animate-spin text-purple-600' size={40} />
        <p className='text-gray-500 font-medium'>Loading staff details...</p>
      </div>
    );
  }

  if (error || !detailData) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
        <div className='h-16 w-16 bg-red-50 rounded-full flex items-center justify-center text-red-600'>
          <X size={32} />
        </div>
        <div className='text-center'>
          <h2 className='text-xl font-bold text-gray-900'>
            Error Loading Details
          </h2>
          <p className='text-gray-500 mt-1'>
            We couldn't retrieve the information for this staff member.
          </p>
        </div>
        <Link href='/admin/staff'>
          <Button variant='outline'>Back to Staff List</Button>
        </Link>
      </div>
    );
  }

  const { staff, activity, recentActivity } = detailData;

  const handleStatusToggle = () => {
    updateStatus({
      id: staffId,
      data: { isActive: !staff.isActive },
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-50 text-red-600";
      case "operations":
        return "bg-blue-50 text-blue-600";
      case "trust_safety":
        return "bg-orange-50 text-orange-600";
      case "support":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

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
            onClick={handleStatusToggle}
            disabled={isUpdating}
            variant='outline'
            className={`h-10 gap-2 text-sm font-semibold rounded-xl border-gray-200 px-5 ${
              staff.isActive
                ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                : "text-green-600 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            {isUpdating ? (
              <Loader2 size={16} className='animate-spin' />
            ) : staff.isActive ? (
              <UserX size={16} />
            ) : (
              <UserCheck size={16} />
            )}
            {staff.isActive ? "Deactivate Account" : "Activate Account"}
          </Button>
          <Button
            variant='outline'
            className='h-10 gap-2 text-sm font-semibold rounded-xl border-gray-200 text-gray-700 px-5'
          >
            <Download size={16} className='text-gray-500' /> Export Profile
          </Button>
        </div>
      </div>

      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
        <CardContent className='p-6 md:p-8'>
          <div className='flex flex-col md:flex-row items-center gap-6'>
            <div className='w-20 h-20 md:w-24 md:h-24 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-3xl md:text-4xl shrink-0'>
              {staff.fullName.charAt(0)}
            </div>
            <div className='flex-1 text-center md:text-left space-y-4 md:space-y-6 w-full'>
              <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                <div className='flex flex-wrap items-center justify-center md:justify-start gap-3'>
                  <h2 className='text-xl md:text-2xl font-bold text-gray-900'>
                    {staff.fullName}
                  </h2>
                  <span
                    className={`text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${getRoleBadgeColor(staff.role)}`}
                  >
                    {staff.role.replace("_", " ")}
                  </span>
                  <Badge
                    variant='secondary'
                    className={`${
                      staff.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    } font-medium`}
                  >
                    {staff.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 text-sm'>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <Mail size={16} className='text-gray-400' />
                  <span>{staff.emailAddress}</span>
                </div>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <Calendar size={16} className='text-gray-400' />
                  <span>
                    Joined {format(new Date(staff.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <ShieldCheck size={16} className='text-gray-400' />
                  <span>{staff.permissions.length} Permissions</span>
                </div>
                {staff.lastLogin && (
                  <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                    <Calendar size={16} className='text-gray-400' />
                    <span>
                      Last Login{" "}
                      {format(new Date(staff.lastLogin), "MMM dd, HH:mm")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Access & Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-4'>
            {staff.permissions.length > 0 ? (
              staff.permissions.map((permission, idx) => (
                <div
                  key={idx}
                  className='flex items-center gap-3 text-sm text-gray-700 font-medium'
                >
                  <div className='h-2 w-2 rounded-full bg-[#6B46C1] shadow-[0_0_0_2px_rgba(107,70,193,0.2)]' />
                  {permission}
                </div>
              ))
            ) : (
              <div className='text-gray-500 text-sm'>
                No specific permissions assigned.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Account Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-6'>
            <div className='grid grid-cols-2 gap-6'>
              <div className='space-y-1.5'>
                <div className='text-xs text-gray-500 font-medium tracking-wide'>
                  Total Logins
                </div>
                <div className='text-lg font-bold text-gray-900'>
                  {activity.login_count}
                </div>
              </div>
              <div className='space-y-1.5'>
                <div className='text-xs text-gray-500 font-medium tracking-wide'>
                  30d Actions
                </div>
                <div className='text-lg font-bold text-gray-900'>
                  {activity.last_30_days.actions}
                </div>
              </div>
              <div className='space-y-1.5'>
                <div className='text-xs text-gray-500 font-medium tracking-wide'>
                  Avg Session
                </div>
                <div className='text-sm font-bold text-gray-900'>
                  {activity.last_30_days.average_session}
                </div>
              </div>
              <div className='space-y-1.5'>
                <div className='text-xs text-gray-500 font-medium tracking-wide'>
                  Admin Status
                </div>
                <div className='text-sm font-bold text-gray-900'>
                  {staff.isActive ? "Verified" : "Suspended"}
                </div>
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
            {recentActivity.length > 0 ? (
              recentActivity.map((act, idx) => (
                <div key={idx} className='relative pl-8'>
                  <div className='absolute left-0 top-1.5 h-3 w-3 rounded-full bg-[#6B46C1] shadow-[0_0_0_4px_white]' />
                  <div className='flex flex-col gap-1.5'>
                    <span className='text-sm font-bold text-gray-900'>
                      {act.type.charAt(0).toUpperCase() +
                        act.type.slice(1).replace("_", " ")}
                    </span>
                    <span className='text-sm text-gray-600 leading-relaxed'>
                      Performed action on{" "}
                      <span className='font-semibold'>{act.target}</span>
                    </span>
                    <span className='text-xs text-gray-400 font-medium pt-1'>
                      {format(new Date(act.timestamp), "MMM dd, yyyy HH:mm:ss")}
                    </span>
                  </div>
                  {idx < recentActivity.length - 1 && (
                    <div className='border-b border-gray-100/60 mt-6' />
                  )}
                </div>
              ))
            ) : (
              <div className='text-center py-8 text-gray-500'>
                No recent activities recorded.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
