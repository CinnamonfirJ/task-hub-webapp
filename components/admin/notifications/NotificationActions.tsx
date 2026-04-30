import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Send, Ban } from "lucide-react";

interface NotificationActionsProps {
  onViewDetails: () => void;
  onResend?: () => void;
  onSuspend?: () => void;
}

export function NotificationActions({
  onViewDetails,
  onResend,
  onSuspend,
}: NotificationActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 text-gray-400 hover:text-gray-600'
        >
          <MoreVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48 p-2 rounded-xl shadow-xl border-gray-100'>
        <DropdownMenuItem
          onClick={onViewDetails}
          className='flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-gray-50 group transition-colors'
        >
          <Eye size={18} className="text-gray-400 group-hover:text-gray-600" />
          <span className="text-sm font-medium text-gray-700">View Details</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={onResend}
          className='flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-gray-50 group transition-colors'
        >
          <Send size={18} className="text-gray-400 group-hover:text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Resend</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onSuspend}
          className='flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-red-50 group transition-colors'
        >
          <Ban size={18} className="text-red-400 group-hover:text-red-600" />
          <span className="text-sm font-medium text-red-600">Suspend User</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
