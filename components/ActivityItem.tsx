import { Calendar } from "lucide-react";

interface ActivityItemProps {
  title: string;
  category: string;
  description: string;
  date: string | Date;
  status: string;
  amount: number;
  id: string;
  className?: string;
}

export function ActivityItem({
  title,
  category,
  description,
  date,
  status,
  amount,
  id,
  className = "",
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
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "canceled":
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    // h-full + flex flex-col so the card fills its grid cell height.
    // flex-1 on the description pushes the footer to the bottom,
    // keeping date/amount aligned across all cards in the same row.
    <div
      className={`flex flex-col bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors ${className}`}
    >
      {/* Top: title, category badge, status */}
      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1 min-w-0 pr-3'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2 line-clamp-2'>
            {title}
          </h3>
          <span className='text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full'>
            {category}
          </span>
        </div>
        <span
          className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(status)}`}
        >
          {status}
        </span>
      </div>

      {/* Description — flex-1 expands to fill remaining space */}
      <p className='flex-1 text-sm text-gray-600 mb-4 line-clamp-2'>
        {description}
      </p>

      {/* Footer — always pinned to the bottom */}
      <div className='flex items-center justify-between pt-3 gap-2 border-t border-gray-50'>
        <div className='flex items-center gap-1 text-gray-500'>
          <Calendar className='h-4 w-4 shrink-0' />
          <span className='text-xs'>{formatDate(date)}</span>
        </div>
        <span className=' font-bold text-purple-600'>
          ₦{(amount || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
