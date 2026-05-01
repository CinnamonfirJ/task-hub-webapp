"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Calendar, Briefcase, Wallet, Star, ShieldCheck, MapPin, CheckCircle2 } from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    fullName?: string;
    profilePicture?: string;
    createdAt?: string;
    location?: {
      residentState?: string;
      country?: string;
    },
    trustScore?: number;
    completedTasksCount?: number;
    totalTasks?: number;
    spendingRange?: string;
  } | null;
}

/**
 * A premium modal for taskers to view public credibility stats of a user (task poster).
 */
export function UserProfileModal({ isOpen, onClose, user }: UserProfileModalProps) {
  if (!user) return null;

  const initials = (user.fullName || "U")
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "U";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Jan 2024";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[420px] max-h-[90vh] p-0 overflow-y-auto border-none rounded-[2.5rem] shadow-2xl bg-white focus:outline-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
        {/* Banner with Gradient */}
        <div className='relative h-36 bg-linear-to-br from-[#7C3AED] via-[#6D28D9] to-[#4C1D95]'>
          {/* Abstract pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className='absolute -bottom-14 left-8 p-1.5 bg-white rounded-[2rem] shadow-2xl'>
             <div className='w-28 h-28 rounded-[1.75rem] bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-gray-50/50'>
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.fullName} className='w-full h-full object-cover' />
                ) : (
                  <div className='w-full h-full bg-linear-to-br from-purple-100 to-purple-50 flex items-center justify-center'>
                    <span className='text-3xl font-black text-[#6B46C1]'>{initials}</span>
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className='pt-16 pb-10 px-8 space-y-8'>
          {/* Identity Header */}
          <div className='flex justify-between items-start'>
            <div className='space-y-1.5'>
              <div className='flex items-center gap-2.5'>
                <h2 className='text-2xl font-black text-gray-900 tracking-tight'>{user.fullName}</h2>
                <div className='bg-blue-50 p-1 rounded-full'>
                  <ShieldCheck size={20} className='text-blue-500 fill-blue-50' />
                </div>
              </div>
              <div className='flex items-center gap-2 text-gray-500 text-[13px] font-semibold'>
                <MapPin size={14} className="text-purple-400" />
                <span>{user?.location?.residentState || "Lagos"}, {user?.location?.country || "Nigeria"}</span>
              </div>
            </div>
            
            <div className='bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5'>
              <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
              <span className='text-[10px] font-bold text-emerald-700 uppercase tracking-wider'>Verified</span>
            </div>
          </div>

          {/* Core Stats Grid */}
          <div className='grid grid-cols-3 gap-3'>
            <div className='bg-gray-50/60 p-4 rounded-3xl border border-gray-100/80 flex flex-col items-center text-center'>
              <div className='w-8 h-8 rounded-xl bg-purple-100/50 flex items-center justify-center text-purple-600 mb-2'>
                <Briefcase size={16} />
              </div>
              <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1'>Total</p>
              <p className='text-xl font-black text-gray-900'>{user?.totalTasks || 0}</p>
            </div>
            
            <div className='bg-gray-50/60 p-4 rounded-3xl border border-gray-100/80 flex flex-col items-center text-center'>
              <div className='w-8 h-8 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-600 mb-2'>
                <CheckCircle2 size={16} />
              </div>
              <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1'>Done</p>
              <p className='text-xl font-black text-gray-900'>{user?.completedTasksCount || 0}</p>
            </div>

            <div className='bg-gray-50/60 p-4 rounded-3xl border border-gray-100/80 flex flex-col items-center text-center'>
              <div className='w-8 h-8 rounded-xl bg-amber-100/50 flex items-center justify-center text-amber-600 mb-2'>
                <Wallet size={16} />
              </div>
              <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1'>Spend</p>
              <p className='text-[15px] font-black text-gray-900 truncate w-full'>
                {user?.spendingRange?.includes('₦') ? user.spendingRange : `₦${user?.spendingRange || '0'}`}
              </p>
            </div>
          </div>

          {/* Trust & Longevity Info */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-5 bg-purple-50/30 rounded-[2rem] border border-purple-100/50'>
               <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-400 shadow-sm border border-amber-50'>
                    <Star size={24} fill="currentColor" />
                  </div>
                  <div>
                    <p className='text-[11px] font-bold text-gray-400 uppercase tracking-widest'>Trust Score</p>
                    <div className='flex items-baseline gap-1'>
                      <p className='text-xl font-black text-gray-900'>{user?.trustScore?.toFixed(1) || "5.0"}</p>
                      <p className='text-[11px] font-bold text-gray-400'>/ 5.0</p>
                    </div>
                  </div>
               </div>
               
               <div className='h-12 w-px bg-purple-100/60' />

               <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-sm border border-blue-50'>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className='text-[11px] font-bold text-gray-400 uppercase tracking-widest'>Member</p>
                    <p className='text-lg font-black text-gray-900'>{formatDate(user?.createdAt)}</p>
                  </div>
               </div>
            </div>

            {/* Footer Trust Indicator */}
            <div className='bg-linear-to-r from-emerald-50/50 to-teal-50/50 p-5 rounded-[2rem] border border-emerald-100/50'>
               <div className='flex items-start gap-3'>
                  <div className='mt-0.5 bg-emerald-500 rounded-full p-1'>
                    <CheckCircle2 size={12} className='text-white' />
                  </div>
                  <p className='text-[12px] text-gray-600 font-semibold leading-relaxed'>
                    High trust user with <span className="text-emerald-600 font-black">excellent</span> payment history and community standing.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
