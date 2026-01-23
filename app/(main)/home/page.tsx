"use client";

import { useHome, formatDeadline, getCategoryName } from "@/hooks/useHome";
import { Button } from "@/components/ui/button";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import Link from "next/link";
import { ArrowRight, Clock, Loader2 } from "lucide-react";

export default function HomePage() {
  const {
    user,
    userInitials,
    isProfileComplete,
    featuredTask,
    recentTasks,
    isLoading,
    isError,
  } = useHome();

  if (!user) return null;

  // -- Empty State / Onboarding View --
  if (!isProfileComplete) {
    return (
      <div className='flex flex-col justify-center items-center space-y-8 mx-auto p-8 w-full max-w-4xl min-h-[80vh] text-center'>
        <div className='flex flex-col items-center gap-4 mb-4'>
          <div className='flex justify-center items-center bg-[#6B46C1] rounded-full w-20 h-20 font-bold text-white text-3xl'>
            {userInitials}
          </div>
          <div>
            <h1 className='font-bold text-gray-900 text-3xl'>Welcome</h1>
            <p className='text-gray-500 capitalize'>{user?.fullName || "User"}</p>
          </div>
        </div>

        <div className='inline-flex bg-purple-50 p-6 rounded-full'>
          <div className='text-4xl'>✨</div>
        </div>

        <div className='space-y-4 mx-auto max-w-md'>
          <h2 className='font-bold text-3xl'>Welcome! Lets get you started</h2>
          <p className='text-gray-500'>
            Complete your profile to unlock full access to TaskHub. You&apos;ll
            be able to
            {user.role === "tasker"
              ? " accept tasks, earn money, and manage your work."
              : " post tasks, connect with taskers, and start managing your projects."}
          </p>
          <Link href='/profile'>
            <Button className='bg-[#6B46C1] hover:bg-[#553C9A] mt-4 px-8 py-6 text-lg'>
              Complete profile &rarr;
            </Button>
          </Link>
        </div>

        <div className='flex flex-col items-center gap-4 bg-white opacity-75 shadow-sm blur-[1px] grayscale mx-auto mt-12 p-12 border border-gray-100 rounded-3xl w-full max-w-2xl'>
          <div className='bg-purple-100 p-4 rounded-full'>
            <Loader2 className='w-8 h-8 text-[#6B46C1]' />
          </div>
          <h3 className='font-bold text-xl'>Dashboard Locked</h3>
          <p className='text-gray-400'>Complete profile to view activities</p>
        </div>
      </div>
    );
  }

  // -- Dashboard View --
  return (
    <div className='flex flex-col space-y-8 mx-auto p-8 w-full max-w-6xl min-h-screen'>
      <div className='flex items-center gap-4 mb-4'>
        <div className='flex justify-center items-center bg-[#6B46C1] rounded-full w-12 h-12 font-bold text-white text-xl'>
          {userInitials}
        </div>
        <div>
          <h1 className='font-bold text-gray-900 text-2xl'>Welcome</h1>
          <p className='text-gray-500 capitalize'>{user?.fullName || "User"}</p>
        </div>
      </div>

      {/* Featured/Hero Card */}
      {isLoading ? (
        <div className='relative flex justify-center items-center bg-gradient-to-r from-[#6B46C1] to-[#482880] shadow-xl p-8 rounded-[2rem] w-full min-h-[250px] overflow-hidden text-white'>
          <Loader2 className='w-8 h-8 animate-spin' />
        </div>
      ) : isError ? (
        <div className='relative bg-gradient-to-r from-[#6B46C1] to-[#482880] shadow-xl p-8 rounded-[2rem] w-full overflow-hidden text-white'>
          <p className='text-center'>Failed to load tasks. Please try again.</p>
        </div>
      ) : featuredTask ? (
        <div className='relative bg-gradient-to-r from-[#6B46C1] to-[#482880] shadow-xl p-8 rounded-[2rem] w-full overflow-hidden text-white'>
          {/* Top Row: Tag & Action */}
          <div className='flex justify-between items-start mb-6'>
            <span className='bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-lg font-medium text-sm'>
              {getCategoryName(featuredTask.category)}
            </span>
            <Link href={`/tasks/${featuredTask._id}`}>
              <Button
                variant='secondary'
                className='bg-white/20 hover:bg-white/30 border-none text-white'
              >
                Open
              </Button>
            </Link>
          </div>

          {/* Content */}
          <div className='mb-8'>
            <h2 className='mb-2 font-bold text-3xl'>{featuredTask.title}</h2>
            <p className='text-white/80 line-clamp-2'>
              {featuredTask.description}
            </p>
          </div>

          {/* Bottom Row: Budget & Meta */}
          <div className='flex justify-between items-end'>
            <div className='bg-green-500/90 p-3 px-5 rounded-xl min-w-[120px]'>
              <div className='opacity-90 mb-1 text-xs uppercase tracking-wider'>
                BUDGET
              </div>
              <div className='font-bold text-xl'>
                ₦ {featuredTask.budget.toLocaleString()}
              </div>
            </div>

            <div className='flex items-center gap-4 text-white/80 text-sm'>
              <div className='flex items-center gap-2'>
                <Clock size={16} />
                <span>{formatDeadline(featuredTask.deadline)}</span>
              </div>
              <Link href={`/tasks/${featuredTask._id}`}>
                <Button
                  size='icon'
                  className='bg-white/20 hover:bg-white/30 rounded-full w-10 h-10'
                >
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className='relative bg-gradient-to-r from-[#6B46C1] to-[#482880] shadow-xl p-8 rounded-[2rem] w-full overflow-hidden text-white'>
          <div className='text-center'>
            <h2 className='mb-2 font-bold text-2xl'>No Tasks Available</h2>
            <p className='mb-4 text-white/80'>Be the first to create a task!</p>
            <Link href='/tasks/create'>
              <Button
                variant='secondary'
                className='bg-white hover:bg-white/90 text-[#6B46C1]'
              >
                Create Task
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activities Section */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h3 className='font-bold text-gray-900 text-xl'>Recent Activities</h3>
          <Link
            href='/tasks'
            className='font-medium text-[#6B46C1] text-sm hover:underline'
          >
            See all
          </Link>
        </div>

        <div className='space-y-3'>
          {isLoading ? (
            <div className='flex items-center gap-2 text-gray-500 text-sm'>
              <Loader2 className='w-4 h-4 animate-spin' />
              Loading activities...
            </div>
          ) : recentTasks.length === 0 ? (
            <div className='bg-gray-50 py-4 rounded-lg text-gray-500 text-sm text-center'>
              No recent activities found.
            </div>
          ) : (
            recentTasks.map((task) => (
              <ActivityItem
                key={task._id}
                id={task._id}
                title={task.title}
                date={task.createdAt}
                status={task.status}
                amount={task.budget}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
