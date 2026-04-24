"use client";

import { useState } from "react";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  MoreVertical,
  Flag,
  AlertTriangle,
  Clock,
  Activity,
} from "lucide-react";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import Link from "next/link";
import { useReports, useActivityLogs } from "@/hooks/useAdmin";
import { ApiError } from "@/lib/api";

export default function ReportsManagementPage() {
  const [activeTab, setActiveTab] = useState<"reports" | "activity">("reports");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeLogFilter, setActiveLogFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [logSearchTerm, setLogSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [logPage, setLogPage] = useState(1);
  const limit = 20;

  const statusParam =
    activeFilter === "All" ? undefined : activeFilter.toLowerCase();

  const resourceTypeParam = 
    activeLogFilter === "All" ? undefined : activeLogFilter;

  const { data: reportsData, isLoading: loadingReports, error: reportsError } = useReports({
    status: statusParam,
    page,
    limit,
    search: searchTerm,
  });

  const { data: logsData, isLoading: loadingLogs, error: logsError } = useActivityLogs({
    page: logPage,
    limit: 50,
    resourceType: resourceTypeParam,
    search: logSearchTerm,
  });

  const reports = reportsData?.reports ?? [];
  const reportsPagination = reportsData?.pagination || ((reportsData as any)?.totalPages ? {
    totalPages: (reportsData as any).totalPages,
    totalRecords: (reportsData as any).totalRecords || (reportsData as any).count,
    currentPage: (reportsData as any).currentPage || page
  } : null);

  // FIX: API returns `logs` at root level, not `data.activities`
  const activities = logsData?.logs ?? [];

  // FIX: API returns pagination fields at root level, not nested under `pagination`
  const logsPagination =
    (logsData as any)?.totalPages != null
      ? {
          currentPage: (logsData as any).currentPage ?? logPage,
          totalPages: (logsData as any).totalPages,
          totalActivities: (logsData as any).totalRecords,
          hasNext: ((logsData as any).currentPage ?? logPage) < (logsData as any).totalPages,
          hasPrev: ((logsData as any).currentPage ?? logPage) > 1,
        }
      : null;

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setPage(1);
  };

  const handleLogSearch = (query: string) => {
    setLogSearchTerm(query);
    setLogPage(1);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleLogFilterChange = (filter: string) => {
    setActiveLogFilter(filter);
    setLogPage(1);
  };

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-500",
    resolved: "bg-green-50 text-green-500",
    dismissed: "bg-gray-50 text-gray-500",
  };

  const priorityColor: Record<string, string> = {
    high: "bg-red-50 text-red-500",
    medium: "bg-orange-50 text-orange-500",
    low: "bg-blue-50 text-blue-500",
  };

  const typeLabel = (type: string) =>
    type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const getReporterName = (report: (typeof reports)[0]) =>
    report.reporter.fullName ||
    `${report.reporter.firstName || ""} ${report.reporter.lastName || ""}`.trim() ||
    "Unknown";

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Reports & Activity Logs
          </h1>
          <p className='text-sm text-gray-500'>
            Manage disputes, reports, and view admin activity
          </p>
        </div>
        {/* <Button variant='outline' className='text-sm h-10 px-4 gap-2'>
          <Download size={16} /> Export
        </Button> */}
      </div>

      {/* Tab Switcher */}
      <div className='flex gap-1 bg-gray-100 rounded-xl p-1 w-fit'>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === "reports" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Flag size={14} className='inline mr-2' /> User Reports
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === "activity" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Activity size={14} className='inline mr-2' /> Activity Logs
        </button>
      </div>

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <Card className='border border-gray-100 shadow-sm overflow-hidden'>
          <CardContent className='p-0'>
            <div className='p-6 border-b border-gray-100'>
              <AdminSearchFilter
                searchPlaceholder='Search reports...'
                searchTerm={searchTerm}
                onSearch={handleSearch}
                filterOptions={["All", "Pending", "Resolved", "Dismissed"]}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
              />
            </div>

            <div className='overflow-x-auto min-h-[400px] relative'>
              {(loadingReports || reportsError) && (
                <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
                  {loadingReports ? (
                    <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
                  ) : (
                    <div className='text-center p-6 bg-white rounded-xl shadow-lg border border-red-50 max-w-sm mx-auto'>
                      <div className='w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <div className='w-6 h-6 text-red-500 font-bold'>!</div>
                      </div>
                      <p className='text-gray-900 font-bold mb-1'>{(reportsError as any)?.message || "Request failed"}</p>
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
                    <th className='px-6 py-4'>TYPE</th>
                    <th className='px-6 py-4'>REPORTER</th>
                    <th className='px-6 py-4'>REASON</th>
                    <th className='px-6 py-4'>PRIORITY</th>
                    <th className='px-6 py-4'>STATUS</th>
                    <th className='px-6 py-4'>DATE</th>
                    <th className='px-6 py-4 text-right'>ACTION</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {reports.map((report) => (
                    <tr
                      key={report._id}
                      className='group hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-5'>
                        <span className='text-xs font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded-md border border-gray-100'>
                          {typeLabel(report.type)}
                        </span>
                      </td>
                      <td className='px-6 py-5 text-gray-900 font-medium text-xs'>
                        {getReporterName(report)}
                      </td>
                      <td className='px-6 py-5 text-gray-500 text-xs max-w-[200px] truncate'>
                        {report.reason}
                      </td>
                      <td className='px-6 py-5'>
                        {report.priority && (
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-bold capitalize ${priorityColor[report.priority] || "bg-gray-50 text-gray-500"}`}
                          >
                            {report.priority}
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-5'>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold capitalize ${statusColor[report.status]}`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className='px-6 py-5 text-xs text-gray-500'>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-5 text-right'>
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
                          <DropdownMenuContent align='end' className='w-40'>
                            <Link href={`/admin/reports/${report._id}`}>
                              <DropdownMenuItem className='gap-2 cursor-pointer text-xs'>
                                <ExternalLink size={14} /> View Details
                              </DropdownMenuItem>
                            </Link>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {!loadingReports && reports.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className='py-12 text-center text-gray-400 font-medium'
                      >
                        No reports found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <AdminPagination
              currentPage={page}
              totalPages={reportsPagination?.totalPages || 1}
              onPageChange={setPage}
              totalRecords={(reportsPagination as any)?.totalRecords}
              label='reports'
            />
          </CardContent>
        </Card>
      )}

      {/* Activity Logs Tab */}
      {activeTab === "activity" && (
        <Card className='border border-gray-100 shadow-sm overflow-hidden'>
          <CardContent className='p-0'>
            <div className='p-6 border-b border-gray-100'>
              <AdminSearchFilter
                searchPlaceholder='Search logs...'
                searchTerm={logSearchTerm}
                onSearch={handleLogSearch}
                filterOptions={["All", "User", "Tasker"]}
                activeFilter={activeLogFilter}
                onFilterChange={handleLogFilterChange}
              />
            </div>

            <div className='overflow-x-auto min-h-[400px] relative'>
              {(loadingLogs || logsError) && (
                <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
                  {loadingLogs ? (
                    <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
                  ) : (
                    <div className='text-center p-6 bg-white rounded-xl shadow-lg border border-red-50 max-w-sm mx-auto'>
                      <div className='w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <div className='w-6 h-6 text-red-500 font-bold'>!</div>
                      </div>
                      <p className='text-gray-900 font-bold mb-1'>{(logsError as any)?.message || "Request failed"}</p>
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
                    <th className='px-6 py-4'>ENTITY</th>
                    <th className='px-6 py-4'>ACTION</th>
                    <th className='px-6 py-4'>STATUS</th>
                    <th className='px-6 py-4'>PERFORMED BY</th>
                    <th className='px-6 py-4'>DATE</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {activities.map((log: any) => (
                    <tr
                      key={log._id}
                      className='hover:bg-gray-50 transition-colors'
                    >
                      {/* ENTITY: Fallback from resourceType to onModel */}
                      <td className='px-6 py-4'>
                        <span className='text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md border border-purple-100'>
                          {typeLabel(log.onModel ?? log.resourceType ?? log.type ?? "—")}
                        </span>
                      </td>
                      {/* ACTION */}
                      <td className='px-6 py-4 text-xs font-medium text-gray-900'>
                        {typeLabel(log.action)}
                      </td>
                      {/* STATUS */}
                      <td className='px-6 py-4'>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          log.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {log.status || "—"}
                        </span>
                      </td>
                      {/* PERFORMED BY: Use log.performedBy if available */}
                      <td className='px-6 py-4 text-xs text-gray-500'>
                        <div className='flex flex-col'>
                          <span className='font-medium text-gray-900'>
                            {log.performedBy 
                              ? `${log.performedBy.firstName || ""} ${log.performedBy.lastName || ""}`.trim() || log.performedBy.emailAddress
                              : log.admin?.fullName ?? log.admin?.email ?? "—"}
                          </span>
                          {log.performedBy?.role && (
                            <span className='text-[10px] text-gray-400 capitalize'>
                              ({log.performedBy.role})
                            </span>
                          )}
                        </div>
                      </td>
                      {/* DATE */}
                      <td className='px-6 py-4 text-xs text-gray-400'>
                        {new Date(
                          log.timestamp ?? log.createdAt,
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {!loadingLogs && activities.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className='py-12 text-center text-gray-400 font-medium'
                      >
                        No activity logs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <AdminPagination
              currentPage={logPage}
              totalPages={logsPagination?.totalPages || 1}
              onPageChange={setLogPage}
              totalRecords={logsPagination?.totalActivities}
              label='logs'
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
