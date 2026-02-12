"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCompleteProfile } from "@/hooks/useCompleteProfile";
import { ProfileCompletionStep1 } from "@/components/profile/ProfileCompletionStep1";
import { ProfileCompletionStep2 } from "@/components/profile/ProfileCompletionStep2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Loader2, 
  ChevronRight, 
  Wallet, 
  Plus, 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  Lock, 
  FileQuestion, 
  LogOut,
  User as UserIcon,
  Star,
  Activity,
  History,
  TrendingUp,
  Briefcase,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  // Use useCompleteProfile to get the step and completion status
  // Note: We use useAuth for logout as useCompleteProfile doesn't expose it
  const { user, isLoadingUser, isUserError, logout } = useAuth();
  const { 
      isProfileComplete, 
      step, 
      setStep,
      form, 
      handleNext, 
      handleVerify, 
      handlePictureUpload,
      isVerifying 
  } = useCompleteProfile() as any;


  if (!user && !isLoadingUser && !isUserError) {
    return (
      <div className="p-8 text-center text-gray-500">
        Please login to view your profile.
      </div>
    );
  }

  // If profile is NOT complete, show the setup flow (only if we're not loading and there's no error)
  if (!isLoadingUser && !isUserError && !isProfileComplete) {
      if (step === 2) {
          return (
            <ProfileCompletionStep2 
                form={form}
                handleVerify={handleVerify}
                setStep={setStep}
                isVerifying={isVerifying}
            />
          );
      }
      return (
        <ProfileCompletionStep1 
            form={form}
            handleNext={handleNext}
            handlePictureUpload={handlePictureUpload}
            user={user}
        />
      );
  }

  // --- Completed Profile View ---
  const userInitials = user?.fullName
    ? user.fullName.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-10">
      <h1 className="text-2xl font-bold text-gray-900">Profile Information</h1>

      {/* User Info Card */}
      <Link href="/profile/details">
        <div className="bg-white border-none shadow-sm rounded-3xl p-6 flex items-center gap-5 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-16 h-16 rounded-full bg-[#6B46C1] flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-sm overflow-hidden">
            {isLoadingUser ? (
                <Skeleton className="w-full h-full" />
            ) : user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : userInitials}
            </div>
            <div className="space-y-1 w-full max-w-[200px]">
            {isLoadingUser ? (
                <>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-20" />
                </>
            ) : (
                <>
                <h2 className="text-xl font-bold text-gray-900">{user?.fullName || "User"}</h2>
                <span className="inline-flex bg-purple-100 text-[#6B46C1] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {user?.role === 'tasker' ? 'Tasker' : 'User'}
                </span>
                </>
            )}
            </div>
            <div className="ml-auto">
                <ChevronRight size={20} className="text-gray-300 group-hover:text-[#6B46C1] transition-colors" />
            </div>
        </div>
      </Link>

      {/* Switch to Users Banner (For Taskers) */}
      {user?.role === 'tasker' && (
          <div className="bg-[#F5F3FF] border border-purple-100 p-5 rounded-3xl flex items-center justify-between group cursor-pointer shadow-sm">
            <div className="flex items-center gap-4">
                <div className="bg-[#6B46C1] p-3 rounded-xl text-white">
                    <UserIcon size={22} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Switch to Users</h3>
                    <p className="text-xs text-purple-400">Post task and hire taskers</p>
                </div>
            </div>
            <ChevronRight size={20} className="text-[#6B46C1]" />
          </div>
      )}

      {/* Wallet balance or Tasker Stats */}
      {user?.role === 'tasker' ? (
        <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">TASKER STATISTICS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard icon={<Briefcase size={18} className="text-[#6B46C1]" />} label="Task completed" value="0" color="bg-purple-50" />
                <StatCard icon={<Star size={18} className="text-orange-400" />} label="Ratings" value="0" color="bg-orange-50" />
                <StatCard icon={<Wallet size={18} className="text-green-500" />} label="Wallet Balance" value="#0" color="bg-green-50" />
                <StatCard icon={<TrendingUp size={18} className="text-blue-500" />} label="Success Rate" value="95%" color="bg-blue-50" />
            </div>
        </div>
      ) : (
        <Card className="bg-gradient-to-br from-[#673AB7] to-[#512DA8] border-none shadow-xl rounded-[2.5rem] overflow-hidden text-white">
            <CardContent className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 opacity-90">
                    <Wallet size={18} />
                    <span className="text-sm font-medium">Wallet balance</span>
                </div>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none rounded-xl px-6 flex items-center gap-2">
                    <Plus size={18} /> Fund
                </Button>
            </div>
            
            <div className="space-y-1">
                <div className="text-5xl font-black">
                <span className="text-3xl mr-1">₦</span>0.00
                </div>
                <p className="text-sm text-white/60 font-medium">Available balance</p>
            </div>
            </CardContent>
        </Card>
      )}

      {/* Actions List */}
      <div className="space-y-4">
        {/* Become a tasker (Only for regular users) */}
        {user?.role === 'user' && (
          <Link href="/profile/become-tasker">
            <div className="bg-white hover:bg-gray-50 transition-colors p-5 rounded-3xl flex items-center justify-between group cursor-pointer shadow-sm border border-gray-50 mb-6">
                <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-xl text-[#6B46C1]">
                        <Zap size={22} fill="currentColor" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">Become a tasker</p>
                        <p className="text-xs text-gray-400">Create and switch to being a tasker</p>
                    </div>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-[#6B46C1] transition-colors" />
            </div>
          </Link>
        )}

        {/* Other menu items */}
        <div className="bg-white border border-gray-50 rounded-[2.5rem] shadow-sm divide-y divide-gray-50 overflow-hidden">
            {user?.role === 'tasker' && (
                <ProfileMenuItem 
                    icon={<DollarSign size={22} />} 
                    label="Earnings" 
                    href="/profile/earnings" 
                    amount="#0"
                />
            )}
            {user?.role === 'tasker' && (
                <ProfileMenuItem 
                    icon={<Briefcase size={22} />} 
                    label="Service categories" 
                    href="/profile/become-tasker" 
                />
            )}
            <ProfileMenuItem 
                icon={<Lock size={22} />} 
                label="Change password" 
                href="/profile/change-password" 
            />
            <ProfileMenuItem 
                icon={<ShieldCheck size={22} />} 
                label="Verification" 
                href="/profile/verification" 
            />
            <ProfileMenuItem 
                icon={<HelpCircle size={22} />} 
                label="Get Help" 
                href="/profile/get-help" 
            />
            <ProfileMenuItem 
                icon={<FileQuestion size={22} />} 
                label="FAQ" 
                href="/profile/faq" 
            />
        </div>

        {/* Logout */}
        <div className="bg-white border border-gray-50 rounded-[2rem] shadow-sm overflow-hidden mt-6">
            <button 
                onClick={logout}
                className="w-full flex items-center justify-between p-5 hover:bg-red-50 transition-colors group"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-red-50 p-3 rounded-xl text-red-500">
                        <LogOut size={22} />
                    </div>
                    <span className="font-bold text-red-500">Log out</span>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-red-500 transition-colors" />
            </button>
        </div>
      </div>
    </div>
  );
}

function ProfileMenuItem({ icon, label, href, amount }: { icon: React.ReactNode, label: string, href: string, amount?: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group">
        <div className="flex items-center gap-5">
            <div className="bg-gray-50 p-2.5 rounded-xl text-gray-400 group-hover:bg-purple-50 group-hover:text-[#6B46C1] transition-colors">
                {icon}
            </div>
            <span className="font-bold text-gray-700">{label}</span>
        </div>
        <div className="flex items-center gap-3">
            {amount && <span className="text-gray-900 font-bold">{amount}</span>}
            <ChevronRight size={20} className="text-gray-300 group-hover:text-[#6B46C1] transition-colors" />
        </div>
    </Link>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, colorClass?: string, color: string }) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 transition-all hover:border-purple-100">
        <div className="flex flex-col space-y-4">
            <div className={`${color} p-2 rounded-xl w-fit`}>
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-2xl font-black text-gray-900">{value}</p>
                <p className="text-gray-400 text-xs font-bold tracking-tight">{label}</p>
            </div>
        </div>
    </Card>
  );
}
