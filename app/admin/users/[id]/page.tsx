"use client";

import {
  ArrowLeft,
  Ban,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  Wallet,
  CheckCircle2,
  XCircle,
  X,
  Lock,
  Unlock,
  Trash2,
  MoreVertical,
  ChevronDown,
  ShieldAlert,
  ShieldCheck,
  History,
  Info,
  Fingerprint,
  Key,
  MousePointerClick,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  useUserDetails,
  useDeactivateUser,
  useActivateUser,
  useLockUser,
  useUnlockUser,
  useSoftDeleteUser,
  useSecuritySummary,
  useActivityLogs,
} from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";
import { useState, use, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: detailData, isLoading, isError } = useUserDetails(id);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState("");
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [lockReason, setLockReason] = useState("");
  const [lockDuration, setLockDuration] = useState(24);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [logPage, setLogPage] = useState(1);

  const { data: securitySummary, isLoading: isLoadingSecurity } = useSecuritySummary(id);
  const { data: logsData, isLoading: isLoadingLogs } = useActivityLogs({
    userId: id,
    page: logPage,
    limit: 10,
  });

  const { mutate: deactivate, isPending: isDeactivating } = useDeactivateUser();
  const { mutate: activate, isPending: isActivating } = useActivateUser();
  const { mutate: lock, isPending: isLocking } = useLockUser();
  const { mutate: unlock, isPending: isUnlocking } = useUnlockUser();
  const { mutate: softDelete, isPending: isDeleting } = useSoftDeleteUser();

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
        <h2 className='text-xl font-bold text-gray-900'>User not found</h2>
        <Link href='/admin/users'>
          <Button variant='outline'>Back to Users</Button>
        </Link>
      </div>
    );
  }

  const {
    user,
    wallet,
    verification,
    tasks,
    transactions,
    activityLog,
    stats,
    recentTasks,
    recentTransactions,
  } = detailData;

  const handleDeactivate = () => {
    deactivate(
      { id, reason: deactivateReason },
      {
        onSuccess: () => {
          setIsDeactivateModalOpen(false);
          setDeactivateReason("");
        },
      },
    );
  };

  const handleToggleStatus = () => {
    if (user.isActive) {
      setIsDeactivateModalOpen(true);
    } else {
      activate(id);
    }
  };

  const handleLock = () => {
    lock(
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
    unlock(id);
  };

  const handleDelete = () => {
    softDelete(
      { id, reason: deleteReason },
      {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setDeleteReason("");
        },
      },
    );
  };

  const allTasks = tasks || recentTasks || [];
  const allTransactions = transactions || recentTransactions || [];

  return (
    <div className='space-y-6 p-4 md:p-8 max-w-[1400px] mx-auto relative'>
      {/* ── Header ── */}
      <div className='flex items-center justify-between gap-4'>
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

        <div className='flex items-center gap-3'>
          {/* Primary: Suspend / Activate */}
          <Button
            onClick={handleToggleStatus}
            disabled={
              isDeactivating ||
              isActivating ||
              isLocking ||
              isUnlocking ||
              isDeleting
            }
            className={`${
              user.isActive
                ? "bg-[#EF4444] hover:bg-[#DC2626]"
                : "bg-[#10B981] hover:bg-[#059669]"
            } text-white gap-2 h-10 px-6 font-semibold rounded-xl min-w-[160px] transition-all`}
          >
            {isDeactivating || isActivating ? (
              <Loader2 size={18} className='animate-spin' />
            ) : user.isActive ? (
              <>
                <Ban size={18} /> Suspend User
              </>
            ) : (
              <>
                <ShieldCheck size={18} /> Activate User
              </>
            )}
          </Button>

          {/* More Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='h-10 w-10 md:w-auto md:px-4 rounded-xl border-gray-200 gap-2 font-semibold text-gray-700'
              >
                <MoreVertical size={18} className='md:hidden' />
                <span className='hidden md:inline'>More Actions</span>
                <ChevronDown
                  size={16}
                  className='hidden md:inline text-gray-400'
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-56 p-2 rounded-2xl shadow-xl border-gray-100'
            >
              <DropdownMenuItem
                onClick={
                  user.isLocked ? handleUnlock : () => setIsLockModalOpen(true)
                }
                disabled={isLocking || isUnlocking}
                className={`flex gap-3 px-3 py-2.5 rounded-xl cursor-pointer ${
                  user.isLocked
                    ? "text-green-600 focus:text-green-600"
                    : "text-amber-600 focus:text-amber-600"
                }`}
              >
                {user.isLocked ? (
                  <>
                    <Unlock size={18} />
                    <span>Unlock User Account</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Lock User Account</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isDeleting}
                className='flex gap-3 px-3 py-2.5 rounded-xl text-red-600 focus:text-red-600 cursor-pointer'
              >
                <Trash2 size={18} />
                <span>Delete User (Soft)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Profile Card ── */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <CardContent className='p-5 md:p-6'>
          <div className='flex items-center gap-4'>
            {/* Avatar */}
            <div className='w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold shrink-0 overflow-hidden'>
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.fullName}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span>
                  {(user.fullName || "U")
                    .split(" ")
                    .filter(Boolean)
                    .map((w: string) => w[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)}
                </span>
              )}
            </div>

            {/* Name + badges + contact */}
            <div className='flex-1 min-w-0'>
              <div className='flex flex-wrap items-center gap-2 mb-2'>
                <h2 className='text-base md:text-lg font-bold text-gray-900'>
                  {user.fullName}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    user.isEmailVerified
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {user.isEmailVerified ? "Verified" : "Unverified"}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    user.isActive
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : "bg-red-50 text-red-500 border border-red-200"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
                {user.isLocked && (
                  <span className='text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-500 border border-red-200 flex items-center gap-1'>
                    <ShieldAlert size={10} /> Locked
                  </span>
                )}
              </div>

              {/* Contact row */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-1.5 text-sm text-gray-600'>
                <div className='flex items-center gap-2'>
                  <Mail size={14} className='text-gray-400 shrink-0' />
                  <span className='truncate'>{user.emailAddress}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone size={14} className='text-gray-400 shrink-0' />
                  <span>{user.phoneNumber || "Not provided"}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <MapPin size={14} className='text-gray-400 shrink-0' />
                  <span>
                    {user.residentState || "N/A"}, {user.country || "N/A"}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar size={14} className='text-gray-400 shrink-0' />
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
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
                {(verification as any)?.nin ?? (user as any)?.nin ?? "—"}
              </p>
            </div>
            <div>
              <p className='text-xs text-gray-400 mb-1'>Verification Status</p>
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                  verification?.status === "verified" || user.isKYCVerified
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {verification?.status === "verified" || user.isKYCVerified
                  ? "Verified"
                  : "Not Submitted"}
              </span>
            </div>
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
              <span className='text-gray-500'>Total Tasks</span>
              <span className='font-bold text-gray-900'>
                {stats?.tasks?.total ?? allTasks.length ?? 0}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500'>Active Tasks</span>
              <span className='font-bold text-gray-900'>
                {(stats?.tasks as any)?.active ??
                  allTasks.filter((t: any) => t.status === "in_progress")
                    .length ??
                  0}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500'>Completed Tasks</span>
              <span className='font-bold text-gray-900'>
                {stats?.tasks?.completed ??
                  allTasks.filter((t: any) => t.status === "completed")
                    .length ??
                  0}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500'>Total Transaction</span>
              <span className='font-bold text-gray-900'>
                {formatCurrency(stats?.financials?.totalSpent ?? 0)}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500'>Current balance</span>
              <span className='font-bold text-gray-900'>
                {formatCurrency(wallet?.balance ?? user?.wallet ?? 0)}
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
                {(user as any)?.userId ?? user?._id ?? "—"}
              </p>
            </div>
            <div>
              <p className='text-xs text-gray-400 mb-0.5'>Role</p>
              <p className='text-sm font-bold text-gray-900'>
                {(user as any)?.role ?? "User"}
              </p>
            </div>
            <div>
              <p className='text-xs text-gray-400 mb-0.5'>Last Updated</p>
              <p className='text-sm font-bold text-gray-900'>
                {user?.updatedAt
                  ? new Date(user.updatedAt).toLocaleString()
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
              <ShieldAlert size={16} className='text-purple-600' />
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
                <p className='text-[10px] text-gray-400 font-bold uppercase mb-1'>Login Attempts</p>
                <div className='flex items-center gap-2'>
                  <span className='text-lg font-bold text-gray-900'>
                    {securitySummary?.loginAttempts ?? user?.loginAttempts ?? 0}
                  </span>
                  <span className='text-[10px] text-gray-400'>Failed</span>
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
                    user?.isLocked ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"
                  }`}>
                    {user?.isLocked ? "Suspicious" : "Secure"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Alerts */}
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

      {/* ── Address ── */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <CardContent className='p-5 md:p-6 space-y-3'>
          <h3 className='text-sm font-bold text-gray-900'>Address</h3>
          <div>
            <p className='text-xs text-gray-400 mb-0.5'>Location</p>
            <p className='text-sm font-bold text-gray-900'>
              {[user.residentState, user.country].filter(Boolean).join(" ") ||
                (user as any).address ||
                "Not provided"}
            </p>
          </div>
          <div>
            <p className='text-xs text-gray-400 mb-0.5'>Last Updated</p>
            <p className='text-sm text-gray-700'>
              {user?.updatedAt
                ? new Date(user.updatedAt).toLocaleString()
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Posted Tasks ── */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl overflow-hidden'>
        <div className='flex items-center justify-between px-6 pt-5 pb-3'>
          <h3 className='text-base font-bold text-gray-900'>
            Posted Tasks ({allTasks.length})
          </h3>
          <button className='text-xs text-gray-400 hover:text-gray-600 font-medium'>
            See all
          </button>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='border-b border-gray-100 text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider'>
                <th className='py-3 px-6 font-medium'>Title</th>
                <th className='py-3 px-6 font-medium'>Budget</th>
                <th className='py-3 px-6 font-medium'>Status</th>
                <th className='py-3 px-6 font-medium'>Date</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50 text-xs md:text-sm'>
              {allTasks.map((task: any) => (
                <tr
                  key={task._id}
                  className='hover:bg-gray-50/50 transition-colors'
                >
                  <td className='py-4 px-6 font-semibold text-gray-900 max-w-[180px] truncate'>
                    {task.title}
                  </td>
                  <td className='py-4 px-6 font-bold text-gray-900'>
                    {formatCurrency(task.budget)}
                  </td>
                  <td className='py-4 px-6'>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        task.status === "completed"
                          ? "bg-green-50 text-green-600"
                          : task.status === "in_progress"
                            ? "bg-blue-50 text-blue-600"
                            : task.status === "open"
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      {task.status === "in_progress"
                        ? "In progress"
                        : task.status.charAt(0).toUpperCase() +
                          task.status.slice(1)}
                    </span>
                  </td>
                  <td className='py-4 px-6 text-gray-500 whitespace-nowrap'>
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
              {allTasks.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className='py-8 text-center text-gray-400 font-medium'
                  >
                    No tasks posted yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Transaction History ── */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl overflow-hidden'>
        <div className='flex items-center justify-between px-6 pt-5 pb-3'>
          <h3 className='text-base font-bold text-gray-900'>
            Transaction History
          </h3>
          <button className='text-xs text-gray-400 hover:text-gray-600 font-medium'>
            See all
          </button>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='border-b border-gray-100 text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider'>
                <th className='py-3 px-6 font-medium'>Description</th>
                <th className='py-3 px-6 font-medium'>Type</th>
                <th className='py-3 px-6 font-medium'>Amount</th>
                <th className='py-3 px-6 font-medium'>Date</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50 text-xs md:text-sm'>
              {allTransactions.map((tx: any) => {
                const isCredit =
                  tx.type?.toLowerCase().includes("credit") ||
                  tx.type === "credit";
                return (
                  <tr
                    key={tx._id}
                    className='hover:bg-gray-50/50 transition-colors'
                  >
                    <td className='py-4 px-6 text-gray-900 font-medium max-w-[200px] truncate'>
                      {tx.description}
                    </td>
                    <td className='py-4 px-6'>
                      <span
                        className={`text-xs font-semibold ${
                          isCredit ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {isCredit ? "Credit" : "Debit"}
                      </span>
                    </td>
                    <td className='py-4 px-6 font-bold text-gray-900'>
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className='py-4 px-6 text-gray-500 whitespace-nowrap'>
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                );
              })}
              {allTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className='py-8 text-center text-gray-400 font-medium'
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Activity Log (History) ── */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <div className='flex items-center justify-between px-6 pt-5 pb-3'>
          <h3 className='text-base font-bold text-gray-900 flex items-center gap-2'>
            <History size={18} className='text-gray-400' />
            Activity History
          </h3>
          <div className='flex items-center gap-2'>
            <span className='text-[10px] text-gray-400 font-medium'>
              {logsData?.totalRecords || 0} Events
            </span>
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
                <p>No activity logs found for this user</p>
              </div>
            )}
          </div>

          {/* Pagination for Logs */}
          {(logsData?.totalPages ?? 0) > 1 && (
            <div className='flex items-center justify-between mt-6 pt-4 border-t border-gray-100'>
              <p className='text-[10px] text-gray-400'>
                Page {logPage} of {logsData?.totalPages ?? 0}
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

      {/* ── Deactivate / Suspend Modal ── */}
      {isDeactivateModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg shadow-xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto no-scrollbar'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold text-gray-900'>
                  Suspend User Account
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  Suspend access for {user.fullName}
                </p>
              </div>
              <button
                onClick={() => setIsDeactivateModalOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400'
              >
                <X size={20} />
              </button>
            </div>
            <div className='p-6 space-y-5'>
              <p className='text-sm text-gray-600'>
                This will prevent the user from logging in and accessing their
                account.
              </p>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Reason for Suspension
                </label>
                <Input
                  placeholder='e.g. Violation of terms of service'
                  value={deactivateReason}
                  onChange={(e) => setDeactivateReason(e.target.value)}
                  className='rounded-xl h-11'
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setIsDeactivateModalOpen(false)}
                className='rounded-xl font-semibold'
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeactivate}
                disabled={isDeactivating}
                className='bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl gap-2 font-semibold'
              >
                {isDeactivating ? (
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

      {/* ── Lock User Modal ── */}
      {isLockModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg shadow-xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto no-scrollbar'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold text-amber-600'>
                  Lock User Account
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  Temporarily restrict access for {user.fullName}
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
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Lock Duration (Hours)
                </label>
                <Input
                  type='number'
                  value={lockDuration}
                  onChange={(e) => setLockDuration(parseInt(e.target.value))}
                  className='rounded-xl h-11'
                  min={1}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Reason for Locking
                </label>
                <Input
                  placeholder='e.g. Suspicious activity detected'
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
                disabled={isLocking}
                className='bg-amber-600 hover:bg-amber-700 text-white rounded-xl gap-2 font-semibold'
              >
                {isLocking ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <Lock size={16} />
                )}
                Confirm Lock
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete User Modal ── */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold text-red-600'>
                  Delete User Account
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  This is a soft delete for {user.fullName}
                </p>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400'
              >
                <X size={20} />
              </button>
            </div>
            <div className='p-6 space-y-5'>
              <p className='text-sm text-red-600 font-medium bg-red-50 p-3 rounded-xl'>
                Warning: This will hide the user from all public listings and
                terminate active sessions. This action is reversible by an admin
                but should be used with caution.
              </p>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Reason for Deletion
                </label>
                <Input
                  placeholder='e.g. Account removal request'
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className='rounded-xl h-11'
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setIsDeleteModalOpen(false)}
                className='rounded-xl font-semibold'
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className='bg-red-600 hover:bg-red-700 text-white rounded-xl gap-2 font-semibold'
              >
                {isDeleting ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <Trash2 size={16} />
                )}
                Confirm Deletion
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
