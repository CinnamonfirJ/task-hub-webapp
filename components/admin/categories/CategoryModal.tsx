"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AdminCategory } from "@/types/admin";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  category?: AdminCategory | null; // null for add mode, category object for edit mode
  isSaving?: boolean;
}

export function CategoryModal({
  isOpen,
  onClose,
  onSave,
  category,
  isSaving = false,
}: CategoryModalProps) {
  const isEditMode = !!category;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minPrice: "",
    status: "Active" as "Active" | "Closed",
  });

  // Reset or populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name || "",
          description: category.description || "",
          minPrice: category.minPrice ? category.minPrice.toString() : "",
          status: category.status || "Active",
        });
      } else {
        setFormData({
          name: "",
          description: "",
          minPrice: "",
          status: "Active",
        });
      }
    }
  }, [isOpen, category]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      minPrice: Number(formData.minPrice.replace(/,/g, "")) || 0,
    };
    await onSave(payload);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic formatting for currency input
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      const formatted = new Intl.NumberFormat().format(Number(value));
      setFormData({ ...formData, minPrice: formatted });
    } else {
      setFormData({ ...formData, minPrice: "" });
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl md:rounded-[2rem] w-full max-w-lg overflow-hidden shadow-xl animate-in zoom-in-95 duration-200'>
        {/* Header */}
        <div className='p-6 md:px-8 border-b border-gray-100 flex items-center justify-between'>
          <h2 className='text-xl md:text-2xl font-bold text-gray-900'>
            {isEditMode ? "Edit Category" : "Add category"}
          </h2>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='h-8 w-8 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100'
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className='p-6 md:p-8 space-y-6'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900'>
              Category name
            </label>
            <Input
              placeholder='Enter category name'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className='h-12 rounded-xl focus-visible:ring-[#6B46C1] border-gray-200'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900'>
              Description
            </label>
            <Textarea
              placeholder='Brief description of this category'
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className='resize-none rounded-xl focus-visible:ring-[#6B46C1] border-gray-200 p-3'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900'>
              Set minimum price
            </label>
            <Input
              placeholder='e.g 15,000'
              value={formData.minPrice}
              onChange={handlePriceChange}
              className='h-12 rounded-xl focus-visible:ring-[#6B46C1] border-gray-200'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900'>Status</label>
            <div className='flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-100'>
              <div>
                <div className='text-sm font-bold text-gray-900'>
                  {formData.status}
                </div>
                <div className='text-xs text-gray-500 mt-0.5'>
                  {formData.status === "Active"
                    ? "Category is visible and accepting new services"
                    : "Category is hidden and not accepting new services"}
                </div>
              </div>
              <Switch
                checked={formData.status === "Active"}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    status: checked ? "Active" : "Closed",
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='p-6 md:px-8 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50'>
          <Button
            variant='outline'
            onClick={onClose}
            className='h-11 px-6 rounded-xl border-gray-200 hover:bg-white text-gray-900'
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.minPrice || isSaving}
            className='h-11 px-6 rounded-xl bg-[#6B46C1] hover:bg-[#5A3AA3] text-white'
          >
            {isSaving ? (
              <span className='flex items-center gap-2'>
                <div className='w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin' />
                Saving...
              </span>
            ) : (
              "Save Category"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
