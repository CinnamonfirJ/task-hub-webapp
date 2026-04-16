"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Download, 
  FileText, 
  Calendar, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { 
  useExportDashboard, 
  useExportTasks, 
  useExportPayments, 
  useExportUsers, 
  useExportTaskers 
} from "@/hooks/useAdmin";
import { toast } from "sonner";

export type ExportType = "dashboard" | "tasks" | "payments" | "users" | "taskers";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: ExportType;
}

export function ExportModal({ isOpen, onClose, type = "dashboard" }: ExportModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [format, setFormat] = useState("csv");

  const exportDashboard = useExportDashboard();
  const exportTasks = useExportTasks();
  const exportPayments = useExportPayments();
  const exportUsers = useExportUsers();
  const exportTaskers = useExportTaskers();

  const getExportMutation = () => {
    switch (type) {
      case "dashboard": return exportDashboard;
      case "tasks": return exportTasks;
      case "payments": return exportPayments;
      case "users": return exportUsers;
      case "taskers": return exportTaskers;
      default: return exportDashboard;
    }
  };

  const mutation = getExportMutation();
  const isPending = mutation.isPending;

  const handleExport = async () => {
    try {
      const params = (type === "dashboard" || type === "tasks") 
        ? { startDate, endDate } 
        : undefined;

      mutation.mutate(params as any, {
        onSuccess: (data: any) => {
          toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully!`);
          
          // In a real app, 'data' would be a URL or a blob
          // For now, we simulate the download if the API returns a blob/url
          if (data?.url) {
            window.open(data.url, "_blank");
          }
          
          onClose();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to export data");
        }
      });
    } catch (error) {
      toast.error("An unexpected error occurred during export");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-[#6B46C1] p-8 text-white">
          <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
            <Download size={24} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white">Export Data</DialogTitle>
            <p className="text-purple-100 text-sm font-medium mt-1">
              Select your preferences to download report.
            </p>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Export Category</Label>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl text-[#6B46C1] shadow-sm">
                  <FileText size={18} />
                </div>
                <span className="font-bold text-gray-900 capitalize">{type} Records</span>
              </div>
            </div>

            {(type === "dashboard" || type === "tasks") && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start" className="text-xs font-black uppercase tracking-widest text-gray-400">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <Input 
                      id="start"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pl-10 h-12 bg-gray-50 border-gray-100 rounded-xl font-bold text-sm focus:ring-[#6B46C1]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end" className="text-xs font-black uppercase tracking-widest text-gray-400">End Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <Input 
                      id="end"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="pl-10 h-12 bg-gray-50 border-gray-100 rounded-xl font-bold text-sm focus:ring-[#6B46C1]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">File Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-100 rounded-xl font-bold focus:ring-[#6B46C1]">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="csv" className="font-bold">CSV (Comma Separated Values)</SelectItem>
                  <SelectItem value="xlsx" className="font-bold">Excel Spreadshet (.xlsx)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Button 
              onClick={handleExport}
              disabled={isPending}
              className="w-full bg-[#6B46C1] hover:bg-[#553C9A] h-14 rounded-2xl font-black text-lg shadow-lg shadow-purple-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Download size={20} />
                  <span>Download Report</span>
                </div>
              )}
            </Button>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-full h-12 rounded-xl font-bold text-gray-400 hover:text-gray-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
