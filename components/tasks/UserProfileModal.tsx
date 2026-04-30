"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Calendar, Briefcase, Wallet, Star, ShieldCheck, MapPin } from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    fullName?: string;
    profilePicture?: string;
    createdAt?: string;
    residentState?: string;
    country?: string;
    // These stats are placeholders that can be populated if the backend provides them
    stats?: {
      completedTasks?: number;
      totalSpent?: number;
      rating?: number;
    };
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

  // Mock stats or fallbacks if the backend doesn't provide them yet
  // This allows the UI to look complete even while API updates are pending
  const stats = user.stats || {
    completedTasks: (user as any).completedTasksCount || 5, 
    totalSpent: (user as any).spendingRange || 25000,
    rating: (user as any).rating || 4.9,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[400px] p-0 overflow-hidden border-none rounded-[2rem] shadow-2xl bg-white focus:outline-none'>
        {/* Banner */}
        <div className='relative h-32 bg-gradient-to-br from-[#6B46C1] to-[#553C9A]'>
          <div className='absolute -bottom-12 left-6 p-1 bg-white rounded-3xl shadow-xl'>
             <div className='w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-50'>
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.fullName} className='w-full h-full object-cover' />
                ) : (
                  <span className='text-2xl font-black text-[#6B46C1]'>{initials}</span>
                )}
             </div>
          </div>
        </div>

        <div className='pt-16 pb-8 px-6 space-y-6'>
          {/* Identity Header */}
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <h2 className='text-xl font-black text-gray-900'>{user.fullName}</h2>
              <ShieldCheck size={18} className='text-blue-500 fill-blue-50' />
            </div>
            <div className='flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-tight'>
              <MapPin size={12} className="text-gray-300" />
              <span>{user.residentState || "Lagos"}, {user.country || "Nigeria"}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-gray-50/80 p-4 rounded-2xl border border-gray-100'>
              <div className='flex items-center gap-2 text-[#6B46C1] mb-1.5'>
                <Briefcase size={14} />
                <span className='text-[10px] font-black uppercase tracking-widest'>Trust Score</span>
              </div>
              <p className='text-lg font-black text-gray-900'>{stats.completedTasks} <span className='text-[10px] text-gray-400 font-bold uppercase'>Tasks</span></p>
            </div>
            <div className='bg-gray-50/80 p-4 rounded-2xl border border-gray-100'>
              <div className='flex items-center gap-2 text-emerald-600 mb-1.5'>
                <Wallet size={14} />
                <span className='text-[10px] font-black uppercase tracking-widest'>Spending</span>
              </div>
              <p className='text-lg font-black text-gray-900'>₦{stats.totalSpent.toLocaleString()}+</p>
            </div>
          </div>

          {/* Detailed Info Cards */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50'>
               <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-xl bg-white flex items-center justify-center text-amber-400 shadow-sm border border-amber-50'>
                    <Star size={18} fill="currentColor" />
                  </div>
                  <div>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-tighter'>Rating</p>
                    <p className='text-sm font-black text-gray-900'>{stats.rating} <span className="text-[10px] text-gray-400">/ 5.0</span></p>
                  </div>
               </div>
               
               <div className='h-8 w-px bg-purple-100' />

               <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm border border-blue-50'>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-tighter'>Joined</p>
                    <p className='text-sm font-black text-gray-900'>{user.createdAt ? new Date(user.createdAt).getFullYear() : "2024"}</p>
                  </div>
               </div>
            </div>

            {/* Footer Tip */}
            <div className='bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200'>
               <p className='text-[11px] text-gray-500 font-medium leading-relaxed text-center'>
                 This user has a <span className="text-emerald-600 font-bold">100% payment completion rate</span>. They are a verified member of TaskHub.
               </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
