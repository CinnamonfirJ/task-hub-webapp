import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActivityItemProps {
  title: string;
  date: string | Date; // ISO string or Date
  status: string;
  amount: number;
  id: string;
}

export function ActivityItem({
  title,
  date,
  status,
  amount,
  id,
}: ActivityItemProps) {
  const isApplied = status.toLowerCase() === "applied";

  return (
    <div className='flex items-center justify-between p-6 bg-white rounded-[1.5rem] border border-gray-100 hover:border-purple-100 transition-all gap-2 shadow-sm'>
      <div className='flex items-center gap-4'>
        <div className='h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-[#6B46C1]'>
          <Calendar className='h-6 w-6 opacity-30' />
        </div>
        <div>
          <h4 className='font-bold text-gray-900 md:text-lg text-sm leading-tight line-clamp-1'>
            {title}
          </h4>
          <p className='text-sm text-gray-400 font-medium mt-1'>
            {format(new Date(date), "dd MMMM, yyyy")}
          </p>
        </div>
      </div>

      <div className='flex flex-col items-end gap-2'>
        <span className='font-black text-gray-900 md:text-xl text-sm'>
          ₦ {(amount || 0).toLocaleString()}
        </span>
        <div
          className={cn(
            "px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-colors",
            isApplied ? "bg-[#6B46C1] text-white" : "bg-gray-100 text-gray-500",
          )}
        >
          {status}
        </div>
      </div>
    </div>
  );
}
