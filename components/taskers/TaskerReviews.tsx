"use client";

import { useState } from "react";
import { Star, User, Loader2, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useTaskerReviews } from "@/hooks/useTaskerReviews";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskerReviewsProps {
  taskerId: string;
}

export function TaskerReviews({ taskerId }: TaskerReviewsProps) {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError } = useTaskerReviews(taskerId, { page, limit });

  const reviews = data?.data?.reviews || data?.reviews || [];
  const averageRating = data?.data?.averageRating || data?.averageRating || 0;
  const pagination = data?.data?.pagination || data?.pagination;
  const totalReviews = pagination?.total || reviews.length;

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-24 w-full rounded-2xl' />
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-32 w-full rounded-2xl' />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center bg-red-50 rounded-2xl border border-red-100'>
        <p className='text-red-600 font-bold'>Failed to load reviews</p>
        <Button variant='link' onClick={() => window.location.reload()} className='text-red-500 text-xs'>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Average Rating Header */}
      <div className='bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6'>
        <div className='flex items-center gap-6'>
          <div className='w-20 h-20 bg-purple-50 rounded-2xl flex flex-col items-center justify-center border border-purple-100'>
            <span className='text-3xl font-black text-[#6B46C1]'>{averageRating.toFixed(1)}</span>
            <div className='flex items-center gap-0.5 mt-1'>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={8}
                  className={cn(
                    "fill-current",
                    s <= Math.round(averageRating) ? "text-amber-400" : "text-gray-200"
                  )}
                />
              ))}
            </div>
          </div>
          <div>
            <h3 className='text-lg font-bold text-gray-900'>Tasker Rating</h3>
            <p className='text-sm text-gray-500 font-medium'>
              Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"} from task owners
            </p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className='space-y-4'>
        {reviews.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200'>
            <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4'>
              <MessageSquare className='text-gray-300' size={28} />
            </div>
            <h4 className='text-gray-900 font-bold'>No reviews yet</h4>
            <p className='text-sm text-gray-400 max-w-[240px] mt-1'>
              This tasker hasn't received any reviews from task owners yet.
            </p>
          </div>
        ) : (
          <>
            <div className='grid gap-4'>
              {reviews.map((review: any) => (
                <div
                  key={review._id || review.id}
                  className='bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all'
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-50'>
                        {review.user?.profilePicture ? (
                          <img
                            src={review.user.profilePicture}
                            alt={review.user.fullName}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <User size={18} className='text-gray-400' />
                        )}
                      </div>
                      <div>
                        <h5 className='text-sm font-bold text-gray-900'>{review.user?.fullName || "Anonymous"}</h5>
                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                          {review.task?.category || "Task"} • {review.createdAt ? format(new Date(review.createdAt), "MMM d, yyyy") : ""}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-xs font-black'>
                      <Star size={12} className='fill-amber-400 text-amber-400' />
                      {review.rating.toFixed(1)}
                    </div>
                  </div>
                  
                  {review.task?.title && (
                    <p className='text-xs font-bold text-[#6B46C1] bg-purple-50 px-2 py-1 rounded-md w-fit mb-3'>
                      Task: {review.task.title}
                    </p>
                  )}
                  
                  <p className='text-sm text-gray-600 leading-relaxed italic'>
                    "{review.reviewText || "No review text provided."}"
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className='flex items-center justify-center gap-4 pt-6'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className='rounded-xl h-10 w-10 p-0 border-gray-200'
                >
                  <ChevronLeft size={18} />
                </Button>
                <div className='text-sm font-bold text-gray-500'>
                  Page <span className='text-gray-900'>{page}</span> of {pagination.pages}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className='rounded-xl h-10 w-10 p-0 border-gray-200'
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
