"use client";

import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Calendar, 
  Phone,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data for a single admin user
const adminUser = {
  id: "1",
  name: "Adewale Thompson",
  role: "Operations Admin",
  roleColor: "bg-purple-100 text-purple-700",
  email: "adewale.t@example.com",
  phone: "+234 803 456 7890",
  location: "Lagos, Nigeria",
  joinDate: "11/15/2025",
  adminId: "Demo1",
  lastUpdated: "1/20/2026, 3:15:00 PM",
  permissions: [
    "User and Tasker management",
    "KYC Verification",
    "Task Management",
    "Payment Oversight",
    "System Logs & Reports"
  ]
};

const activities = [
  {
    title: "Admin Action",
    description: "Approved KYC verification for Chukwudi Eze",
    date: "1/29/2026, 11:12:47 AM",
    type: "action"
  },
  {
    title: "User Suspended",
    description: "Suspended user: Mohammed Bello",
    date: "1/28/2026, 10:15:00 AM",
    type: "suspension"
  },
  {
    title: "Admin Action",
    description: "Updated task status to cancelled",
    date: "1/15/2026, 1:00:00 PM",
    type: "action"
  },
  {
    title: "Admin Action",
    description: "Reviewed report #R123",
    date: "1/29/2026, 11:12:47 AM",
    type: "action"
  }
];

export default function StaffDetailsPage() {
  const params = useParams();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/staff">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Staff & Admin Details</h1>
            <p className="text-sm text-gray-500">View and manage administrator information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-9 gap-2 text-xs">
            <Calendar size={14} /> Default
          </Button>
          <Button variant="outline" className="h-9 gap-2 text-xs">
            <Download size={14} /> Export
          </Button>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 md:items-start">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">{adminUser.name}</h2>
                <Badge variant="secondary" className={`${adminUser.roleColor} hover:${adminUser.roleColor}`}>
                  {adminUser.role}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  {adminUser.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  {adminUser.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  {adminUser.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  Joined {adminUser.joinDate}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border shadow-sm h-full">
          <CardHeader>
            <CardTitle className="text-base font-bold">Permission Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminUser.permissions.map((permission, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                {permission}
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              System Logs & Reports
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm h-full">
          <CardHeader>
            <CardTitle className="text-base font-bold">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="text-gray-500 mb-1">Admin ID</div>
              <div className="font-semibold text-gray-900">{adminUser.adminId}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Role</div>
              <div className="font-semibold text-gray-900">{adminUser.role}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Last Updated</div>
              <div className="font-semibold text-gray-900">{adminUser.lastUpdated}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold">Recent Activities</CardTitle>
          <Link href="#" className="text-xs text-gray-500 hover:text-gray-900">See all</Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 relative before:absolute before:left-[5px] before:top-2 before:h-[calc(100%-20px)] before:w-[2px] before:bg-gray-100">
            {activities.map((activity, idx) => (
              <div key={idx} className="relative pl-6">
                <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-purple-600 ring-4 ring-white" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-gray-900">{activity.title}</span>
                  <span className="text-xs text-gray-500">{activity.description}</span>
                  <span className="text-xs text-gray-400 mt-1">{activity.date}</span>
                </div>
                {idx < activities.length - 1 && <div className="border-b border-gray-100 mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
