"use client";

import { X, AlertCircle, Info, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "info" | "danger" | "success";
  icon?: "info" | "warning" | "shield";
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "info",
  icon = "info",
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const icons = {
    info: <Info className="h-6 w-6 text-blue-500" />,
    warning: <AlertCircle className="h-6 w-6 text-orange-500" />,
    shield: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
  };

  const variants = {
    info: "bg-[#6B46C1] hover:bg-[#553C9A]",
    danger: "bg-red-600 hover:bg-red-700",
    success: "bg-emerald-600 hover:bg-emerald-700",
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn(
                "p-2 rounded-xl",
                variant === "info" ? "bg-blue-50" : 
                variant === "danger" ? "bg-red-50" : "bg-emerald-50"
            )}>
              {icons[icon]}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 py-6 rounded-2xl border-none bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold"
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            className={cn(
                "flex-1 py-6 rounded-2xl text-white font-bold shadow-lg transition-all",
                variants[variant]
            )}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
