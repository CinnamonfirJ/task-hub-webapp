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

export function ActivityItem({ title, date, status, amount, id }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-100 transition-colors">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
           {/* Placeholder icon or conditional based on type */}
           <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500">{format(new Date(date), "dd MMMM, yyyy")}</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
         <span className="font-bold text-gray-900">#{amount.toLocaleString()}</span>
         <Button size="sm" className="h-7 px-4 text-xs font-semibold bg-[#6B46C1] hover:bg-[#553C9A]">
            OPEN
         </Button>
      </div>
    </div>
  );
}
