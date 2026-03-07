"use client";

import { useState, use } from "react";
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
  X,
  CheckCircle2,
  DollarSign,
  LogIn,
  CheckSquare,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
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

  const { tasker, stats, recentTasks, reviews, account, kyc } = detailData;
  const activityLog = detailData?.activityLog ?? [];
  const fullName = account?.fullName;

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

  const activityIconMap: Record<string, React.ReactNode> = {
    login: <LogIn size={14} className='text-[#6B46C1]' />,
    task_completed: <CheckSquare size={14} className='text-green-500' />,
    profile_update: <UserCog size={14} className='text-blue-500' />,
  };

  return (
    <div className='space-y-6 p-4 md:p-8 max-w-[1400px] mx-auto relative'>
      {/* ── Header ── */}
      <div className='flex items-center justify-between gap-4'>
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

        {/* Suspend / Activate button */}
        {/* <Button
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
            <Loader2 size={18} className="animate-spin" />
          ) : tasker.isSuspended ? (
            <>
              <ShieldCheck size={18} /> Activate Tasker
            </>
          ) : (
            <>
              <Ban size={18} /> Suspend Tasker
            </>
          )}
        </Button> */}
      </div>

      {/* ── Three info cards ── */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* KYC Information */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-bold text-gray-900'>
              KYC Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-xs text-gray-400 mb-1'>NIN</p>
              <p className='text-sm font-bold text-gray-900'>
                {kyc?.number || "—"}
              </p>
            </div>
            <div>
              <p className='text-xs text-gray-400 mb-1'>Verification Status</p>
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                  kyc?.status === "verified"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {kyc?.status === "verified" ? "Verified" : "Unverified"}
              </span>
            </div>

            {/* {kyc?.status === "unverified" && (
              <Button
                onClick={() => setIsVerifyModalOpen(true)}
                disabled={isVerifying}
                size='sm'
                className='w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white gap-2 rounded-xl font-semibold mt-2'
              >
                {isVerifying ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Verify Profile
                  </>
                )}
              </Button>
            )} */}
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-bold text-gray-900'>
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500'>Rating</span>
              <span className='font-bold text-gray-900 flex items-center gap-1'>
                <Star size={14} className='fill-amber-400 text-amber-400' />
                {(
                  stats?.rating ??
                  stats?.performance?.averageRating ??
                  0
                ).toFixed(1)}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500'>Completion Rate</span>
              <span className='font-bold text-gray-900'>
                {stats?.completionRate ?? stats?.tasks?.completionRate ?? 0}%
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500'>Completed Tasks</span>
              <span className='font-bold text-gray-900'>
                {stats?.completedTasks ?? stats?.tasks?.completed ?? 0}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500'>Total Transaction</span>
              <span className='font-bold text-gray-900'>
                {formatCurrency(stats?.totalTransaction ?? 0)}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500'>Current balance</span>
              <span className='font-bold text-gray-900'>
                {formatCurrency(tasker?.wallet ?? stats?.currentBalance ?? 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-bold text-gray-900'>
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div>
              <p className='text-xs text-gray-400 mb-0.5'>User ID</p>
              <p className='text-sm font-bold text-gray-900'>
                {account?.userId ?? tasker?._id ?? "—"}
              </p>
            </div>
            <div>
              <p className='text-xs text-gray-400 mb-0.5'>Role</p>
              <p className='text-sm font-bold text-gray-900'>
                {account?.role ?? "User"}
              </p>
            </div>
            <div>
              <p className='text-xs text-gray-400 mb-0.5'>Last Updated</p>
              <p className='text-sm font-bold text-gray-900'>
                {account?.lastUpdated
                  ? new Date(account.lastUpdated).toLocaleString()
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Service Category ── */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-bold text-gray-900'>
            Service Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-3'>
            {tasker?.categories?.map((cat: any, idx: number) => (
              <span
                key={typeof cat === "string" ? idx : cat._id}
                className='px-4 py-2 bg-white text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 shadow-sm'
              >
                {typeof cat === "string" ? cat : cat.displayName}
              </span>
            ))}
            {(!tasker?.categories || tasker.categories.length === 0) && (
              <span className='text-sm text-gray-400'>
                No categories assigned
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Recent Reviews ── */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl overflow-hidden'>
        <CardHeader className='flex flex-row items-center justify-between p-6 pb-4'>
          <CardTitle className='text-base font-bold text-gray-900'>
            Recent Reviews
          </CardTitle>
          <button className='text-xs text-gray-400 hover:text-gray-600 font-medium'>
            See all
          </button>
        </CardHeader>
        <CardContent className='p-6 pt-0 space-y-4'>
          {reviews.map((review: any) => (
            <div
              key={review._id}
              className='flex items-start gap-4 p-4 border border-gray-100 rounded-2xl hover:shadow-sm transition-shadow'
            >
              {/* Avatar */}
              <div className='w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold shrink-0'>
                {review.reviewer
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)}
              </div>

              {/* Content */}
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-bold text-gray-900'>
                  {review.reviewer}
                </p>
                <p className='text-sm text-gray-600 mt-0.5 leading-relaxed'>
                  {review.comment}
                </p>
                <p className='text-xs text-gray-400 mt-1'>
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Stars */}
              <div className='flex gap-0.5 text-amber-400 shrink-0'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    }
                  />
                ))}
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

      {/* ── Activity Log ── */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl overflow-hidden'>
        <CardHeader className='flex flex-row items-center justify-between p-6 pb-4'>
          <CardTitle className='text-base font-bold text-gray-900'>
            Activity Log
          </CardTitle>
          <button className='text-xs text-gray-400 hover:text-gray-600 font-medium'>
            See all
          </button>
        </CardHeader>
        <CardContent className='p-6 pt-0 space-y-5'>
          {activityLog.length > 0 ? (
            activityLog.map((entry: any, idx: number) => (
              <div key={idx} className='flex items-start gap-4'>
                {/* Dot */}
                <div className='mt-1 w-2.5 h-2.5 rounded-full bg-[#6B46C1] shrink-0' />
                <div>
                  <p className='text-sm font-bold text-gray-900'>
                    {entry.title}
                  </p>
                  <p className='text-xs text-gray-500'>{entry.description}</p>
                  <p className='text-xs text-gray-400 mt-0.5'>
                    {entry.createdAt
                      ? new Date(entry.createdAt).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            ))
          ) : /* Fallback: show recentTasks as activity */
          recentTasks?.length > 0 ? (
            recentTasks.map((task: any) => (
              <div key={task._id} className='flex items-start gap-4'>
                <div className='mt-1 w-2.5 h-2.5 rounded-full bg-[#6B46C1] shrink-0' />
                <div>
                  <p className='text-sm font-bold text-gray-900'>
                    Task {task.status.replace("_", " ")}
                  </p>
                  <p className='text-xs text-gray-500'>{task.title}</p>
                  <p className='text-xs text-gray-400 mt-0.5'>
                    {task.updatedAt
                      ? new Date(task.updatedAt).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className='py-6 text-center text-gray-400 font-medium text-sm'>
              No activity recorded
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Suspend Tasker Modal ── */}
      {isSuspendModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl'>
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
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400'
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

      {/* ── Verify Tasker Modal ── */}
      {isVerifyModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl'>
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
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400'
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
