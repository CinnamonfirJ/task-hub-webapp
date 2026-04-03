"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useAdminCategoryDetails,
  useUpdateAdminCategory,
  useDeleteAdminCategory,
  useAdminCategories,
  useCreateAdminCategory,
} from "@/hooks/useAdmin";
import {
  ArrowLeft,
  Pencil,
  Lock,
  Trash2,
  MoreVertical,
  Eye,
  Ban,
  Search,
  Loader2,
  Unlock,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { CategoryModal } from "@/components/admin/categories/CategoryModal";
import { ConfirmModal } from "@/components/admin/categories/ConfirmModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { AdminCategory, AdminCategoryTasker } from "@/types/admin";

type ConfirmAction =
  | { type: "delete-category" }
  | { type: "toggle-category" }
  | { type: "suspend-tasker"; tasker: AdminCategoryTasker }
  | null;

export default function CategoryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSubModalOpen, setIsAddSubModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  
  const [activeTab, setActiveTab] = useState<"tasks" | "taskers" | "subcategories">("tasks");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskFilter, setTaskFilter] = useState("All");
  const [taskerSearch, setTaskerSearch] = useState("");
  const [taskerFilter, setTaskerFilter] = useState("All");

  const { data, isLoading, error } = useAdminCategoryDetails(categoryId);
  const { data: allCategoriesData } = useAdminCategories();
  const updateCategory = useUpdateAdminCategory();
  const deleteCategory = useDeleteAdminCategory();
  const createCategory = useCreateAdminCategory();

  if (isLoading) {
    return (
      <div className='flex h-[50vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='flex h-[50vh] items-center justify-center'>
        <div className='text-center space-y-4'>
          <p className='text-red-500 font-medium'>
            Failed to load category details
          </p>
          <Button
            variant='outline'
            onClick={() => window.location.reload()}
            className='rounded-xl'
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const { category, stats, tasks, taskers } = data;
  
  // If the backend doesn't return subcategories, filter them from all categories
  const subcategories = data.subcategories || (allCategoriesData?.categories || []).filter(
    (c: any) => c.parentCategory === categoryId || (c.parentCategory?._id === categoryId)
  );

  const parentCategory = allCategoriesData?.categories?.find(
    (c: any) => c._id === category.parentCategory || c._id === (category.parentCategory as any)?._id
  );

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(taskSearch.toLowerCase());
    const matchesFilter = taskFilter === "All" || task.status === taskFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredTaskers = taskers.filter((tasker) => {
    const name = tasker.fullName ?? "";
    const email = tasker.email ?? tasker.emailAddress ?? "";
    const matchesSearch =
      name.toLowerCase().includes(taskerSearch.toLowerCase()) ||
      email.toLowerCase().includes(taskerSearch.toLowerCase());
    const matchesFilter =
      taskerFilter === "All" ||
      tasker.status === taskerFilter ||
      tasker.verification === taskerFilter;
    return matchesSearch && matchesFilter;
  });

  const handleEditSave = async (categoryData: any) => {
    try {
      await updateCategory.mutateAsync({
        id: category._id,
        data: categoryData,
      });
      toast.success("Category updated successfully");
      setIsEditModalOpen(false);
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleCreateSubcategory = async (categoryData: any) => {
    try {
      await createCategory.mutateAsync({
        ...categoryData,
        parentCategory: category._id,
      });
      toast.success("Sub category created successfully");
      setIsAddSubModalOpen(false);
    } catch {
      toast.error("Failed to create sub category");
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === "delete-category") {
        await deleteCategory.mutateAsync(category._id);
        toast.success("Category deleted successfully");
        router.push("/admin/categories");
      } else if (confirmAction.type === "toggle-category") {
        await updateCategory.mutateAsync({
          id: category._id,
          data: { isActive: !category.isActive },
        });
        const next = category.isActive ? "closed" : "activated";
        toast.success(`Category ${next} successfully`);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setConfirmAction(null);
    }
  };

  const isConfirmLoading =
    (confirmAction?.type === "delete-category" && deleteCategory.isPending) ||
    (confirmAction?.type === "toggle-category" && updateCategory.isPending);

  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto'>
      {/* Breadcrumbs & Header */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <button onClick={() => router.push("/admin/categories")} className="hover:text-gray-900 transition-colors">Categories</button>
          {parentCategory && (
            <>
              <ChevronRight size={14} />
              <button 
                onClick={() => router.push(`/admin/categories/${parentCategory._id}`)} 
                className="hover:text-gray-900 transition-colors"
              >
                {parentCategory.displayName || parentCategory.name}
              </button>
            </>
          )}
          <ChevronRight size={14} />
          <span className="font-medium text-gray-900">{category.displayName || category.name}</span>
        </div>

        <div className='flex flex-col md:flex-row md:items-start justify-between gap-6'>
          <div className='flex items-start gap-4'>
            <Button
              variant='outline'
              size='icon'
              className='h-12 w-12 shrink-0 rounded-2xl border-gray-100 shadow-sm'
              onClick={() => router.push("/admin/categories")}
            >
              <ArrowLeft size={22} className='text-gray-600' />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
                  {category.displayName || category.name}
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    category.isActive
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {category.isActive ? "Active" : "Closed"}
                </span>
              </div>
              <p className='text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed'>
                {category.description || "Manage settings and view metrics for this category."}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3 shrink-0'>
            <Button
              variant='outline'
              className='rounded-xl h-11 px-5 border-gray-200'
              onClick={() => setIsEditModalOpen(true)}
            >
              <Pencil size={18} className='mr-2 text-gray-500' />
              Edit
            </Button>
            <Button
              variant='outline'
              className='rounded-xl h-11 px-5 border-gray-200'
              onClick={() => setConfirmAction({ type: "toggle-category" })}
            >
              {category.isActive ? (
                <Lock size={18} className='mr-2 text-gray-500' />
              ) : (
                <Unlock size={18} className='mr-2 text-gray-500' />
              )}
              {category.isActive ? "Close" : "Activate"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-gray-200">
                  <MoreVertical size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl border-gray-100">
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-700 focus:bg-red-50 py-2.5 rounded-lg cursor-pointer"
                  onClick={() => setConfirmAction({ type: "delete-category" })}
                >
                  <Trash2 size={16} className="mr-3" /> Delete Category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6'>
        {[
          { label: "Total services", value: stats.totalServices },
          { label: "Sub categories", value: stats.subCategoryCount || subcategories.length },
          { label: "Active services", value: stats.activeServices || 0 },
          { label: "Taskers", value: stats.totalTaskers },
          { label: "Revenue", value: formatCurrency(stats.revenue) },
        ].map((stat, idx) => (
          <Card key={idx} className='border border-gray-100 shadow-sm rounded-2xl overflow-hidden'>
            <CardContent className='p-6'>
              <div className='text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2'>
                {stat.label}
              </div>
              <div className='text-2xl font-bold text-gray-900'>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Tabs Selection */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {[
            { id: "tasks", label: "Tasks", count: filteredTasks.length },
            { id: "taskers", label: "Taskers", count: filteredTaskers.length },
            ...(category.parentCategory ? [] : [{ id: "subcategories", label: "Sub-categories", count: subcategories.length }]),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id ? "bg-black text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pt-2">
          {activeTab === "tasks" && (
            <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input 
                    placeholder="Search tasks..." 
                    value={taskSearch}
                    onChange={(e) => setTaskSearch(e.target.value)}
                    className="pl-9 h-10 bg-gray-50/50 border-gray-100 rounded-xl text-sm"
                  />
                </div>
                <div className="flex gap-1 p-1 bg-gray-50 rounded-xl overflow-x-auto">
                  {["All", "In-progress", "Open", "Completed", "Cancelled"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setTaskFilter(f)}
                      className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        taskFilter === f ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/30">
                      <th className="py-4 px-6 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">Task</th>
                      <th className="py-4 px-6 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">Posted By</th>
                      <th className="py-4 px-6 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">Budget</th>
                      <th className="py-4 px-6 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">Status</th>
                      <th className="py-4 px-6 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredTasks.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-gray-400">No tasks found</td></tr>
                    ) : (
                      filteredTasks.map((task) => (
                        <tr key={task._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-5 px-6 font-bold text-gray-900">{task.title}</td>
                          <td className="py-5 px-6 text-gray-500">{task.postedBy}</td>
                          <td className="py-5 px-6 font-medium">{formatCurrency(task.budget)}</td>
                          <td className="py-5 px-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              task.status === "Completed" ? "bg-green-50 text-green-600" :
                              task.status === "In progress" ? "bg-blue-50 text-blue-600" :
                              "bg-gray-100 text-gray-600"
                            }`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="py-5 px-6 text-gray-400">{new Date(task.createdAt || Date.now()).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === "taskers" && (
            <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input 
                    placeholder="Search taskers..." 
                    value={taskerSearch}
                    onChange={(e) => setTaskerSearch(e.target.value)}
                    className="pl-9 h-10 bg-gray-50/50 border-gray-100 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/30">
                      <th className="py-4 px-6 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">Tasker</th>
                      <th className="py-4 px-6 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">Status</th>
                      <th className="py-4 px-6 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">Verification</th>
                      <th className="py-4 px-6 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">Last Active</th>
                      <th className="py-4 px-6 text-right font-bold text-gray-500 uppercase tracking-wider text-[10px]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredTaskers.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-gray-400">No taskers found</td></tr>
                    ) : (
                      filteredTaskers.map((tasker) => (
                        <tr key={tasker._id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-50">
                                {tasker.profilePicture && (
                                  <img src={tasker.profilePicture} alt="" className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-gray-900">{tasker.fullName}</div>
                                <div className="text-[11px] text-gray-500">{tasker.email || tasker.emailAddress}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              tasker.status === "Active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                            }`}>
                              {tasker.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              tasker.verification === "Verified" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                            }`}>
                              {tasker.verification}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-400 text-xs">{tasker.lastActive || "Recently active"}</td>
                          <td className="py-4 px-6 text-right">
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => router.push(`/admin/taskers/${tasker._id}`)}>
                               <Eye size={16} className="text-gray-400" />
                             </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === "subcategories" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="font-bold text-gray-900">Sub-categories in this group</h3>
                <Button 
                  onClick={() => setIsAddSubModalOpen(true)}
                  className="bg-black hover:bg-black/80 text-white rounded-xl h-10 px-4 text-xs font-bold"
                >
                  <Plus size={16} className="mr-2" /> Add sub-category
                </Button>
              </div>
              <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/30">
                        <th className="py-4 px-6 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">Category</th>
                        <th className="py-4 px-6 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">Description</th>
                        <th className="py-4 px-6 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">Min Price</th>
                        <th className="py-4 px-6 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">Status</th>
                        <th className="py-4 px-6 text-right font-bold text-gray-500 uppercase tracking-wider text-[10px]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {subcategories.length === 0 ? (
                        <tr><td colSpan={5} className="py-12 text-center text-gray-400">No sub-categories found. Create one from the button above.</td></tr>
                      ) : (
                        subcategories.map((sub: any) => (
                          <tr 
                            key={sub._id} 
                            onClick={() => router.push(`/admin/categories/${sub._id}`)}
                            className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                          >
                            <td className="py-5 px-6 font-bold text-gray-900">{sub.displayName || sub.name}</td>
                            <td className="py-5 px-6 text-gray-500 line-clamp-1">{sub.description}</td>
                            <td className="py-5 px-6 font-medium">{formatCurrency(sub.minimumPrice || 0)}</td>
                            <td className="py-5 px-6">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                sub.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                              }`}>
                                {sub.isActive ? "Active" : "Closed"}
                              </span>
                            </td>
                            <td className="py-5 px-6 text-right">
                               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg group-hover:bg-white" onClick={(e) => { e.stopPropagation(); router.push(`/admin/categories/${sub._id}`); }}>
                                 <ChevronRight size={16} className="text-gray-400" />
                               </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
        category={category as AdminCategory}
        isSaving={updateCategory.isPending}
      />

      <CategoryModal
        isOpen={isAddSubModalOpen}
        onClose={() => setIsAddSubModalOpen(false)}
        onSave={handleCreateSubcategory}
        parentCategory={category}
        isSaving={createCategory.isPending}
      />

      {confirmAction && (
        <ConfirmModal
          isOpen={confirmAction !== null}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
          title={
            confirmAction.type === "delete-category"
              ? `Delete "${category?.name}"?`
              : category?.isActive
                ? `Close "${category?.name}"?`
                : `Activate "${category?.name}"?`
          }
          description={
            confirmAction.type === "delete-category"
              ? "This action cannot be undone. All services linked to this category may be affected."
              : category?.isActive
                ? "Closing this category will hide it from the platform. You can reactivate it later."
                : "Activating this category will make it visible on the platform again."
          }
          confirmLabel={
            confirmAction.type === "delete-category"
              ? "Delete"
              : category?.isActive
                ? "Close category"
                : "Activate"
          }
          variant={confirmAction.type === "delete-category" ? "danger" : "warning"}
          isLoading={isConfirmLoading}
        />
      )}
    </div>
  );
}
