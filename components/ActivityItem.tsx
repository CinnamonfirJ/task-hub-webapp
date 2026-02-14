import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ActivityItemProps {
  title: string;
  category: string;
  description: string;
  date: string | Date;
  status: string;
  amount: number;
  id: string;
}

export function ActivityItem({
  title,
  category,
  description,
  date,
  status,
  amount,
  id,
}: ActivityItemProps) {
  const formatDate = (dateString: string | Date) => {
    const dateObj =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return dateObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-700";
      case "in progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "canceled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors'>
      {/* Hidden Action for Hover or Click */}

      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>{title}</h3>
          <div className='flex items-center gap-2 mb-3'>
            <span className='text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full'>
              {category}
            </span>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(status)}`}
        >
          {status}
        </span>
      </div>

      <p className='text-sm text-gray-600 mb-4 line-clamp-2'>{description}</p>

      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1 text-gray-500'>
          <Calendar className='h-4 w-4' />
          <span className='text-xs'>{formatDate(date)}</span>
        </div>
        <div className='flex items-center gap-3'>
          <span className='text-lg font-bold text-purple-600'>
            ₦ {(amount || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
