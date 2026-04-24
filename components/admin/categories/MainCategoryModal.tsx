"use client";

import { useState, useEffect } from "react";
import { X, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface MainCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  category?: any;
  isSaving: boolean;
}

export function MainCategoryModal({
  isOpen,
  onClose,
  onSave,
  category,
  isSaving,
}: MainCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    icon: "Layers",
    isActive: true,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        displayName: category.displayName || "",
        description: category.description || "",
        icon: category.icon || "Layers",
        isActive: category.isActive !== false,
      });
    } else {
      setFormData({
        name: "",
        displayName: "",
        description: "",
        icon: "Layers",
        isActive: true,
      });
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug =
      formData.name || formData.displayName.toLowerCase().replace(/\s+/g, "-");
    await onSave({ ...formData, name: slug });
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-white rounded-lg w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar'>
        <div className='p-8 border-b border-gray-50 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600'>
              <Layers size={20} />
            </div>
            <div>
              <h2 className='text-xl font-bold text-gray-900'>
                {category ? "Edit" : "New"} Main Category
              </h2>
              <p className='text-xs text-gray-500 font-medium'>
                Top-level service cluster
              </p>
            </div>
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='rounded-full'
          >
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className='p-8 space-y-6'>
          <div className='space-y-2'>
            <label className='text-[11px] font-black text-gray-400 uppercase tracking-widest'>
              Display Name
            </label>
            <Input
              placeholder='e.g. Local Services'
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              className='h-12 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-black font-bold'
              required
            />
          </div>

          <div className='space-y-2'>
            <label className='text-[11px] font-black text-gray-400 uppercase tracking-widest'>
              Internal Name / Slug
            </label>
            <Input
              placeholder='e.g. local-services'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className='h-12 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-black font-mono text-sm'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-[11px] font-black text-gray-400 uppercase tracking-widest'>
              Description
            </label>
            <Textarea
              placeholder='Describe what services fall under this category...'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className='min-h-[100px] bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-black resize-none'
              required
            />
          </div>

          <div className='flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl'>
            <div>
              <p className='text-sm font-bold text-gray-900'>Active Status</p>
              <p className='text-[10px] text-gray-500 font-medium'>
                Visible to users when posting tasks
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
              className='data-[state=checked]:bg-black'
            />
          </div>

          <div className='pt-4 flex items-center justify-end gap-3'>
            <Button
              type='button'
              variant='ghost'
              onClick={onClose}
              className='rounded-xl h-11 px-6 font-bold text-gray-500'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSaving || !formData.displayName}
              className='rounded-xl h-11 px-8 bg-black hover:bg-gray-800 text-white font-bold transition-all shadow-lg shadow-black/10'
            >
              {isSaving
                ? "Saving..."
                : category
                  ? "Update Category"
                  : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
