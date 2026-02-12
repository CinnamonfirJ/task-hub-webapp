"use client";

import { useState } from "react";
import { 
  MoreVertical, 
  Search, 
  UserCircle2, 
  ExternalLink, 
  Ban,
  Download,
  Phone
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const summaryMetrics = [
  { label: "Total Users", value: "7" },
  { label: "Active", value: "7", color: "text-green-500" },
  { label: "Inactive", value: "30" },
  { label: "Verified", value: "67", color: "text-blue-500" },
  { label: "Suspended", value: "7", color: "text-red-500" },
  { label: "Pending KYC", value: "7", color: "text-yellow-500" },
  { label: "Total Tasks posted", value: "7" },
  { label: "Completed Tasks", value: "30" },
  { label: "Unverified", value: "67", color: "text-gray-400" },
  { label: "Disputes", value: "7", color: "text-red-500" },
];

const users = [
  { 
    id: 1, 
    name: "Adewale Thompson", 
    email: "adewale.t@example.com", 
    contact: "+234 803 456 7890", 
    status: "Active", 
    verification: "Verified", 
    lastActive: "7:24PM, 11/1/2025" 
  },
  { 
    id: 2, 
    name: "Chidinma Okonkwo", 
    email: "chidinma.o@example.com", 
    contact: "+234 803 456 7890", 
    status: "Active", 
    verification: "Not verified", 
    lastActive: "7:24PM, 11/1/2025" 
  },
  { 
    id: 3, 
    name: "Ibrahim Yusuf", 
    email: "ibrahim.y@example.com", 
    contact: "+234 803 456 7890", 
    status: "Active", 
    verification: "Pending", 
    lastActive: "7:24PM, 11/1/2025" 
  },
  { 
    id: 4, 
    name: "Ngozi Adekunle", 
    email: "ngozi.a@example.com", 
    contact: "+234 803 456 7890", 
    status: "Suspended", 
    verification: "Verified", 
    lastActive: "7:24PM, 11/1/2025" 
  },
  { 
    id: 5, 
    name: "Mohammed Bello", 
    email: "mohamed.b@example.com", 
    contact: "+234 803 456 7890", 
    status: "Active", 
    verification: "Not verified", 
    lastActive: "7:24PM, 11/1/2025" 
  },
];

export default function UsersManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Monitor system metrics and recent activity</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-sm h-10 px-4 gap-2">
            <MoreVertical size={16} /> Default
          </Button>
          <Button variant="outline" className="text-sm h-10 px-4 gap-2">
            <Download size={16} /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {summaryMetrics.map((metric, idx) => (
          <Card key={idx} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="text-xl font-bold">{metric.value}</div>
              <div className={`text-[10px] mt-1 ${metric.color || "text-gray-500"}`}>
                {metric.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search name or email..." 
                className="pl-10 h-10 bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-purple-200"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {["All", "Active", "Suspended", "Verified"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeFilter === filter 
                      ? "bg-gray-900 text-white" 
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y bg-gray-50/30 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">USER</th>
                  <th className="px-6 py-4">CONTACT</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4">VERIFICATION</th>
                  <th className="px-6 py-4">LAST ACTIVE</th>
                  <th className="px-6 py-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                          <UserCircle2 size={24} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500">
                      {user.contact}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                        user.status === 'Active' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                        user.verification === 'Verified' ? 'bg-blue-50 text-blue-500' :
                        user.verification === 'Pending' ? 'bg-yellow-50 text-yellow-500' :
                        'bg-red-50 text-red-400'
                      }`}>
                        {user.verification}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{user.lastActive}</td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
                            <ExternalLink size={14} /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-xs text-red-600 focus:text-red-600">
                            <Ban size={14} /> Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
