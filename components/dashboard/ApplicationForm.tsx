import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Task } from "@/types/task";

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
