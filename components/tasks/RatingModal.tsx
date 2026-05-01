"use client";

import { useState } from "react";
import { Star, Loader2, Send, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRateTask } from "@/hooks/useTaskDetails";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskerName: string;
}

export function RatingModal({
  isOpen,
  onClose,
  taskId,
  taskerName,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const { mutate: rateTask, isPending } = useRateTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (reviewText.length > 500) {
      toast.error("Review must be less than 500 characters");
      return;
    }

    rateTask(
      { id: taskId, data: { rating, reviewText } },
      {
        onSuccess: () => {
          toast.success("Thank you for your rating!");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to submit rating");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] gap-6 rounded-3xl border-none shadow-2xl'>
        <DialogHeader>
          <div className='w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-2'>
            <Star className='text-[#6B46C1]' size={24} fill='#6B46C1' />
          </div>
          <DialogTitle className='text-2xl font-black text-gray-900'>
            Rate your experience
          </DialogTitle>
          <p className='text-sm text-gray-500'>
            How was your experience working with <span className='font-bold text-gray-700'>{taskerName}</span>?
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex flex-col items-center justify-center gap-3 py-2'>
            <div className='flex items-center gap-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  className='transition-transform hover:scale-110 active:scale-95 p-1 outline-none'
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={40}
                    className={cn(
                      "transition-colors duration-200",
                      (hoveredRating || rating) >= star
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200"
                    )}
                  />
                </button>
              ))}
            </div>
            <span className='text-xs font-black uppercase tracking-widest text-gray-400'>
              {rating > 0 ? `${rating} Stars Selected` : "Tap a star to rate"}
            </span>
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <Label htmlFor='review' className='text-sm font-bold text-gray-700'>
                Your Review (Optional)
              </Label>
              <span className={cn(
                "text-[10px] font-bold uppercase",
                reviewText.length > 450 ? "text-red-500" : "text-gray-400"
              )}>
                {reviewText.length}/500
              </span>
            </div>
            <Textarea
              id='review'
              placeholder='Tell us more about the service...'
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className='min-h-[120px] rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-purple-100 transition-all resize-none text-sm'
              maxLength={500}
            />
          </div>

          <DialogFooter className='sm:justify-start gap-2 pt-2'>
            <Button
              type='submit'
              disabled={isPending || rating === 0}
              className='w-full bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-2xl h-12 font-bold gap-2 shadow-lg shadow-purple-100'
            >
              {isPending ? (
                <Loader2 size={18} className='animate-spin' />
              ) : (
                <>
                  <Send size={18} /> Submit Rating
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
