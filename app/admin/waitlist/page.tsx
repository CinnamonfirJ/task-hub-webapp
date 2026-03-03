"use client";

import { useEffect, useState } from "react";
import { Search, Users, Download, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import { useWaitlist } from "@/hooks/useWaitlist";
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";

export default function WaitlistManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Local state for waitlist for "Load more" functionality
  const [visibleItems, setVisibleItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(false);

  // Fetch waitlist with search
  const { data: waitlistData, isLoading } = useWaitlist({
    page,
    limit,
    search: searchQuery,
  });

  // Update visible items when new data comes in
  useEffect(() => {
    if (waitlistData?.waitlist) {
      if (page === 1) {
        setVisibleItems(waitlistData.waitlist);
      } else {
        setVisibleItems((prev) => {
          const existingIds = new Set(prev.map((item) => item._id));
          const newItems = waitlistData.waitlist.filter(
            (item) => !existingIds.has(item._id),
          );
          return [...prev, ...newItems];
        });
      }
      setHasMore(waitlistData.pagination?.hasNext ?? false);
    }
  }, [waitlistData, page]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Email,Joined At\n" +
      visibleItems
        .map((item) => `${item._id},${item.email},${item.createdAt}`)
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
            disabled={visibleItems.length === 0}
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
              {waitlistData?.pagination?.totalItems || 0}
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
                  {visibleItems.map((item) => (
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
                  {!isLoading && visibleItems.length === 0 && (
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

              {hasMore && (
                <div className='p-6 flex justify-center border-t border-gray-100'>
                  <Button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className='bg-[#6B46C1] hover:bg-[#553C9A] text-white px-8 rounded-lg text-sm font-semibold h-10 transition-colors'
                  >
                    {isLoading ? (
                      <Loader2 size={18} className='animate-spin mr-2' />
                    ) : null}
                    Load more
                  </Button>
                </div>
              )}
            </ExpandableTableContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
