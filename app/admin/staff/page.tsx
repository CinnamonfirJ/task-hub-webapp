"use client";

import { useState } from "react";
import { 
  Search, 
  UserPlus,
  Filter
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock data for stats
const stats = [
  { label: "Total Admin", value: "7" },
  { label: "Active Today", value: "7", color: "text-green-600" },
  { label: "Super Admin", value: "1" },
];

// Mock data for admin users
const adminUsers = [
  {
    id: 1,
    name: "Adewale Thompson",
    email: "adewale.t@example.com",
    role: "Administrator",
    roleColor: "bg-purple-100 text-purple-700",
    joinDate: "11/15/2025",
    status: "Active",
  },
  {
    id: 2,
    name: "Adewale Thompson",
    email: "adewale.t@example.com",
    role: "Operations Admin",
    roleColor: "bg-purple-100 text-purple-700",
    joinDate: "11/15/2025",
    status: "Active",
  },
  {
    id: 3,
    name: "Adewale Thompson",
    email: "adewale.t@example.com",
    role: "Verification Admin",
    roleColor: "bg-purple-100 text-purple-700",
    joinDate: "11/15/2025",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Adewale Thompson",
    email: "adewale.t@example.com",
    role: "Support Admin",
    roleColor: "bg-purple-100 text-purple-700",
    joinDate: "11/15/2025",
    status: "Active",
  },
];

export default function StaffPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff & Admin Management</h1>
          <p className="text-sm text-gray-500">Manage administrative users and permissions</p>
        </div>
        <Button className="bg-[#6B46C1] hover:bg-[#5a3da1] text-white gap-2">
          <UserPlus size={18} /> Invite Admin
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border shadow-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className={`text-sm mt-1 ${stat.color || "text-gray-500"}`}>
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search name or email..." 
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-[#6B46C1]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={activeFilter === "All" ? "default" : "ghost"}
              onClick={() => setActiveFilter("All")}
              className={`h-9 px-4 text-xs font-semibold ${activeFilter === "All" ? "bg-black text-white hover:bg-black/90" : "text-gray-500 hover:text-gray-900"}`}
            >
              All
            </Button>
            {["Active", "Suspended", "Verified"].map((filter) => (
              <Button 
                key={filter}
                variant="ghost"
                onClick={() => setActiveFilter(filter)}
                className={`h-9 px-4 text-xs font-semibold ${activeFilter === filter ? "bg-black text-white hover:bg-black/90" : "text-gray-500 hover:text-gray-900"}`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Admin Users</h2>
        <div className="grid gap-4">
          {adminUsers.map((user) => (
            <Link href={`/admin/staff/${user.id}`} key={user.id}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-100">
                <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-full ${user.roleColor}`}>
                          {user.role}
                        </span>
                        <span className="text-gray-400">Joined {user.joinDate}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                     <Badge 
                      variant="secondary" 
                      className={`${
                        user.status === "Active" 
                          ? "bg-green-100 text-green-700 hover:bg-green-100" 
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      } font-medium`}
                    >
                      {user.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
