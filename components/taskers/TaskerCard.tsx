"use client";

import { Star, MapPin, Briefcase } from "lucide-react";
import { NearbyTasker } from "@/types/category";
import { cn } from "@/lib/utils";

interface TaskerCardProps {
  worker: NearbyTasker;
  onClick?: () => void;
  className?: string;
}

export function TaskerCard({ worker, onClick, className }: TaskerCardProps) {
  const name = `${worker.firstName} ${worker.lastName || ""}`.trim() || "Tasker";
  const initial = name[0]?.toUpperCase() || "T";
  
  const role = worker.primaryCategory || "Tasker";
  const rating = worker.averageRating || 4.9;
  const jobs = worker.completedJobs || 0;
  const locationLabel = worker.area || worker.residentState || "Nearby";

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white border border-gray-100 rounded-md p-5 shadow-sm hover:shadow-md hover:border-purple-100 transition-all cursor-pointer group flex flex-col h-full",
        className
      )}
    >
      <div className='flex items-center gap-4 mb-4'>
        <div className='relative w-14 h-14 shrink-0'>
          <div className='w-full h-full rounded-full overflow-hidden border-2 border-white shadow-sm'>
            {worker.profilePicture ? (
              <img
                src={worker.profilePicture}
                alt={name}
                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
              />
            ) : (
              <div className='w-full h-full bg-linear-to-br from-[#6B46C1] to-[#805AD5] flex items-center justify-center text-white font-bold text-xl'>
                {initial}
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
        </div>
        <div className='min-w-0 flex-1'>
          <h3 className='font-bold text-gray-900 text-base md:text-lg truncate group-hover:text-[#6B46C1] transition-colors'>
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Briefcase size={12} className="text-[#6B46C1]" />
            <p className='text-xs font-medium truncate capitalize'>
              {role}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-auto">
        <div className='flex items-center gap-4 text-xs'>
          <div className='flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md font-bold'>
            <Star
              size={12}
              className='fill-yellow-400 text-yellow-400'
            />
            {rating.toFixed(1)}
          </div>
          <div className="text-gray-400 font-medium">
            <span className="text-gray-900 font-bold">{jobs}</span> tasks completed
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className='flex items-center gap-1 text-xs font-semibold text-gray-500'>
            <MapPin size={14} className="text-gray-400" />
            <span className="truncate max-w-[120px]">{locationLabel}</span>
          </div>
          {worker.distance !== undefined && (
            <span className="text-[10px] font-bold text-[#6B46C1] bg-purple-50 px-2 py-1 rounded-full">
              {worker.distance.toFixed(1)}km away
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
