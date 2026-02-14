import { Bid } from "@/types/bid";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface BidCardProps {
  bid: Bid;
  onAccept: (bidId: string) => void;
  onMessage: (bidId: string) => void;
  isAccepting?: boolean;
}

export function BidCard({
  bid,
  onAccept,
  onMessage,
  isAccepting,
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

  return (
    <div className='bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm'>
      <div className='flex items-start justify-between gap-6'>
        <div className='flex items-start gap-4 flex-1'>
          <div className='w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100'>
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
              <h4 className='font-bold text-gray-900 text-lg'>{taskerName}</h4>
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

        {/* Right: Amount */}
        <div className='text-right space-y-4 shrink-0'>
          <div className='text-[#4CAF50] font-black text-2xl'>
            ₦{bid.amount?.toLocaleString() || "0"}
          </div>

          {bid.status === "pending" && (
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onMessage(bid._id)}
                className='rounded-xl font-bold text-xs h-10 px-4'
              >
                Message
              </Button>
              <Button
                size='sm'
                onClick={() => onAccept(bid._id)}
                disabled={isAccepting}
                className='bg-[#6B46C1] hover:bg-[#553C9A] rounded-xl font-bold text-xs h-10 px-6'
              >
                {isAccepting ? "Accepting..." : "Accept"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
