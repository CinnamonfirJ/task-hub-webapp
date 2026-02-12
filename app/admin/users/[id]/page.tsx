"use client";

import { 
  ArrowLeft, 
  Ban, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            <p className="text-sm text-gray-500">View and manage User Information</p>
          </div>
        </div>
        <Button variant="destructive" className="gap-2 h-10 px-6 font-semibold">
          <Ban size={18} /> Suspend User
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
              <span className="text-gray-500">Total Tasks</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Active Tasks</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Completed Tasks</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Total Transaction</span>
              <span className="font-bold">0</span>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Posted Tasks (3)</CardTitle>
          <Button variant="link" className="text-sm text-gray-400">See all</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-[10px] text-gray-400 font-bold uppercase tracking-wider pb-4">
                  <th className="pb-4">TITLE</th>
                  <th className="pb-4">BUDGET</th>
                  <th className="pb-4">STATUS</th>
                  <th className="pb-4">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {[
                  { title: "House Cleaning", budget: "₦15,000", status: "In progress", date: "12/12/2025, 12:20:00 PM", statusColor: "text-blue-500 bg-blue-50" },
                  { title: "Plumbing Repair", budget: "₦25,000", status: "Completed", date: "12/12/2025, 12:20:00 PM", statusColor: "text-green-500 bg-green-50" },
                  { title: "Graphic Design Project", budget: "₦50,000", status: "Open", date: "12/12/2025, 12:20:00 PM", statusColor: "text-green-500 bg-green-50" },
                ].map((task, idx) => (
                  <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium text-gray-900">{task.title}</td>
                    <td className="py-4 font-bold text-gray-900">{task.budget}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${task.statusColor}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-500">{task.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Transaction History</CardTitle>
          <Button variant="link" className="text-sm text-gray-400">See all</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-4">DESCRIPTION</th>
                  <th className="pb-4">TYPE</th>
                  <th className="pb-4">AMOUNT</th>
                  <th className="pb-4">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {[
                  { desc: "Payment for completed task", type: "Credit", typeColor: "bg-green-50 text-green-500", amount: "₦15,000", date: "12/12/2025, 12:20:00 PM" },
                  { desc: "Wallet funding", type: "Credit", typeColor: "bg-green-50 text-green-500", amount: "₦55,000", date: "12/12/2025, 12:20:00 PM" },
                  { desc: "Task payment to tasker", type: "Debit", typeColor: "bg-red-50 text-red-500", amount: "₦25,000", date: "12/12/2025, 12:20:00 PM" },
                ].map((tx, idx) => (
                  <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium text-gray-900">{tx.desc}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tx.typeColor}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-gray-900">{tx.amount}</td>
                    <td className="py-4 text-gray-500">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            { title: "Task posted", detail: "Posted new task: Graphic Design Project", date: "1/28/2026, 10:15:00 AM" },
            { title: "Payment Made", detail: "Made payment of ₦25,000", date: "1/20/2026, 4:45:00 PM" },
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
