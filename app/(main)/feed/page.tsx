"use client";

import { useState } from "react";
import { useHome, formatDeadline, getCategoryName } from "@/hooks/useHome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, Clock, FilePlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeedPage() {
  const {
    recentTasks,
    isLoading,
    isError,
    refetchTasks,
  } = useHome();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Digital Marketing", "Graphics Design", "Cleaning", "Handyman"];

  // Filter tasks based on search and category
  const filteredTasks = recentTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || getCategoryName(task.categories) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className='flex flex-col space-y-8 mx-auto p-8 w-full max-w-7xl min-h-screen'>
      {/* Header */}
      <h1 className='font-bold text-gray-900 text-3xl'>Explore Tasks</h1>

      {/* Search Bar */}
      <div className='relative w-full'>
        <Search className='top-1/2 left-4 absolute w-5 h-5 text-gray-400 -translate-y-1/2' />
        <Input
          type='text'
          placeholder='Search tasks...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='bg-gray-100/80 pr-4 pl-12 border-none rounded-xl h-14 text-gray-600 focus-visible:ring-1 focus-visible:ring-[#6B46C1]'
        />
      </div>

      {/* Category Filters */}
      <div className='flex flex-wrap gap-3'>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              selectedCategory === cat
                ? "bg-[#6B46C1] text-white shadow-md shadow-purple-100"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task Grid */}
      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className='rounded-[2rem] h-[340px]' />
          ))}
        </div>
      ) : isError ? (
        <div className='flex flex-col items-center justify-center py-20 text-center space-y-4'>
           <p className='font-medium text-gray-500'>Failed to load tasks. Please try again.</p>
           <Button onClick={() => refetchTasks()} className='bg-[#6B46C1]'>Retry</Button>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredTasks.map((task) => {
            const creator = task.creator && typeof task.creator === 'object' ? task.creator : null;
            return (
              <div
                key={task._id}
                className='flex flex-col bg-white hover:bg-gray-50/50 p-8 border border-gray-100 rounded-[2.5rem] shadow-sm transition-all group relative'
              >
                {/* Card Top: Category Badge */}
                <div className='mb-6'>
                  <span className='bg-purple-100/60 px-4 py-1.5 rounded-lg font-bold text-[#6B46C1] text-[10px] uppercase tracking-wider'>
                    {getCategoryName(task.categories)}
                  </span>
                </div>

                {/* Poster Info */}
                <div className='flex items-center gap-3 mb-6'>
                  <div className='flex justify-center items-center bg-[#6B46C1] rounded-full w-9 h-9 font-bold text-white text-[10px]'>
                    {creator?.fullName?.[0] || creator?.firstName?.[0] || "T"}
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-medium text-gray-400 text-[10px]'>
                      Posted by {creator?.fullName || (creator?.firstName ? `${creator.firstName} ${creator.lastName || ''}` : "Task Hub")}
                    </span>
                  </div>
                </div>

              {/* Title & Description */}
              <div className='flex-1 space-y-3 mb-8'>
                <h3 className='group-hover:text-[#6B46C1] font-bold text-gray-900 text-xl transition-colors line-clamp-2'>
                  {task.title}
                </h3>
                <p className='text-gray-400 text-sm leading-relaxed line-clamp-3'>
                  {task.description}
                </p>
              </div>

              {/* Footer: Date & Price */}
              <div className='flex justify-between items-center pt-6 border-t border-gray-50'>
                <div className='flex items-center gap-2 text-gray-400 text-xs font-bold'>
                  <Calendar size={16} />
                  <span>{task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "Flexible"}</span>
                </div>
                <div className='font-black text-[#22C55E] text-xl'>
                   ₦{task.budget.toLocaleString()}
                </div>
              </div>
              
              {/* Hidden Action for Hover or Click */}
              <Link href={`/tasks/${task._id}`} className="inset-0 absolute rounded-[2.5rem]" />
            </div>
          );
          })}
        </div>
      ) : (
        /* Empty State Matching Design */
        <div className='flex flex-col items-center justify-center py-32 text-center space-y-6'>
          <div className='flex justify-center items-center bg-purple-50 rounded-full w-24 h-24'>
             <div className="bg-white p-4 rounded-3xl shadow-sm">
                <Clock className="w-10 h-10 text-[#6B46C1] animate-pulse" />
             </div>
          </div>
          <div className='space-y-2'>
            <h2 className='font-bold text-gray-900 text-2xl'>No Task Available</h2>
            <p className='text-gray-400 text-sm max-w-sm'>
              No tasks matching your categories right now. Check back soon!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
