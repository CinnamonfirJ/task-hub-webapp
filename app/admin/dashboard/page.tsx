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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const metrics = [
  {
    label: "Total Users",
    value: "7",
    trend: "+24%",
    trendType: "up",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
  },
  {
    label: "Total Taskers",
    value: "30",
    trend: "+24%",
    trendType: "up",
    icon: Users2,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Total Tasks",
    value: "67",
    trend: "+24%",
    trendType: "up",
    icon: Briefcase,
    color: "bg-orange-100 text-orange-600",
  },
  {
    label: "Active Tasks",
    value: "7",
    trend: "-24%",
    trendType: "down",
    icon: BarChart3,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    label: "Completed Tasks",
    value: "60",
    trend: "+24%",
    trendType: "up",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Cancelled Tasks",
    value: "30",
    trend: "+24%",
    trendType: "up",
    icon: XCircle,
    color: "bg-red-100 text-red-600",
  },
  {
    label: "Pending KYC",
    value: "3",
    trend: "+24%",
    trendType: "up",
    icon: AlertCircle,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    label: "Total Revenue",
    value: "₦ 200,476.00",
    trend: "-24%",
    trendType: "down",
    icon: DollarSign,
    color: "bg-emerald-100 text-emerald-600",
  },
];

const recentTasks = [
  {
    id: 1,
    title: "Fix Leaking Kitchen Sink",
    postedBy: "aisha.musa@taskhubdemo.com",
    budget: "₦40,000",
    status: "In progress",
    date: "02/02/2025",
  },
  {
    id: 2,
    title: "Design Company Logo",
    postedBy: "chidinma.o@taskhubdemo.com",
    budget: "₦55,000",
    status: "Assigned",
    date: "02/02/2025",
  },
  {
    id: 3,
    title: "Office Deep Cleaning",
    postedBy: "ibrahim.y@taskhubdemo.com",
    budget: "₦95,000",
    status: "Open",
    date: "02/02/2025",
  },
  {
    id: 4,
    title: "Wedding Photography",
    postedBy: "segun.adebayo@taskhubdemo.com",
    budget: "₦125,000",
    status: "Assigned",
    date: "02/02/2025",
  },
];

export default function AdminDashboardPage() {
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
          <div className='flex gap-26 md:gap-3'>
            <Button variant='outline' className='text-sm h-10 px-4'>
              Default
            </Button>
            <Button variant='outline' className='text-sm h-10 px-4'>
              Export
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
        <Card className='lg:col-span-2 border-none shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-lg font-bold'>Recent Tasks</CardTitle>
            <Button variant='link' className='text-sm text-gray-500'>
              See all
            </Button>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-b text-gray-400 font-medium'>
                    <th className='pb-4'>TASK</th>
                    <th className='pb-4'>POSTED BY</th>
                    <th className='pb-4'>BUDGET</th>
                    <th className='pb-4'>STATUS</th>
                    <th className='pb-4'>DATE</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {recentTasks.map((task) => (
                    <tr
                      key={task.id}
                      className='group hover:bg-gray-50 transition-colors'
                    >
                      <td className='py-4 font-medium'>{task.title}</td>
                      <td className='py-4 text-gray-500'>{task.postedBy}</td>
                      <td className='py-4 font-semibold'>{task.budget}</td>
                      <td className='py-4'>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                            task.status === "In progress"
                              ? "bg-blue-50 text-blue-500"
                              : task.status === "Assigned"
                                ? "bg-yellow-50 text-yellow-500"
                                : "bg-green-50 text-green-500"
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className='py-4 text-gray-500'>{task.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className='space-y-8'>
          <Card className='border-none shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-lg font-bold'>
                Recent activity
              </CardTitle>
              <Button variant='link' className='text-sm text-gray-500'>
                See all
              </Button>
            </CardHeader>
            <CardContent className='space-y-6'>
              {[
                {
                  type: "Task Posted",
                  user: "adewale.t@taskhubdemo.com",
                  date: "1/29/2026, 11:12:47 AM",
                  detail: "Posted task: Fix Leaking Kitchen Sink",
                },
                {
                  type: "Task Assigned",
                  user: "segun.adebayo@taskhubdemo.com",
                  date: "1/29/2026, 11:12:47 AM",
                  detail: "Applied for task: Fix Leaking Kitchen Sink",
                },
                {
                  type: "Verification Submitted",
                  user: "ibrahim.y@taskhubdemo.com",
                  date: "1/29/2026, 11:12:47 AM",
                  detail: "Submitted NIN verification documents",
                },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className='relative pl-4 border-l-2 border-purple-500 py-1'
                >
                  <div className='absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-purple-500 border-2 border-white' />
                  <div className='text-sm font-bold'>{activity.type}</div>
                  <div className='text-xs text-gray-500 mt-1'>
                    {activity.user} • {activity.date}
                  </div>
                  <div className='text-xs text-gray-400 mt-1 italic'>
                    {activity.detail}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className='border-none shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg font-bold'>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>User to Tasker Ratio</span>
                <span className='font-semibold'>0.0:1</span>
              </div>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>Task Completion Rate</span>
                <span className='font-semibold'>8%</span>
              </div>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>Verified Users</span>
                <span className='font-semibold'>67</span>
              </div>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>Average Task Value</span>
                <span className='font-semibold'>₦45,000</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
