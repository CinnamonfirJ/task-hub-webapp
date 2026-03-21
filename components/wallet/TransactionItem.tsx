import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft, Lock, XCircle } from "lucide-react";
import { Transaction } from "@/types/transaction";

interface TransactionItemProps {
  transaction: Transaction | any;
  onClick: (t: any) => void;
}

export function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const isCredit = transaction.type === "credit";
  const isPending = transaction.status === "pending";
  const isFailed = transaction.status === "failed" || transaction.status === "cancelled";
  const isEscrow = transaction.paymentPurpose === "escrow_hold";

  let Icon = isCredit ? ArrowDownLeft : ArrowUpRight;
  let iconBg = isCredit ? "bg-green-50" : "bg-red-50";
  let iconColor = isCredit ? "text-green-500" : "text-red-500";
  let amountColor = isCredit ? "text-[#4CAF50]" : "text-red-500";

  // Overrides based on status/purpose
  if (isEscrow && isPending) {
    Icon = Lock;
    iconBg = "bg-orange-50";
    iconColor = "text-orange-400";
    amountColor = "text-orange-400";
  } else if (isFailed) {
    Icon = XCircle;
    iconBg = "bg-red-50";
    iconColor = "text-red-500";
  }

  const sign = isCredit ? "" : "-";
  // The design shows # symbol instead of NGN sometimes, but let's use ₦ for standard
  const formattedAmount = `${sign}₦${(transaction.amount || 0).toLocaleString()}`;
  
  // Try to parse description to title and subtitle if "title - subtitle" format, else use default logic
  const title = transaction.description || "Wallet Transaction";
  const dateFormatted = transaction.createdAt 
    ? format(new Date(transaction.createdAt), "MMM d") 
    : "Recent";
    
  const subtitle = transaction.metadata?.providerName 
    ? `${transaction.metadata.providerName} . ${dateFormatted}`
    : `${transaction.provider || "System"}. ${dateFormatted}`;

  const statusClass = 
    transaction.status === "success" || transaction.status === "completed" 
      ? "bg-green-100 text-green-700"
      : transaction.status === "pending"
      ? "bg-orange-100 text-orange-600"
      : "bg-red-100 text-red-600";
      
  const displayStatus = transaction.status === "success" ? "Completed" : 
                        transaction.status ? transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) : 
                        "Completed";

  return (
    <div 
      onClick={() => onClick(transaction)}
      className="flex items-center justify-between p-4 md:p-6 bg-white border border-gray-100 rounded-2xl md:rounded-3xl hover:shadow-md transition-shadow cursor-pointer mb-3"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 md:p-4 rounded-xl ${iconBg}`}>
          <Icon className={`w-5 h-5 md:w-6 md:h-6 ${iconColor}`} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 text-sm md:text-base">{title}</span>
          <span className="text-xs md:text-sm text-gray-500">{subtitle}</span>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1.5">
        <span className={`font-black text-sm md:text-base ${amountColor}`}>
          {formattedAmount}
        </span>
        <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold ${statusClass}`}>
          {displayStatus}
        </span>
      </div>
    </div>
  );
}
