"use client";

import { useState } from "react";
import {
  ArrowLeft,
  XCircle,
  CheckCircle2,
  Loader2,
  X,
  Clock,
  DollarSign,
  MoreVertical,
  ChevronDown,
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
  useAdminTaskDetails,
  useForceCancelTask,
  useForceCompleteTask,
} from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";

export default function TaskDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: detailData, isLoading, isError } = useAdminTaskDetails(id);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [refundUser, setRefundUser] = useState(true);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completeReason, setCompleteReason] = useState("");

  const { mutate: forceCancel, isPending: isCancelling } = useForceCancelTask();
  const { mutate: forceComplete, isPending: isCompleting } =
    useForceCompleteTask();

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
        <h2 className='text-xl font-bold text-gray-900'>Task not found</h2>
        <Link href='/admin/tasks'>
          <Button variant='outline'>Back to Tasks</Button>
        </Link>
      </div>
    );
  }

  const { task, bids, timeline, payments } = detailData;

  const statusColor: Record<string, string> = {
    open: "bg-green-50 text-green-600",
    in_progress: "bg-blue-50 text-blue-600",
    completed: "bg-emerald-50 text-emerald-600",
    cancelled: "bg-red-50 text-red-600",
  };

  const handleCancel = () => {
    forceCancel(
      { id, reason: cancelReason, refundUser },
      {
        onSuccess: () => {
          setIsCancelModalOpen(false);
          setCancelReason("");
        },
      },
    );
  };

  const handleComplete = () => {
    forceComplete(
      { id, reason: completeReason, releaseToTasker: true },
      {
        onSuccess: () => {
          setIsCompleteModalOpen(false);
          setCompleteReason("");
        },
      },
    );
  };

  const canModify = task.status !== "completed" && task.status !== "cancelled";

  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto relative'>
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

        {canModify && (
          <div className='flex items-center gap-3'>
            <Button
              onClick={() => setIsCancelModalOpen(true)}
              className='bg-[#EF4444] hover:bg-[#DC2626] text-white gap-2 h-10 px-6 font-semibold rounded-xl'
            >
              <XCircle size={18} /> Cancel Task
            </Button>
            <Button
              onClick={() => setIsCompleteModalOpen(true)}
              className='bg-[#10B981] hover:bg-[#059669] text-white gap-2 h-10 px-6 font-semibold rounded-xl'
            >
              <CheckCircle2 size={18} /> Force Complete
            </Button>
          </div>
        )}
      </div>

      {/* Task Summary Card */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
        <CardContent className='p-6 md:p-8'>
          <div className='flex flex-col md:flex-row md:items-start justify-between gap-6'>
            <div className='space-y-4 flex-1'>
              <h2 className='text-xl md:text-2xl font-bold text-gray-900'>
                {task.title}
              </h2>
              <span
                className={`${statusColor[task.status] || "bg-gray-50 text-gray-500"} text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full inline-block uppercase`}
              >
                {task.status.replace("_", " ")}
              </span>
              {task.description && (
                <p className='text-sm text-gray-600 leading-relaxed max-w-3xl'>
                  {task.description}
                </p>
              )}
              <div className='flex flex-wrap gap-2'>
                {task.categories.map((cat) => (
                  <span
                    key={cat._id}
                    className='px-4 py-2 bg-white text-gray-700 text-xs font-medium rounded-lg border border-gray-200 shadow-sm'
                  >
                    {cat.displayName}
                  </span>
                ))}
              </div>
            </div>
            <div className='text-left md:text-right shrink-0'>
              <div className='text-xs text-gray-500 font-medium'>Budget</div>
              <div className='text-2xl md:text-3xl font-bold text-gray-900 mt-1'>
                {formatCurrency(task.budget)}
              </div>
              {task.agreedPrice && (
                <div className='text-sm text-[#6B46C1] font-semibold mt-1'>
                  Agreed: {formatCurrency(task.agreedPrice)}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='p-6 pb-4'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Task Information
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-5'>
            <div>
              <div className='text-xs text-gray-500 font-medium'>Posted By</div>
              <div className='text-sm font-bold text-gray-900 mt-1'>
                {task.user.fullName}
              </div>
              <div className='text-xs text-gray-400'>
                {task.user.emailAddress}
              </div>
            </div>
            {task.location?.address && (
              <div>
                <div className='text-xs text-gray-500 font-medium'>
                  Location
                </div>
                <div className='text-sm font-bold text-gray-900 mt-1'>
                  {task.location.address}
                </div>
              </div>
            )}
            <div>
              <div className='text-xs text-gray-500 font-medium'>Bids</div>
              <div className='text-sm font-bold text-gray-900 mt-1'>
                {task.bidCount ?? bids.length}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='p-6 pb-4'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-5'>
            {task.assignedTasker ? (
              <>
                <div>
                  <div className='text-xs text-gray-500 font-medium'>
                    Assigned Tasker
                  </div>
                  <div className='text-sm font-bold text-gray-900 mt-1'>
                    {task.assignedTasker.firstName}{" "}
                    {task.assignedTasker.lastName}
                  </div>
                </div>
                {task.assignedTasker.rating && (
                  <div>
                    <div className='text-xs text-gray-500 font-medium'>
                      Rating
                    </div>
                    <div className='text-sm font-bold text-gray-900 mt-1'>
                      ⭐ {task.assignedTasker.rating}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className='text-sm text-gray-400'>No tasker assigned yet</p>
            )}
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] h-full'>
          <CardHeader className='p-6 pb-4'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-5'>
            <div>
              <div className='text-xs text-gray-500 font-medium'>Created</div>
              <div className='text-sm font-bold text-gray-900 mt-1'>
                {new Date(task.createdAt).toLocaleString()}
              </div>
            </div>
            {task.deadline && (
              <div>
                <div className='text-xs text-gray-500 font-medium'>
                  Deadline
                </div>
                <div className='text-sm font-bold text-gray-900 mt-1'>
                  {new Date(task.deadline).toLocaleString()}
                </div>
              </div>
            )}
            {task.completedAt && (
              <div>
                <div className='text-xs text-gray-500 font-medium'>
                  Completed
                </div>
                <div className='text-sm font-bold text-gray-900 mt-1'>
                  {new Date(task.completedAt).toLocaleString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bids & Payments */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] overflow-hidden'>
          <CardHeader className='p-6 pb-4'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Applicants / Bids ({bids.length})
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-4'>
            {bids.map((bid) => (
              <div
                key={bid._id}
                className='p-4 border border-gray-100 rounded-2xl flex items-center justify-between bg-gray-50/50'
              >
                <div>
                  <div className='text-sm font-bold text-gray-900'>
                    {bid.tasker.firstName} {bid.tasker.lastName}
                  </div>
                  <div className='text-[10px] text-gray-400 font-medium mt-0.5'>
                    {new Date(bid.createdAt).toLocaleDateString()} ·{" "}
                    <span
                      className={
                        bid.status === "accepted"
                          ? "text-green-500"
                          : "text-gray-400"
                      }
                    >
                      {bid.status}
                    </span>
                  </div>
                </div>
                <div className='text-sm font-bold text-gray-900'>
                  {formatCurrency(bid.amount)}
                </div>
              </div>
            ))}
            {bids.length === 0 && (
              <p className='text-sm text-gray-400 text-center py-6'>
                No bids yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem] overflow-hidden'>
          <CardHeader className='p-6 pb-4'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Payment History ({payments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-4'>
            {payments.map((p, i) => (
              <div
                key={i}
                className='flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/50'
              >
                <div>
                  <div className='text-sm font-bold text-gray-900 capitalize'>
                    {p.type.replace("_", " ")}
                  </div>
                  <div className='text-[10px] text-gray-400 font-medium mt-0.5'>
                    {new Date(p.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-bold text-gray-900'>
                    {formatCurrency(p.amount)}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${p.status === "completed" ? "text-green-500" : "text-yellow-500"}`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
            {payments.length === 0 && (
              <p className='text-sm text-gray-400 text-center py-6'>
                No payment records
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline Events */}
      {timeline.length > 0 && (
        <Card className='border border-gray-100 shadow-sm rounded-2xl md:rounded-[2rem]'>
          <CardHeader className='p-6 pb-4'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0'>
            <div className='space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-[2px] before:bg-purple-100'>
              {timeline.map((event, idx) => (
                <div key={idx} className='relative flex items-start pl-8'>
                  <div className='absolute left-[3px] top-1 w-4 h-4 rounded-full bg-[#6B46C1] border-4 border-white shadow-sm z-10' />
                  <div className='space-y-1'>
                    <div className='text-sm font-bold text-gray-900 capitalize'>
                      {event.event.replace("_", " ")}
                    </div>
                    {event.actor && (
                      <div className='text-xs text-gray-500'>{event.actor}</div>
                    )}
                    <div className='text-xs text-gray-400 font-medium'>
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Task Modal */}
      {isCancelModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-red-600'>
                Force Cancel Task
              </h2>
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400'
              >
                <X size={20} />
              </button>
            </div>
            <div className='p-6 space-y-5'>
              <p className='text-sm text-red-600 font-medium bg-red-50 p-3 rounded-xl'>
                This will cancel the task, notify all parties, and optionally
                refund escrow to the user.
              </p>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Reason *
                </label>
                <Input
                  placeholder='e.g. Task violates platform policies'
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className='rounded-xl h-11'
                />
              </div>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={refundUser}
                  onChange={(e) => setRefundUser(e.target.checked)}
                  className='rounded'
                />
                <span className='text-sm text-gray-700 font-medium'>
                  Refund escrow to user
                </span>
              </label>
            </div>
            <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setIsCancelModalOpen(false)}
                className='rounded-xl font-semibold'
              >
                Cancel
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isCancelling || !cancelReason.trim()}
                className='bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl gap-2 font-semibold'
              >
                {isCancelling ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <XCircle size={16} />
                )}{" "}
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Force Complete Modal */}
      {isCompleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-green-600'>
                Force Complete Task
              </h2>
              <button
                onClick={() => setIsCompleteModalOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400'
              >
                <X size={20} />
              </button>
            </div>
            <div className='p-6 space-y-5'>
              <p className='text-sm text-green-600 font-medium bg-green-50 p-3 rounded-xl'>
                This will mark the task as completed and release payment to the
                tasker.
              </p>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Reason *
                </label>
                <Input
                  placeholder='e.g. Mediation completed - work verified'
                  value={completeReason}
                  onChange={(e) => setCompleteReason(e.target.value)}
                  className='rounded-xl h-11'
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setIsCompleteModalOpen(false)}
                className='rounded-xl font-semibold'
              >
                Cancel
              </Button>
              <Button
                onClick={handleComplete}
                disabled={isCompleting || !completeReason.trim()}
                className='bg-[#10B981] hover:bg-[#059669] text-white rounded-xl gap-2 font-semibold'
              >
                {isCompleting ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <CheckCircle2 size={16} />
                )}{" "}
                Confirm Completion
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
