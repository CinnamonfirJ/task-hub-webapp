"use client";

import { useState, use } from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Loader2,
  X,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useKYCRequests, useApproveKYC, useRejectKYC } from "@/hooks/useAdmin";

export default function KYCDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: kycData, isLoading } = useKYCRequests({ status: undefined });
  const record = kycData?.records?.find((r) => r._id === id);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveNotes, setApproveNotes] = useState("");

  const { mutate: approve, isPending: isApproving } = useApproveKYC();
  const { mutate: reject, isPending: isRejecting } = useRejectKYC();

  const handleApprove = () => {
    approve(
      { id, notes: approveNotes },
      {
        onSuccess: () => {
          setIsApproveModalOpen(false);
          setApproveNotes("");
        },
      },
    );
  };

  const handleReject = () => {
    reject(
      { id, reason: rejectReason },
      {
        onSuccess: () => {
          setIsRejectModalOpen(false);
          setRejectReason("");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className='flex h-[80vh] items-center justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-[#6B46C1]' />
      </div>
    );
  }

  if (!record) {
    return (
      <div className='flex h-[80vh] flex-col items-center justify-center gap-4'>
        <XCircle className='h-12 w-12 text-red-500' />
        <h2 className='text-xl font-bold text-gray-900'>
          KYC record not found
        </h2>
        <Link href='/admin/verification'>
          <Button variant='outline'>Back to Verifications</Button>
        </Link>
      </div>
    );
  }

  const statusConfig = {
    pending: {
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      label: "Pending Review",
    },
    approved: { bg: "bg-green-50", text: "text-green-600", label: "Approved" },
    rejected: { bg: "bg-red-50", text: "text-red-600", label: "Rejected" },
  };
  const sc = statusConfig[record.status];

  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto relative'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/verification'>
            <Button
              variant='outline'
              size='icon'
              className='h-10 w-10 border-gray-200'
            >
              <ArrowLeft size={18} className='text-gray-500' />
            </Button>
          </Link>
          <div>
            <h1 className='text-xl md:text-2xl font-bold text-gray-900'>
              KYC / Verification Details
            </h1>
            <p className='text-xs md:text-sm text-gray-500'>
              Review verification submission
            </p>
          </div>
        </div>
        {record.status === "pending" && (
          <div className='flex gap-3'>
            <Button
              onClick={() => setIsApproveModalOpen(true)}
              disabled={isApproving}
              className='bg-green-500 hover:bg-green-600 text-white gap-2 h-10 px-4 font-semibold rounded-xl'
            >
              {isApproving ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                <CheckCircle size={16} />
              )}
              Approve
            </Button>
            <Button
              onClick={() => setIsRejectModalOpen(true)}
              disabled={isRejecting}
              className='bg-[#EF4444] hover:bg-[#DC2626] text-white gap-2 h-10 px-4 font-semibold rounded-xl'
            >
              {isRejecting ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                <XCircle size={16} />
              )}
              Reject
            </Button>
          </div>
        )}
      </div>

      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div
                className={`w-12 h-12 rounded-full ${sc.bg} flex items-center justify-center`}
              >
                <ShieldCheck size={24} className={sc.text} />
              </div>
              <div>
                <h3 className='font-bold text-gray-900 text-lg'>
                  Verification Status
                </h3>
                <span
                  className={`${sc.bg} ${sc.text} text-[10px] font-bold px-3 py-1 rounded-full uppercase mt-1 inline-block`}
                >
                  {sc.label}
                </span>
              </div>
            </div>
            <div className='text-right'>
              <div className='text-xs text-gray-500 font-medium mb-1'>
                Submitted
              </div>
              <div className='text-sm font-bold text-gray-900'>
                {new Date(record.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='p-6 pb-4'>
            <CardTitle className='text-lg font-bold text-gray-900'>
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-5'>
            <div>
              <div className='text-xs text-gray-500 font-medium mb-1'>
                Full Name
              </div>
              <div className='text-sm font-bold text-gray-900'>
                {record.user.fullName}
              </div>
            </div>
            <div>
              <div className='text-xs text-gray-500 font-medium mb-1'>
                Email Address
              </div>
              <div className='text-sm font-bold text-gray-900'>
                {record.user.emailAddress}
              </div>
            </div>
            {record.user.phoneNumber && (
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Phone Number
                </div>
                <div className='text-sm font-bold text-gray-900'>
                  {record.user.phoneNumber}
                </div>
              </div>
            )}
            <div>
              <div className='text-xs text-gray-500 font-medium mb-1'>
                User ID
              </div>
              <div className='text-sm font-bold text-gray-900 font-mono'>
                {record.user._id}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='p-6 pb-4'>
            <CardTitle className='text-lg font-bold text-gray-900'>
              KYC Information
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-5'>
            <div>
              <div className='text-sm text-gray-500 font-medium mb-2'>
                National Identification Number (NIN)
              </div>
              <div className='bg-gray-50/50 border border-gray-100 rounded-xl p-4 font-bold text-gray-900 tracking-wider'>
                {record.nin}
              </div>
            </div>
            <div>
              <div className='text-xs text-gray-500 font-medium mb-1'>
                Submission Date
              </div>
              <div className='text-sm font-bold text-gray-900'>
                {new Date(record.createdAt).toLocaleString()}
              </div>
            </div>
            {record.updatedAt && (
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Last Updated
                </div>
                <div className='text-sm font-bold text-gray-900'>
                  {new Date(record.updatedAt).toLocaleString()}
                </div>
              </div>
            )}
            {record.approvedBy && (
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Approved By
                </div>
                <div className='text-sm font-bold text-gray-900'>
                  {record.approvedBy.fullName}
                </div>
              </div>
            )}
            {record.rejectionReason && (
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Rejection Reason
                </div>
                <div className='text-sm font-bold text-red-600'>
                  {record.rejectionReason}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {record.submittedDocuments && record.submittedDocuments.length > 0 && (
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='p-6 pb-4'>
            <CardTitle className='text-lg font-bold text-gray-900'>
              Verification Documents
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0'>
            <div className='flex flex-wrap gap-4'>
              {record.submittedDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className='w-40 h-40 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2 relative group'
                >
                  <FileText size={24} className='text-gray-400' />
                  <span className='text-[10px] text-gray-500 font-medium capitalize'>
                    {doc.type.replace("_", " ")}
                  </span>
                  <a
                    href={doc.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl'
                  >
                    <Button
                      variant='secondary'
                      className='bg-white shadow-sm text-sm font-bold h-9 px-6'
                    >
                      <ExternalLink size={14} className='mr-2' /> View
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approve Modal */}
      {isApproveModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-green-600'>Approve KYC</h2>
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400'
              >
                <X size={20} />
              </button>
            </div>
            <div className='p-6 space-y-4'>
              <p className='text-sm text-gray-600'>
                Approving will grant KYC verified status to{" "}
                <strong>{record.user.fullName}</strong>.
              </p>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Notes (Optional)
                </label>
                <Input
                  placeholder='e.g. Documents verified manually'
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  className='rounded-xl h-11'
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setIsApproveModalOpen(false)}
                className='rounded-xl font-semibold'
              >
                Cancel
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isApproving}
                className='bg-green-500 hover:bg-green-600 text-white rounded-xl gap-2 font-semibold'
              >
                {isApproving ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <CheckCircle size={16} />
                )}{" "}
                Confirm Approval
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-red-600'>Reject KYC</h2>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400'
              >
                <X size={20} />
              </button>
            </div>
            <div className='p-6 space-y-4'>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Rejection Reason *
                </label>
                <Input
                  placeholder='e.g. ID photo does not match selfie'
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className='rounded-xl h-11'
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setIsRejectModalOpen(false)}
                className='rounded-xl font-semibold'
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={isRejecting || !rejectReason.trim()}
                className='bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl gap-2 font-semibold'
              >
                {isRejecting ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <XCircle size={16} />
                )}{" "}
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
