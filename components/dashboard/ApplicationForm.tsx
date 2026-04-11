import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Calculator } from "lucide-react";
import { Task } from "@/types/task";
import { PLATFORM_FEE_PERCENT, calculateNetEarnings } from "@/lib/constants";

interface ApplicationFormProps {
  task: Task;
  onSubmit: (data: { amount?: number; message: string }) => void;
  isSubmitting?: boolean;
  initialData?: {
    amount?: number;
    message?: string;
  };
  isEditing?: boolean;
}

export function ApplicationForm({
  task,
  onSubmit,
  isSubmitting,
  initialData,
  isEditing = false,
}: ApplicationFormProps) {
  const [message, setMessage] = useState(initialData?.message || "");
  const [customAmount, setCustomAmount] = useState<number | "">(
    initialData?.amount ?? task.budget,
  );

  const isFixedPrice = task.applicationInfo
    ? !task.applicationInfo.priceEditable
    : !task.isBiddingEnabled;

  const displayAmount = isFixedPrice
    ? task.applicationInfo?.fixedPrice || task.budget
    : customAmount;

  const handleSubmit = () => {
    onSubmit({
      amount: isFixedPrice ? undefined : (customAmount as number),
      message,
    });
  };

  return (
    <div className='bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm '>
      <div className='space-y-2'>
        <h3 className='font-bold text-gray-900 text-xl'>Application</h3>
        <p className='text-gray-500 text-sm leading-relaxed'>
          {isFixedPrice
            ? "This is a fixed-price task. Amount is set by the poster. You can include a message"
            : "You can bid a custom amount for this task. Include a message to introduce yourself"}
        </p>
      </div>

      {/* Price Display/Input */}
      {isFixedPrice ? (
        <div className='flex justify-between items-center py-4'>
          <span className='text-gray-400 font-medium'>Fixed Price</span>
          <span className='text-gray-900 font-bold'>
            ₦{displayAmount?.toLocaleString() || "0"}
          </span>
        </div>
      ) : (
        <div className='space-y-3'>
          <label className='text-gray-500 text-sm font-bold'>
            Your Bid Amount
          </label>
          <div className='relative'>
            <span className='absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold'>
              ₦
            </span>
            <Input
              type='number'
              value={customAmount}
              onChange={(e) =>
                setCustomAmount(e.target.value ? Number(e.target.value) : "")
              }
              className='bg-[#F3F4F6] border-0 h-14 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] pl-12 text-gray-900 font-bold'
              placeholder='Enter your bid'
            />
          </div>
        </div>
      )}

      {/* Revenue Calculator */}
      {(isFixedPrice ? displayAmount : customAmount) ? (
        <div className='bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300'>
          <div className='flex items-center gap-2 text-[#6B46C1] mb-1'>
            <Calculator size={14} className='font-bold' />
            <span className='text-[10px] font-black uppercase tracking-widest'>Revenue Breakdown</span>
          </div>
          <div className='flex justify-between items-center text-xs'>
            <span className='text-gray-500 font-medium'>Platform Service Fee ({PLATFORM_FEE_PERCENT * 100}%)</span>
            <span className='text-red-400 font-bold'>-₦{(Math.round((isFixedPrice ? (displayAmount || 0) : Number(customAmount || 0)) * PLATFORM_FEE_PERCENT)).toLocaleString()}</span>
          </div>
          <div className='h-px bg-gray-200/50 w-full' />
          <div className='flex justify-between items-center'>
            <span className='text-gray-900 font-bold text-sm'>You will earn</span>
            <span className='text-[#38A169] font-black text-lg'>
              ₦{calculateNetEarnings(isFixedPrice ? (displayAmount || 0) : Number(customAmount || 0)).toLocaleString()}
            </span>
          </div>
          <p className='text-[9px] text-gray-400 font-medium italic mt-1'>
            * This is the exact amount that will be credited to your wallet upon task completion.
          </p>
        </div>
      ) : null}

      {/* Message */}
      <div className='space-y-3'>
        <label className='text-gray-500 text-sm font-medium'>
          Message (Optional)
        </label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Introduce yourself, relevant experience, availability...'
          className='bg-[#F3F4F6] border-0 h-40 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] p-6 text-gray-600 resize-none'
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || (!isFixedPrice && !customAmount)}
        className='w-full bg-[#6B46C1] hover:bg-[#553C9A] py-8 rounded-xl font-bold text-lg shadow-sm'
      >
        {isSubmitting ? (
          <Loader2 className='w-5 h-5 animate-spin mr-2' />
        ) : null}
        {isSubmitting
          ? isEditing
            ? "Updating..."
            : "Submitting..."
          : isEditing
            ? "Update Application"
            : task.applicationInfo?.applicationLabel || "Apply"}
      </Button>
    </div>
  );
}
