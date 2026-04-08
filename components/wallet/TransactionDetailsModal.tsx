import { format } from "date-fns";
import { Copy, ArrowUpRight, ArrowDownLeft, Lock, XCircle } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | any;
}

export function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction,
}: ModalProps) {
  if (!transaction) return null;

  const isCredit = transaction.type === "credit";
  const isPending = transaction.status === "pending";
  const isFailed =
    transaction.status === "failed" || transaction.status === "cancelled";
  const isEscrow = transaction.paymentPurpose === "escrow_hold";

  let Icon = isCredit ? ArrowDownLeft : ArrowUpRight;
  let iconBg = isCredit ? "bg-green-50" : "bg-red-50";
  let iconColor = isCredit ? "text-green-500" : "text-red-500";
  let amountColor = isCredit ? "text-[#4CAF50]" : "text-red-500";

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
  const formattedAmount = `${sign}₦${(transaction.amount || 0).toLocaleString()}`;
  const title = transaction.description || "Wallet Transaction";

  const statusClass =
    transaction.status === "success" || transaction.status === "completed"
      ? "bg-green-100 text-green-700"
      : transaction.status === "pending"
        ? "bg-orange-100 text-orange-600"
        : "bg-red-100 text-red-600";

  const displayStatus =
    transaction.status === "success"
      ? "Completed"
      : transaction.status
        ? transaction.status.charAt(0).toUpperCase() +
          transaction.status.slice(1)
        : "Completed";

  const dateFormatted = transaction.createdAt
    ? format(new Date(transaction.createdAt), "MMMM d, yyyy")
    : "N/A";
  const timeFormatted = transaction.createdAt
    ? format(new Date(transaction.createdAt), "h:mm a")
    : "N/A";

  const providerName =
    transaction.metadata?.providerName || transaction.provider || "System";
  const reference = transaction.reference || transaction._id || "N/A";

  const copyToClipboard = () => {
    if (reference) {
      navigator.clipboard.writeText(reference);
      // Optional: add a tiny toast here if you have a toast system
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-w-md rounded-lg p-0 overflow-hidden bg-white gap-0 border-none shadow-2xl'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 pb-2'>
          <DialogTitle className='text-xl font-bold text-gray-900'>
            Transaction Details
          </DialogTitle>
          {/* <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button> */}
        </div>

        {/* Amount & Status Center Area */}
        <div className='flex flex-col items-center justify-center p-6 space-y-4'>
          <div className={`p-4 rounded-xl ${iconBg}`}>
            <Icon className={`w-8 h-8 ${iconColor}`} />
          </div>

          <div className='text-center space-y-1'>
            <div className={`text-3xl font-black ${amountColor}`}>
              {formattedAmount}
            </div>
            <div className='text-gray-600 font-medium'>{title}</div>
            <div
              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold mt-2 ${statusClass}`}
            >
              {displayStatus}
            </div>
          </div>
        </div>

        {/* Details List */}
        <div className='p-6 pt-2'>
          <div className='bg-gray-50/80 rounded-2xl p-4 md:p-6 space-y-4 mb-2'>
            <DetailRow label='Provider' value={providerName} />
            <DetailRow label='Date' value={dateFormatted} />
            <DetailRow label='Time' value={timeFormatted} />
            <DetailRow label='Currency' value={transaction.currency || "NGN"} />

            <div className='flex items-center justify-between'>
              <span className='text-gray-500 text-sm'>Reference</span>
              <div
                className='flex items-center gap-2 cursor-pointer text-[#6B46C1] hover:text-[#553C9A]'
                onClick={copyToClipboard}
              >
                <span className='font-semibold text-sm truncate max-w-[150px]'>
                  {reference}
                </span>
                <Copy size={14} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-center justify-between'>
      <span className='text-gray-500 text-sm'>{label}</span>
      <span className='font-semibold text-gray-900 text-sm'>{value}</span>
    </div>
  );
}
