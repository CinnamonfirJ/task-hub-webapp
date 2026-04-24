"use client";

import { useEffect, useState } from "react";
import { Search, Users, Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import { useWaitlist } from "@/hooks/useWaitlist";
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";

export default function WaitlistManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Fetch waitlist with search
  const { data: waitlistData, isLoading } = useWaitlist({
    page,
    limit,
    search: searchQuery,
  });

  const waitlistItems = waitlistData?.data || [];
  const totalRecords = waitlistData?.count || 0;
  const totalPages = Math.ceil(totalRecords / limit);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Email,Joined At\n" +
      waitlistItems
        .map((item: any) => `${item._id},${item.email},${item.createdAt}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `waitlist_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Waitlist Management
          </h1>
          <p className='text-sm text-gray-500'>
            View and manage emails currently on the waitlist
          </p>
        </div>
        <div className='flex gap-3'>
          <Button
            onClick={handleExport}
            variant='outline'
            className='text-sm h-10 px-4 gap-2'
            disabled={waitlistItems.length === 0}
          >
            <Download size={16} />
            Export CSV
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='border-none shadow-sm'>
          <CardContent className='p-4 text-center'>
            <div className='text-xl font-bold text-[#6B46C1]'>
              {waitlistData?.count || 0}
            </div>
            <div className='text-[10px] mt-1 font-semibold uppercase tracking-wider text-gray-500'>
              Total Waitlist Entries
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='border-none shadow-sm overflow-hidden'>
        <CardContent className='p-0'>
          <div className='p-6 border-b border-gray-100'>
            <AdminSearchFilter
              searchPlaceholder='Search email...'
              searchTerm={searchQuery}
              onSearch={handleSearch}
              // Waitlist doesn't need complex filters for now
              filterOptions={["All"]}
              activeFilter='All'
              onFilterChange={() => {}}
            />
          </div>

          <div className='overflow-x-auto relative'>
            {isLoading && page === 1 && (
              <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
              </div>
            )}
            <ExpandableTableContainer>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-y bg-gray-50/30 text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                    <th className='px-6 py-4'>EMAIL ADDRESS</th>
                    <th className='px-6 py-4'>JOINED AT</th>
                    <th className='px-6 py-4 text-right'>ID</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {waitlistItems.map((item) => (
                    <tr
                      key={item._id}
                      className='group hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-4'>
                        <div className='font-bold text-gray-900'>
                          {item.email}
                        </div>
                      </td>
                      <td className='px-6 py-4 text-xs font-bold text-gray-900'>
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className='px-6 py-4 text-right text-[10px] text-gray-400 font-mono'>
                        {item._id}
                      </td>
                    </tr>
                  ))}
                  {!isLoading && waitlistItems.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className='py-20 text-center text-gray-400 font-medium'
                      >
                        <Users size={40} className='mx-auto mb-4 opacity-20' />
                        <p>No entries found on the waitlist</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <AdminPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalRecords={totalRecords}
                label='entries'
              />
            </ExpandableTableContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
