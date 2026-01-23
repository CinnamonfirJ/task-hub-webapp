"use client"

import { usePostTask } from "@/hooks/usePostTask";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  X, 
  ChevronDown, 
  CalendarDays, 
  Upload, 
  Loader2, 
  Image as ImageIcon 
} from "lucide-react";
import { useState } from "react";

export default function PostTaskPage() {
  const {
    form,
    onSubmit,
    categories,
    isLoadingCategories,
    isSubmitting,
  } = usePostTask();

  const [tagInput, setTagInput] = useState("");
  const [showImages, setShowImages] = useState(false);

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const currentTags = form.getValues("tags") || [];
    if (!currentTags.includes(tagInput.trim())) {
      form.setValue("tags", [...currentTags, tagInput.trim()]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter((t) => t !== tag));
  };

  const toggleCategory = (catId: string) => {
    const currentCats = form.getValues("categories") || [];
    if (currentCats.includes(catId)) {
      form.setValue("categories", currentCats.filter((id) => id !== catId));
    } else if (currentCats.length < 3) {
      form.setValue("categories", [...currentCats, catId]);
    }
  };

  return (
    <div className="flex flex-col mx-auto p-4 md:p-8 w-full max-w-4xl min-h-screen">
      <div className="mb-10 text-left">
        <h1 className="text-2xl font-bold text-gray-900">Post task</h1>
        <p className="text-sm text-gray-400">Create a task of your choice and post for taskers to be up to the task</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
        {/* Task Title */}
        <div className="space-y-3">
          <Label className="text-sm font-bold text-gray-700">Task title</Label>
          <Input 
            {...form.register("title")}
            placeholder="e.g interior decoration" 
            className="bg-gray-100/60 border-none h-14 rounded-xl px-5 focus-visible:ring-purple-400 placeholder:text-gray-300"
          />
          {form.formState.errors.title && <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.title.message}</p>}
        </div>

        {/* Task Category */}
        <div className="space-y-3">
          <Label className="text-sm font-bold text-gray-700">Task Category</Label>
          <div className="relative">
            <div className="min-h-14 w-full bg-gray-100/60 rounded-xl px-5 py-3 flex flex-wrap gap-2 items-center cursor-pointer group">
              {form.watch("categories")?.length > 0 ? (
                form.watch("categories").map((catId: string) => {
                  const cat = categories?.find(c => c._id === catId);
                  return (
                    <span key={catId} className="bg-purple-100 text-[#6B46C1] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      {cat?.name || "Category"}
                      <X size={14} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleCategory(catId); }} />
                    </span>
                  );
                })
              ) : (
                <span className="text-sm text-gray-300">Select category (Max 3)</span>
              )}
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors" size={20} />
            </div>

            {/* Dropdown - Simple version for now */}
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden hidden group-focus-within:block focus-within:block">
              <div className="max-h-60 overflow-y-auto p-2">
                {isLoadingCategories ? (
                  <div className="p-4 text-center"><Loader2 className="animate-spin mx-auto text-purple-400" /></div>
                ) : categories?.map((cat) => (
                  <div 
                    key={cat._id}
                    onClick={() => toggleCategory(cat._id)}
                    className={`p-3 rounded-xl cursor-pointer text-sm font-medium transition-colors ${
                      form.watch("categories")?.includes(cat._id) 
                        ? "bg-[#6B46C1] text-white" 
                        : "hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {form.formState.errors.categories && <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.categories.message}</p>}
        </div>

        {/* Payment offer */}
        <div className="space-y-3">
           <div className="flex justify-between items-center">
             <Label className="text-sm font-bold text-gray-700">Payment offer (#)</Label>
             <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-tight italic">Bargain</span>
                <Switch 
                  checked={form.watch("isBiddingEnabled")}
                  onCheckedChange={(val: boolean) => form.setValue("isBiddingEnabled", val)}
                  className="data-[state=checked]:bg-[#6B46C1]"
                />
             </div>
           </div>
           <Input 
             {...form.register("budget")}
             placeholder="e.g 400.00" 
             className="bg-gray-100/60 border-none h-14 rounded-xl px-4 focus-visible:ring-purple-400 placeholder:text-gray-300"
           />
           {form.formState.errors.budget && <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.budget.message}</p>}
        </div>

        {/* Deadline */}
        <div className="space-y-3">
          <Label className="text-sm font-bold text-gray-700">Deadline ( End date )</Label>
          <div className="relative">
            <Input 
              type="date"
              {...form.register("deadline")}
              className="bg-gray-100/60 border-none h-14 rounded-xl px-5 focus-visible:ring-purple-400 placeholder:text-gray-300 appearance-none inline-flex items-center"
            />
            <CalendarDays className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
          {form.formState.errors.deadline && <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.deadline.message}</p>}
        </div>

        {/* Task Description */}
        <div className="space-y-3">
          <Label className="text-sm font-bold text-gray-700">Task Description</Label>
          <Textarea 
             {...form.register("description")}
             placeholder="Write a brief description about the task you are about posting" 
             className="bg-gray-100/60 border-none rounded-xl px-5 py-5 min-h-[160px] focus-visible:ring-purple-400 placeholder:text-gray-300 resize-none ring-0 focus-within:ring-0 ring-offset-0"
          />
          {form.formState.errors.description && <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.description.message}</p>}
        </div>

        {/* Task images */}
        <Card className="border border-gray-100 shadow-none rounded-xl overflow-hidden">
          <CardContent className="p-6 space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">Task images</span>
                <Switch 
                  checked={showImages}
                  onCheckedChange={setShowImages}
                  className="data-[state=checked]:bg-[#6B46C1]"
                />
             </div>
             <p className="text-xs text-gray-400 font-medium tracking-tight">Upload task images to help find taskers faster</p>
             
             {showImages && (
               <div className="border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-gray-50 transition-colors bg-gray-50/30">
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-10 py-4 rounded-xl">Upload files</span>
               </div>
             )}
          </CardContent>
        </Card>

        {/* Tags */}
        <div className="space-y-3">
          <Label className="text-sm font-bold text-gray-700">Tags</Label>
          <div className="flex gap-2">
            <Input 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tags (e.g, urgent , indoor)" 
              className="bg-white border-gray-200 h-14 rounded-xl px-5 focus-visible:ring-purple-400"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <Button 
              type="button"
              onClick={handleAddTag}
              className="bg-[#6B46C1] hover:bg-[#553C9A] h-14 px-8 rounded-xl font-bold"
            >
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {form.watch("tags")?.map((tag: string) => (
               <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  {tag}
                  <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
               </span>
            ))}
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-[#6B46C1] hover:bg-[#553C9A] py-8 text-sm font-bold rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-[0.99]"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          Post Task
        </Button>
      </form>
    </div>
  );
}
