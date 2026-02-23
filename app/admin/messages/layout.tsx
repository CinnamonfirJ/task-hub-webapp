"use client";

import { useState } from "react";
import { Search, Download, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";

const messageMetrics = [
  { label: "Total Conversations", value: "14" },
  { label: "Total Messages", value: "14" },
  { label: "Unread Messages", value: "14" },
];

const conversations = [
  {
    id: "1",
    participants: "fatima.h@example.com ↔ adebayo.j@example.com",
    preview: "Hi, are you available to fix my kitchen sink this week?",
    date: "1/29/2026, 10:41:44 AM",
    unreadCount: 1,
  },
  {
    id: "2",
    participants: "fatima.h@example.com ↔ adebayo.j@example.com",
    preview: "Hi, are you available to fix my kitchen sink this week?",
    date: "1/29/2026, 10:41:44 AM",
    unreadCount: 1,
  },
  {
    id: "3",
    participants: "fatima.h@example.com ↔ adebayo.j@example.com",
    preview: "Hi, are you available to fix my kitchen sink this week?",
    date: "1/29/2026, 10:41:44 AM",
    unreadCount: 1,
  },
  {
    id: "4",
    participants: "fatima.h@example.com ↔ adebayo.j@example.com",
    preview: "Hi, are you available to fix my kitchen sink this week?",
    date: "1/29/2026, 10:41:44 AM",
    unreadCount: 1,
  },
];

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const pathname = usePathname();

  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto'>
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Messages & Conversations
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Monitor user conversations (read-only)
          </p>
        </div>
        <div className='flex gap-18 md:gap-3'>
          <Button
            variant='outline'
            className='text-sm h-10 px-4 gap-2 border-gray-200'
          >
            Default
          </Button>
          <Button
            variant='outline'
            className='text-sm h-10 px-4 gap-2 border-gray-200'
          >
            <Download size={16} /> Export
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {messageMetrics.map((metric, idx) => (
          <Card
            key={idx}
            className='border border-gray-100 shadow-sm rounded-2xl'
          >
            <CardContent className='p-6'>
              <div className='text-sm text-gray-500 font-medium mb-2'>
                {metric.label}
              </div>
              <div className='text-2xl md:text-3xl font-bold text-gray-900'>
                {metric.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='relative w-full md:w-[450px]'>
          <Input
            placeholder='Search name or email...'
            className='h-11 bg-gray-50/50 border border-gray-100 focus-visible:ring-1 focus-visible:ring-purple-200 rounded-xl text-sm'
          />
        </div>
        <div className='flex items-center gap-2 overflow-x-auto pb-2 md:pb-0'>
          {["All", "Unread", "Read"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-6 h-[800px]'>
        {/* Left Sidebar - Conversations List */}
        <Card className='w-full md:w-[350px] lg:w-[400px] border border-gray-100 shadow-sm rounded-2xl flex flex-col h-full bg-white shrink-0'>
          <div className='p-4 border-b border-gray-50 shrink-0'>
            <div className='relative'>
              <Input
                placeholder='Search Conversations'
                className='h-10 bg-gray-50/50 border border-gray-100 focus-visible:ring-1 focus-visible:ring-purple-200 rounded-xl text-sm w-full'
              />
            </div>
          </div>
          <div className='flex-1 overflow-y-auto p-4 space-y-3'>
            {conversations.map((conv) => {
              const isActive = pathname === `/admin/messages/${conv.id}`;

              return (
                <Link key={conv.id} href={`/admin/messages/${conv.id}`}>
                  <div
                    className={`p-4 rounded-xl border transition-colors ${
                      isActive
                        ? "border-[#6B46C1] bg-purple-50/30"
                        : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <div className='font-bold text-sm text-gray-900 leading-tight'>
                        {conv.participants}
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className='w-5 h-5 rounded-full bg-[#6B46C1] text-white flex items-center justify-center text-[10px] font-bold shrink-0'>
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                    <p className='text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed'>
                      {conv.preview}
                    </p>
                    <div className='text-[10px] text-gray-400 font-medium mt-3'>
                      {conv.date}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Right Content Area */}
        <div className='flex-1 min-w-0 h-full'>
          <Card className='h-full border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white'>
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
}
