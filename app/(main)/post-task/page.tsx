"use client";

import { usePostTask } from "@/hooks/usePostTask";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  X,
  CalendarDays,
  Upload,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useRef, useEffect, useMemo } from "react";
import { useCategories, useUniversities } from "@/hooks/useCategories";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CloudinaryUpload from "@/components/CloudinaryUpload";

function PostTaskForm() {
  const { form, onSubmit, isSubmitting } = usePostTask();
  const searchParams = useSearchParams();

  const [tagInput, setTagInput] = useState("");
  const [showImages, setShowImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category selection state
  const { data: allCategories, isLoading: isLoadingCategories } = useCategories();
  const { data: universities, isLoading: isLoadingUni } = useUniversities();

  // Prefill main category from URL
  useEffect(() => {
    const mainCatId = searchParams.get("mainCategory");
    if (mainCatId && !form.getValues("mainCategory")) {
      form.setValue("mainCategory", mainCatId);
    }
  }, [searchParams, form]);

  const handleTaskImageUploadSuccess = (url: string, publicId: string) => {
    const currentImages = form.getValues("images") || [];
    if (currentImages.length >= 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    form.setValue("images", [...currentImages, { url, publicId }]);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const newTags = tagInput.split(",").map((tag) => tag.trim()).filter(Boolean);
    if (newTags.length === 0) return;

    const currentTags = form.getValues("tags") || [];
    const updatedTags = [...currentTags];
    newTags.forEach((tag) => {
      if (!updatedTags.includes(tag)) updatedTags.push(tag);
    });
    form.setValue("tags", updatedTags);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter((t) => t !== tag));
  };

  const selectedMainId = form.watch("mainCategory");
  const selectedSubIds = form.watch("categories") || [];
  const selectedUniId = form.watch("university");

  const toggleSubcategory = (id: string) => {
    const current = form.getValues("categories") || [];
    if (current.includes(id)) {
      form.setValue("categories", current.filter(i => i !== id));
    } else {
      form.setValue("categories", [...current, id]);
    }
  };

  const isCampusSelected = useMemo(() => {
    if (!selectedMainId || !allCategories) return false;
    const main = allCategories.find(m => m._id === selectedMainId);
    return main?.name?.toLowerCase().includes("campus");
  }, [selectedMainId, allCategories]);

  const canProceedToDetails = () => {
    if (!selectedMainId) return false;
    if (selectedSubIds.length === 0) return false;
    if (isCampusSelected && !selectedUniId) return false;
    return true;
  };

  // RESOLVE DISPLAY CATEGORIES
  const displayMainCategories = allCategories?.filter(c => !c.parentCategory) || [];
  const displaySubcategories = allCategories?.filter(s => {
    if (!s.parentCategory) return false;
    const parentId = typeof s.parentCategory === 'string' ? s.parentCategory : s.parentCategory?._id;
    return parentId === selectedMainId;
  }) || [];

  // SINGLE STEP LAYOUT
  return (
    <div className='flex flex-col mx-auto p-4 md:p-8 w-full max-w-4xl min-h-screen slide-in-from-right-8 animate-in duration-300'>
      <div className='mb-10'>
        <h1 className='text-3xl font-black text-gray-900'>Post a Task</h1>
        <p className='text-sm text-gray-400 font-medium'>
           Fill in the details below to find the right tasker for your needs.
        </p>
      </div>

      <form 
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          toast.error("Please fill in all required fields correctly.");
        })} 
        className='space-y-10 pb-20 max-w-4xl'
      >
        {/* Task Title */}
        <div className='space-y-3'>
          <Label className='text-sm font-bold text-gray-700'>Task title</Label>
          <Input
            {...form.register("title")}
            placeholder='e.g interior decoration'
            className='bg-gray-100/60 border-none h-14 rounded-xl px-5 focus-visible:ring-purple-400 placeholder:text-gray-300 font-medium'
          />
          {form.formState.errors.title && (
            <p className='text-xs text-red-500 font-medium px-1'>
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* SECTION 1: CATEGORY SELECTION */}
        <div className="space-y-8">
           {/* Main Category */}
           <div className="space-y-3">
             <Label className='text-sm font-bold text-gray-700'>Category</Label>
             <div className="relative">
               <select 
                 className='w-full h-14 bg-gray-100/60 border-none rounded-xl px-5 focus-visible:ring-purple-400 font-medium appearance-none outline-none cursor-pointer'
                 value={selectedMainId || ""}
                 onChange={(e) => {
                   form.setValue("mainCategory", e.target.value);
                   form.setValue("categories", []);
                   form.setValue("university", "");
                 }}
               >
                 <option value="" disabled>{isLoadingCategories ? "Loading categories..." : "Select a category"}</option>
                 {displayMainCategories.map(cat => (
                   <option key={cat._id} value={cat._id}>{cat.displayName}</option>
                 ))}
               </select>
               <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
               </div>
             </div>
             {form.formState.errors.mainCategory && (
               <p className='text-xs text-red-500 font-medium px-1'>
                 {form.formState.errors.mainCategory.message}
               </p>
             )}
           </div>

           {/* Subcategory */}
           <div className="space-y-3">
             <Label className='text-sm font-bold text-gray-700'>Subcategory</Label>
             <div className="relative">
               <select 
                 disabled={!selectedMainId}
                 className='w-full h-14 bg-gray-100/60 border-none rounded-xl px-5 focus-visible:ring-purple-400 font-medium appearance-none outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                 value=""
                 onChange={(e) => {
                   if (e.target.value) toggleSubcategory(e.target.value);
                 }}
               >
                 <option value="" disabled>
                   {!selectedMainId ? "Choose category first" : "Select a subcategory"}
                 </option>
                 {displaySubcategories.map(sub => (
                   <option key={sub._id} value={sub._id}>{sub.displayName}</option>
                 ))}
               </select>
               <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
               </div>
             </div>
             
              {/* Selected Subcategories Tags */}
             {selectedSubIds.length > 0 && (
               <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSubIds.map(id => {
                    const sub = allCategories?.find(s => s._id === id);
                    if (!sub) return null;
                    return (
                      <span key={id} className="bg-purple-100 text-[#6B46C1] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-purple-200">
                        {sub.displayName}
                        <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => toggleSubcategory(id)} />
                      </span>
                    );
                  })}
               </div>
             ) || selectedMainId && displaySubcategories.length === 0 && (
                <p className="text-[11px] text-gray-500 italic">No subcategories available for this category yet.</p>
             )}

             {form.formState.errors.categories && (
               <p className='text-xs text-red-500 font-medium px-1'>
                 {form.formState.errors.categories.message}
               </p>
             )}
           </div>

           {/* University (if campus) */}
           {isCampusSelected && (
             <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label className='text-sm font-bold text-gray-700'>University</Label>
                <div className="relative">
                  <select 
                    className='w-full h-14 bg-[#6B46C1]/5 border border-purple-100 rounded-xl px-5 outline-none focus:ring-2 focus:ring-purple-400 font-medium appearance-none cursor-pointer'
                    value={selectedUniId || ""}
                    onChange={(e) => form.setValue("university", e.target.value)}
                  >
                    <option value="" disabled>{isLoadingUni ? "Loading universities..." : "Select your university"}</option>
                    {universities?.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.abbreviation})</option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
               </div>
             </div>
           )}
        </div>

        {/* Dual Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment offer */}
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <Label className='text-sm font-bold text-gray-700'>
                Payment offer (#)
              </Label>
              <div className='flex items-center gap-3'>
                <span className='text-[10px] font-bold text-gray-400 uppercase tracking-tight'>
                  Bargain
                </span>
                <Switch
                  checked={form.watch("isBiddingEnabled")}
                  onCheckedChange={(val: boolean) =>
                    form.setValue("isBiddingEnabled", val)
                  }
                  className='data-[state=checked]:bg-[#6B46C1] scale-75'
                />
              </div>
            </div>
            <Input
              {...form.register("budget")}
              placeholder='4000.00'
              type="number"
              className='bg-gray-100/60 border-none h-14 rounded-xl px-4 focus-visible:ring-purple-400 placeholder:text-gray-300 font-medium font-mono text-lg'
            />
            {form.formState.errors.budget && (
              <p className='text-xs text-red-500 font-medium px-1'>
                {form.formState.errors.budget.message}
              </p>
            )}
          </div>

          {/* Deadline */}
          <div className='space-y-3'>
            <Label className='text-sm font-bold text-gray-700'>
              Due Date
            </Label>
            <div className='relative'>
              <Input
                type='date'
                {...form.register("dueDate")}
                className='bg-gray-100/60 border-none h-14 rounded-xl px-5 focus-visible:ring-purple-400 placeholder:text-gray-300 appearance-none inline-flex items-center font-medium'
              />
              <CalendarDays
                className='absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
                size={20}
              />
            </div>
            {form.formState.errors.dueDate && (
              <p className='text-xs text-red-500 font-medium px-1'>
                {form.formState.errors.dueDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Task Description */}
        <div className='space-y-3'>
          <Label className='text-sm font-bold text-gray-700'>
            Description
          </Label>
          <Textarea
            {...form.register("description")}
            placeholder='Write a brief description about the task you are posting...'
            className='bg-gray-100/60 border-none rounded-xl px-5 py-5 min-h-[160px] focus-visible:ring-purple-400 placeholder:text-gray-300 resize-none ring-0 focus-within:ring-0 ring-offset-0 font-medium'
          />
          {form.formState.errors.description && (
            <p className='text-xs text-red-500 font-medium px-1'>
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {/* Task images */}
        <Card className='border border-gray-100 shadow-none rounded-2xl overflow-hidden'>
          <CardContent className='p-6 space-y-4'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-bold text-gray-700'>
                Reference Images
              </span>
              <Switch
                checked={showImages}
                onCheckedChange={(val) => {
                  setShowImages(val);
                  if (!val) form.setValue("images", []);
                }}
                className='data-[state=checked]:bg-[#6B46C1] scale-90'
              />
            </div>
            <p className='text-[13px] text-gray-400 font-medium tracking-tight'>
              Upload task images to help find taskers faster
            </p>

            {showImages && (
              <div className='space-y-4 mt-2'>
                <CloudinaryUpload
                  onSuccess={handleTaskImageUploadSuccess}
                  folder="task-images"
                  variant="box"
                  buttonText="Upload Task Photos"
                  multiple={true}
                  maxFiles={5}
                  className="bg-purple-50/30 border-purple-100"
                />

                {form.watch("images") && form.watch("images")!.length > 0 && (
                  <div className='grid grid-cols-3 md:grid-cols-4 gap-3'>
                    {form.watch("images")?.map((img: any, index: number) => (
                      <div
                        key={index}
                        className='relative group aspect-square rounded-xl overflow-hidden border border-gray-200'
                      >
                        <img
                          src={img.url}
                          alt={`Task image ${index + 1}`}
                          className='w-full h-full object-cover'
                        />
                        <button
                          type='button'
                          onClick={() => {
                            const currentImages = form.getValues("images") || [];
                            form.setValue("images", currentImages.filter((_, i) => i !== index));
                          }}
                          className='absolute top-1.5 right-1.5 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg z-10'
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <div className='space-y-3'>
          <Label className='text-sm font-bold text-gray-700'>Tags</Label>
          <div className='flex gap-2 relative'>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder='e.g urgent, indoor'
              className='bg-gray-100/60 border-none h-14 rounded-xl px-5 focus-visible:ring-purple-400 flex-1 font-medium'
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddTag())
              }
            />
            <Button
              type='button'
              onClick={handleAddTag}
              variant="outline"
              className='border-purple-200 text-[#6B46C1] hover:bg-purple-50 h-14 px-6 rounded-xl font-bold'
            >
              Add
            </Button>
          </div>

          <div className='flex flex-wrap gap-2 mt-3'>
            {form.watch("tags")?.map((tag: string) => (
              <span
                key={tag}
                className='bg-[#F5EEFF] text-[#6B46C1] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-purple-100'
              >
                {tag}
                <X
                  size={14}
                  className='cursor-pointer text-purple-400 hover:text-red-500'
                  onClick={() => removeTag(tag)}
                />
              </span>
            ))}
          </div>
        </div>

        <Button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-[#6B46C1] hover:bg-[#553C9A] h-[60px] text-lg font-black rounded-2xl shadow-xl shadow-purple-500/20 transition-all active:scale-[0.99] mt-6'
        >
          {isSubmitting ? (
            <Loader2 className='w-6 h-6 animate-spin mr-2' />
          ) : null}
          Post Task
        </Button>
      </form>
    </div>
  );
}

export default function PostTaskPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#6B46C1]" />
        <p className="mt-4 text-gray-500 font-medium">Loading form...</p>
      </div>
    }>
      <PostTaskForm />
    </Suspense>
  );
}
