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
  parentCategory?: AdminCategory | null; // For creating subcategories
  isSaving?: boolean;
}

export function CategoryModal({
  isOpen,
  onClose,
  onSave,
  category,
  parentCategory,
  isSaving = false,
}: CategoryModalProps) {
  const isEditMode = !!category;
  const isSubcategory = !!parentCategory || !!(category?.parentCategory);

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    minimumPrice: "",
    isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name || "",
          displayName: category.displayName || category.name || "",
          description: category.description || "",
          minimumPrice: category.minimumPrice ? category.minimumPrice.toString() : "",
          isActive: category.isActive !== false,
        });
      } else {
        setFormData({
          name: "",
          displayName: "",
          description: "",
          minimumPrice: "",
          isActive: true,
        });
      }
    }
  }, [isOpen, category]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // If name is not set, use displayName as name (slugified)
    const name = formData.name || formData.displayName.toLowerCase().replace(/\s+/g, '-');
    const payload = {
      ...formData,
      name,
      parentCategory: parentCategory?._id,
      minimumPrice: Number(formData.minimumPrice.replace(/,/g, "")) || 0,
    };
    await onSave(payload);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      const formatted = new Intl.NumberFormat().format(Number(value));
      setFormData({ ...formData, minimumPrice: formatted });
    } else {
      setFormData({ ...formData, minimumPrice: "" });
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300'>
      <div className='bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar'>
        {/* Header */}
        <div className='p-8 pb-4 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-black text-gray-900 tracking-tight'>
              {isEditMode ? `Edit ${isSubcategory ? 'Sub-category' : 'Category'}` : `Add ${isSubcategory ? 'sub-category' : 'category'}`}
            </h2>
            {parentCategory && (
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                Under: {parentCategory.displayName || parentCategory.name}
              </p>
            )}
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='h-10 w-10 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-all'
          >
            <X size={24} />
          </Button>
        </div>

        {/* Content */}
        <div className='p-8 pt-4 space-y-6'>
          <div className='space-y-2'>
            <label className='text-[11px] font-black text-gray-400 uppercase tracking-widest'>
              {isSubcategory ? 'Sub-category' : 'Category'} Name
            </label>
            <Input
              placeholder={`Enter ${isSubcategory ? 'sub-category' : 'category'} name`}
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              className='h-14 rounded-2xl focus-visible:ring-black border-gray-100 bg-gray-50/50 text-sm font-bold placeholder:text-gray-300 placeholder:font-medium'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-[11px] font-black text-gray-400 uppercase tracking-widest'>
              Description
            </label>
            <Textarea
              placeholder='Brief description of this category'
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className='resize-none rounded-2xl focus-visible:ring-black border-gray-100 bg-gray-50/50 p-4 text-sm font-medium placeholder:text-gray-300'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-[11px] font-black text-gray-400 uppercase tracking-widest'>
              Minimum price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₦</span>
              <Input
                placeholder='e.g 15,000'
                value={formData.minimumPrice}
                onChange={handlePriceChange}
                className='h-14 pl-8 rounded-2xl focus-visible:ring-black border-gray-100 bg-gray-50/50 text-sm font-bold placeholder:text-gray-300 placeholder:font-medium'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-[11px] font-black text-gray-400 uppercase tracking-widest'>Status</label>
            <div className='flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 border border-gray-100'>
              <div>
                <div className='text-sm font-black text-gray-900'>
                  {formData.isActive ? "Active" : "Closed"}
                </div>
                <div className='text-[11px] text-gray-500 font-medium mt-0.5'>
                  {formData.isActive
                    ? "Visible and accepting new services"
                    : "Hidden from platform and new growth"}
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    isActive: checked,
                  })
                }
                className="data-[state=checked]:bg-black"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='p-8 border-t border-gray-50 flex items-center justify-end gap-3'>
          <Button
            variant='ghost'
            onClick={onClose}
            className='h-12 px-8 rounded-2xl text-gray-500 font-bold hover:bg-gray-100'
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.displayName || !formData.minimumPrice || isSaving}
            className='h-12 px-10 rounded-2xl bg-black hover:bg-gray-800 text-white font-black transition-all shadow-lg shadow-black/10'
          >
            {isSaving ? (
              <span className='flex items-center gap-2'>
                <div className='w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin' />
                Processing...
              </span>
            ) : (
              isEditMode ? "Update Changes" : `Add ${isSubcategory ? 'Sub-category' : 'Category'}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
