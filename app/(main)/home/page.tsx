"use client";

import { useHome, formatDeadline, getCategoryName } from "@/hooks/useHome";
import { Button } from "@/components/ui/button";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import Link from "next/link";
import { ArrowRight, Clock, FilePlus, Loader2, Package, Stars } from "lucide-react";

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

  // -- Empty State View --
  if (!isProfileComplete) {
    return (
      <div className='flex flex-col space-y-8 mx-auto p-8 w-full max-w-6xl min-h-screen'>
        {/* Header */}
        <div className='flex items-center gap-4'>
          <div className='flex justify-center items-center bg-[#6B46C1] rounded-full w-14 h-14 font-bold text-white text-xl'>
            {userInitials}
          </div>
          <div>
            <h1 className='font-bold text-gray-900 text-2xl'>Welcome</h1>
            <p className='text-gray-500 capitalize'>{user?.fullName || "User"}</p>
          </div>
        </div>

        {/* Welcome Section */}
        <div className='flex flex-col items-center justify-center py-10 space-y-6 text-center'>
          <div className='inline-flex bg-purple-50 p-6 rounded-full'>
            <span className='text-4xl text-[#6B46C1]'><Stars size={24}/></span>
          </div>
          <div className='space-y-3 max-w-md'>
            <h2 className='font-bold text-3xl text-gray-900'>Welcome! Lets get you started</h2>
            <p className='text-gray-500 text-sm leading-relaxed'>
              Complete your profile to unlock full access to TaskHub. You&apos;ll be able to post tasks, connect with taskers, and start managing your projects.
            </p>
            <div className="flex justify-center">
            <Link href='/profile'>
              <Button className='bg-[#6B46C1] hover:bg-[#553C9A] mt-4 px-8 py-6 text-lg rounded-sm flex items-center gap-2'>
                Complete profile <ArrowRight size={20} />
              </Button>
            </Link>
            </div>
          </div>
        </div>

        {/* No Task Placeholder */}
        <div className='p-2 flex flex-col items-center justify-center text-center space-y-4'>
          <div className='bg-purple-50 p-5 rounded-full'>
            <div className=" p-3 rounded-xl ">
                <FilePlus size={24} className="w-8 h-8 text-[#6B46C1]" />
            </div>
          </div>
          <h3 className='font-bold text-xl text-gray-900'>No Task here</h3>
          <p className='text-gray-400 text-sm max-w-sm'>
            There are no ongoing tasks, click on the button below to create one
          </p>
          <Link href='/post-task'>
            <Button className='bg-[#6B46C1] hover:bg-[#553C9A] px-10 py-5 rounded-xl text-sm font-semibold'>
                Post a Task
            </Button>
          </Link>
        </div>

        {/* Recent Activities Empty */}
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h3 className='font-bold text-gray-900 text-2xl'>Recent Activities</h3>
            <span className='text-[#6B46C1] font-medium text-sm cursor-pointer'>See all</span>
          </div>
          <div className='p-16 flex flex-col items-center justify-center text-center space-y-4'>
             <div className='bg-purple-50 p-5 rounded-full'>
                <Package size={24} className="w-8 h-8 text-[#6B46C1]" />
             </div>
             <h3 className='font-bold text-xl text-gray-900'>No recent activities</h3>
             <p className='text-gray-400 text-sm'>There are no activities here, engage in an activity of any sort to see them here</p>
          </div>
        </div>
      </div>
    );
  }

  // -- Dashboard View --
  return (
    <div className='flex flex-col space-y-10 mx-auto p-8 w-full max-w-6xl min-h-screen'>
      <div className='flex items-center gap-4'>
        <div className='flex justify-center items-center bg-[#6B46C1] rounded-full w-14 h-14 font-bold text-white text-xl'>
          {userInitials}
        </div>
        <div>
          <h1 className='font-bold text-gray-900 text-2xl'>Welcome</h1>
          <p className='text-gray-500 capitalize'>{user?.fullName || "User"}</p>
        </div>
      </div>

      {/* Featured/Hero Card */}
      {isLoading ? (
        <div className='relative flex justify-center items-center bg-[#6B46C1] shadow-xl p-8 rounded-[2rem] w-full min-h-[250px] overflow-hidden text-white'>
          <Loader2 className='w-8 h-8 animate-spin' />
        </div>
      ) : isError ? (
        <div className='relative bg-[#6B46C1] shadow-xl p-8 rounded-[2rem] w-full overflow-hidden text-white text-center'>
          <p>Failed to load tasks. Please try again.</p>
        </div>
      ) : featuredTask ? (
        <div className='relative bg-[#6B46C1] shadow-xl p-10 rounded-[2.5rem] w-full overflow-hidden text-white'>
          {/* Top Row: Tag & Action */}
          <div className='flex justify-between items-start mb-8'>
            <span className='bg-white/20 px-5 py-2 rounded-xl font-medium text-sm'>
              {getCategoryName(featuredTask.categories)}
            </span>
            <Link href={`/tasks/${featuredTask._id}`}>
              <Button
                variant='secondary'
                className='bg-white/20 hover:bg-white/30 border-none text-white px-8 rounded-xl'
              >
                Open
              </Button>
            </Link>
          </div>

          {/* Content */}
          <div className='mb-10'>
            <h2 className='mb-3 font-bold text-4xl leading-tight'>{featuredTask.title}</h2>
            <p className='text-white/70 text-lg line-clamp-2 max-w-2xl'>
              {featuredTask.description}
            </p>
          </div>

          {/* Bottom Row: Budget & Meta */}
          <div className='flex justify-between items-end'>
            <div className='bg-[#22C55E] p-4 px-8 rounded-2xl'>
              <div className='opacity-80 mb-1 text-[10px] uppercase font-bold tracking-[0.2em]'>
                BUDGET
              </div>
              <div className='font-bold text-2xl'>
                ₦ {featuredTask.budget.toLocaleString()}
              </div>
            </div>

            <div className='flex items-center gap-6 text-white text-sm'>
              <div className='flex items-center gap-3 font-medium'>
                <Clock size={20} className="text-white/60" />
                <span>{formatDeadline(featuredTask.deadline)}</span>
              </div>
              <Link href={`/tasks/${featuredTask._id}`}>
                <Button
                  size='icon'
                  className='bg-white/10 hover:bg-white/20 rounded-full w-12 h-12'
                >
                  <ArrowRight size={24} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
         <div className='relative bg-gradient-to-br from-[#673AB7] to-[#512DA8] shadow-xl p-10 rounded-[2.5rem] w-full overflow-hidden text-white text-center flex flex-col items-center'>
            <div className='bg-white/10 p-5 rounded-full mb-4'>
                <Clock className="w-10 h-10" />
            </div>
            <h2 className='mb-2 font-bold text-2xl'>No Tasks Available</h2>
            <p className='mb-6 text-white/70'>Be the first to create a task in your area!</p>
            <Link href='/post-task'>
              <Button
                variant='secondary'
                className='bg-white hover:bg-gray-100 text-[#6B46C1] px-10 py-6 rounded-xl font-bold'
              >
                Post a Task
              </Button>
            </Link>
          </div>
      )}

      {/* Recent Activities Section */}
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h3 className='font-bold text-gray-900 text-2xl'>Recent Activities</h3>
          <Link
            href='/tasks'
            className='font-semibold text-[#6B46C1] text-sm hover:underline'
          >
            See all
          </Link>
        </div>

        <div className='space-y-4'>
          {isLoading ? (
            <div className='flex items-center gap-3 text-gray-500 font-medium py-10 justify-center'>
              <Loader2 className='w-6 h-6 animate-spin' />
              Loading activities...
            </div>
          ) : recentTasks.length === 0 ? (
            <div className='bg-white border border-gray-100 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center space-y-4 shadow-sm'>
                 <div className='bg-purple-50 p-6 rounded-full'>
                    <Loader2 className="w-10 h-10 text-[#6B46C1] opacity-20" />
                 </div>
                 <h3 className='font-bold text-xl text-gray-900'>No recent activities</h3>
                 <p className='text-gray-400 text-sm max-w-[280px]'>There are no activities here, engage in an activity of any sort to see them here</p>
            </div>
          ) : (
            recentTasks.map((task) => (
              <ActivityItem
                key={task._id}
                id={task._id}
                title={task.title}
                date={task.createdAt}
                status={task.status === 'open' ? 'OPEN' : task.status}
                amount={task.budget}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
