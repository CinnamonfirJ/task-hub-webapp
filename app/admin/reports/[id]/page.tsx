"use client";

import { useState, use } from "react";
import {
  ArrowLeft,
  Flag,
  Loader2,
  X,
  XCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useReportDetails, useResolveReport } from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";

export default function ReportDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: detailData, isLoading, isError } = useReportDetails(id);

  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolution, setResolution] = useState("");
  const [actionTaken, setActionTaken] = useState("no_action");
  const [refundAmount, setRefundAmount] = useState("");
  const [warningIssued, setWarningIssued] = useState(false);
  const [notes, setNotes] = useState("");

  const { mutate: resolve, isPending: isResolving } = useResolveReport();

  if (isLoading) {
    return (
      <div className='flex h-[80vh] items-center justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-[#6B46C1]' />
      </div>
    );
  }

  if (isError || !detailData) {
    return (
      <div className='flex h-[80vh] flex-col items-center justify-center gap-4'>
        <XCircle className='h-12 w-12 text-red-500' />
        <h2 className='text-xl font-bold text-gray-900'>Report not found</h2>
        <Link href='/admin/reports'>
          <Button variant='outline'>Back to Reports</Button>
        </Link>
      </div>
    );
  }

  const { report, timeline, taskHistory, chatMessages } = detailData;

  const statusColor: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    pending: { bg: "bg-yellow-50", text: "text-yellow-600", label: "Pending" },
    resolved: { bg: "bg-green-50", text: "text-green-600", label: "Resolved" },
    dismissed: { bg: "bg-gray-50", text: "text-gray-500", label: "Dismissed" },
  };
  const sc = statusColor[report.status] || statusColor.pending;

  const getReporterName = () =>
    report.reporter.fullName ||
    `${report.reporter.firstName ?? ""} ${report.reporter.lastName ?? ""}`.trim() ||
    "Unknown";

  const getReportedName = () =>
    report.reportedUser?.fullName ||
    `${report.reportedUser?.firstName ?? ""} ${report.reportedUser?.lastName ?? ""}`.trim() ||
    "N/A";

  const typeLabel = (type: string) =>
    type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const handleResolve = () => {
    resolve(
      {
        id,
        resolution,
        action_taken: actionTaken,
        refund_amount: refundAmount ? Number(refundAmount) : undefined,
        warning_issued: warningIssued,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          setIsResolveModalOpen(false);
          setResolution("");
          setNotes("");
        },
      },
    );
  };

  const evidenceIcon = (type: string) => {
    if (type === "image")
      return <ImageIcon size={20} className='text-gray-400' />;
    if (type === "chat_log")
      return <MessageSquare size={20} className='text-gray-400' />;
    return <FileText size={20} className='text-gray-400' />;
  };

  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto relative'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/reports'>
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
              Report Details
            </h1>
            <p className='text-xs md:text-sm text-gray-500 mt-1'>
              Review and manage user report
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <span
            className={`${sc.bg} ${sc.text} text-xs font-semibold px-3 py-1.5 rounded capitalize`}
          >
            {sc.label}
          </span>
          {report.status === "pending" && (
            <Button
              onClick={() => setIsResolveModalOpen(true)}
              className='bg-[#22C55E] hover:bg-[#16A34A] text-white gap-2 h-10 px-5 rounded-xl font-semibold'
            >
              <CheckCircle2 size={16} /> Resolve
            </Button>
          )}
        </div>
      </div>

      {/* Report summary */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <CardContent className='p-6 md:p-8'>
          <div className='flex items-center justify-between gap-6'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0'>
                <Flag size={20} />
              </div>
              <div>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Report Type
                </div>
                <h2 className='text-lg font-bold text-gray-900'>
                  {typeLabel(report.type)}
                </h2>
                {report.priority && (
                  <span
                    className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${report.priority === "high" ? "bg-red-50 text-red-500" : report.priority === "medium" ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-500"}`}
                  >
                    {report.priority} priority
                  </span>
                )}
              </div>
            </div>
            <div className='text-right shrink-0'>
              <div className='text-xs text-gray-500 font-medium'>Submitted</div>
              <div className='text-sm font-bold text-gray-900 mt-1'>
                {new Date(report.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Report Info */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl h-full'>
          <CardHeader className='p-6 pb-4'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Report Information
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-5'>
            <div>
              <div className='text-xs text-gray-500 font-medium'>Report ID</div>
              <div className='text-sm font-bold text-gray-900 mt-1 font-mono'>
                {report._id}
              </div>
            </div>
            <div>
              <div className='text-xs text-gray-500 font-medium'>Reason</div>
              <div className='text-sm font-bold text-gray-900 mt-1 leading-relaxed'>
                {report.reason}
              </div>
            </div>
            {report.detailedDescription && (
              <div>
                <div className='text-xs text-gray-500 font-medium'>
                  Detailed Description
                </div>
                <div className='text-sm text-gray-700 mt-1 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100'>
                  {report.detailedDescription}
                </div>
              </div>
            )}
            {report.relatedTask && (
              <div>
                <div className='text-xs text-gray-500 font-medium'>
                  Related Task
                </div>
                <div className='text-sm font-bold text-gray-900 mt-1'>
                  {report.relatedTask.title}
                </div>
                {report.relatedTask.budget && (
                  <div className='text-xs text-gray-400 mt-0.5'>
                    Budget: {formatCurrency(report.relatedTask.budget)}
                  </div>
                )}
              </div>
            )}
            {report.resolution && (
              <div>
                <div className='text-xs text-gray-500 font-medium'>
                  Resolution
                </div>
                <div className='text-sm font-bold text-green-600 mt-1 bg-green-50/50 p-3 rounded-xl border border-green-100'>
                  {report.resolution}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users Involved */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl h-full'>
          <CardHeader className='p-6 pb-4'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Users Involved
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0 space-y-4'>
            <div className='p-5 bg-blue-50/50 border border-blue-100 rounded-xl'>
              <div className='text-xs text-gray-500 font-medium mb-1'>
                Reporter
              </div>
              <div className='font-bold text-gray-900 text-sm'>
                {getReporterName()}
              </div>
              {report.reporter.userType && (
                <span className='text-[10px] text-gray-400 capitalize'>
                  {report.reporter.userType}
                </span>
              )}
            </div>
            {report.reportedUser && (
              <div className='p-5 bg-red-50/30 border border-red-100 rounded-xl'>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Reported User
                </div>
                <div className='font-bold text-gray-900 text-sm'>
                  {getReportedName()}
                </div>
                {report.reportedUser.userType && (
                  <span className='text-[10px] text-gray-400 capitalize'>
                    {report.reportedUser.userType}
                  </span>
                )}
              </div>
            )}
            {report.resolvedBy && (
              <div className='p-5 bg-green-50/30 border border-green-100 rounded-xl'>
                <div className='text-xs text-gray-500 font-medium mb-1'>
                  Resolved By
                </div>
                <div className='font-bold text-gray-900 text-sm'>
                  {report.resolvedBy.fullName}
                </div>
                {report.resolvedAt && (
                  <div className='text-xs text-gray-400 mt-0.5'>
                    {new Date(report.resolvedAt).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Evidence */}
      {report.evidence && report.evidence.length > 0 && (
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='p-6 pb-4'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Evidence ({report.evidence.length})
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 pt-0'>
            <div className='flex flex-wrap gap-4'>
              {report.evidence.map((ev, idx) => (
                <a
                  key={idx}
                  href={ev.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-40 h-40 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2 hover:border-purple-200 hover:bg-purple-50/30 transition-colors group'
                >
                  {evidenceIcon(ev.type)}
                  <span className='text-[10px] text-gray-500 font-medium capitalize group-hover:text-purple-600'>
                    {ev.description || ev.type.replace("_", " ")}
                  </span>
                  <span className='text-[10px] text-purple-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity'>
                    View
                  </span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline + Chat */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {timeline && timeline.length > 0 && (
          <Card className='border border-gray-100 shadow-sm rounded-2xl'>
            <CardHeader className='p-6 pb-4'>
              <CardTitle className='text-base font-bold text-gray-900'>
                Report Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className='p-6 pt-0'>
              <div className='space-y-4'>
                {timeline.map((event, idx) => (
                  <div
                    key={idx}
                    className='flex items-center gap-4 p-3 rounded-xl bg-gray-50/50'
                  >
                    <div className='w-2 h-2 rounded-full bg-[#6B46C1] shrink-0' />
                    <div className='flex-1'>
                      <div className='text-sm font-bold text-gray-900 capitalize'>
                        {event.event.replace(/_/g, " ")}
                      </div>
                      {event.actor && (
                        <div className='text-xs text-gray-500'>
                          {event.actor}
                        </div>
                      )}
                      <div className='text-xs text-gray-400'>
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {chatMessages && chatMessages.length > 0 && (
          <Card className='border border-gray-100 shadow-sm rounded-2xl'>
            <CardHeader className='p-6 pb-4'>
              <CardTitle className='text-base font-bold text-gray-900'>
                Related Chat Messages
              </CardTitle>
            </CardHeader>
            <CardContent className='p-6 pt-0 space-y-3'>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className='p-3 bg-gray-50/50 rounded-xl border border-gray-100'
                >
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-xs font-bold text-gray-900'>
                      {msg.from}
                    </span>
                    <span className='text-[10px] text-gray-400'>
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className='text-sm text-gray-600'>{msg.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Resolve Modal */}
      {isResolveModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-green-600'>
                Resolve Report
              </h2>
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400'
              >
                <X size={20} />
              </button>
            </div>
            <div className='p-6 space-y-5'>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Resolution *
                </label>
                <textarea
                  placeholder='Describe how this report was resolved...'
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className='w-full min-h-[100px] p-3 text-sm bg-gray-50/30 border border-gray-200 rounded-xl focus:ring-1 focus:ring-purple-200 outline-none resize-y'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Action Taken *
                </label>
                <select
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className='w-full h-11 px-3 text-sm border border-gray-200 rounded-xl bg-white focus:ring-1 focus:ring-purple-200 outline-none'
                >
                  <option value='no_action'>No Action</option>
                  <option value='warning'>Issue Warning</option>
                  <option value='refund_user'>Refund User</option>
                  <option value='ban_user'>Ban User</option>
                  <option value='suspend_user'>Suspend User</option>
                </select>
              </div>
              {actionTaken === "refund_user" && (
                <div className='space-y-2'>
                  <label className='text-xs font-bold text-gray-700 uppercase'>
                    Refund Amount
                  </label>
                  <Input
                    type='number'
                    placeholder='e.g. 47000'
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className='rounded-xl h-11'
                  />
                </div>
              )}
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={warningIssued}
                  onChange={(e) => setWarningIssued(e.target.checked)}
                  className='rounded'
                />
                <span className='text-sm text-gray-700 font-medium'>
                  Issue warning to reported user
                </span>
              </label>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Internal Notes
                </label>
                <Input
                  placeholder='Internal admin notes...'
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className='rounded-xl h-11'
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setIsResolveModalOpen(false)}
                className='rounded-xl font-semibold'
              >
                Cancel
              </Button>
              <Button
                onClick={handleResolve}
                disabled={isResolving || !resolution.trim()}
                className='bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl gap-2 font-semibold'
              >
                {isResolving ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <CheckCircle2 size={16} />
                )}{" "}
                Confirm Resolution
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
