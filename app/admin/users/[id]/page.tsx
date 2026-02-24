"use client";

import {
  ArrowLeft,
  Ban,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  History,
  Wallet,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  Lock,
  Unlock,
  Trash2,
  MoreVertical,
  ChevronDown,
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
} from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
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
  params: { id: string };
}) {
  const { id } = params;
  const { data: detailData, isLoading, isError } = useUserDetails(id);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState("");
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [lockReason, setLockReason] = useState("");
  const [lockDuration, setLockDuration] = useState(24); // hours
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

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

  const { user, stats, recentTasks, recentTransactions } = detailData;

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

  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto relative'>
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
        <div className='flex items-center gap-3'>
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
                <Ban size={18} /> Deactivate User
              </>
            ) : (
              <>
                <ShieldCheck size={18} /> Activate User
              </>
            )}
          </Button>

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

      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
        <CardContent className='p-6 md:p-8'>
          <div className='flex flex-col md:flex-row items-center gap-6'>
            <div className='w-20 h-20 md:w-24 md:h-24 rounded-full bg-purple-50 flex items-center justify-center text-[#6B46C1] overflow-hidden border border-purple-100 shrink-0'>
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.fullName}
                  className='w-full h-full object-cover'
                />
              ) : (
                <ArrowLeft size={40} className='rotate-180 opacity-20' />
              )}
            </div>
            <div className='flex-1 text-center md:text-left space-y-4 md:space-y-6 w-full'>
              <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                <div className='flex flex-wrap items-center justify-center md:justify-start gap-3'>
                  <h2 className='text-xl md:text-2xl font-bold text-gray-900'>
                    {user.fullName}
                  </h2>
                  <span
                    className={`${
                      user.isEmailVerified
                        ? "bg-blue-50 text-[#3B82F6]"
                        : "bg-gray-50 text-gray-400"
                    } text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}
                  >
                    {user.isEmailVerified ? "VERIFIED" : "UNVERIFIED"}
                  </span>
                  <span
                    className={`${
                      user.isActive
                        ? "bg-green-50 text-[#10B981]"
                        : "bg-red-50 text-[#EF4444]"
                    } text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}
                  >
                    {user.isActive ? "ACTIVE" : "DEACTIVATED"}
                  </span>
                  {user.isLocked && (
                    <span className='bg-red-100 text-[#EF4444] text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1'>
                      <ShieldAlert size={12} /> LOCKED
                    </span>
                  )}
                </div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 text-sm'>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <Mail size={16} className='text-gray-400' />
                  <span className='truncate max-w-[150px] md:max-w-none'>
                    {user.emailAddress}
                  </span>
                </div>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <Phone size={16} className='text-gray-400' />
                  <span>{user.phoneNumber || "Not provided"}</span>
                </div>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <MapPin size={16} className='text-gray-400' />
                  <span>
                    {user.residentState || "N/A"}, {user.country || "N/A"}
                  </span>
                </div>
                <div className='flex items-center justify-center md:justify-start gap-2.5 text-gray-600'>
                  <Calendar size={16} className='text-gray-400' />
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='pb-4'>
            <CardTitle className='text-sm md:text-base font-bold text-gray-900 flex items-center gap-2'>
              <ShieldCheck size={18} className='text-[#6B46C1]' />
              KYC Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-5'>
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-500 font-medium'>NIN</div>
              <div className='text-sm font-bold text-gray-900'>
                {/* Assuming user.nin exists or we use a placeholder */}
                {(user as any).nin || "Not uploaded"}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-xs text-gray-500 font-medium'>
                Verification Status
              </div>
              <div>
                <span
                  className={`${
                    user.isKYCVerified
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-yellow-50 text-yellow-600"
                  } text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full inline-block uppercase`}
                >
                  {user.isKYCVerified ? "Verified" : "Pending / Not Started"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='pb-4'>
            <CardTitle className='text-sm md:text-base font-bold text-gray-900 flex items-center gap-2'>
              <History size={18} className='text-[#6B46C1]' />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Total Tasks</span>
              <span className='font-bold text-gray-900'>
                {stats.tasks.total}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Completed Tasks</span>
              <span className='font-bold text-gray-900'>
                {stats.tasks.completed}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Cancelled Tasks</span>
              <span className='font-bold text-red-500'>
                {stats.tasks.cancelled}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Total Spent</span>
              <span className='font-bold text-gray-900'>
                {formatCurrency(stats.financials.totalSpent)}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 font-medium'>Escrow Held</span>
              <span className='font-bold text-[#6B46C1]'>
                {formatCurrency(stats.financials.escrowHeld)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='pb-4'>
            <CardTitle className='text-sm md:text-base font-bold text-gray-900 flex items-center gap-2'>
              <Wallet size={18} className='text-[#6B46C1]' />
              Financial Status
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-5'>
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-500 font-medium'>
                Current Balance
              </div>
              <div className='text-2xl font-bold text-gray-900'>
                {formatCurrency(user.wallet || 0)}
              </div>
            </div>
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-500 font-medium'>
                Average Task Budget
              </div>
              <div className='text-sm font-bold text-gray-900'>
                {formatCurrency(stats.financials.averageTaskBudget)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
        <CardHeader>
          <CardTitle className='text-sm md:text-base font-bold text-gray-900 flex items-center gap-2'>
            <MapPin size={18} className='text-[#6B46C1]' />
            Address & Location
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1.5'>
            <div className='text-xs text-gray-500 font-medium'>
              Full Address
            </div>
            <div className='text-sm font-bold text-gray-900'>
              {(user as any).address || "Not provided"}
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-500 font-medium'>State</div>
              <div className='text-sm font-bold text-gray-900'>
                {user.residentState || "N/A"}
              </div>
            </div>
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-500 font-medium'>Country</div>
              <div className='text-sm font-bold text-gray-900'>
                {user.country || "N/A"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Tasks */}
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
                    <th className='py-4 px-6 font-medium'>BUDGET</th>
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
                        {formatCurrency(task.budget)}
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
                        No tasks posted yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] overflow-hidden'>
          <CardHeader className='flex flex-row items-center justify-between p-6 md:p-8 pb-4'>
            <CardTitle className='text-base md:text-lg font-bold text-gray-900'>
              Recent Transactions ({recentTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm whitespace-nowrap'>
                <thead>
                  <tr className='border-b border-gray-50 text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider'>
                    <th className='py-4 px-6 md:px-8 font-medium'>
                      DESCRIPTION
                    </th>
                    <th className='py-4 px-6 font-medium text-right'>AMOUNT</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-50 text-xs md:text-sm'>
                  {recentTransactions.map((tx) => (
                    <tr
                      key={tx._id}
                      className='group hover:bg-gray-50/50 transition-colors'
                    >
                      <td className='py-5 px-6 md:px-8'>
                        <div className='font-medium text-gray-900'>
                          {tx.description}
                        </div>
                        <div className='text-[10px] text-gray-400 mt-0.5'>
                          {new Date(tx.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td
                        className={`py-5 px-6 text-right font-bold ${
                          tx.type.includes("credit")
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {tx.type.includes("credit") ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
                  {recentTransactions.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className='py-8 text-center text-gray-400 font-medium'
                      >
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deactivate User Modal */}
      {isDeactivateModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold text-gray-900'>
                  Deactivate User Account
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  Are you sure you want to deactivate **{user.fullName}**?
                </p>
              </div>
              <button
                onClick={() => setIsDeactivateModalOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors'
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
                  Reason for Deactivation
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
                Confirm Deactivation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lock User Modal */}
      {isLockModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold text-amber-600'>
                  Lock User Account
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  Temporarily restrict access for **{user.fullName}**.
                </p>
              </div>
              <button
                onClick={() => setIsLockModalOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors'
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

      {/* Delete User Modal */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold text-red-600'>
                  Delete User Account
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  This is a **soft delete** for **{user.fullName}**.
                </p>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors'
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
