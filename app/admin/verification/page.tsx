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
  X,
  Eye,
  Copy,
} from "lucide-react";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import Link from "next/link";
import { useKYCRequests, useKYCStats, useApproveKYC, useRejectKYC } from "@/hooks/useAdmin";
import { ExportModal } from "@/components/admin/ExportModal";
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";
import { useRouter } from "next/navigation";

export default function KYCManagementPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [approveNotes, setApproveNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const limit = 20;

  const statusParam =
    activeFilter === "All"
      ? undefined
      : (activeFilter.toLowerCase() as "pending" | "approved" | "rejected");

  const { data: kycStats } = useKYCStats();
  const { data: kycData, isLoading, error } = useKYCRequests({
    status: statusParam,
    page,
    limit: searchTerm ? 100 : limit, // Increase limit when searching to allow client-side filter to find more
  });
  
  const { mutate: approve, isPending: isApproving } = useApproveKYC();
  const { mutate: reject, isPending: isRejecting } = useRejectKYC();

  const rawRecords = kycData?.records ?? [];
  
  // Client-side filtering fallback: 
  // If the server returns results, we show them. 
  // If the server doesn't support the specific field search (like name/email), 
  // this ensures we still filter what we have.
  const records = searchTerm 
    ? rawRecords.filter(record => {
        const term = searchTerm.toLowerCase();
        
        // User Info
        const firstName = (record.user?.firstName || "").toLowerCase();
        const lastName = (record.user?.lastName || "").toLowerCase();
        const fullName = (record.user?.fullName || `${firstName} ${lastName}`).toLowerCase();
        const email = (record.user?.emailAddress || "").toLowerCase();
        const phone = (record.user?.phoneNumber || "").toLowerCase();
        
        // KYC Info
        const nin = (record.nin || record.nin || "").toLowerCase();
        const status = (record.status || "").toLowerCase();
        const id = (record._id || "").toLowerCase();
        
        return (
          fullName.includes(term) || 
          email.includes(term) || 
          phone.includes(term) || 
          nin.includes(term) ||
          status.includes(term) ||
          id.includes(term)
        );
      })
    : rawRecords;

  const pagination = kycData?.pagination;
  const totalRecords = (kycData as any)?.totalRecords || (kycData as any)?.count || (pagination as any)?.totalRecords || 0;
  const totalPages = (pagination as any)?.totalPages || (kycData as any)?.totalPages || Math.ceil(totalRecords / (searchTerm ? 100 : limit));

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

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setPage(1);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleApprove = () => {
    if (!selectedRecord) return;
    approve(
      { id: selectedRecord._id, notes: approveNotes },
      {
        onSuccess: () => {
          setIsApproveModalOpen(false);
          setApproveNotes("");
          setSelectedRecord(null);
        },
      },
    );
  };

  const handleReject = () => {
    if (!selectedRecord) return;
    reject(
      { id: selectedRecord._id, reason: rejectReason },
      {
        onSuccess: () => {
          setIsRejectModalOpen(false);
          setRejectReason("");
          setSelectedRecord(null);
        },
      },
    );
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
        {/* <Button 
          variant='outline' 
          className='text-sm h-10 px-4 gap-2'
          onClick={() => setIsExportModalOpen(true)}
        >
          <Download size={16} /> Export
        </Button> */}
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
              searchTerm={searchTerm}
              onSearch={handleSearch}
              filterOptions={["All", "Pending", "Approved", "Rejected"]}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className='overflow-x-auto min-h-[400px] relative border-t border-gray-100'>
            {(isLoading || error) && (
              <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
                {isLoading ? (
                  <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
                ) : (
                  <div className='text-center p-6 bg-white rounded-xl shadow-lg border border-red-50 max-w-sm mx-auto'>
                    <div className='w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <div className='w-6 h-6 text-red-500 font-bold'>!</div>
                    </div>
                    <p className='text-gray-900 font-bold mb-1'>{(error as any)?.message || "Request failed"}</p>
                    <p className='text-gray-500 text-xs mb-4'>Please check your connection or try again later.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.location.reload()}
                      className="border-red-100 text-red-600 hover:bg-red-50"
                    >
                      Try again
                    </Button>
                  </div>
                )}
              </div>
            )}
            <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-y bg-gray-50/30 text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                    <th className='px-6 py-4 w-12'>#</th>
                    <th className='px-6 py-4'>USER</th>
                    <th className='px-6 py-4'>NIN</th>
                    <th className='px-6 py-4'>STATUS</th>
                    <th className='px-6 py-4'>DATE</th>
                    <th className='px-6 py-4 text-right'>ACTION</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {records.map((record, index) => (
                    <tr
                      key={record._id}
                      className='group hover:bg-gray-50 transition-colors cursor-pointer'
                      onClick={() => router.push(`/admin/verification/${record._id}`)}
                    >
                      <td className='px-6 py-4 text-xs font-medium text-gray-400'>
                        {(page - 1) * (searchTerm ? 100 : limit) + index + 1}
                      </td>
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
                        <div className="flex items-center gap-2">
                          {record.nin || record.nin || "N/A"}
                          {(record.nin || record.nin) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(record.nin || record.nin || "");
                                toast.success("NIN copied to clipboard");
                              }}
                              className="h-6 w-6 text-gray-400 hover:text-[#6B46C1] hover:bg-gray-100"
                              title="Copy NIN"
                            >
                              <Copy size={12} />
                            </Button>
                          )}
                        </div>
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
                      <td className='px-6 py-4 text-right' onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 px-2 text-gray-500 font-bold text-[10px] hover:bg-gray-100 gap-1 rounded-lg border border-gray-100'
                            >
                              <MoreVertical size={12} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='w-44'>
                            <Link href={`/admin/verification/${record._id}`}>
                              <DropdownMenuItem className='gap-2 cursor-pointer text-gray-700'>
                                <Eye size={16} /> View Details
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedRecord(record);
                                setIsApproveModalOpen(true);
                              }}
                              disabled={record.status === "approved"}
                              className='gap-2 cursor-pointer text-green-600 focus:text-green-600 font-medium'
                            >
                              <CheckCircle size={14} /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedRecord(record);
                                setIsRejectModalOpen(true);
                              }}
                              disabled={record.status === "rejected"}
                              className='gap-2 cursor-pointer text-red-600 focus:text-red-600 font-medium'
                            >
                              <XCircle size={14} /> Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {!isLoading && records.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className='py-12 text-center text-gray-400 font-medium'
                      >
                        {searchTerm ? `No results found for "${searchTerm}"` : "No KYC submissions found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <AdminPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalRecords={totalRecords}
              label='submissions'
            />
        </CardContent>
      </Card>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        type="taskers"
      />

      {/* Approve Modal */}
      {isApproveModalOpen && selectedRecord && (
        <div className='fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4' onClick={(e) => {
          if (e.target === e.currentTarget) setIsApproveModalOpen(false);
        }}>
          <div className='bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto no-scrollbar'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between bg-white'>
              <h2 className='text-xl font-bold text-green-600 flex items-center gap-2'>
                <CheckCircle size={24} /> Approve KYC
              </h2>
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors'
              >
                <X size={20} />
              </button>
            </div>
            <div className='p-8 space-y-6'>
              <div className='bg-green-50/50 p-4 rounded-2xl border border-green-100'>
                <p className='text-sm text-gray-700 leading-relaxed'>
                  You are about to approve verification for <strong className='text-gray-900'>{selectedRecord.user?.fullName || selectedRecord.user?.firstName || "this user"}</strong>. 
                  This will grant them verified status across the platform.
                </p>
              </div>
              <div className='space-y-3'>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-wider ml-1'>
                  Internal Notes (Optional)
                </label>
                <Input
                  placeholder='Enter any internal notes regarding this approval...'
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  className='rounded-2xl h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20'
                  autoFocus
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3'>
              <Button
                variant='ghost'
                onClick={() => setIsApproveModalOpen(false)}
                className='rounded-2xl font-semibold px-6 hover:bg-gray-200'
              >
                Cancel
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isApproving}
                className='bg-green-500 hover:bg-green-600 text-white rounded-2xl gap-2 font-bold px-8 h-12 shadow-md shadow-green-500/20 active:scale-[0.98] transition-all'
              >
                {isApproving ? (
                  <Loader2 size={18} className='animate-spin' />
                ) : (
                  <CheckCircle size={18} />
                )}
                Approve Verification
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && selectedRecord && (
        <div className='fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4' onClick={(e) => {
          if (e.target === e.currentTarget) setIsRejectModalOpen(false);
        }}>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between bg-white'>
              <h2 className='text-xl font-bold text-red-600 flex items-center gap-2'>
                <XCircle size={24} /> Reject KYC
              </h2>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors'
              >
                <X size={20} />
              </button>
            </div>
            <div className='p-8 space-y-6'>
              <div className='bg-red-50/50 p-4 rounded-2xl border border-red-100'>
                <p className='text-sm text-gray-700 leading-relaxed'>
                  Please provide a clear reason why <strong className='text-gray-900'>{selectedRecord.user?.fullName || selectedRecord.user?.firstName || "this user"}</strong>'s 
                  verification is being rejected. This information may be shared with the user.
                </p>
              </div>
              <div className='space-y-3'>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-wider ml-1'>
                  Rejection Reason <span className='text-red-500'>*</span>
                </label>
                <Input
                  placeholder='e.g. ID photo is blurry or does not match profile'
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className='rounded-2xl h-12 border-gray-200 focus:border-red-500 focus:ring-red-500/20'
                  autoFocus
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3'>
              <Button
                variant='ghost'
                onClick={() => setIsRejectModalOpen(false)}
                className='rounded-2xl font-semibold px-6 hover:bg-gray-200'
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={isRejecting || !rejectReason.trim()}
                className='bg-red-500 hover:bg-red-600 text-white rounded-2xl gap-2 font-bold px-8 h-12 shadow-md shadow-red-500/20 active:scale-[0.98] transition-all'
              >
                {isRejecting ? (
                  <Loader2 size={18} className='animate-spin' />
                ) : (
                  <XCircle size={18} />
                )}
                Reject Verification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
