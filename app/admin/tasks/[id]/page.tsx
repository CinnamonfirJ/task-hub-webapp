"use client";

import { 
  ArrowLeft, 
  XCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle2 } from "lucide-react";
import Link from "next/link";

export default function TaskDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/tasks">
            <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200">
              <ArrowLeft size={18} className="text-gray-400" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Details</h1>
            <p className="text-sm text-gray-500">View and manage task information</p>
          </div>
        </div>
        <Button className="bg-red-500 hover:bg-red-600 gap-2 h-10 px-6 font-bold text-sm">
          <XCircle size={18} /> Cancel task
        </Button>
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">Fix Leaking Kitchen Sink</h2>
                <span className="bg-blue-50 text-blue-500 text-[10px] font-bold px-3 py-1 rounded-full">In progress</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-3xl">
                Certified plumber and electrician with 10 years of professional experience in residential and commercial maintenance
              </p>
              <div className="flex gap-2">
                 <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-md border border-gray-100">Electrical repairs</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
               <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Budget</div>
               <div className="text-2xl font-bold text-gray-900 mt-1">40,000</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Task Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Posted By</div>
              <div className="text-sm font-medium text-gray-500 mt-1">aisha.musa@taskhubdemo.com</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Deadline</div>
              <div className="text-sm font-bold text-gray-500 mt-1">2/5/2026</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Negotiable</div>
              <div className="text-sm font-bold text-gray-900 mt-1 uppercase">Yes</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Assigned Tasker</div>
              <div className="text-sm font-medium text-gray-500 mt-1">segun.adebayo@taskhubdemo.com</div>
            </div>
            <div className="mt-2">
              <span className="bg-blue-50 text-blue-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase">In progress</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm font-medium">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Created</div>
              <div className="text-sm text-gray-900 font-bold mt-1">1/29/2026, 11:12:47 AM</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Deadline</div>
              <div className="text-sm text-gray-900 font-bold mt-1">1/29/2026, 11:12:47 AM</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Last Updated</div>
              <div className="text-sm text-gray-900 font-bold mt-1">1/29/2026, 11:12:47 AM</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Applicants/ Bids</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-5 border border-gray-100 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                  <UserCircle2 size={32} />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Mike Tasker</div>
                  <div className="text-xs text-gray-500 font-medium">Applied 2 days ago</div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                 <span className="text-xs text-gray-400 font-medium">Bid: </span>
                 <span className="text-sm font-bold text-gray-900 font-sans tracking-tight">₦13,500</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
