"use client";

import { useState, use } from "react";
import { ArrowLeft, XCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  useAdminTaskDetails,
  useForceCancelTask,
  useForceCompleteTask,
} from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function TaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
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
    <div className='space-y-6 p-6 md:p-8 max-w-[1400px] mx-auto relative'>
      {/* ── Page Header ── */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/tasks'>
            <Button
              variant='outline'
              size='icon'
              className='h-9 w-9 border-gray-200'
            >
              <ArrowLeft size={17} className='text-gray-500' />
            </Button>
          </Link>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>Task Details</h1>
            <p className='text-sm text-gray-500 mt-0.5'>
              View and manage task information
            </p>
          </div>
        </div>

        {canModify && (
          <Button
            onClick={() => setIsCancelModalOpen(true)}
            className='bg-[#EF4444] hover:bg-[#DC2626] text-white gap-2 h-10 px-5 font-semibold rounded-xl'
          >
            <XCircle size={16} /> Cancel task
          </Button>
        )}
      </div>

      {/* ── Task Summary Card ── */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <CardContent className='p-6 md:p-8'>
          <div className='flex items-start justify-between gap-6'>
            {/* Left: title, badge, description, categories */}
            <div className='space-y-3 flex-1'>
              <h2 className='text-2xl font-bold text-gray-900'>{task.title}</h2>

              <span
                className={`${statusColor[task.status] || "bg-gray-50 text-gray-500"} text-xs font-semibold px-3 py-1 rounded-full inline-block`}
              >
                {task.status.replace("_", " ")}
              </span>

              {task.description && (
                <p className='text-sm text-gray-600 leading-relaxed max-w-3xl'>
                  {task.description}
                </p>
              )}

              <div className='flex flex-wrap gap-2 pt-1'>
                {task.category && (
                  <span className='px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-lg border border-gray-200'>
                    {task.category.replace("-", " ")}
                  </span>
                )}
                {task.categories?.map((cat) => (
                  <span
                    key={cat._id}
                    className='px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-lg border border-gray-200'
                  >
                    {cat.displayName}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: budget */}
            <div className='text-right shrink-0'>
              <div className='text-xs text-gray-500 font-medium'>Budget</div>
              <div className='text-3xl font-bold text-gray-900 mt-1'>
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

      {/* ── Info Grid: Task Info / Assignment / Timeline ── */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Task Information */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='p-6 pb-3'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Task Information
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-5'>
            <div>
              <div className='text-xs text-gray-500 font-medium mb-1'>
                Posted By
              </div>
              <div className='text-sm font-semibold text-gray-900'>
                {task.postedBy?.emailAddress || task.user?.emailAddress}
              </div>
            </div>

            {task.deadline && (
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Deadline
                </div>
                <div className='text-sm font-semibold text-gray-900'>
                  {new Date(task.deadline).toLocaleDateString()}
                </div>
              </div>
            )}

            {task.location?.address && (
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Location
                </div>
                <div className='text-sm font-semibold text-gray-900'>
                  {task.location.address}
                </div>
              </div>
            )}

            {task.negotiable && (
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Negotiable
                </div>
                <div className='text-sm font-semibold text-gray-900'>
                  {task.negotiable}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignment */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='p-6 pb-3'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-5'>
            {task.assignedTo ? (
              <>
                <div>
                  <div className='text-xs text-gray-500 font-medium mb-1'>
                    Assigned Tasker
                  </div>
                  <div className='text-sm font-semibold text-gray-900'>
                    {task.assignedTo.emailAddress ||
                      task.assignedTo.taskerName}
                  </div>
                </div>
                <div>
                  <span
                    className={`${statusColor[task.status] || "bg-gray-50 text-gray-500"} text-xs font-semibold px-3 py-1 rounded-full inline-block`}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                </div>
                {task.assignedTo.rating && (
                  <div>
                    <div className='text-xs text-gray-500 font-medium mb-1'>
                      Rating
                    </div>
                    <div className='text-sm font-semibold text-gray-900'>
                      ⭐ {task.assignedTo.rating}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className='text-sm text-gray-400'>No tasker assigned yet</p>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='p-6 pb-3'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-5'>
            <div>
              <div className='text-xs text-gray-500 font-medium mb-1'>
                Created
              </div>
              <div className='text-sm font-semibold text-gray-900'>
                {new Date(task.createdAt).toLocaleString()}
              </div>
            </div>

            {task.deadline && (
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Deadline
                </div>
                <div className='text-sm font-semibold text-gray-900'>
                  {new Date(task.deadline).toLocaleString()}
                </div>
              </div>
            )}

            {task.lastUpdated && (
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Last Updated
                </div>
                <div className='text-sm font-semibold text-gray-900'>
                  {new Date(task.lastUpdated).toLocaleString()}
                </div>
              </div>
            )}

            {task.completedAt && (
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Completed
                </div>
                <div className='text-sm font-semibold text-gray-900'>
                  {new Date(task.completedAt).toLocaleString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Applicants / Bids ── */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl overflow-hidden'>
        <CardHeader className='p-6 pb-3'>
          <CardTitle className='text-base font-bold text-gray-900'>
            Applicants/ Bids
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6 pt-0 space-y-3'>
          {bids?.length === 0 && (
            <p className='text-sm text-gray-400 text-center py-6'>
              No bids yet
            </p>
          )}
          {bids?.map((bid) => (
            <div
              key={bid._id}
              className='flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/40'
            >
              {/* Avatar */}
              <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden'>
                {bid.taskerImage ? (
                  <img
                    src={bid.taskerImage}
                    alt={bid.taskerName}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <span className='text-xs font-bold text-gray-400'>
                    {bid.taskerName?.charAt(0)?.toUpperCase() ?? "T"}
                  </span>
                )}
              </div>

              {/* Name + applied */}
              <div className='flex-1 min-w-0'>
                <div className='text-sm font-bold text-gray-900'>
                  {bid.taskerName}
                </div>
                <div className='text-xs text-gray-400 mt-0.5'>
                  Applied {timeAgo(bid.date)}
                </div>
              </div>

              {/* Bid amount */}
              <div className='text-sm font-semibold text-gray-900 shrink-0'>
                Bid: {formatCurrency(bid.amount)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Payment History (secondary) ── */}
      {payments?.length > 0 && (
        <Card className='border border-gray-100 shadow-sm rounded-2xl overflow-hidden'>
          <CardHeader className='p-6 pb-3'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Payment History ({payments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-3'>
            {payments.map((p, i) => (
              <div
                key={i}
                className='flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/40'
              >
                <div>
                  <div className='text-sm font-bold text-gray-900 capitalize'>
                    {p.type.replace("_", " ")}
                  </div>
                  <div className='text-xs text-gray-400 font-medium mt-0.5'>
                    {new Date(p.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-bold text-gray-900'>
                    {formatCurrency(p.amount)}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      p.status === "completed"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── Activity Timeline ── */}
      {timeline?.length > 0 && (
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='p-6 pb-3'>
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

      {/* ── Cancel Task Modal ── */}
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

      {/* ── Force Complete Modal ── */}
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
