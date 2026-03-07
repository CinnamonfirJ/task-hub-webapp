"use client";

import { useHome, formatDeadline, getCategoryName } from "@/hooks/useHome";
import { Button } from "@/components/ui/button";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  FilePlus,
  Loader2,
  Package,
  Stars,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    user,
    userInitials,
    isProfileComplete,
    featuredTask,
    recentTasks,
    recentActivities,
    isLoading,
    isError,
    isLoadingActivities,
    isActivitiesError,
    isLoadingUser,
    isVerified,
    isTasker,
    userName,
    refetchTasks,
  } = useHome();

  if (!isMounted) {
    return (
      <div className='flex flex-col space-y-8 mx-auto p-8 w-full max-w-6xl min-h-screen'>
        <div className='flex items-center gap-4'>
          <Skeleton className='w-14 h-14 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-4 w-24' />
          </div>
        </div>
        <div className='flex flex-col items-center justify-center py-20'>
          <Loader2 className='w-10 h-10 animate-spin text-primary' />
        </div>
      </div>
    );
  }

  const showWelcomeBanner = !isProfileComplete;

  // -- Dashboard View --
  return (
    <div className='flex flex-col space-y-6 md:space-y-10 mx-auto p-4 md:p-8 w-full max-w-6xl min-h-screen'>
      <div className='flex items-center gap-4'>
        {isLoadingUser ? (
          <Skeleton className='w-12 h-12 md:w-14 md:h-14 rounded-full' />
        ) : (
          <div className='flex justify-center items-center bg-[#6B46C1] rounded-full w-12 h-12 md:w-14 md:h-14 font-bold text-white text-lg md:text-xl shrink-0'>
            {userInitials}
          </div>
        )}
        <div className='min-w-0'>
          <h1 className='font-bold text-gray-900 text-xl md:text-2xl truncate'>
            Welcome {userName}
          </h1>
          <div className='flex items-center gap-2'>
            {isLoadingUser ? (
              <Skeleton className='h-4 w-24 md:w-32 mt-1' />
            ) : (
              <>
                <p className='text-gray-500 capitalize text-xs md:text-sm'>
                  {user?.role || "User"}
                </p>
                {isTasker && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-black border transition-colors whitespace-nowrap ${
                      isVerified
                        ? "bg-[#E6FFFA] text-[#38A169] border-[#B2F5EA]"
                        : "bg-[#FFF9EA] text-[#D69E2E] border-[#FFE7A5]"
                    }`}
                  >
                    {isVerified ? (
                      <>
                        {" "}
                        <Stars
                          size={8}
                          fill='currentColor'
                          className='md:w-2.5 md:h-2.5'
                        />{" "}
                        Verified{" "}
                      </>
                    ) : (
                      <>
                        {" "}
                        <Clock size={8} className='md:w-2.5 md:h-2.5' />{" "}
                        Identity not verified{" "}
                      </>
                    )}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Verification Banner for Taskers */}
      {isTasker && (!isVerified || !isProfileComplete) && (
        <div className='bg-[#FFF9EA] border border-[#FFE7A5] rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 md:gap-6 shadow-sm border-dashed'>
          <div className='bg-[#FBBC05] p-4 md:p-5 rounded-full text-white shadow-lg shrink-0'>
            <Clock size={24} className='md:w-8 md:h-8' />
          </div>
          <div className='flex-1 space-y-1 md:space-y-2 text-center md:text-left'>
            <h3 className='font-bold text-gray-900 text-lg md:text-2xl'>
              Complete your profile & Verification
            </h3>
            <p className='text-gray-500 text-sm md:text-base font-medium'>
              Please complete your profile details to apply for tasks and get
              hired
            </p>
          </div>
          <Link href='/profile' className='w-full md:w-auto'>
            <Button className='w-full md:w-auto bg-[#FBBC05] hover:bg-[#E5A900] text-white px-8 md:px-10 h-12 md:h-14 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm md:text-base shadow-md'>
              Complete profile{" "}
              <ArrowRight size={18} className='md:w-5 md:h-5' />
            </Button>
          </Link>
        </div>
      )}

      {/* Welcome Banner for Users (Incomplete Profile) */}
      {!isTasker && showWelcomeBanner && (
        <div className='bg-[#F5EEFF] border border-[#E9D8FD] rounded-2xl md:rounded-[2rem] p-6 md:p-10 flex flex-col items-center text-center space-y-4 md:space-y-6'>
          <div className='bg-[#6B46C1] p-4 rounded-full text-white'>
            <Stars size={32} />
          </div>
          <div className='space-y-2 max-w-lg'>
            <h2 className='font-black text-xl md:text-3xl text-gray-900'>
              Welcome! Let&apos;s get you started
            </h2>
            <p className='text-gray-500 font-medium'>
              Complete your profile to unlock full access to TaskHub and start
              managing your projects.
            </p>
          </div>
          <Link href='/profile'>
            <Button className='bg-[#6B46C1] hover:bg-[#553C9A] px-12 h-14 rounded-xl font-bold text-lg'>
              Complete profile
            </Button>
          </Link>
        </div>
      )}

      {/* Featured Task or Available Tasks */}
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h3 className='font-bold text-gray-900 text-xl md:text-2xl'>
            {isTasker ? "Available tasks" : "Featured Task"}
          </h3>
          {isTasker && (
            <Link
              href='/feed'
              className='text-[#6B46C1] font-bold text-sm hover:underline'
            >
              See all
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className='relative flex justify-center items-center bg-[#6B46C1] shadow-xl p-8 rounded-[2rem] w-full min-h-[200px] md:min-h-[250px] overflow-hidden text-white'>
            <Loader2 className='w-8 h-8 animate-spin' />
          </div>
        ) : isError ? (
          <div className='relative bg-[#6B46C1] shadow-xl p-8 rounded-[2rem] w-full overflow-hidden text-white text-center'>
            <p>Failed to load tasks. Please try again.</p>
          </div>
        ) : isTasker ? (
          /* Tasker Available Tasks Feed */
          recentTasks.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
              {recentTasks.slice(0, 2).map((task) => (
                <div
                  key={task._id}
                  className='bg-white border border-gray-100 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm space-y-4 md:space-y-6'
                >
                  <div className='flex justify-between items-start'>
                    <span className='bg-[#F5EEFF] text-[#6B46C1] px-3 py-1 md:px-4 md:py-1.5 rounded-lg font-bold text-[10px] md:text-xs uppercase tracking-wider'>
                      {getCategoryName(task.categories)}
                    </span>
                    <span className='text-[#4CAF50] font-black text-xl md:text-2xl'>
                      ₦ {task.budget?.toLocaleString() || "0"}
                    </span>
                  </div>

                  <div className='space-y-3 md:space-y-4'>
                    <div className='flex items-center gap-2 md:gap-3'>
                      <div className='w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#6B46C1] flex items-center justify-center text-[10px] md:text-xs font-bold text-white shadow-sm'>
                        {task.user?.fullName?.[0] || "T"}
                      </div>
                      <span className='text-gray-400 text-xs md:text-sm font-semibold'>
                        By {task.user?.fullName || "Task Hub"}
                      </span>
                    </div>

                    <div className='space-y-1 md:space-y-2'>
                      <h4 className='font-bold text-lg md:text-2xl text-gray-900 leading-tight'>
                        {task.title}
                      </h4>
                      <p className='text-gray-400 text-xs md:text-sm font-medium line-clamp-2'>
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className='flex justify-between items-center pt-2 gap-2'>
                    <div className='flex items-center gap-1.5 md:gap-2 text-gray-400 text-[10px] md:text-sm font-medium min-w-0'>
                      <Clock
                        size={14}
                        className='opacity-50 shrink-0 md:w-[18px] md:h-[18px]'
                      />
                      <span className='truncate'>
                        {formatDeadline(task.deadline)}
                      </span>
                    </div>
                    <Link href={`/tasks/${task._id}`}>
                      <Button className='bg-[#6B46C1] hover:bg-[#553C9A] px-4 md:px-8 h-10 md:h-12 rounded-xl text-xs md:text-sm font-black shadow-sm'>
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Tasker Empty State Matching Image */
            <div className='bg-white border border-gray-50 shadow-sm p-8 md:p-16 rounded-[2rem] md:rounded-[2.5rem] w-full flex flex-col items-center justify-center text-center space-y-4 md:space-y-6'>
              <div className='bg-purple-50 p-4 md:p-5 rounded-full'>
                <div className='bg-white p-2.5 md:p-3 rounded-xl shadow-sm'>
                  <FilePlus
                    size={24}
                    className='text-[#6B46C1] md:w-8 md:h-8'
                  />
                </div>
              </div>
              <div className='space-y-1 md:space-y-2'>
                <h3 className='font-bold text-lg md:text-xl text-gray-900'>
                  No Task Available
                </h3>
                <p className='text-gray-400 text-xs md:text-sm max-w-[280px] md:max-w-[320px]'>
                  No tasks matching your categories are available right now.
                  Check back later for new opportunities.
                </p>
              </div>
              <Button
                onClick={() => refetchTasks()}
                className='bg-[#6B46C1] hover:bg-[#553C9A] px-8 md:px-10 py-5 md:py-6 rounded-xl font-bold flex items-center gap-2 text-sm'
              >
                Refresh
              </Button>
            </div>
          )
        ) : featuredTask ? (
          /* User Featured Hero Card */
          <div className='relative bg-[#6B46C1] shadow-xl p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] w-full overflow-hidden text-white'>
            {/* Top Row: Tag & Action */}
            <div className='flex justify-between items-start mb-6 md:mb-8'>
              <span className='bg-white/20 px-4 py-1.5 md:px-5 md:py-2 rounded-xl font-medium text-xs md:text-sm uppercase tracking-wider'>
                {getCategoryName(featuredTask.categories)}
              </span>
              <Link href={`/tasks/${featuredTask._id}`}>
                <Button
                  variant='secondary'
                  className='bg-white/20 hover:bg-white/30 border-none text-white px-6 md:px-8 rounded-xl h-9 md:h-11 text-xs md:text-sm'
                >
                  Open
                </Button>
              </Link>
            </div>

            {/* Content */}
            <div className='mb-8 md:mb-10'>
              <h2 className='mb-2 md:mb-3 font-bold text-2xl md:text-4xl leading-tight'>
                {featuredTask.title}
              </h2>
              <p className='text-white/70 text-sm md:text-lg line-clamp-2 max-w-2xl'>
                {featuredTask.description}
              </p>
            </div>

            {/* Bottom Row: Budget & Meta */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-6'>
              <div className='bg-[#4CAF50] p-4 md:px-8 rounded-2xl w-full md:w-auto text-center md:text-left'>
                <div className='opacity-80 mb-0.5 md:mb-1 text-[8px] md:text-[10px] uppercase font-bold tracking-[0.2em]'>
                  BUDGET
                </div>
                <div className='font-bold text-xl md:text-2xl'>
                  ₦ {featuredTask.budget?.toLocaleString() || "0"}
                </div>
              </div>

              <div className='flex items-center justify-between md:justify-end gap-4 md:gap-6 text-white text-xs md:text-sm w-full md:w-auto'>
                <div className='flex items-center gap-2 md:gap-3 font-medium'>
                  <Clock size={16} className='text-white/60 md:w-5 md:h-5' />
                  <span>{formatDeadline(featuredTask.deadline)}</span>
                </div>
                <Link href={`/tasks/${featuredTask._id}`}>
                  <Button
                    size='icon'
                    className='bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 md:w-12 md:h-12 shrink-0'
                  >
                    <ArrowRight size={20} className='md:w-6 md:h-6' />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className='relative bg-linear-to-br from-[#673AB7] to-[#512DA8] shadow-xl p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] w-full overflow-hidden text-white text-center flex flex-col items-center'>
            <div className='bg-white/10 p-4 md:p-5 rounded-full mb-4 md:mb-6'>
              <Clock className='w-8 h-8 md:w-10 md:h-10' />
            </div>
            <h2 className='mb-2 font-bold text-lg md:text-2xl'>
              No Tasks Available
            </h2>
            <p className='mb-6 md:mb-8 text-white/70 text-sm md:text-base'>
              Be the first to create a task in your area!
            </p>
            <Link href='/post-task'>
              <Button
                variant='secondary'
                className='bg-white hover:bg-gray-100 text-[#6B46C1] px-8 md:px-10 py-5 md:py-6 rounded-xl font-bold'
              >
                Post a Task
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Recent Activities Section */}
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h3 className='font-bold text-gray-900 text-xl md:text-2xl'>
            Recent Activities
          </h3>
          <Link
            href={isTasker ? "/feed" : "/history"}
            className='font-semibold text-[#6B46C1] text-sm hover:underline'
          >
            See all
          </Link>
        </div>

        <div className='space-y-4'>
          {isLoadingActivities ? (
            <div className='flex items-center gap-3 text-gray-500 font-medium py-10 justify-center'>
              <Loader2 className='w-6 h-6 animate-spin' />
              Loading activities...
            </div>
          ) : isActivitiesError ? (
            <div className='bg-white border border-gray-100 rounded-[2.5rem] py-10 flex flex-col items-center justify-center text-center space-y-4 shadow-sm'>
              <p className='text-gray-500 font-medium'>
                Failed to load activities.
              </p>
              <Button
                onClick={() => refetchTasks()}
                variant='ghost'
                size='sm'
                className='text-[#6B46C1]'
              >
                Try again
              </Button>
            </div>
          ) : isTasker ? (
            /* Tasker Recent Activities: Show their bids */
            recentActivities.length === 0 ? (
              <div className='bg-white border border-gray-100 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center space-y-4 shadow-sm'>
                <div className='bg-purple-50 p-6 rounded-full'>
                  <Loader2 className='w-10 h-10 text-[#6B46C1] opacity-20' />
                </div>
                <h3 className='font-bold text-xl text-gray-900'>
                  No recent activities
                </h3>
                <p className='text-gray-400 text-sm max-w-[280px]'>
                  You haven&apos;t applied to any tasks yet. Browse available
                  tasks to get started!
                </p>
              </div>
            ) : (
              recentActivities.map((bid: any) => {
                const task = typeof bid.task === "object" ? bid.task : null;
                return (
                  <ActivityItem
                    key={bid._id}
                    id={task?._id || bid._id}
                    title={task?.title || "Task"}
                    date={bid.createdAt}
                    status='Applied'
                    amount={bid.amount}
                  />
                );
              })
            )
          ) : /* User Recent Activities: Show general tasks */
          recentTasks.length === 0 ? (
            <div className='bg-white border border-gray-100 rounded-2xl md:rounded-[2.5rem] py-16 md:py-20 flex flex-col items-center justify-center text-center space-y-4 shadow-sm'>
              <div className='bg-purple-50 p-6 rounded-full'>
                <Loader2 className='w-10 h-10 text-[#6B46C1] opacity-20' />
              </div>
              <h3 className='font-bold text-xl text-gray-900'>
                No recent activities
              </h3>
              <p className='text-gray-400 text-sm max-w-[280px]'>
                There are no activities here, engage in an activity of any sort
                to see them here
              </p>
            </div>
          ) : (
            recentTasks.map((task) => (
              <ActivityItem
                key={task._id}
                id={task._id}
                title={task.title}
                date={task.createdAt}
                status={task.status === "open" ? "OPEN" : task.status}
                amount={task.budget}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
