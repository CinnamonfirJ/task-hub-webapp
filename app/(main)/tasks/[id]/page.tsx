"use client";

import { useTaskDetails } from "@/hooks/useTaskDetails";
import {
  useTaskBids,
  useAcceptBid,
  useCreateBid,
  useUpdateBid,
  useMyBids,
} from "@/hooks/useBids";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Edit2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { BidCard } from "@/components/dashboard/BidCard";
import { ApplicationForm } from "@/components/dashboard/ApplicationForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api/tasks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateConversation } from "@/hooks/useChat";
import { MessageSquare } from "lucide-react";

export default function TaskDetailsPage() {
  const router = useRouter();
  const { task, isLoading, error, goBack } = useTaskDetails();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isTasker = user?.role === "tasker";
  const isOwner =
    user?._id ===
    (typeof task?.user === "object" ? task?.user?._id : task?.creator);

  // Fetch bids if user is the task owner
  const { data: bidsData } = useTaskBids(task?._id || "", {
    enabled: !!task && isOwner && !isTasker,
  });

  // Fetch current tasker's bids to check if they've applied
  const { data: myBids } = useMyBids(undefined);

  const bids = bidsData?.bids || [];

  // Find if current tasker has already bid on this task
  const existingBid =
    isTasker && Array.isArray(myBids)
      ? myBids.find((b) => {
          const bidTaskId = typeof b.task === "object" ? b.task?._id : b.task;
          return bidTaskId?.toString() === task?._id?.toString();
        })
      : null;

  // Use either the info from task object (if present) or our fetched existing bid
  const taskerBid =
    existingBid ||
    (task?.taskerBidInfo?.hasBid
      ? {
          _id: task.taskerBidInfo._id,
          amount: task.taskerBidInfo.amount,
          message: task.taskerBidInfo.message,
          status: "pending", // Default if we only have taskerBidInfo
        }
      : null);

  const hasApplied = !!taskerBid;

  // Accept bid mutation
  const { mutate: acceptBid, isPending: isAccepting } = useAcceptBid();

  // Create conversation mutation
  const { mutate: createConv, isPending: isCreatingConv } =
    useCreateConversation();

  const handleOpenChat = (taskerId?: string, bidId?: string) => {
    createConv(
      {
        taskId: task?._id || "",
        taskerId: taskerId,
        bidId: bidId,
      },
      {
        onSuccess: (conversation) => {
          if (process.env.NODE_ENV === "development") {
            console.log(
              "[TaskDetails] Conversation created/retrieved:",
              conversation,
            );
          }
          const conv = conversation as any;
          const convId =
            conv?._id || conv?.id || conv?.data?._id || conv?.data?.id;
          if (convId) {
            router.push(`/messages/${convId}`);
          } else {
            console.error(
              "[TaskDetails] Could not find ID in conversation response:",
              conversation,
            );
          }
        },
      },
    );
  };

  // Update bid mutation
  const { mutate: updateBid, isPending: isUpdatingBid } = useUpdateBid();

  // Create bid mutation (for taskers)
  const { mutate: createBid, isPending: isSubmittingBid } = useCreateBid();

  const [isEditingApplication, setIsEditingApplication] = useState(false);

  // Cancel task mutation
  const { mutate: cancelTask, isPending: isCancelling } = useMutation({
    mutationFn: () => tasksApi.cancelTask(task!._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", task!._id] });
      router.push("/home");
    },
  });

  const [messageTaskerId, setMessageTaskerId] = useState<string | null>(null);

  const handleAcceptBid = (bidId: string) => {
    acceptBid(bidId);
  };

  const handleMessageTasker = (bidId: string) => {
    const bid = bids.find((b) => b._id === bidId);
    if (bid) {
      const bidderId =
        typeof bid.tasker === "object" ? bid.tasker?._id : bid.tasker;
      handleOpenChat(bidderId, bidId);
    }
  };

  const handleApply = (data: { amount?: number; message: string }) => {
    if (!task) return;

    if (isEditingApplication && taskerBid?._id) {
      updateBid({
        id: taskerBid._id,
        data: {
          amount: data.amount,
          message: data.message,
        },
      });
      setIsEditingApplication(false);
    } else {
      createBid({
        taskId: task._id,
        amount: data.amount,
        message: data.message,
      });
    }
  };

  const handleCancelTask = () => {
    if (confirm("Are you sure you want to cancel this task?")) {
      cancelTask();
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[50vh]'>
        <Loader2 className='w-8 h-8 animate-spin text-[#6B46C1]' />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] space-y-4'>
        <p className='text-gray-500 font-medium text-lg'>
          Oops! Task not found
        </p>
        <Button onClick={goBack} variant='outline' className='rounded-xl'>
          Go Back
        </Button>
      </div>
    );
  }

  const categories = task.categories || [];
  const primaryCategory = categories.length > 0 ? categories[0] : null;
  const categoryName =
    primaryCategory && typeof primaryCategory === "object"
      ? primaryCategory.displayName || primaryCategory.name
      : "Uncategorized";

  const displayLocation =
    typeof task.location === "object" && task.location.address
      ? task.location.address
      : typeof task.location === "object"
        ? `${task.location.latitude.toFixed(4)}, ${task.location.longitude.toFixed(4)}`
        : task.location || "Remote";

  const posterName = task.user?.fullName || "Task NG";
  const posterInitial = posterName
    .trim()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <div className='flex flex-col space-y-8 mx-auto p-8 w-full max-w-5xl min-h-screen'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={goBack}
          className='hover:bg-purple-50 rounded-full w-12 h-12 text-gray-700'
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className='font-bold text-gray-900 text-3xl'>Task Details</h1>
      </div>

      <div className='space-y-8'>
        {/* USER VIEW */}
        {!isTasker && isOwner && (
          <>
            {/* Budget Badge (Top Right for Tasker) */}
            {
              <div className='flex justify-end'>
                <span className='bg-[#4CAF50] text-white px-6 py-2.5 rounded-xl font-black text-lg shadow-sm'>
                  ₦ {task.budget?.toLocaleString() || "0"}
                </span>
              </div>
            }
            {/* Task Title */}
            <div className='space-y-2'>
              <h2 className='font-bold text-gray-900 text-2xl'>Task Title</h2>
              <p className='text-gray-900 text-xl'>{task.title}</p>
            </div>

            {/* Deadline */}
            <div className='space-y-2'>
              <h3 className='font-bold text-gray-900 text-lg'>Deadline</h3>
              <p className='text-gray-700'>
                {task.deadline
                  ? new Date(task.deadline).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Pending"}
              </p>
            </div>

            {/* Category */}
            <div className='space-y-2'>
              <h3 className='font-bold text-gray-900 text-lg'>Category</h3>
              <span className='inline-block bg-purple-100 px-4 py-1.5 rounded-lg font-bold text-[#6B46C1] text-sm'>
                {categoryName}
              </span>
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <h3 className='font-bold text-gray-900 text-lg'>
                Task Description
              </h3>
              <p className='text-gray-600 leading-relaxed whitespace-pre-wrap'>
                {task.description}
              </p>
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className='space-y-2'>
                <h3 className='font-bold text-gray-900 text-lg'>Tags</h3>
                <div className='flex flex-wrap gap-2'>
                  {task.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className='bg-gray-100 px-3 py-1 rounded-lg text-gray-600 text-sm'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Applications/Bids Section */}
            <div className='space-y-4'>
              <h3 className='font-bold text-gray-900 text-xl'>
                Application / Bids
              </h3>

              {bids.length === 0 ? (
                <div className='text-center py-12'>
                  <p className='text-gray-400 font-medium'>
                    No application yet
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {bids.map((bid) => (
                    <BidCard
                      key={bid._id}
                      bid={bid}
                      onAccept={handleAcceptBid}
                      onMessage={handleMessageTasker}
                      isAccepting={isAccepting}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Cancel Task Button */}
            {task.status === "open" && (
              <Button
                variant='outline'
                onClick={handleCancelTask}
                disabled={isCancelling}
                className='text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 rounded-xl font-bold px-8 py-6'
              >
                {isCancelling ? "Cancelling..." : "Cancel task"} ✕
              </Button>
            )}
          </>
        )}

        {/* TASKER VIEW */}
        {isTasker && (
          <>
            {/* Task Title with Posted By */}
            <div className='bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm space-y-4'>
              <div className='flex justify-between items-start'>
                <div className='space-y-1'>
                  <h3 className='text-gray-500 text-sm font-bold'>
                    Task Title
                  </h3>
                  <h2 className='font-bold text-gray-900 text-2xl'>
                    {task.title}
                  </h2>
                </div>
                <span className='bg-[#4CAF50] text-white px-6 py-2.5 rounded-xl font-black text-lg shadow-sm'>
                  ₦ {task.budget?.toLocaleString() || "0"}
                </span>
              </div>

              <div className='flex items-center gap-3 pt-2'>
                <div className='w-10 h-10 rounded-full bg-[#6B46C1] flex items-center justify-center text-white font-bold text-sm shadow-sm'>
                  {posterInitial}
                </div>
                <span className='text-gray-400 text-sm font-semibold'>
                  Posted by {posterName}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className='bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm space-y-4'>
              <h3 className='font-bold text-gray-900 text-xl'>{task.title}</h3>
              <p className='text-gray-600 leading-relaxed whitespace-pre-wrap text-base'>
                {task.description}
              </p>
            </div>

            {/* Task Details Card */}
            <div className='bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm space-y-6'>
              <h3 className='font-bold text-gray-900 text-xl'>Task Details</h3>
              <div className='space-y-5'>
                <DetailRow label='Category' value={categoryName} />
                <DetailRow
                  label='Deadline'
                  value={
                    task.deadline
                      ? new Date(task.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Pending"
                  }
                />
                <DetailRow
                  label='Status'
                  value={
                    task.status.charAt(0).toUpperCase() + task.status.slice(1)
                  }
                />
                <DetailRow
                  label='Posted'
                  value={
                    task.createdAt
                      ? new Date(task.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"
                  }
                />
              </div>
            </div>

            {/* Application Form Section */}
            {isTasker && !hasApplied && (
              <ApplicationForm
                task={task}
                onSubmit={handleApply}
                isSubmitting={isSubmittingBid}
              />
            )}

            {/* Already Applied State / Edit Mode */}
            {isTasker && hasApplied && (
              <>
                {!isEditingApplication ? (
                  <div className='bg-purple-50 border border-purple-100 p-8 rounded-[2rem] space-y-4'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='font-bold text-[#6B46C1] text-xl'>
                          Application Submitted
                        </h3>
                        <p className='text-gray-600 text-sm mt-1'>
                          You have submitted an application for this task.
                        </p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            handleOpenChat(undefined, taskerBid?._id)
                          }
                          disabled={isCreatingConv}
                          className='border-purple-200 text-purple-700 hover:bg-purple-100 gap-2'
                        >
                          <MessageSquare size={14} />
                          Message Owner
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setIsEditingApplication(true)}
                          className='border-purple-200 text-purple-700 hover:bg-purple-100 gap-2'
                        >
                          <Edit2 size={14} />
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className='bg-white/50 rounded-xl p-4 space-y-3'>
                      {taskerBid.amount && (
                        <div className='flex justify-between'>
                          <span className='text-gray-500 font-medium text-sm'>
                            Your Rate
                          </span>
                          <span className='text-gray-900 font-bold'>
                            ₦{taskerBid.amount?.toLocaleString() || "0"}
                          </span>
                        </div>
                      )}
                      {taskerBid.message && (
                        <div className='space-y-1'>
                          <span className='text-gray-500 font-medium text-sm'>
                            Your Message
                          </span>
                          <p className='text-gray-700 text-sm leading-relaxed'>
                            {taskerBid.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <div className='flex justify-between items-center'>
                      <h3 className='font-bold text-gray-900 text-xl'>
                        Edit Application
                      </h3>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setIsEditingApplication(false)}
                        className='text-gray-500'
                      >
                        Cancel
                      </Button>
                    </div>
                    <ApplicationForm
                      task={task}
                      onSubmit={handleApply}
                      isSubmitting={isUpdatingBid}
                      isEditing={true}
                      initialData={{
                        amount: taskerBid.amount,
                        message: taskerBid.message,
                      }}
                    />
                  </div>
                )}
              </>
            )}

            {/* Cannot Apply State */}
            {task.applicationInfo &&
              !task.applicationInfo.canApply &&
              !hasApplied && (
                <div className='bg-gray-50 border border-gray-200 p-8 rounded-[2rem] text-center space-y-2'>
                  <h3 className='font-bold text-gray-600 text-xl'>
                    Cannot Apply
                  </h3>
                  <p className='text-gray-500 text-sm'>
                    You are not eligible to apply for this task at the moment.
                  </p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex justify-between items-center text-sm font-medium'>
      <span className='text-gray-400'>{label}</span>
      <span className='text-gray-900'>{value}</span>
    </div>
  );
}
