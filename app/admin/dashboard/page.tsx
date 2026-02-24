"use client";

import {
  Users,
  Users2,
  Briefcase,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  DollarSign,
  Loader2,
  Activity,
  Server,
  Database,
  ShieldCheck,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useAdminDashboard,
  useSystemStats,
  useExportDashboard,
} from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useAdminDashboard();
  const { data: systemStats, isLoading: systemLoading } = useSystemStats();
  const { mutate: exportDashboard, isPending: isExporting } =
    useExportDashboard();

  const handleExport = () => {
    exportDashboard(undefined, {
      onSuccess: (data) => {
        if (data.downloadUrl) {
          window.open(data.downloadUrl, "_blank");
        } else {
          // Fallback: download as JSON
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${data.export_type}_${new Date().getTime()}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      },
    });
  };

  if (statsLoading || systemLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-purple-600' />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className='p-8 text-center text-red-500'>
        <AlertCircle className='mx-auto h-12 w-12 mb-4' />
        <p className='text-lg font-semibold'>
          Failed to load dashboard statistics
        </p>
        <Button
          variant='outline'
          className='mt-4'
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const metrics = [
    {
      label: "Total Users",
      value: stats?.users.total.toLocaleString() || "0",
      trend: stats?.users.new_this_month
        ? `+${stats.users.new_this_month}`
        : "0",
      trendType: "up",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Total Taskers",
      value: stats?.taskers.total.toLocaleString() || "0",
      trend: stats?.taskers.pending_verification
        ? `${stats.taskers.pending_verification} pending`
        : "0",
      trendType: "up",
      icon: Users2,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Tasks",
      value: stats?.tasks.total.toLocaleString() || "0",
      trend: stats?.tasks.this_month ? `+${stats.tasks.this_month}` : "0",
      trendType: "up",
      icon: Briefcase,
      color: "bg-orange-100 text-orange-600",
    },
    {
      label: "Active Tasks",
      value: (
        (stats?.tasks.open || 0) + (stats?.tasks.in_progress || 0)
      ).toLocaleString(),
      trend: stats?.tasks.in_progress
        ? `${stats.tasks.in_progress} in progress`
        : "0",
      trendType: "up",
      icon: BarChart3,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "Completed Tasks",
      value: stats?.tasks.completed.toLocaleString() || "0",
      trend: "85%",
      trendType: "up",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Cancelled Tasks",
      value: stats?.tasks.cancelled.toLocaleString() || "0",
      trend: "5%",
      trendType: "down",
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
    {
      label: "Pending KYC",
      value: stats?.kyc.pending.toLocaleString() || "0",
      trend: stats?.kyc.pending_review
        ? `${stats.kyc.pending_review} review`
        : "0",
      trendType: "up",
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.financials.total_revenue || 0),
      trend: stats?.financials.this_month_revenue
        ? `+${formatCurrency(stats.financials.this_month_revenue)}`
        : "0",
      trendType: "up",
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className='space-y-8'>
      <div>
        <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
          <div>
            <h1 className='md:text-2xl text-lg font-bold text-gray-900'>
              Dashboard Overview
            </h1>
            <p className='text-sm text-gray-500'>
              Monitor system metrics and recent activity
            </p>
          </div>
          <div className='flex gap-4 md:gap-3'>
            <Button variant='outline' className='text-sm h-10 px-4'>
              Refresh
            </Button>
            <Button className='bg-[#6B46C1] hover:bg-[#553C9A] text-white text-sm h-10 px-4'>
              Export Data
            </Button>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {metrics.map((metric, index) => (
          <Card key={index} className='border-none shadow-sm'>
            <CardContent className='p-6'>
              <div className='flex items-start justify-between'>
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  <metric.icon size={20} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${metric.trendType === "up" ? "text-green-500" : "text-red-500"}`}
                >
                  {metric.trendType === "up" ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {metric.trend}
                </div>
              </div>
              <div className='mt-4'>
                <div className='text-2xl font-bold'>{metric.value}</div>
                <div className='text-xs text-gray-500 mt-1'>{metric.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* System Health Section */}
        <div className='lg:col-span-2 space-y-8'>
          <Card className='border-none shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-lg font-bold flex items-center gap-2'>
                <Activity size={20} className='text-green-500' />
                System Health
              </CardTitle>
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
                <span className='text-xs font-medium text-green-500 uppercase'>
                  Live
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='p-4 rounded-xl bg-gray-50/50 border border-gray-100'>
                  <div className='flex items-center gap-3 mb-3'>
                    <Server size={18} className='text-blue-500' />
                    <span className='text-sm font-bold text-gray-700'>
                      API Status
                    </span>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-lg font-bold text-green-600 uppercase'>
                      Healthy
                    </div>
                    <div className='text-[10px] text-gray-400'>
                      UPTIME: {systemStats?.systemHealth.uptime}
                    </div>
                  </div>
                </div>

                <div className='p-4 rounded-xl bg-gray-50/50 border border-gray-100'>
                  <div className='flex items-center gap-3 mb-3'>
                    <Database size={18} className='text-indigo-500' />
                    <span className='text-sm font-bold text-gray-700'>
                      Database
                    </span>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-lg font-bold text-green-600 uppercase'>
                      {systemStats?.database.status}
                    </div>
                    <div className='text-[10px] text-gray-400'>
                      LATENCY: {systemStats?.database.responseTime}
                    </div>
                  </div>
                </div>

                <div className='p-4 rounded-xl bg-gray-50/50 border border-gray-100'>
                  <div className='flex items-center gap-3 mb-3'>
                    <ShieldCheck size={18} className='text-purple-500' />
                    <span className='text-sm font-bold text-gray-700'>
                      Performance
                    </span>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-lg font-bold text-gray-900 uppercase'>
                      {systemStats?.performance.avgResponseTime} avg
                    </div>
                    <div className='text-[10px] text-gray-400'>
                      ERROR RATE: {systemStats?.performance.errorRate}
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-8 grid grid-cols-2 md:grid-cols-4 gap-4'>
                {Object.entries(systemStats?.services || {}).map(
                  ([service, status]) => (
                    <div key={service} className='flex flex-col gap-1'>
                      <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                        {service}
                      </span>
                      <div className='flex items-center gap-2'>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${status === "operational" ? "bg-green-500" : "bg-yellow-500"}`}
                        />
                        <span className='text-xs font-semibold text-gray-600 capitalize'>
                          {status}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          <Card className='border-none shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-lg font-bold'>
                Activity Overview
              </CardTitle>
              <Button variant='link' className='text-sm text-gray-500'>
                View detailed logs
              </Button>
            </CardHeader>
            <CardContent>
              {/* This could represent a chart or more detailed stats */}
              <div className='h-64 bg-gray-50/50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-100'>
                <p className='text-sm text-gray-400 font-medium'>
                  Activity visualization placeholder
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-8'>
          <Card className='border-none shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-lg font-bold'>
                Verification Stats
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-500 font-medium'>
                    Pending Requests
                  </span>
                  <span className='font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full text-xs'>
                    {stats?.kyc.pending}
                  </span>
                </div>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-500 font-medium'>
                    Approved Today
                  </span>
                  <span className='font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs'>
                    {stats?.kyc.approved}
                  </span>
                </div>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-500 font-medium'>
                    Rejected Today
                  </span>
                  <span className='font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs'>
                    {stats?.kyc.rejected}
                  </span>
                </div>
              </div>

              <div className='pt-4 border-t border-gray-50'>
                <Button className='w-full bg-gray-900 hover:bg-black text-white rounded-xl h-11 text-xs font-bold uppercase tracking-widest'>
                  Review Pending KYC
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className='border-none shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg font-bold'>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>User to Tasker Ratio</span>
                <span className='font-semibold'>
                  {stats
                    ? (stats.users.total / (stats.taskers.total || 1)).toFixed(
                        1,
                      )
                    : "0.0"}
                  :1
                </span>
              </div>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>Task Completion Rate</span>
                <span className='font-semibold'>
                  {stats
                    ? Math.round(
                        (stats.tasks.completed / (stats.tasks.total || 1)) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>Verified Users</span>
                <span className='font-semibold'>
                  {stats?.users.verified.toLocaleString() || "0"}
                </span>
              </div>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>Escrow Held</span>
                <span className='font-semibold text-emerald-600'>
                  {formatCurrency(stats?.financials.escrow_held || 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
