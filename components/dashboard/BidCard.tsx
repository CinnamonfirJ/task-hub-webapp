import { Bid } from "@/types/bid";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { TaskerProfileModal } from "./TaskerProfileModal";

interface BidCardProps {
  bid: Bid;
  onAccept: (bidId: string) => void;
  onReject: (bidId: string) => void;
  onMessage: (bidId: string) => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
}

export function BidCard({
  bid,
  onAccept,
  onReject,
  onMessage,
  isAccepting,
  isRejecting,
}: BidCardProps) {
  const tasker = typeof bid.tasker === "object" ? bid.tasker : null;
  const taskerInitial = tasker?.fullName?.[0] || tasker?.firstName?.[0] || "E";
  const taskerName =
    tasker?.fullName ||
    (tasker?.firstName
      ? `${tasker.firstName} ${tasker.lastName || ""}`
      : "Elliot Samuel");

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-[#FFF9EA] text-[#D69E2E] border-[#FFE7A5]",
      accepted: "bg-[#E6FFFA] text-[#38A169] border-[#B2F5EA]",
      rejected: "bg-[#FFF5F5] text-[#E53E3E] border-[#FED7D7]",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isBusy = isAccepting || isRejecting;

  return (
    <>
      <div className='bg-white border border-gray-100 rounded-lg p-6 shadow-sm'>
        <div className='flex md:flex-row flex-col items-start justify-between gap-6'>
          <div className='flex items-start gap-4 flex-1'>
            <div
              className='w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100 cursor-pointer hover:opacity-80 transition-opacity'
              onClick={() => setIsModalOpen(true)}
            >
              {tasker?.profilePicture ? (
                <img
                  src={tasker.profilePicture}
                  alt='Tasker'
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='h-full w-full bg-[#6B46C1] flex items-center justify-center text-white font-bold text-lg'>
                  {taskerInitial}
                </div>
              )}
            </div>
            <div className='flex-1 space-y-3'>
              <div className='space-y-1'>
                <h4
                  className='font-bold text-gray-900 text-lg cursor-pointer hover:underline'
                  onClick={() => setIsModalOpen(true)}
                >
                  {taskerName}
                </h4>
                <p className='text-gray-500 text-sm leading-relaxed line-clamp-2'>
                  {bid.message || "No message provided"}
                </p>
              </div>

              <div className='flex items-center gap-4 text-xs text-gray-400 font-medium'>
                <div className='flex items-center gap-1.5'>
                  <Calendar size={14} />
                  <span>
                    {new Date(bid.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(bid.status)}`}
                >
                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Amount + actions */}
          <div className='w-full md:w-auto text-left md:text-right space-y-4 shrink-0 mt-4 md:mt-0'>
            <div className='flex items-center justify-between md:block'>
              <span className='md:hidden text-gray-400 font-bold text-sm'>
                Bid Amount:
              </span>
              <div className='text-[#4CAF50] font-black text-xl md:text-2xl'>
                ₦{bid.amount?.toLocaleString() || "0"}
              </div>
            </div>

            {bid.status === "pending" && (
              <div className='flex justify-between md:justify-end gap-3'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onMessage(bid._id)}
                  disabled={isBusy}
                  className='flex-1 md:flex-none rounded-lg font-bold text-xs h-10 px-4'
                >
                  Message
                </Button>
                <Button
                  size='sm'
                  onClick={() => onReject(bid._id)}
                  disabled={isBusy}
                  className='flex-1 md:flex-none bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg font-bold text-xs h-10 px-4 shadow-none'
                >
                  {isRejecting ? (
                    "Rejecting..."
                  ) : (
                    <span className='flex items-center gap-1.5'>
                      <XCircle size={14} /> Reject
                    </span>
                  )}
                </Button>
                <Button
                  size='sm'
                  onClick={() => onAccept(bid._id)}
                  disabled={isBusy}
                  className='flex-1 md:flex-none bg-[#6B46C1] hover:bg-[#553C9A] rounded-lg font-bold text-xs h-10 px-6'
                >
                  {isAccepting ? (
                    "Accepting..."
                  ) : (
                    <span className='flex items-center gap-1.5'>
                      <CheckCircle size={14} /> Accept
                    </span>
                  )}
                </Button>
              </div>
            )}

            {bid.status === "accepted" && (
              <div className='flex justify-end'>
                <span className='text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5'>
                  <CheckCircle size={13} /> Accepted
                </span>
              </div>
            )}

            {bid.status === "rejected" && (
              <div className='flex justify-end'>
                <span className='text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5'>
                  <XCircle size={13} /> Rejected
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskerProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tasker={tasker}
      />
    </>
  );
}
