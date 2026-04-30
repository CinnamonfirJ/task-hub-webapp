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
  ShieldAlertIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  useTaskerDetails,
  useLockTasker,
  useUnlockTasker,
  useVerifyTasker,
  useSecuritySummary,
  useActivityLogs,
} from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";
import {
  History,
  Info,
  Fingerprint,
  Key,
  MousePointerClick,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

export default function TaskerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: detailData, isLoading, isError } = useTaskerDetails(id);

  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [lockReason, setLockReason] = useState("");
  const [lockDuration, setLockDuration] = useState(7);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState("");

  const { mutate: lockTasker, isPending: isLocking } = useLockTasker();
  const { mutate: unlockTasker, isPending: isUnlocking } = useUnlockTasker();
  const { mutate: verify, isPending: isVerifying } = useVerifyTasker();

  const [logPage, setLogPage] = useState(1);

  const { data: securitySummary, isLoading: isLoadingSecurity } = useSecuritySummary(id);
  const { data: logsData, isLoading: isLoadingLogs } = useActivityLogs({
    userId: id,
    page: logPage,
    limit: 10,
  });

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

  const { tasker, stats, recentTasks, reviews, account, kyc, categories } = detailData;
  const activityLog = detailData?.activityLog ?? [];
  const fullName = account?.fullName;

  const handleLock = () => {
    lockTasker(
      { id, reason: lockReason, duration: lockDuration },
      {
        onSuccess: () => {
          setIsLockModalOpen(false);
          setLockReason("");
        },
      },
    );
  };

  const handleUnlock = () => {
    unlockTasker(id);
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
        <Button
          onClick={
            tasker?.lockUntil && new Date(tasker.lockUntil) > new Date()
              ? handleUnlock
              : () => setIsLockModalOpen(true)
          }
          disabled={isLocking || isUnlocking}
          className={`${
            tasker?.lockUntil && new Date(tasker.lockUntil) > new Date()
              ? "bg-[#10B981] hover:bg-[#059669]"
              : "bg-[#EF4444] hover:bg-[#DC2626]"
          } text-white gap-2 h-10 px-6 font-semibold rounded-xl min-w-[160px] transition-all`}
        >
          {isLocking || isUnlocking ? (
            <Loader2 size={18} className="animate-spin" />
          ) : tasker?.lockUntil && new Date(tasker.lockUntil) > new Date() ? (
            <>
              <ShieldCheck size={18} /> Unlock Tasker
            </>
          ) : (
            <>
              <Ban size={18} /> Lock Tasker
            </>
          )}
        </Button>
      </div>

      {/* ── Profile Card ── */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <CardContent className='p-5 md:p-6'>
          <div className='flex items-center gap-4'>
            {/* Avatar */}
            <div className='w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold shrink-0 overflow-hidden border border-gray-100'>
              {tasker?.profilePicture ? (
                <img
                  src={tasker.profilePicture}
                  alt={fullName}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span>
                  {fullName
                    ?.split(" ")
                    .map((w: string) => w[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2) || "T"}
                </span>
              )}
            </div>

            {/* Name + badges + contact */}
            <div className='flex-1 min-w-0'>
              <div className='flex flex-wrap items-center gap-2 mb-2'>
                <h2 className='text-base md:text-lg font-bold text-gray-900'>
                  {fullName}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    tasker?.verifyIdentity
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {tasker?.verifyIdentity ? "Verified" : "Unverified"}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    tasker?.isActive
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : "bg-red-50 text-red-500 border border-red-200"
                  }`}
                >
                  {tasker?.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Contact row */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-1.5 text-sm text-gray-600'>
                <div className='flex items-center gap-2'>
                  <Mail size={14} className='text-gray-400 shrink-0' />
                  <span className='truncate'>{tasker?.emailAddress}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone size={14} className='text-gray-400 shrink-0' />
                  <span>{tasker?.phoneNumber || "Not provided"}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <MapPin size={14} className='text-gray-400 shrink-0' />
                  <span>
                    {tasker?.residentState || "N/A"}, {tasker?.country || "N/A"}
                  </span>
                </div>
              
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* ── Security Summary ── */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='pb-2 flex flex-row items-center justify-between space-y-0'>
            <CardTitle className='text-sm font-bold text-gray-900 flex items-center gap-2'>
              <ShieldAlertIcon size={16} className='text-purple-600' />
              Security Summary
            </CardTitle>
            {isLoadingSecurity && <Loader2 size={14} className='animate-spin text-gray-400' />}
          </CardHeader>
          <CardContent className='pt-2'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='p-3 bg-gray-50 rounded-xl border border-gray-100'>
                <p className='text-[10px] text-gray-400 font-bold uppercase mb-1'>Risk Score</p>
                <div className='flex items-center gap-2'>
                  <span className={`text-lg font-bold ${
                    (securitySummary?.riskScore || 0) > 70 ? "text-red-500" : 
                    (securitySummary?.riskScore || 0) > 30 ? "text-amber-500" : "text-green-500"
                  }`}>
                    {securitySummary?.riskScore ?? "—"}
                  </span>
                  <span className='text-[10px] text-gray-400'>/ 100</span>
                </div>
              </div>
              <div className='p-3 bg-gray-50 rounded-xl border border-gray-100'>
                <p className='text-[10px] text-gray-400 font-bold uppercase mb-1'>Security Alerts</p>
                <div className='flex items-center gap-2'>
                  <span className='text-lg font-bold text-gray-900'>
                    {securitySummary?.alerts?.length || 0}
                  </span>
                  <span className='text-[10px] text-gray-400'>Total</span>
                </div>
              </div>
              <div className='col-span-2 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between'>
                <div>
                  <p className='text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center gap-1'>
                    <Fingerprint size={12} /> Last Known IP
                  </p>
                  <p className='text-sm font-mono text-gray-700'>{securitySummary?.lastLoginIp || "—"}</p>
                </div>
                <div className='text-right'>
                  <p className='text-[10px] text-gray-400 font-bold uppercase mb-1'>Status</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tasker?.lockUntil && new Date(tasker.lockUntil) > new Date() ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"
                  }`}>
                    {tasker?.lockUntil && new Date(tasker.lockUntil) > new Date() ? "Locked" : "Active"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Alerts List */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-bold text-gray-900 flex items-center gap-2'>
              <AlertCircle size={16} className='text-amber-500' />
              Recent Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-2 h-[140px] overflow-y-auto custom-scrollbar px-6'>
            {securitySummary?.alerts?.length > 0 ? (
              <div className='space-y-3'>
                {securitySummary.alerts.map((alert: any, idx: number) => (
                  <div key={idx} className='flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors'>
                    <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                      alert.severity === "high" ? "bg-red-500" : "bg-amber-400"
                    }`} />
                    <div>
                      <p className='text-xs font-bold text-gray-800'>{alert.type}</p>
                      <p className='text-[10px] text-gray-500'>{alert.description}</p>
                      <p className='text-[9px] text-gray-400 mt-0.5'>{new Date(alert.date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='h-full flex flex-col items-center justify-center text-gray-400'>
                <ShieldCheck size={24} className='mb-2 opacity-20' />
                <p className='text-xs font-medium'>No security alerts detected</p>
              </div>
            )}
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
            {/* categories is string[] | TaskerCategory[] from the detail endpoint */}
            {(categories ?? tasker?.categories ?? []).map(
              (cat: any, idx: number) => (
                <span
                  key={typeof cat === "string" ? idx : cat._id ?? idx}
                  className='px-4 py-2 bg-purple-50 text-[#6B46C1] text-xs font-semibold rounded-xl border border-purple-100'
                >
                  {typeof cat === "string" ? cat : (cat.displayName ?? cat.name ?? cat)}
                </span>
              ),
            )}
            {((categories ?? tasker?.categories ?? []).length === 0) && (
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

      {/* ── Activity History ── */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <div className='flex items-center justify-between px-6 pt-5 pb-3'>
          <h3 className='text-base font-bold text-gray-900 flex items-center gap-2'>
            <History size={18} className='text-gray-400' />
            Activity History
          </h3>
          <div className='flex items-center gap-2 text-[10px] text-gray-400 font-medium'>
            {logsData?.totalRecords || 0} Total Events
          </div>
        </div>
        <CardContent className='px-6 pb-6 pt-0'>
          <div className='space-y-4 relative min-h-[100px]'>
            {isLoadingLogs && (
              <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
                <Loader2 className='h-6 w-6 animate-spin text-purple-600' />
              </div>
            )}
            
            {(logsData?.logs || []).map((log: any, idx: number) => (
              <div key={log._id || idx} className='group flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100'>
                <div className='mt-1.5 w-2 h-2 rounded-full bg-purple-500 shrink-0 group-hover:scale-125 transition-transform' />
                <div className='flex-1'>
                  <div className='flex items-center justify-between mb-0.5'>
                    <p className='text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors'>
                      {log.action.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </p>
                    <span className='text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase'>
                      {log.onModel || log.resourceType || "System"}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500 leading-relaxed mb-1.5'>{log.details || "No additional details provided."}</p>
                  <div className='flex items-center gap-3 text-[10px] text-gray-400'>
                    <div className='flex items-center gap-1'>
                      <Calendar size={10} />
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                    {log.ipAddress && (
                      <div className='flex items-center gap-1'>
                        <MousePointerClick size={10} />
                        {log.ipAddress}
                      </div>
                    )}
                    {(log.performedBy || log.admin) && (
                      <div className='flex items-center gap-1'>
                        <ShieldCheck size={10} className='text-purple-400' />
                        {log.performedBy 
                          ? `${log.performedBy.firstName || ""} ${log.performedBy.lastName || ""}`.trim() || log.performedBy.emailAddress
                          : log.admin?.fullName ?? log.admin?.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {(logsData?.logs || []).length === 0 && !isLoadingLogs && (
              <div className='py-12 text-center text-gray-400 font-medium text-sm flex flex-col items-center gap-2'>
                <History size={32} className='opacity-10' />
                <p>No activity logs found for this tasker</p>
              </div>
            )}
          </div>

          {/* Pagination for Logs */}
          {(logsData?.totalPages ?? 0) > 1 && (
            <div className='flex items-center justify-between mt-6 pt-4 border-t border-gray-100'>
              <p className='text-[10px] text-gray-400'>
                Page {logPage} of {logsData?.totalPages || 0}
              </p>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                  disabled={logPage === 1}
                  className='h-7 w-7 p-0 rounded-lg'
                >
                  <ChevronDown className='rotate-90' size={14} />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setLogPage((p) => p + 1)}
                  disabled={logPage === (logsData?.totalPages ?? 0)}
                  className='h-7 w-7 p-0 rounded-lg'
                >
                  <ChevronDown className='-rotate-90' size={14} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Lock Tasker Modal ── */}
      {isLockModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto no-scrollbar'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold text-gray-900'>
                  Lock Tasker
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  Lock access for {fullName}
                </p>
              </div>
              <button
                onClick={() => setIsLockModalOpen(false)}
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
                  Lock Duration (Days)
                </label>
                <Input
                  type='number'
                  value={lockDuration}
                  onChange={(e) =>
                    setLockDuration(parseInt(e.target.value) || 0)
                  }
                  className='rounded-xl h-11'
                  min={0}
                  placeholder='0 for indefinite'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Reason for Lock *
                </label>
                <Input
                  placeholder='e.g. Multiple customer complaints'
                  value={lockReason}
                  onChange={(e) => setLockReason(e.target.value)}
                  className='rounded-xl h-11'
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setIsLockModalOpen(false)}
                className='rounded-xl font-semibold'
              >
                Cancel
              </Button>
              <Button
                onClick={handleLock}
                disabled={isLocking || !lockReason.trim()}
                className='bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl gap-2 font-semibold'
              >
                {isLocking ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <Ban size={16} />
                )}
                Confirm Lock
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
