"use client";

import { 
  ArrowLeft, 
  Ban, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Star,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TaskerDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/taskers">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasker Details</h1>
            <p className="text-sm text-gray-500">View and manage User Information</p>
          </div>
        </div>
        <Button variant="destructive" className="gap-2 h-10 px-6 font-semibold">
          <Ban size={18} /> Suspend Tasker
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h2 className="text-xl font-bold">Adewale Thompson</h2>
                  <span className="bg-blue-50 text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded-full">VERIFIED</span>
                  <span className="bg-green-50 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-8">
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
                  <Mail size={16} className="text-gray-400" />
                  adewale.t@example.com
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
                  <Phone size={16} className="text-gray-400" />
                  +234 803 456 7890
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
                  <MapPin size={16} className="text-gray-400" />
                  Lagos, Nigeria
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
                  <Calendar size={16} className="text-gray-400" />
                  Joined 11/15/2025
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">KYC Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs text-gray-400 font-medium">NIN</div>
              <div className="text-sm font-bold mt-1">12345678901</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Verification Status</div>
              <div className="mt-2">
                <span className="bg-blue-50 text-blue-500 text-[10px] font-bold px-3 py-1 rounded-full">Verified</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Rating</span>
              <span className="font-bold flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" /> 4.5
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Completion Rate</span>
              <span className="font-bold">92%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Completed Tasks</span>
              <span className="font-bold">8</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Total Transaction</span>
              <span className="font-bold">₦250,000</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Current balance</span>
              <span className="font-bold">₦50,000</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs text-gray-400 font-medium">User ID</div>
              <div className="text-sm font-bold mt-1">Demo1</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Role</div>
              <div className="text-sm font-bold mt-1">User</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Last Updated</div>
              <div className="text-sm font-bold mt-1">1/20/2026, 3:15:00 PM</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Service Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <span className="px-4 py-2 bg-gray-50 text-gray-600 text-xs font-medium rounded-md border">Plumbing</span>
            <span className="px-4 py-2 bg-gray-50 text-gray-600 text-xs font-medium rounded-md border">Electrical repairs</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100" />
                  <div>
                    <div className="text-sm font-bold">John Doe</div>
                    <div className="text-[10px] text-gray-400">2days Ago</div>
                  </div>
                </div>
                <div className="flex gap-0.5 text-yellow-500">
                  <Star size={14} className="fill-current" />
                  <Star size={14} className="fill-current" />
                  <Star size={14} className="fill-current" />
                  <Star size={14} className="fill-current" />
                  <Star size={14} className="fill-current" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Excellent work! Very professional and completed the task ahead of schedule.</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Activity Log</CardTitle>
          <Button variant="link" className="text-sm text-gray-400">See all</Button>
        </CardHeader>
        <CardContent className="space-y-8">
          {[
            { title: "Login", detail: "Logged in from Lagos, Nigeria", date: "1/29/2026, 11:12:47 AM" },
            { title: "Task Completed", detail: "Completed Task: Graphic Design Project", date: "1/28/2026, 10:15:00 AM" },
            { title: "Profile Update", detail: "Updated profile information", date: "1/15/2026, 1:00:00 PM" },
          ].map((activity, idx) => (
            <div key={idx} className="relative pl-6 border-l-2 border-purple-500 pb-2">
              <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-purple-500 border-2 border-white" />
              <div className="text-sm font-bold">{activity.title}</div>
              <div className="text-xs text-gray-500 mt-1 italic">{activity.detail}</div>
              <div className="text-[10px] text-gray-400 mt-1">{activity.date}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
