"use client";

import { useAuth } from "@/hooks/useAuth";

export function DashboardHeader() {
  const { user } = useAuth();
  const userName = user?.fullName || "Welcome";
  const userRole = user?.role === "tasker" ? "Tasker" : "User";
  const userInitial = user?.fullName ? user.fullName[0].toUpperCase() : "U";

  return (
    <div className="flex items-center gap-4 px-8 py-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6B46C1] text-white text-lg font-bold shadow-md shadow-purple-200">
        {userInitial}
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900">{userName}</h1>
        <p className="text-sm font-medium text-gray-500">{userRole}</p>
      </div>
    </div>
  );
}
