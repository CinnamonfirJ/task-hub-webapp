"use client";

import { useTaskDetails, useUpdateTaskStatusTasker, useCompletionCode } from "@/hooks/useTaskDetails";
import { getCategoryName } from "@/hooks/useHome";
import {
  useTaskBids,
  useAcceptBid,
  useCreateBid,
  useUpdateBid,
  useDeleteBid,
  useMyBids,
  useRejectBid,
} from "@/hooks/useBids";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { BidCard } from "@/components/dashboard/BidCard";
import { ApplicationForm } from "@/components/dashboard/ApplicationForm";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api/tasks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateConversation } from "@/hooks/useChat";
import { useWalletBalance } from "@/hooks/useWallet";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ConfirmationModal";

export default function TaskDetailsPage() {
  const router = useRouter();
  const { task, isLoading, error, goBack } = useTaskDetails();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isTasker = user?.role === "tasker";
  const isOwner =
    user?._id ===
    (typeof task?.user === "object" ? task?.user?._id : task?.creator);

  const { balance } = useWalletBalance();

  // Fetch bids if user is the task owner
  const { data: bidsData } = useTaskBids(task?._id || "", {
    enabled: !!task && isOwner && !isTasker,
  });

  // Fetch current tasker's bids to check if they've applied
  const { data: myBids } = useMyBids(undefined, { enabled: !!isTasker });

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
          status: task.taskerBidInfo.status || "pending",
        }
      : null);

  const hasApplied = !!taskerBid;

  // Accept bid mutation
  const { mutate: acceptBid, isPending: isAccepting } = useAcceptBid();
  // Track which specific bid is being accepted for per-card loading state
  const [acceptingBidId, setAcceptingBidId] = useState<string | null>(null);

  // Reject bid mutation
  const { mutate: rejectBid, isPending: isRejecting } = useRejectBid();

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

  // Delete bid mutation
  const { mutate: deleteBid, isPending: isDeletingBid } = useDeleteBid();

  const [isEditingApplication, setIsEditingApplication] = useState(false);

  // Cancel task mutation
  const { mutate: cancelTask, isPending: isCancelling } = useMutation({
    mutationFn: () => tasksApi.cancelTask(task!._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", task!._id] });
      router.push("/home");
    },
  });

  // Tasker status update mutation
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateTaskStatusTasker();

  // Completion code query
  const { data: completionCodeData } = useCompletionCode(
    isOwner && task?.status === "in-progress" ? task._id : ""
  );
  const completionCode = completionCodeData;

  const [inputCode, setInputCode] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const [messageTaskerId, setMessageTaskerId] = useState<string | null>(null);

  // Modal states
  const [confirmAccept, setConfirmAccept] = useState<{ isOpen: boolean; bidId: string }>({ 
    isOpen: false, 
    bidId: "" 
  });
  const [confirmReject, setConfirmReject] = useState<{ isOpen: boolean; bidId: string }>({ 
    isOpen: false, 
    bidId: "" 
  });
  const [confirmCancelTask, setConfirmCancelTask] = useState(false);
  const [confirmDeleteBid, setConfirmDeleteBid] = useState(false);

  const handleAcceptBid = (bidId: string) => {
    setConfirmAccept({ isOpen: true, bidId });
  };

  const handleConfirmAccept = () => {
    const bidId = confirmAccept.bidId;
    const bid = bids.find((b) => b._id === bidId);

    if (bid && balance < bid.amount) {
      toast.error(`Insufficient funds. Your balance is ₦${balance.toLocaleString()}, but this bid requires ₦${bid.amount.toLocaleString()}.`);
      setConfirmAccept({ isOpen: false, bidId: "" });
      setTimeout(() => router.push("/profile"), 1500);
      return;
    }

    setAcceptingBidId(bidId);
    acceptBid(bidId, {
      onSettled: () => {
        setAcceptingBidId(null);
        setConfirmAccept({ isOpen: false, bidId: "" });
      },
    });
  };

  const handleRejectBid = (bidId: string) => {
    setConfirmReject({ isOpen: true, bidId });
  };

  const handleConfirmReject = () => {
    rejectBid({ id: confirmReject.bidId });
    setConfirmReject({ isOpen: false, bidId: "" });
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
    setConfirmCancelTask(true);
  };

  const handleConfirmCancelTask = () => {
    cancelTask();
    setConfirmCancelTask(false);
  };

  const handleConfirmDeleteBid = () => {
    if (taskerBid?._id) {
      deleteBid(taskerBid._id, {
        onSuccess: () => {
          setIsEditingApplication(false);
          toast.success("Application withdrawn successfully");
        }
      });
    }
    setConfirmDeleteBid(false);
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

  const categoryName = getCategoryName(task);

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
    <div className='flex flex-col space-y-4 md:space-y-8 mx-auto p-4 sm:p-6 md:p-8 w-full max-w-5xl min-h-screen'>
      {/* Header */}
      <div className='flex items-center gap-3 md:gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={goBack}
          className='hover:bg-purple-50 rounded-full w-10 h-10 md:w-12 md:h-12 text-gray-700'
        >
          <ArrowLeft size={20} className='md:w-6 md:h-6' />
        </Button>
        <h1 className='font-bold text-gray-900 text-2xl md:text-3xl'>
          Task Details
        </h1>
      </div>

      <div className='space-y-8'>
        {/* USER VIEW */}
        {!isTasker && isOwner && (
          <>
            {/* Budget Badge (Top Right for Tasker) */}
            {
              <div className='flex justify-end'>
                <span className='bg-[#4CAF50] text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-black text-base md:text-lg shadow-sm'>
                  ₦ {task.budget?.toLocaleString() || "0"}
                </span>
              </div>
            }
            {/* Task Title */}
            <div className='space-y-1 md:space-y-2'>
              <h2 className='font-bold text-gray-900 text-xl md:text-2xl'>
                Task Title
              </h2>
              <p className='text-gray-900 text-lg md:text-xl wrap-break-words'>
                {task.title}
              </p>
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

            {/* Task Images (User View) */}
            <TaskImages images={task.images} />

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
                      onReject={handleRejectBid}
                      onMessage={handleMessageTasker}
                      isAccepting={acceptingBidId === bid._id}
                      isRejecting={isRejecting}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Task Owner Actions */}
            {task.status === "open" && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant='outline'
                  onClick={() => router.push(`/edit-task/${task._id}`)}
                  className='text-[#6B46C1] hover:text-[#553C9A] hover:bg-purple-50 border-purple-200 rounded-xl font-bold px-8 py-6 w-full sm:w-auto'
                >
                  Edit Task ✎
                </Button>
                <Button
                  variant='outline'
                  onClick={handleCancelTask}
                  disabled={isCancelling}
                  className='text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 rounded-xl font-bold px-8 py-6 w-full sm:w-auto'
                >
                  {isCancelling ? "Cancelling..." : "Cancel task"} ✕
                </Button>
              </div>
            )}

            {/* Completion Code Display for Owner */}
            {task.status === "in-progress" && (
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl space-y-3">
                <h3 className="font-bold text-emerald-800 text-lg">Task In Progress</h3>
                <p className="text-emerald-700 text-sm">
                  Share this 6-digit completion code with the tasker ONLY when you are satisfied with the work.
                </p>
                <div className="flex justify-center py-4 text-4xl font-black tracking-[0.5em] text-emerald-900 bg-white rounded-xl border border-emerald-200">
                  {completionCode || "------"}
                </div>
              </div>
            )}
            
            {task.status === "completed" && (
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                <h3 className="font-bold text-blue-800 text-lg">Task Completed</h3>
                <p className="text-blue-700 text-sm">This task has been verified and completed.</p>
              </div>
            )}
          </>
        )}

        {/* TASKER VIEW */}
        {isTasker && (
          <>
            {/* Task Title with Posted By */}
            <div className='bg-white border border-gray-100 p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm space-y-4'>
              <div className='flex flex-col sm:flex-row sm:justify-between items-start gap-4'>
                <div className='space-y-1 w-full'>
                  <h3 className='text-gray-500 text-xs md:text-sm font-bold uppercase tracking-wider'>
                    Task Title
                  </h3>
                  <h2 className='font-bold text-gray-900 text-xl md:text-2xl wrap-break-words'>
                    {task.title}
                  </h2>
                </div>
                <span className='bg-[#4CAF50] text-white px-5 py-2 md:px-6 md:py-2.5 rounded-xl font-black text-base md:text-lg shadow-sm whitespace-nowrap self-start sm:self-auto'>
                  ₦ {task.budget?.toLocaleString() || "0"}
                </span>
              </div>

              <div className='flex items-center gap-3 pt-2'>
                <div className='w-10 h-10 rounded-full bg-[#6B46C1] flex items-center justify-center text-white font-bold text-sm shadow-sm'>
                  {posterInitial}
                </div>
                <div className="flex flex-col">
                  <span className='text-gray-400 text-sm font-semibold'>
                    Posted by {posterName}
                  </span>
                  
                  {/* Assignment Status Message */}
                  {(task.status === 'assigned' || task.status === 'in-progress') && (
                    <div className="mt-1">
                      {taskerBid?.status === 'accepted' ? (
                        <span className="text-green-600 text-xs font-bold uppercase tracking-tight">✓ Assigned to you</span>
                      ) : (
                        <span className="text-red-500 text-xs font-bold uppercase tracking-tight">⚠ Assigned to someone else</span>
                      )}
                    </div>
                  )}
                  {task.status === 'completed' && (
                    <div className="mt-1">
                       <span className="text-blue-500 text-xs font-bold uppercase tracking-tight">✓ Completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className='bg-white border border-gray-100 p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm space-y-4'>
              <h3 className='font-bold text-gray-900 text-lg md:text-xl'>
                {task.title}
              </h3>
              <p className='text-gray-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base'>
                {task.description}
              </p>
            </div>

            {/* Task Details Card */}
            <div className='bg-white border border-gray-100 p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm space-y-6'>
              <h3 className='font-bold text-gray-900 text-lg md:text-xl'>
                Task Details
              </h3>
              <div className='space-y-4 md:space-y-5'>
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

            {/* Task Images (Tasker View) */}
            <div className='bg-white border border-gray-100 p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm'>
              <TaskImages images={task.images} title='Task Images' />
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
                  <div className='bg-purple-50 border border-purple-100 p-6 md:p-8 rounded-2xl md:rounded-[2rem] space-y-4'>
                    <div className='flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0'>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className='font-bold text-[#6B46C1] text-xl'>
                            Application {taskerBid.status === "accepted" ? "Accepted" : taskerBid.status === "rejected" ? "Rejected" : "Submitted"}
                          </h3>
                          <span
                             className={cn(
                               "px-3 py-1 rounded-full text-[10px] font-bold border",
                               taskerBid.status === "accepted"
                                 ? "bg-[#E6FFFA] text-[#38A169] border-[#B2F5EA]"
                                 : taskerBid.status === "rejected"
                                   ? "bg-[#FFF5F5] text-[#E53E3E] border-[#FED7D7]"
                                   : "bg-[#FFF9EA] text-[#D69E2E] border-[#FFE7A5]"
                             )}
                           >
                            {taskerBid.status?.charAt(0).toUpperCase() + taskerBid.status?.slice(1)}
                          </span>
                        </div>
                        <p className='text-gray-600 text-sm mt-1'>
                          {taskerBid.status === "accepted" 
                            ? "Congratulations! Your application has been accepted." 
                            : taskerBid.status === "rejected"
                            ? "Your application for this task has been rejected."
                            : "You have submitted an application for this task."}
                        </p>
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

                    {/* Pending Bid Actions */}
                    {taskerBid.status === "pending" && (
                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditingApplication(true)}
                          className="flex-1 bg-white border-purple-200 text-[#6B46C1] hover:bg-purple-50 font-bold rounded-xl py-5"
                        >
                          Edit Application ✎
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setConfirmDeleteBid(true)}
                          className="flex-1 border-red-100 text-red-500 hover:bg-red-50 font-bold rounded-xl py-5"
                        >
                          Withdraw ✕
                        </Button>
                      </div>
                    )}

                    {/* Tasker Actions (Start/Complete) */}
                    {taskerBid.status === "accepted" && task.status === "assigned" && (
                      <Button
                        className="w-full bg-[#6B46C1] hover:bg-[#553C9A] py-8 text-lg font-bold"
                        onClick={() => updateStatus({ taskId: task._id, payload: { status: "in-progress" } })}
                        disabled={isUpdatingStatus}
                      >
                        {isUpdatingStatus ? "Starting..." : "Start Task"}
                      </Button>
                    )}

                    {taskerBid.status === "accepted" && task.status === "in-progress" && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl border border-purple-100 flex flex-col gap-3">
                          <label className="text-sm font-bold text-gray-700">Enter Completion Code</label>
                          <input 
                            type="text" 
                            maxLength={6}
                            placeholder="6-digit code from user"
                            className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center text-2xl font-black tracking-widest outline-none focus:ring-2 focus:ring-purple-200"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ""))}
                          />
                          <Button
                            className="w-full bg-[#4CAF50] hover:bg-[#388E3C] py-6 font-bold"
                            onClick={() => updateStatus({ 
                              taskId: task._id, 
                              payload: { status: "completed", completionCode: inputCode } 
                            })}
                            disabled={isUpdatingStatus || inputCode.length !== 6}
                          >
                            {isUpdatingStatus ? "Verifying..." : "Complete Task & Release Payment"}
                          </Button>
                        </div>
                      </div>
                    )}
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
              !hasApplied && task.status === 'open' && (
                <div className='bg-gray-50 border border-gray-200 p-8 rounded-[2rem] text-center space-y-2'>
                  <h3 className='font-bold text-gray-600 text-xl'>
                    Cannot Apply
                  </h3>
                  <p className='text-gray-500 text-sm'>
                    You are not eligible to apply for this task at the moment.
                  </p>
                </div>
              )}

            {/* Assigned to someone else banner */}
            {(task.status === 'assigned' || task.status === 'in-progress') && !isOwner && taskerBid?.status !== 'accepted' && (
               <div className='bg-gray-50 border border-red-100 p-8 rounded-[2rem] text-center space-y-2 opacity-80'>
               <h3 className='font-bold text-red-500 text-xl'>
                 Assigned to someone else
               </h3>
               <p className='text-gray-500 text-sm'>
                 This task has already been assigned to another tasker and is no longer available.
               </p>
             </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={confirmAccept.isOpen}
        onClose={() => setConfirmAccept({ isOpen: false, bidId: "" })}
        onConfirm={handleConfirmAccept}
        isLoading={isAccepting}
        title="Accept Bid?"
        message="By accepting this bid, the task amount will be deducted from your wallet and held securely in escrow. The funds will only be released to the tasker once you provide them with the completion code after the task is finished."
        confirmLabel="Accept & Secure Funds"
        icon="shield"
        variant="success"
      />

      <ConfirmationModal
        isOpen={confirmReject.isOpen}
        onClose={() => setConfirmReject({ isOpen: false, bidId: "" })}
        onConfirm={handleConfirmReject}
        isLoading={isRejecting}
        title="Reject Bid?"
        message="Are you sure you want to reject this bid? This action cannot be undone, and the tasker will be notified."
        confirmLabel="Reject Bid"
        icon="warning"
        variant="danger"
      />

      <ConfirmationModal
        isOpen={confirmCancelTask}
        onClose={() => setConfirmCancelTask(false)}
        onConfirm={handleConfirmCancelTask}
        isLoading={isCancelling}
        title="Cancel Task?"
        message="Are you sure you want to cancel this task? If a tasker has already been assigned, any escrowed funds will be returned to your wallet. This action cannot be undone."
        confirmLabel="Cancel Task"
        icon="warning"
        variant="danger"
      />
      <ConfirmationModal
        isOpen={confirmDeleteBid}
        onClose={() => setConfirmDeleteBid(false)}
        onConfirm={handleConfirmDeleteBid}
        isLoading={isDeletingBid}
        title="Withdraw Application?"
        message="Are you sure you want to withdraw your application? This action cannot be undone."
        confirmLabel="Withdraw Application"
        icon="warning"
        variant="danger"
      />
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

function TaskImages({
  images,
  title = "Images",
}: {
  images?: any[];
  title?: string;
}) {
  if (!images || images.length === 0) return null;

  return (
    <div className='space-y-4 w-full'>
      <h3 className='font-bold text-gray-900 text-lg md:text-xl'>{title}</h3>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
        {images.map((img, idx) => {
          const url = typeof img === "string" ? img : img.url;
          if (!url) return null;
          return (
            <div
              key={idx}
              className='aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity'
              onClick={() => window.open(url, "_blank")}
            >
              <img
                src={url}
                alt={`Task image ${idx + 1}`}
                className='w-full h-full object-cover'
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
