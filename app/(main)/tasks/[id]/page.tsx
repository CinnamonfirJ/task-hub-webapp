"use client";

import { useTaskDetails } from "@/hooks/useTaskDetails";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

function SimpleBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    >
      {children}
    </span>
  );
}

export default function TaskDetailsPage() {
  const { task, isLoading, error, goBack } = useTaskDetails();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6B46C1]" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-gray-500 font-medium text-lg">Oops! Task not found</p>
        <Button onClick={goBack} variant="outline" className="rounded-xl">
          Go Back
        </Button>
      </div>
    );
  }

  const categories = task.categories || [];
  const primaryCategory = categories.length > 0 ? categories[0] : null;
  const categoryName = (primaryCategory && typeof primaryCategory === "object") ? primaryCategory.name : "Uncategorized";

  const displayLocation = typeof task.location === "object" 
    ? `${task.location.latitude.toFixed(4)}, ${task.location.longitude.toFixed(4)}`
    : task.location || "Remote";

  return (
    <div className='flex flex-col space-y-8 mx-auto p-8 w-full max-w-5xl min-h-screen'>
      {/* Header / Navigation */}
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={goBack}
          className='hover:bg-purple-50 rounded-full w-12 h-12 text-gray-700'
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className='font-bold text-gray-900 text-3xl'>Task Details</h1>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-start'>
        {/* Main Info - Left Side (8 cols) */}
        <div className='lg:col-span-8 space-y-10'>
          {/* Status & Title */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <span className='bg-purple-100 px-6 py-2 rounded-xl font-bold text-[#6B46C1] text-xs transition-colors cursor-pointer hover:bg-purple-200'>
                {categoryName.toUpperCase()}
              </span>
              <span className='bg-green-100 px-6 py-2 rounded-xl font-bold text-[#22C55E] text-xs'>
                {task.status.toUpperCase()}
              </span>
            </div>
            <h2 className='font-bold text-gray-900 text-4xl leading-tight'>
              {task.title}
            </h2>
          </div>

          {/* Location & Date Meta */}
          <div className="flex flex-wrap gap-8">
             <div className="flex items-center gap-3">
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                    <MapPin className="w-5 h-5 text-[#6B46C1]" />
                </div>
                <div>
                   <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Location</p>
                   <p className="font-bold text-gray-900">{displayLocation}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                    <Calendar className="w-5 h-5 text-[#6B46C1]" />
                </div>
                <div>
                   <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Deadline</p>
                   <p className="font-bold text-gray-900">{task.deadline ? new Date(task.deadline).toLocaleDateString() : "Flexible"}</p>
                </div>
             </div>
          </div>

          {/* Description */}
          <div className='space-y-4'>
            <h3 className='font-bold text-gray-900 text-xl'>Description</h3>
            <p className='text-gray-500 text-lg leading-relaxed whitespace-pre-wrap max-w-2xl'>
              {task.description}
            </p>
          </div>

          {/* Images Section */}
          {task.images && task.images.length > 0 && (
            <div className='space-y-6'>
              <h3 className='font-bold text-gray-900 text-xl'>Attached Images</h3>
              <div className='grid grid-cols-2 gap-4'>
                {task.images.map((img, idx) => (
                  <div
                    key={idx}
                    className='relative aspect-[4/3] bg-gray-100 rounded-[1.5rem] overflow-hidden group'
                  >
                    <img
                      src={img}
                      alt='Task detail'
                      className='group-hover:scale-105 transition-transform duration-500 object-cover w-full h-full'
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Right Side (4 cols) */}
        <div className='lg:col-span-4 space-y-6 lg:sticky lg:top-8'>
          <div className='bg-white border border-gray-100 shadow-sm p-8 rounded-[2rem] space-y-8'>
             {/* Budget Display */}
             <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100/50">
                <p className="text-[10px] uppercase font-bold text-[#6B46C1] tracking-[0.2em] mb-2 px-1">ESTIMATED BUDGET</p>
                <div className="text-4xl font-black text-[#6B46C1] flex items-baseline gap-1">
                    <span className="text-2xl font-bold">₦</span>
                    {task.budget.toLocaleString()}
                </div>
             </div>

             <div className="space-y-4">
                 <Button className='bg-[#6B46C1] hover:bg-[#553C9A] w-full py-8 text-lg font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all active:scale-[0.98]'>
                    Place a Bid
                 </Button>
                 
                 <Button 
                    variant="ghost" 
                    className="w-full py-8 text-red-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-2xl transition-all"
                 >
                    Cancel Task
                 </Button>
             </div>
          </div>

          {/* Quick Info / Security Note */}
          <div className="bg-gray-50 p-6 rounded-[2rem] border border-dashed border-gray-200">
             <p className="text-xs text-center text-gray-400 font-medium">
                Make sure to communicate only through task-hub for your safety and security.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
