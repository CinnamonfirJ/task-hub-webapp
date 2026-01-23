"use client";

import { useTaskDetails } from "@/hooks/useTaskDetails";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

function SimpleBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    >
      {children}
    </span>
  );
}

export default function TaskDetailsPage() {
  const { task, isLoading, error, goBack } = useTaskDetails();

  if (isLoading) {
    return <div className="p-8 text-center">Loading task details...</div>;
  }

  if (error || !task) {
    return <div className="p-8 text-center text-red-500">Task not found</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={goBack} className="gap-2 mb-4">
        <ArrowLeft size={16} /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <span className="font-medium text-purple-600">
                      {typeof task.category === "object" ? task.category.name : "Category"}
                    </span>
                    <span>•</span>
                    <span>Posted {new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <SimpleBadge className="bg-green-100 text-green-700">
                  {task.status.toUpperCase()}
                </SimpleBadge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>

              {task.images && task.images.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {task.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
                      >
                        <img
                          src={img}
                          alt={`Task image ${idx + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-500 font-medium">Budget</span>
                <span className="text-2xl font-bold text-green-600">
                  ₦{task.budget.toLocaleString()}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase">Deadline</p>
                    <p className="font-medium">
                      {task.deadline ? new Date(task.deadline).toDateString() : "Flexible"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase">Location</p>
                    <p className="font-medium">{task.location || "Remote"}</p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-[#6B46C1] hover:bg-[#553C9A] py-6 text-lg">
                Place a Bid
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
