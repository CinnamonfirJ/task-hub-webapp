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
  Circle,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminDashboard } from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { navItems } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ExportModal } from "@/components/admin/ExportModal";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useAdminDashboard();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  if (statsLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-purple-600' />
      </div>
    );
  }

  if (statsError) {
    const isForbidden = (statsError as any)?.status === 403 || (statsError as any)?.message?.includes("403");

    if (isForbidden) {
       return (
        <div className='p-8'>
          <div className="bg-white border border-gray-100 rounded-[2rem] p-10 text-center shadow-sm">
            <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-[#6B46C1] w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Action Center</h1>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              You are logged in as <span className="font-semibold text-[#6B46C1]">{user?.role?.replace("_", " ")}</span>. 
              While you don't have access to global statistics, you can manage your assigned modules below.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {navItems.filter(item => item.href !== "/admin/dashboard" && item.roles.includes(user?.role as any)).map(item => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="flex items-center gap-4 p-5 bg-gray-50 hover:bg-purple-50 rounded-2xl border border-transparent hover:border-purple-100 transition-all group"
                >
                  <div className="bg-white p-3 rounded-xl shadow-sm group-hover:bg-[#6B46C1] transition-colors">
                    <item.icon size={24} className="text-[#6B46C1] group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">Access module</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='p-8 text-center text-red-500'>
        <AlertCircle className='mx-auto h-12 w-12 mb-4' />
        <p className='text-lg font-semibold text-center leading-relaxed'>
          Failed to load dashboard statistics.
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

  const growth = stats?.growth ?? 0;
  const growthLabel = `${growth > 0 ? "+" : ""}${growth}%`;

  // 8 metric cards — all driven by data.cards + data.growth
  const metrics = [
    {
      label: "Total Users",
      value: stats?.cards?.totalUsers?.toLocaleString() ?? "0",
      trend: growthLabel,
      trendUp: true,
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      valueColor: "text-purple-600",
    },
    {
      label: "Total Taskers",
      value: stats?.cards?.totalTaskers?.toLocaleString() ?? "0",
      trend: growthLabel,
      trendUp: true,
      icon: Briefcase,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
      valueColor: "text-orange-500",
    },
    {
      label: "Total Tasks",
      value: stats?.cards?.totalTasks?.toLocaleString() ?? "0",
      trend: growthLabel,
      trendUp: true,
      icon: BarChart3,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
    {
      label: "Active Tasks",
      value: stats?.cards?.activeTasks?.toLocaleString() ?? "0",
      // Active tasks trending down if low
      trend: growthLabel,
      trendUp: false,
      icon: Users2,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      valueColor: "text-purple-600",
    },
    {
      label: "Completed Tasks",
      value: stats?.cards?.completedTasks?.toLocaleString() ?? "0",
      trend: growthLabel,
      trendUp: true,
      icon: CheckCircle2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      valueColor: "text-green-600",
    },
    {
      label: "Cancelled Tasks",
      value: stats?.cards?.cancelledTasks?.toLocaleString() ?? "0",
      trend: growthLabel,
      trendUp: true,
      icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      valueColor: "text-red-500",
    },
    {
      label: "Pending KYC",
      value: stats?.cards?.pendingKyc?.toLocaleString() ?? "0",
      trend: growthLabel,
      trendUp: true,
      icon: AlertCircle,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      valueColor: "text-purple-600",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.cards?.totalRevenue ?? 0),
      trend: growthLabel,
      trendUp: false,
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      valueColor: "text-emerald-700",
    },
  ];

  // Status badge styling for tasks
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "in_progress":
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "assigned":
        return "bg-yellow-100 text-yellow-700";
      case "open":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "cancelled":
        return "bg-red-100 text-red-500";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "in_progress":
        return "In progress";
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();
    }
  };

  // Activity dot color by type
  const getActivityDot = (type: string) => {
    switch (type) {
      case "admin":
        return "bg-purple-500";
      case "task":
        return "bg-purple-600";
      case "payment":
        return "bg-emerald-500";
      case "verification":
        return "bg-blue-500";
      default:
        return "bg-purple-500";
    }
  };

  const getActivityTitle = (title: string) => {
    // Convert ADMIN_LOGIN to "Admin Login", keep human-readable ones as-is
    if (title === title.toUpperCase()) {
      return title
        .split("_")
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" ");
    }
    return title;
  };

  const recentTasks = stats?.recentTasks ?? [];
  const recentActivity = stats?.recentActivity ?? [];

  return (
    <div className='space-y-8'>
      {/* Page Header */}
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Dashboard Overview
          </h1>
          <p className='text-sm text-gray-500 mt-0.5'>
            Monitor system metrics and recent activity
          </p>
        </div>
        <div className='flex gap-3'>
          <Button
            onClick={() => setIsExportModalOpen(true)}
            variant='outline'
            className='text-sm h-9 px-4 gap-2 border-gray-200 font-medium'
          >
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        type="dashboard" 
      />

      {/* 8 Metric Cards — 4 columns */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {metrics.map((metric, idx) => (
          <Card
            key={idx}
            className='border border-gray-100 shadow-sm rounded-2xl'
          >
            <CardContent className='p-5'>
              {/* Icon + Trend row */}
              <div className='flex items-start justify-between'>
                <div className={`p-2.5 rounded-xl ${metric.iconBg}`}>
                  <metric.icon size={18} className={metric.iconColor} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    metric.trendUp ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {metric.trendUp ? (
                    <TrendingUp size={13} />
                  ) : (
                    <TrendingDown size={13} />
                  )}
                  {metric.trend}
                </div>
              </div>
              {/* Value + Label */}
              <div className='mt-4'>
                <div className={`text-2xl font-bold ${metric.valueColor}`}>
                  {metric.value}
                </div>
                <div className='text-xs mt-1 font-medium text-gray-500'>
                  {metric.label}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Tasks Table */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <CardHeader className='flex flex-row items-center justify-between pb-2 px-6 pt-6'>
          <CardTitle className='text-base font-bold text-gray-900'>
            Recent Tasks
          </CardTitle>
          <Link
            href='/admin/tasks'
            className='text-sm text-gray-500 hover:text-gray-700 font-medium'
          >
            See all
          </Link>
        </CardHeader>
        <CardContent className='px-0 pb-2'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-100'>
                  <th className='text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>
                    Task
                  </th>
                  <th className='text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>
                    Posted By
                  </th>
                  <th className='text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>
                    Budget
                  </th>
                  <th className='text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {recentTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-6 py-10 text-center text-sm text-gray-400'
                    >
                      No recent tasks
                    </td>
                  </tr>
                ) : (
                  recentTasks.map((task: any) => (
                    <tr
                      key={task._id}
                      className='hover:bg-gray-50/50 transition-colors'
                    >
                      <td className='px-6 py-4 text-sm font-medium text-gray-800'>
                        {task.title}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-500'>
                        {task.user?.emailAddress ?? task.user?.fullName ?? "—"}
                      </td>
                      <td className='px-6 py-4 text-sm font-medium text-gray-700'>
                        {formatCurrency(task.budget ?? 0)}
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(task.status)}`}
                        >
                          {getStatusLabel(task.status ?? "open")}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-500'>
                        {task.createdAt
                          ? new Date(task.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row: Recent Activity + Quick Stats */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Recent Activity — takes 2/3 */}
        <Card className='lg:col-span-2 border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='flex flex-row items-center justify-between pb-2 px-6 pt-6'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Recent activity
            </CardTitle>
            <Link
              href='/admin/logs'
              className='text-sm text-gray-500 hover:text-gray-700 font-medium'
            >
              See all
            </Link>
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='space-y-0 divide-y divide-gray-50'>
              {recentActivity.length === 0 ? (
                <p className='py-8 text-sm text-gray-400 text-center'>
                  No recent activity
                </p>
              ) : (
                recentActivity.map((item: any, idx: number) => (
                  <div key={idx} className='flex gap-4 py-4'>
                    {/* Colored bullet */}
                    <div className='mt-1.5 shrink-0'>
                      <span
                        className={`block w-2 h-2 rounded-full ${getActivityDot(item.type)}`}
                      />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm font-semibold text-gray-800'>
                        {getActivityTitle(item.title)}
                      </p>
                      <p className='text-xs text-gray-400 mt-0.5'>
                        {item.date
                          ? new Date(item.date).toLocaleString("en-US", {
                              month: "numeric",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : ""}
                      </p>
                      {item.detail && (
                        <p className='text-xs text-gray-500 mt-0.5'>
                          {item.detail}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats — takes 1/3 */}
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader className='pb-2 px-6 pt-6'>
            <CardTitle className='text-base font-bold text-gray-900'>
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='space-y-0 divide-y divide-gray-50'>
              <div className='flex justify-between items-center py-4'>
                <span className='text-sm text-gray-500'>
                  User to Tasker Ratio
                </span>
                <span className='text-sm font-semibold text-gray-800'>
                  {stats?.quickStats?.userToTaskerRatio ?? "0.0"}:1
                </span>
              </div>
              <div className='flex justify-between items-center py-4'>
                <span className='text-sm text-gray-500'>
                  Task Completion Rate
                </span>
                <span className='text-sm font-semibold text-gray-800'>
                  {stats?.quickStats?.completionRate ?? "0"}%
                </span>
              </div>
              <div className='flex justify-between items-center py-4'>
                <span className='text-sm text-gray-500'>Users</span>
                <span className='text-sm font-semibold text-gray-800'>
                  {stats?.cards?.totalUsers ?? 0}
                </span>
              </div>
              <div className='flex justify-between items-center py-4'>
                <span className='text-sm text-gray-500'>
                  Average Task Value
                </span>
                <span className='text-sm font-semibold text-gray-800'>
                  {formatCurrency(stats?.quickStats?.avgTaskValue ?? 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
