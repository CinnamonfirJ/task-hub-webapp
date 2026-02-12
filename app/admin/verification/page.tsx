"use client";

import { useState } from "react";
import { 
  Search, 
  Download
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const kycMetrics = [
  { label: "Total Submissions", value: "14" },
  { label: "Pending Review", value: "14" },
  { label: "Approved", value: "14" },
  { label: "Rejected", value: "14" },
  { label: "Verified Users", value: "14" },
  { label: "Verified Taskers", value: "14" },
];

export default function KYCManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KYC / Verification Management</h1>
          <p className="text-sm text-gray-500">Review and manage identity verifications</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-sm h-10 px-4 gap-2 border-gray-200 text-gray-600">
             Default
          </Button>
          <Button variant="outline" className="text-sm h-10 px-4 gap-2 border-gray-200 text-gray-600">
            <Download size={16} /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {kycMetrics.map((metric, idx) => (
          <Card key={idx} className="border border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="text-[10px] text-gray-400 font-medium text-center md:text-left">{metric.label}</div>
              <div className="text-xl font-bold mt-1 text-center md:text-left">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-0">
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <Input 
                placeholder="Search name , email or NIN..." 
                className="pl-10 h-10 bg-gray-50/50 border border-gray-100 focus-visible:ring-1 focus-visible:ring-purple-200"
              />
            </div>
            <div className="flex items-center gap-2">
              {["All", "Pending", "Approved", "Rejected"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    activeFilter === filter 
                      ? "bg-gray-900 text-white" 
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="py-12 flex flex-col items-center justify-center text-gray-300">
             {/* Empty state or table would go here based on filter */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
