"use client";

import { useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Suspense } from "react";
import Loading from "./loading";

export default function MessagesPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "read">(
    "all",
  );
  const searchParams = useSearchParams();

  const userInitials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const displayName = user?.fullName || "User";

  return (
    <Suspense fallback={<Loading />}>
      <div className='p-8'>
        <div className='max-w-6xl mx-auto space-y-8'>
          {/* User Header */}
          <div className='flex items-center gap-4'>
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt='Profile'
                className='h-16 w-16 rounded-full object-cover border border-gray-100'
              />
            ) : (
              <div className='h-16 w-16 rounded-full bg-[#6B46C1] flex items-center justify-center text-white text-xl font-bold'>
                {userInitials}
              </div>
            )}
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                {displayName}
              </h2>
              <p className='text-sm text-gray-600 capitalize'>
                {user?.role || "User"}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
            <input
              type='text'
              placeholder='Search messages'
              className='w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-500'
            />
          </div>

          {/* Filter Tabs */}
          <div className='flex gap-3'>
            {(["all", "unread", "read"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeFilter === filter
                    ? "bg-[#6B46C1] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Empty State */}
          <div className='flex flex-col items-center justify-center py-16'>
            <div className='bg-purple-100 p-6 rounded-full mb-6'>
              <MessageCircle className='h-12 w-12 text-[#6B46C1]' />
            </div>
            <h3 className='text-2xl font-semibold text-gray-900 mb-2'>
              No messages yet
            </h3>
            <p className='text-gray-600 text-center max-w-md mb-6'>
              Start posting tasks and connecting with taskers to begin
              conversations.
            </p>
            <Button className='bg-[#6B46C1] hover:bg-[#553C9A] text-white px-6 py-2 rounded-lg'>
              Post a Task
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
