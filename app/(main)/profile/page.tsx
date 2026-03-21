"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCompleteProfile } from "@/hooks/useCompleteProfile";
import { ProfileCompletionStep1 } from "@/components/profile/ProfileCompletionStep1";
import { ProfileCompletionStep2 } from "@/components/profile/ProfileCompletionStep2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Wallet,
  Plus,
  Zap,
  ShieldCheck,
  HelpCircle,
  Lock,
  RectangleEllipsis,
  FileQuestion,
  LogOut,
  User as UserIcon,
  Star,
  TrendingUp,
  Briefcase,
  DollarSign,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { FundWalletModal } from "@/components/FundWalletModal";
import { StellarPaymentModal } from "@/components/StellarPaymentModal";
import { WithdrawFundsModal } from "@/components/WithdrawFundsModal";
import { StellarWithdrawalModal } from "@/components/StellarWithdrawalModal";
import { useBanks, useTaskerBankAccount } from "@/hooks/useWithdrawal";
import { useState } from "react";

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
    handlePictureUpload,
  } = useCompleteProfile();

  const { data: bankData } = useTaskerBankAccount();

  // --- Modal States ---
  const [isFundOpen, setIsFundOpen] = useState(false);
  const [isStellarFundOpen, setIsStellarFundOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isStellarWithdrawOpen, setIsStellarWithdrawOpen] = useState(false);
  const [txAmount, setTxAmount] = useState("0.00");

  if (!user && !isLoadingUser && !isUserError) {
    return (
      <div className='p-8 text-center text-gray-500'>
        Please login to view your profile.
      </div>
    );
  }

  // If profile is NOT complete, show the setup flow (only if we're not loading and there's no error)
  if (!isLoadingUser && !isUserError && !isProfileComplete) {
    if (step === 2) {
      return <ProfileCompletionStep2 setStep={setStep} userId={user?._id} />;
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
  const userInitials = (() => {
    if (user?.fullName) {
      return user.fullName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    if (user?.firstName || user?.lastName) {
      const first = user.firstName?.[0] || "";
      const last = user.lastName?.[0] || "";
      return (first + last).toUpperCase() || "U";
    }
    return "U";
  })();

  const userName =
    user?.fullName ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || "User");

  return (
    <div className='p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8 pb-10'>
      <h1 className='text-xl md:text-2xl font-bold text-gray-900'>
        Profile Information
      </h1>

      {/* User Info Card */}
      <Link href='/profile/details'>
        <div className='bg-white border-none shadow-sm rounded-3xl p-4 md:p-6 flex items-center gap-4 md:gap-5 hover:bg-gray-50 transition-colors cursor-pointer group'>
          <div className='w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#6B46C1] flex items-center justify-center text-white text-xl md:text-2xl font-bold border-4 border-white shadow-sm overflow-hidden shrink-0'>
            {isLoadingUser ? (
              <Skeleton className='w-full h-full' />
            ) : user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt='Profile'
                className='w-full h-full object-cover'
              />
            ) : (
              userInitials
            )}
          </div>
          <div className='space-y-0.5 md:space-y-1 min-w-0 flex-1'>
            {isLoadingUser ? (
              <>
                <Skeleton className='h-6 w-full' />
                <Skeleton className='h-4 w-20 mt-1' />
              </>
            ) : (
              <>
                <h2 className='text-lg md:text-xl font-bold text-gray-900 truncate'>
                  {userName}
                </h2>
                <span className='inline-flex bg-purple-100 text-[#6B46C1] text-[8px] md:text-[10px] font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-md uppercase tracking-wider'>
                  {user?.role === "tasker" ? "Tasker" : "User"}
                </span>
              </>
            )}
          </div>
          <div className='ml-2'>
            <ChevronRight
              size={18}
              className='text-gray-300 group-hover:text-[#6B46C1] transition-colors md:w-5 md:h-5'
            />
          </div>
        </div>
      </Link>

      {/* Wallet balance Card (Universal) */}
      <Card className='bg-linear-to-br from-[#673AB7] to-[#512DA8] border-none shadow-xl rounded-[2rem] md:rounded-[2.5rem] overflow-hidden text-white'>
        <CardContent className='p-6 md:p-8 space-y-6 md:space-y-8'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2 opacity-90'>
              <Wallet size={16} className='md:w-[18px] md:h-[18px]' />
              <span className='text-xs md:text-sm font-medium'>
                Wallet balance
              </span>
            </div>
            {user?.role === "tasker" ? (
              <Button
                variant='secondary'
                onClick={() => setIsWithdrawOpen(true)}
                className='bg-white/20 hover:bg-white/30 text-white border-none rounded-xl px-4 md:px-6 h-9 md:h-11 text-xs md:text-base flex items-center gap-2'
              >
                Withdraw
              </Button>
            ) : (
              <Button
                variant='secondary'
                onClick={() => setIsFundOpen(true)}
                className='bg-white/20 hover:bg-white/30 text-white border-none rounded-xl px-4 md:px-6 h-9 md:h-11 text-xs md:text-base flex items-center gap-2'
              >
                <Plus size={16} className='md:w-[18px] md:h-[18px]' /> Fund
              </Button>
            )}
          </div>

          <div className='space-y-0.5 md:space-y-1'>
            <div className='text-3xl md:text-5xl font-black'>
              <span className='text-xl md:text-3xl mr-1'>₦</span>
              {(user?.wallet ?? 0).toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className='text-xs md:text-sm text-white/60 font-medium'>
              Available balance
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bank Account Information (For Taskers with saved bank) */}
      {user?.role === "tasker" && bankData && (
        <div className='bg-white border-2 border-dashed border-purple-200 p-5 md:p-6 rounded-[2rem] space-y-4'>
          <div className='flex items-center justify-between border-b border-purple-50 pb-3'>
            <h3 className='text-[10px] md:text-xs font-black text-purple-900 uppercase tracking-widest flex items-center gap-2'>
              <CreditCard size={14} className='text-[#6B46C1]' />
              SAVED SETTLEMENT BANK
            </h3>
            <CheckCircle2 size={16} className='text-green-500' />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <p className='text-[9px] text-gray-400 font-bold uppercase tracking-tighter'>
                Account Name
              </p>
              <p className='text-sm font-black text-gray-900 leading-tight'>
                {bankData.accountName}
              </p>
            </div>
            <div className='space-y-1'>
              <p className='text-[9px] text-gray-400 font-bold uppercase tracking-tighter'>
                Bank / Number
              </p>
              <div className='flex items-center gap-2'>
                <p className='text-sm font-black text-gray-900'>
                  {bankData.bankName}
                </p>
                <span className='w-1 h-1 bg-gray-300 rounded-full' />
                <p className='text-sm font-black text-gray-600 tracking-widest'>
                  {bankData.accountNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Switch to Users Banner (For Taskers) - Moved below Wallet Card */}
      {user?.role === "tasker" && (
        <div className='bg-[#F5F3FF] border border-purple-100 p-4 md:p-5 rounded-3xl flex items-center justify-between group cursor-pointer shadow-sm'>
          <div className='flex items-center gap-3 md:gap-4'>
            <div className='bg-[#6B46C1] p-2.5 md:p-3 rounded-xl text-white'>
              <UserIcon size={20} className='md:w-[22px] md:h-[22px]' />
            </div>
            <div>
              <h3 className='font-bold text-sm md:text-base text-gray-900'>
                Switch to Users
              </h3>
              <p className='text-[10px] md:text-xs text-[#6B46C1]'>
                Post task and hire taskers
              </p>
            </div>
          </div>
          <ChevronRight size={18} className='text-[#6B46C1] md:w-5 md:h-5' />
        </div>
      )}

      {/* Tasker Stats Section */}
      {user?.role === "tasker" && (
        <div className='space-y-4 md:space-y-6'>
          <h3 className='text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest'>
            TASKER STATISTICS
          </h3>
          <div className='grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4'>
            <StatCard
              icon={
                <Briefcase
                  size={16}
                  className='text-[#6B46C1] md:w-[18px] md:h-[18px]'
                />
              }
              label='Task completed'
              value='0'
              color='bg-purple-50'
            />
            <StatCard
              icon={
                <Star
                  size={16}
                  className='text-orange-400 md:w-[18px] md:h-[18px]'
                />
              }
              label='Ratings'
              value='0'
              color='bg-orange-50'
            />
            <StatCard
              icon={
                <Wallet
                  size={16}
                  className='text-green-500 md:w-[18px] md:h-[18px]'
                />
              }
              label='Wallet Balance'
              value={`#${(user?.wallet ?? 0).toLocaleString()}`}
              color='bg-green-50'
            />
            <StatCard
              icon={
                <TrendingUp
                  size={16}
                  className='text-blue-600 md:w-[18px] md:h-[18px]'
                />
              }
              label='Success Rate'
              value='95%'
              color='bg-blue-50'
            />
          </div>
        </div>
      )}

      {/* Actions List */}
      <div className='space-y-4'>
        {/* Become a tasker (Only for regular users) */}
        {user?.role === "user" && (
          <Link href='/profile/become-tasker'>
            <div className='bg-white hover:bg-gray-50 transition-colors p-4 md:p-5 rounded-3xl flex items-center justify-between group cursor-pointer shadow-sm border border-gray-50 mb-4 md:mb-6'>
              <div className='flex items-center gap-3 md:gap-4'>
                <div className='bg-purple-100 p-2.5 md:p-3 rounded-xl text-[#6B46C1]'>
                  <Zap
                    size={20}
                    fill='currentColor'
                    className='md:w-[22px] md:h-[22px]'
                  />
                </div>
                <div>
                  <p className='font-bold text-sm md:text-base text-gray-900'>
                    Become a tasker
                  </p>
                  <p className='text-[10px] md:text-xs text-gray-400'>
                    Create and switch to being a tasker
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className='text-gray-300 group-hover:text-[#6B46C1] transition-colors md:w-5 md:h-5'
              />
            </div>
          </Link>
        )}

        {/* Other menu items */}
        <div className='bg-white border border-gray-50 rounded-[2rem] md:rounded-[2.5rem] shadow-sm divide-y divide-gray-50 overflow-hidden'>
          {user?.role === "tasker" && (
            <ProfileMenuItem
              icon={
                <DollarSign size={20} className='md:w-[22px] md:h-[22px]' />
              }
              label='Earnings'
              href='/profile/earnings'
              amount={`#${(user?.wallet ?? 0).toLocaleString()}`}
              iconColor='text-green-600'
              iconBg='bg-green-50'
            />
          )}
          {user?.role === "tasker" && (
            <ProfileMenuItem
              icon={<Briefcase size={20} className='md:w-[22px] md:h-[22px]' />}
              label='Service categories'
              href='/profile/become-tasker'
              iconColor='text-[#6B46C1]'
              iconBg='bg-purple-50'
            />
          )}
          <ProfileMenuItem
            icon={<Lock size={20} className='md:w-[22px] md:h-[22px]' />}
            label='Transaction Pin'
            href='/profile/transaction-pin'
          />
          <ProfileMenuItem
            icon={
              <RectangleEllipsis
                size={20}
                className='md:w-[22px] md:h-[22px]'
              />
            }
            label='Change password'
            href='/profile/change-password'
          />
          <ProfileMenuItem
            icon={<ShieldCheck size={20} className='md:w-[22px] md:h-[22px]' />}
            label='Verification'
            href='/profile/verification'
          />
          <ProfileMenuItem
            icon={<HelpCircle size={20} className='md:w-[22px] md:h-[22px]' />}
            label='Get Help'
            href='/profile/get-help'
          />
          <ProfileMenuItem
            icon={
              <FileQuestion size={20} className='md:w-[22px] md:h-[22px]' />
            }
            label='FAQ'
            href='/profile/faq'
          />
        </div>

        {/* Logout */}
        <div className='bg-white border border-gray-50 rounded-[2rem] shadow-sm overflow-hidden mt-6'>
          <button
            onClick={logout}
            className='w-full flex items-center justify-between p-5 md:p-6 hover:bg-red-50 transition-colors group'
          >
            <div className='flex items-center gap-4 md:gap-5'>
              <div className='bg-red-50 p-2.5 rounded-xl text-red-500'>
                <LogOut size={20} className='md:w-[22px] md:h-[22px]' />
              </div>
              <span className='font-bold text-sm md:text-base text-red-500'>
                Log out
              </span>
            </div>
            <ChevronRight
              size={18}
              className='text-gray-300 group-hover:text-red-500 transition-colors md:w-5 md:h-5'
            />
          </button>
        </div>
      </div>

      {/* Modals */}
      <FundWalletModal
        isOpen={isFundOpen}
        onClose={() => setIsFundOpen(false)}
        balance={(user?.wallet ?? 0).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        onSwitchToStellar={(amount) => {
          setTxAmount(amount);
          setIsFundOpen(false);
          setIsStellarFundOpen(true);
        }}
      />

      <StellarPaymentModal
        isOpen={isStellarFundOpen}
        onClose={() => setIsStellarFundOpen(false)}
        onCancel={() => {
          setIsStellarFundOpen(false);
          setIsFundOpen(true);
        }}
        onContinue={() => {
          console.log("Stellar payment continued");
          setIsStellarFundOpen(false);
        }}
      />

      <WithdrawFundsModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        balance={(user?.wallet ?? 0).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        onSwitchToStellar={(amount) => {
          setTxAmount(amount);
          setIsWithdrawOpen(false);
          setIsStellarWithdrawOpen(true);
        }}
      />

      <StellarWithdrawalModal
        isOpen={isStellarWithdrawOpen}
        onClose={() => setIsStellarWithdrawOpen(false)}
        amount={txAmount}
        onWithdraw={(address) => {
          console.log("Withdrawing to Stellar address:", address);
          setIsStellarWithdrawOpen(false);
        }}
      />
    </div>
  );
}

function ProfileMenuItem({
  icon,
  label,
  href,
  amount,
  iconColor = "text-gray-400",
  iconBg = "bg-gray-50",
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  amount?: string;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <Link
      href={href}
      className='flex items-center justify-between p-5 md:p-6 hover:bg-gray-50 transition-colors group'
    >
      <div className='flex items-center gap-4 md:gap-5'>
        <div
          className={cn(
            "p-2.5 rounded-xl transition-colors",
            iconBg,
            iconColor,
          )}
        >
          {icon}
        </div>
        <span className='font-bold text-sm md:text-base text-gray-700'>
          {label}
        </span>
      </div>
      <div className='flex items-center gap-3'>
        {amount && (
          <span className='text-gray-900 font-bold text-sm md:text-base'>
            {amount}
          </span>
        )}
        <ChevronRight
          size={20}
          className='text-gray-300 group-hover:text-[#6B46C1] transition-colors w-4 h-4 md:w-5 md:h-5'
        />
      </div>
    </Link>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass?: string;
  color: string;
}) {
  return (
    <Card className='bg-white border border-gray-100 shadow-sm rounded-xl p-4 md:p-6 transition-all hover:border-purple-100'>
      <div className='flex flex-col space-y-4'>
        <div className={`${color} p-2 rounded-xl w-fit`}>{icon}</div>
        <div className='space-y-1'>
          <p className='text-2xl font-black text-gray-900'>{value}</p>
          <p className='text-gray-400 text-xs font-bold tracking-tight'>
            {label}
          </p>
        </div>
      </div>
    </Card>
  );
}
