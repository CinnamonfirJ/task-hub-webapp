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
  LogOut 
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  // Use useCompleteProfile to get the step and completion status
  // Note: We use useAuth for logout as useCompleteProfile doesn't expose it
  const { user, isLoadingUser, logout } = useAuth();
  const { 
      isProfileComplete, 
      step, 
      setStep,
      form, 
      handleNext, 
      handleVerify, 
      handlePictureUpload,
      isVerifying 
  } = useCompleteProfile();

  if (isLoadingUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-[#6B46C1]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-500">
        Please login to view your profile.
      </div>
    );
  }

  // If profile is NOT complete, show the setup flow
  if (!isProfileComplete) {
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
  const userInitials = user.fullName
    ? user.fullName.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-10">
      <h1 className="text-2xl font-bold text-gray-900">Profile Information</h1>

      {/* User Info Card */}
      <div className="bg-white border-none shadow-sm rounded-3xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[#6B46C1] flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-sm overflow-hidden">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : userInitials}
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
          <span className="inline-flex bg-purple-100 text-[#6B46C1] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
            {user.role === 'tasker' ? 'Tasker' : 'User'}
          </span>
        </div>
      </div>

      {/* Wallet balance Card */}
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

      {/* Actions List */}
      <div className="space-y-4">
        {/* Become a tasker (Only for regular users) */}
        {user.role === 'user' && (
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
                icon={<Lock size={22} />} 
                label="Change password" 
                href="/profile/change-password" 
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

function ProfileMenuItem({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group">
        <div className="flex items-center gap-5">
            <div className="bg-gray-50 p-2.5 rounded-xl text-gray-400 group-hover:bg-purple-50 group-hover:text-[#6B46C1] transition-colors">
                {icon}
            </div>
            <span className="font-bold text-gray-700">{label}</span>
        </div>
        <ChevronRight size={20} className="text-gray-300 group-hover:text-[#6B46C1] transition-colors" />
    </Link>
  );
}
