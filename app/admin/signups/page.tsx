"use client";

import { useState } from "react";
import {
  Users,
  UserCircle2,
  Loader2,
  AlertCircle,
  User,
  Briefcase,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import { useTodaySignups } from "@/hooks/useAdmin";

export default function SignupsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, refetch } = useTodaySignups();

  const signups = data?.list || [];
  const count = data?.totalSignupsToday || 0;

  const filteredSignups = signups.filter((signup) => {
    // Search filter
    const matchesSearch = 
      signup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      signup.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Type filter
    if (activeFilter === "Users") return signup.role.toLowerCase() === "user";
    if (activeFilter === "Taskers") return signup.role.toLowerCase() === "tasker";
    
    return true;
  });

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return "—";
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-purple-600' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-8 text-center'>
        <div className="bg-white border border-gray-100 rounded-[2rem] p-10 max-w-lg mx-auto">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-500 w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Failed to load signups</h1>
          <p className="text-gray-500 mb-8">
            There was an error fetching today's signups data. Please try again.
          </p>
          <Button
            onClick={() => refetch()}
            className='bg-[#6B46C1] hover:bg-[#553C9A] text-white px-8 h-12 rounded-xl font-bold'
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Page Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Today&apos;s Signups</h1>
        <p className='text-sm text-gray-500 mt-1'>
          Monitor real-time registrations for today
        </p>
      </div>

      {/* KPI Card */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='border border-gray-100 rounded-sm bg-white'>
          <CardContent className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='p-3 bg-purple-100 rounded-2xl text-purple-600'>
                <Users size={24} />
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>Today&apos;s Total Signups</p>
                <h3 className='text-3xl font-bold text-gray-900'>{count}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className='border border-gray-100 rounded-sm bg-white overflow-hidden'>
        <CardContent className='p-0'>
          {/* Filters & Search */}
          <div className='p-6 border-b border-gray-50'>
            <AdminSearchFilter
              searchPlaceholder='Search by name or email...'
              searchTerm={searchQuery}
              filterOptions={["All", "Users", "Taskers"]}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onSearch={setSearchQuery}
            />
          </div>

          {/* Table */}
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='border-b border-gray-50 bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>
                  <th className='px-6 py-4'>#</th>
                  <th className='px-6 py-4'>Name & Email</th>
                  <th className='px-6 py-4'>Account Type</th>
                  <th className='px-6 py-4'>Signup Time</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {filteredSignups.length === 0 ? (
                  <tr>
                    <td colSpan={4} className='px-6 py-20 text-center'>
                      <div className='flex flex-col items-center justify-center text-gray-400'>
                        <UserCircle2 size={48} className='opacity-10 mb-4' />
                        <p className='font-medium'>No signups found today</p>
                        {searchQuery && <p className='text-xs mt-1'>Try adjusting your search or filters</p>}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSignups.map((signup, idx) => (
                    <tr key={signup.id} className='hover:bg-gray-50/50 transition-colors'>
                      <td className='px-6 py-4 text-sm text-gray-400 font-medium'>
                        {idx + 1}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden'>
                            <User size={18} />
                          </div>
                          <div>
                            <p className='text-sm font-bold text-gray-900'>{signup.name}</p>
                            <p className='text-xs text-gray-500'>{signup.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          {signup.role.toLowerCase() === "tasker" ? (
                            <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold uppercase'>
                              <Briefcase size={12} />
                              Tasker
                            </div>
                          ) : (
                            <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase'>
                              <User size={12} />
                              User
                            </div>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                          <Clock size={14} className='text-gray-400' />
                          {formatTime(signup.signupTime)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
