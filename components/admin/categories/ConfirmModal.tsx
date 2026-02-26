"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmModalProps) {
  const confirmClass =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white shadow-none"
      : variant === "warning"
        ? "bg-amber-500 hover:bg-amber-600 text-white shadow-none"
        : "bg-[#6B46C1] hover:bg-[#553098] text-white shadow-none";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='rounded-2xl max-w-sm border border-gray-100 shadow-xl p-6'>
        <DialogHeader className='space-y-2'>
          <DialogTitle className='text-base font-bold text-gray-900'>
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className='text-sm text-gray-500 leading-relaxed'>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter className='flex flex-row justify-end gap-3 mt-6'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
            className='rounded-xl h-10 px-5 border-gray-200 text-gray-700'
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-xl h-10 px-5 ${confirmClass}`}
          >
            {isLoading && <Loader2 size={14} className='mr-2 animate-spin' />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
