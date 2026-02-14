"use client";

import { useAuth } from "@/hooks/useAuth";

export function DashboardHeader() {
  const { user } = useAuth();
  const userName = user?.fullName || "Welcome";
  const userRole = user?.role === "tasker" ? "Tasker" : "User";
  const userInitial = user?.fullName ? user.fullName[0].toUpperCase() : "U";

  return (
    <div className='flex items-center gap-4 px-8 py-6'>
      <div className='h-12 w-12 rounded-full overflow-hidden shadow-md shadow-purple-200 border border-gray-100'>
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt='Profile'
            className='h-full w-full object-cover'
          />
        ) : (
          <div className='h-full w-full flex items-center justify-center bg-[#6B46C1] text-white text-lg font-bold'>
            {userInitial}
          </div>
        )}
      </div>
      <div>
        <h1 className='text-xl font-bold text-gray-900'>{userName}</h1>
        <p className='text-sm font-medium text-gray-500'>{userRole}</p>
      </div>
    </div>
  );
}
