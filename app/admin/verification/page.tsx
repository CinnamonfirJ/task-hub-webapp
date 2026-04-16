"use client";

import { useState } from "react";
import {
  Download,
  Loader2,
  ExternalLink,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import Link from "next/link";
import { useKYCRequests, useKYCStats } from "@/hooks/useAdmin";
import { ExportModal } from "@/components/admin/ExportModal";

export default function KYCManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const limit = 20;

  const statusParam =
    activeFilter === "All"
      ? undefined
      : (activeFilter.toLowerCase() as "pending" | "approved" | "rejected");

  const { data: kycStats } = useKYCStats();
  const { data: kycData, isLoading } = useKYCRequests({
    status: statusParam,
    page,
    limit,
  });

  const records = kycData?.records ?? [];
  const pagination = kycData?.pagination;

  const summaryMetrics = [
    {
      label: "Total Submissions",
      value: kycStats?.total?.toLocaleString() || "0",
    },
    {
      label: "Pending Review",
      value: kycStats?.pending?.toLocaleString() || "0",
      color: "text-yellow-500",
    },
    {
      label: "Approved",
      value: kycStats?.approved?.toLocaleString() || "0",
      color: "text-green-500",
    },
    {
      label: "Rejected",
      value: kycStats?.rejected?.toLocaleString() || "0",
      color: "text-red-500",
    },
  ];

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            KYC / Verification Management
          </h1>
          <p className='text-sm text-gray-500'>
            Review and manage identity verifications
          </p>
        </div>
        <Button 
          variant='outline' 
          className='text-sm h-10 px-4 gap-2'
          onClick={() => setIsExportModalOpen(true)}
        >
          <Download size={16} /> Export
        </Button>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {summaryMetrics.map((metric, idx) => (
          <Card key={idx} className='border-none shadow-sm'>
            <CardContent className='p-4'>
              <div
                className={`text-xl font-bold ${metric.color || "text-gray-900"}`}
              >
                {metric.value}
              </div>
              <div className='text-[10px] mt-1 font-semibold uppercase tracking-wider text-gray-500'>
                {metric.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className='border-none shadow-sm overflow-hidden'>
        <CardContent className='p-0'>
          <div className='p-6 border-b border-gray-100'>
            <AdminSearchFilter
              searchPlaceholder='Search submissions...'
              filterOptions={["All", "Pending", "Approved", "Rejected"]}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className='overflow-x-auto min-h-[400px] relative'>
            {isLoading && (
              <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
              </div>
            )}

            <table className='w-full text-left text-sm'>
              <thead>
                <tr className='border-y bg-gray-50/30 text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                  <th className='px-6 py-4'>USER</th>
                  <th className='px-6 py-4'>NIN</th>
                  <th className='px-6 py-4'>STATUS</th>
                  <th className='px-6 py-4'>DATE</th>
                  <th className='px-6 py-4 text-right'>ACTION</th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {records.map((record) => (
                  <tr
                    key={record._id}
                    className='group hover:bg-gray-50 transition-colors'
                  >
                    <td className='px-6 py-4'>
                      <div>
                        <div className='font-bold text-gray-900'>
                          {record.user?.fullName || 
                           (record.user?.firstName ? `${record.user.firstName} ${record.user.lastName || ""}`.trim() : "N/A")}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {record.user?.emailAddress || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-gray-500 font-mono text-xs'>
                      {record.maskedNin || record.nin || "N/A"}
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                          record.status === "approved"
                            ? "bg-green-50 text-green-500"
                            : record.status === "pending"
                              ? "bg-yellow-50 text-yellow-500"
                              : "bg-red-50 text-red-500"
                        }`}
                      >
                        {record.status.charAt(0).toUpperCase() +
                          record.status.slice(1)}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-xs text-gray-500'>
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400'
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-44'>
                          <Link href={`/admin/verification/${record._id}`}>
                            <DropdownMenuItem className='gap-2 cursor-pointer'>
                              <ExternalLink size={14} /> View Details
                            </DropdownMenuItem>
                          </Link>
                          {record.status === "pending" && (
                            <>
                              <DropdownMenuItem className='gap-2 cursor-pointer text-green-600 focus:text-green-600'>
                                <CheckCircle size={14} /> Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className='gap-2 cursor-pointer text-red-600 focus:text-red-600'>
                                <XCircle size={14} /> Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {!isLoading && records.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className='py-12 text-center text-gray-400 font-medium'
                    >
                      No KYC submissions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className='flex items-center justify-between px-6 py-4 border-t border-gray-100'>
              <p className='text-xs text-gray-500'>
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrev}
                  className='h-8 w-8 p-0'
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNext}
                  className='h-8 w-8 p-0'
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        type="taskers"
      />
    </div>
  );
}
