"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Ban,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Loader2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  X,
  MoreVertical,
  ChevronDown,
  CheckCircle2,
  Briefcase,
  DollarSign,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  useTaskerDetails,
  useSuspendTasker,
  useActivateTasker,
  useVerifyTasker,
} from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";

export default function TaskerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: detailData, isLoading, isError } = useTaskerDetails(id);

  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendDuration, setSuspendDuration] = useState(7);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState("");

  const { mutate: suspend, isPending: isSuspending } = useSuspendTasker();
  const { mutate: activate, isPending: isActivating } = useActivateTasker();
  const { mutate: verify, isPending: isVerifying } = useVerifyTasker();

  if (isLoading) {
    return (
      <div className='flex h-[80vh] items-center justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-[#6B46C1]' />
      </div>
    );
  }

  if (isError || !detailData) {
    return (
      <div className='flex h-[80vh] flex-col items-center justify-center gap-4'>
        <XCircle className='h-12 w-12 text-red-500' />
        <h2 className='text-xl font-bold text-gray-900'>Tasker not found</h2>
        <Link href='/admin/taskers'>
          <Button variant='outline'>Back to Taskers</Button>
        </Link>
      </div>
    );
  }

  const { tasker, stats, recentTasks, reviews } = detailData;
  const fullName = `${tasker.firstName} ${tasker.lastName}`;

  const handleSuspend = () => {
    suspend(
      { id, reason: suspendReason, duration: suspendDuration },
      {
        onSuccess: () => {
          setIsSuspendModalOpen(false);
          setSuspendReason("");
        },
      },
    );
  };

  const handleActivate = () => {
    activate(id);
  };

  const handleVerify = () => {
    verify(
      { id, verificationNotes },
      {
        onSuccess: () => {
          setIsVerifyModalOpen(false);
          setVerificationNotes("");
        },
      },
    );
  };

  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto relative'>
      {/* Header */}
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
              View and manage tasker information
            </p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <Button
            onClick={
              tasker.isSuspended
                ? handleActivate
                : () => setIsSuspendModalOpen(true)
            }
            disabled={isSuspending || isActivating}
            className={`${
              tasker.isSuspended
                ? "bg-[#10B981] hover:bg-[#059669]"
                : "bg-[#EF4444] hover:bg-[#DC2626]"
            } text-white gap-2 h-10 px-6 font-semibold rounded-xl min-w-[160px] transition-all`}
          >
            {isSuspending || isActivating ? (
              <Loader2 size={18} className='animate-spin' />
            ) : tasker.isSuspended ? (
              <>
                <ShieldCheck size={18} /> Activate Tasker
              </>
            ) : (
              <>
                <Ban size={18} /> Suspend Tasker
              </>
            )}
          </Button>

          {!tasker.verifyIdentity && (
            <Button
              onClick={() => setIsVerifyModalOpen(true)}
              disabled={isVerifying}
              className='bg-[#3B82F6] hover:bg-[#2563EB] text-white gap-2 h-10 px-6 font-semibold rounded-xl transition-all'
            >
              {isVerifying ? (
                <Loader2 size={18} className='animate-spin' />
              ) : (
                <>
                  <CheckCircle2 size={18} /> Verify Profile
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
        <CardContent className='p-6 md:p-8'>
          <div className='flex flex-col md:flex-row items-center gap-6'>
            <div className='w-20 h-20 md:w-24 md:h-24 rounded-full bg-purple-50 flex items-center justify-center text-[#6B46C1] overflow-hidden border border-purple-100 shrink-0'>
              {tasker.profilePicture ? (
                <img
                  src={tasker.profilePicture}
                  alt={fullName}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-2xl font-bold'>
                  {tasker.firstName[0]}
                  {tasker.lastName[0]}
                </span>
              )}
            </div>
            <div className='flex-1 text-center md:text-left space-y-4 md:space-y-6 w-full'>
              <div className='flex flex-wrap items-center justify-center md:justify-start gap-3'>
                <h2 className='text-xl md:text-2xl font-bold text-gray-900'>
                  {fullName}
                </h2>
                <span
                  className={`${
                    tasker.verifyIdentity
                      ? "bg-blue-50 text-[#3B82F6]"
                      : "bg-gray-50 text-gray-400"
                  } text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}
                >
                  {tasker.verifyIdentity ? "VERIFIED" : "UNVERIFIED"}
                </span>
                <span
                  className={`${
                    tasker.isSuspended
                      ? "bg-red-50 text-[#EF4444]"
                      : tasker.isActive
                        ? "bg-green-50 text-[#10B981]"
                        : "bg-gray-50 text-gray-400"
                  } text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}
                >
                  {tasker.isSuspended
                    ? "SUSPENDED"
                    : tasker.isActive
                      ? "ACTIVE"
                      : "INACTIVE"}
                </span>
                {tasker.rating > 0 && (
                  <span className='bg-amber-50 text-amber-600 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1'>
                    <Star size={12} className='fill-amber-500 text-amber-500' />
                    {tasker.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 text-sm'>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <Mail size={16} className='text-gray-400' />
                  <span className='truncate max-w-[150px] md:max-w-none'>
                    {tasker.emailAddress}
                  </span>
                </div>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <Phone size={16} className='text-gray-400' />
                  <span>{tasker.phoneNumber || "Not provided"}</span>
                </div>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <MapPin size={16} className='text-gray-400' />
                  <span>
                    {tasker.residentState || tasker.location?.address || "N/A"},{" "}
                    {tasker.country || "N/A"}
                  </span>
                </div>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <Calendar size={16} className='text-gray-400' />
                  <span>
                    Joined {new Date(tasker.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardContent className='p-5'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-purple-50 rounded-xl'>
                <Briefcase size={18} className='text-[#6B46C1]' />
              </div>
              <span className='text-xs font-bold text-gray-400 uppercase'>
                Tasks
              </span>
            </div>
            <div className='text-2xl font-black text-gray-900'>
              {stats.tasks.completed}
            </div>
            <div className='text-[10px] text-gray-400 mt-1'>
              {stats.tasks.completionRate}% completion rate
            </div>
          </CardContent>
        </Card>
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardContent className='p-5'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-green-50 rounded-xl'>
                <DollarSign size={18} className='text-green-500' />
              </div>
              <span className='text-xs font-bold text-gray-400 uppercase'>
                Earnings
              </span>
            </div>
            <div className='text-2xl font-black text-gray-900'>
              {formatCurrency(stats.financials.totalEarnings)}
            </div>
            <div className='text-[10px] text-gray-400 mt-1'>
              Avg: {formatCurrency(stats.financials.averageTaskValue)}
            </div>
          </CardContent>
        </Card>
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardContent className='p-5'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-amber-50 rounded-xl'>
                <Star size={18} className='text-amber-500' />
              </div>
              <span className='text-xs font-bold text-gray-400 uppercase'>
                Rating
              </span>
            </div>
            <div className='text-2xl font-black text-gray-900'>
              {stats.performance.averageRating.toFixed(1)}
            </div>
            <div className='text-[10px] text-gray-400 mt-1'>
              {stats.performance.totalReviews} reviews
            </div>
          </CardContent>
        </Card>
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardContent className='p-5'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-blue-50 rounded-xl'>
                <TrendingUp size={18} className='text-blue-500' />
              </div>
              <span className='text-xs font-bold text-gray-400 uppercase'>
                Bids
              </span>
            </div>
            <div className='text-2xl font-black text-gray-900'>
              {stats.bids.total}
            </div>
            <div className='text-[10px] text-gray-400 mt-1'>
              {stats.bids.acceptanceRate}% acceptance rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Bid Statistics */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='pb-4'>
            <CardTitle className='text-sm md:text-base font-bold text-gray-900 flex items-center gap-2'>
              <TrendingUp size={18} className='text-[#6B46C1]' />
              Bid Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Total Bids</span>
              <span className='font-bold text-gray-900'>
                {stats.bids.total}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Accepted</span>
              <span className='font-bold text-green-600'>
                {stats.bids.accepted}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Rejected</span>
              <span className='font-bold text-red-500'>
                {stats.bids.rejected}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Pending</span>
              <span className='font-bold text-amber-600'>
                {stats.bids.pending}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='pb-4'>
            <CardTitle className='text-sm md:text-base font-bold text-gray-900 flex items-center gap-2'>
              <Clock size={18} className='text-[#6B46C1]' />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>
                Avg. Response Time
              </span>
              <span className='font-bold text-gray-900'>
                {stats.performance.responseTime}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>
                Avg. Completion Time
              </span>
              <span className='font-bold text-gray-900'>
                {stats.performance.completionTime}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Completion Rate</span>
              <span className='font-bold text-gray-900'>
                {stats.tasks.completionRate}%
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Cancelled Tasks</span>
              <span className='font-bold text-red-500'>
                {stats.tasks.cancelled}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='pb-4'>
            <CardTitle className='text-sm md:text-base font-bold text-gray-900 flex items-center gap-2'>
              <DollarSign size={18} className='text-[#6B46C1]' />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Wallet Balance</span>
              <span className='font-bold text-gray-900'>
                {formatCurrency(tasker.wallet)}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Total Earnings</span>
              <span className='font-bold text-green-600'>
                {formatCurrency(stats.financials.totalEarnings)}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>
                Pending Payments
              </span>
              <span className='font-bold text-[#6B46C1]'>
                {formatCurrency(stats.financials.pendingPayments)}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Avg. Task Value</span>
              <span className='font-bold text-gray-900'>
                {formatCurrency(stats.financials.averageTaskValue)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Categories */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
        <CardHeader className='pb-4'>
          <CardTitle className='text-sm md:text-base font-bold text-gray-900'>
            Service Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-3'>
            {tasker.categories.map((cat) => (
              <span
                key={cat._id}
                className='px-5 py-2.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-xl border border-gray-100 shadow-sm'
              >
                {cat.displayName}
              </span>
            ))}
            {tasker.categories.length === 0 && (
              <span className='text-sm text-gray-400'>
                No categories assigned
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Tasks & Reviews */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] overflow-hidden'>
          <CardHeader className='flex flex-row items-center justify-between p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Recent Tasks ({recentTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm whitespace-nowrap'>
                <thead>
                  <tr className='border-b border-gray-50 text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider'>
                    <th className='py-4 px-6 md:px-8 font-medium'>TITLE</th>
                    <th className='py-4 px-6 font-medium'>PRICE</th>
                    <th className='py-4 px-6 font-medium text-right'>STATUS</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-50 text-xs md:text-sm'>
                  {recentTasks.map((task) => (
                    <tr
                      key={task._id}
                      className='group hover:bg-gray-50/50 transition-colors'
                    >
                      <td className='py-5 px-6 md:px-8 font-semibold text-gray-900 max-w-[200px] truncate'>
                        {task.title}
                      </td>
                      <td className='py-5 px-6 font-bold text-gray-900'>
                        {formatCurrency(task.agreedPrice)}
                      </td>
                      <td className='py-5 px-6 text-right'>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            task.status === "completed"
                              ? "bg-green-50 text-green-600"
                              : task.status === "in_progress"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentTasks.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className='py-8 text-center text-gray-400 font-medium'
                      >
                        No tasks yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] overflow-hidden'>
          <CardHeader className='flex flex-row items-center justify-between p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Recent Reviews ({reviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 md:p-8 pt-0 space-y-4'>
            {reviews.map((review) => (
              <div
                key={review._id}
                className='p-5 border border-gray-100 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow'
              >
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold'>
                      {review.reviewer
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)}
                    </div>
                    <div>
                      <div className='text-sm font-bold text-gray-900'>
                        {review.reviewer}
                      </div>
                      <div className='text-[10px] text-gray-400 font-medium mt-0.5'>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-0.5 text-[#F59E0B]'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < review.rating
                            ? "fill-[#F59E0B] text-[#F59E0B]"
                            : "text-gray-200"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className='text-sm text-gray-600 leading-relaxed'>
                  {review.comment}
                </p>
                <div className='text-[10px] text-gray-400 font-medium'>
                  Task: {review.task}
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className='py-8 text-center text-gray-400 font-medium'>
                No reviews yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Suspend Tasker Modal */}
      {isSuspendModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold text-gray-900'>
                  Suspend Tasker
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  Suspend access for {fullName}
                </p>
              </div>
              <button
                onClick={() => setIsSuspendModalOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors'
              >
                <X size={20} />
              </button>
            </div>
            <div className='p-6 space-y-5'>
              <p className='text-sm text-gray-600'>
                This will prevent the tasker from bidding on tasks, remove them
                from task feeds, and withdraw active bids.
              </p>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Suspension Duration (Days)
                </label>
                <Input
                  type='number'
                  value={suspendDuration}
                  onChange={(e) =>
                    setSuspendDuration(parseInt(e.target.value) || 0)
                  }
                  className='rounded-xl h-11'
                  min={0}
                  placeholder='0 for indefinite'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Reason for Suspension *
                </label>
                <Input
                  placeholder='e.g. Multiple customer complaints'
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className='rounded-xl h-11'
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setIsSuspendModalOpen(false)}
                className='rounded-xl font-semibold'
              >
                Cancel
              </Button>
              <Button
                onClick={handleSuspend}
                disabled={isSuspending || !suspendReason.trim()}
                className='bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl gap-2 font-semibold'
              >
                {isSuspending ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <Ban size={16} />
                )}
                Confirm Suspension
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Verify Tasker Modal */}
      {isVerifyModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold text-[#3B82F6]'>
                  Verify Tasker Profile
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  Manually verify {fullName}&apos;s identity
                </p>
              </div>
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors'
              >
                <X size={20} />
              </button>
            </div>
            <div className='p-6 space-y-5'>
              <p className='text-sm text-blue-600 font-medium bg-blue-50 p-3 rounded-xl'>
                This will grant the tasker a verification badge, allow them to
                bid on premium tasks, and send a notification.
              </p>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Verification Notes (Optional)
                </label>
                <Input
                  placeholder='e.g. ID card and utility bill checked'
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className='rounded-xl h-11'
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setIsVerifyModalOpen(false)}
                className='rounded-xl font-semibold'
              >
                Cancel
              </Button>
              <Button
                onClick={handleVerify}
                disabled={isVerifying}
                className='bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl gap-2 font-semibold'
              >
                {isVerifying ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                Confirm Verification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
