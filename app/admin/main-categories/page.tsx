"use client";

import { useState } from "react";
import {
  Search,
  Loader2,
  MoreVertical,
  Plus,
  Folder,
  Eye,
  Pencil,
  Trash2,
  Unlock,
  Ban,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import { useSearch } from "@/hooks/useSearch";
import {
  useAdminMainCategories,
  useCreateMainCategory,
  useUpdateMainCategory,
  useDeleteMainCategory,
  useCreateAdminCategory,
} from "@/hooks/useAdmin";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/admin/categories/ConfirmModal";
import { MainCategoryModal } from "@/components/admin/categories/MainCategoryModal";
import { CategoryModal } from "@/components/admin/categories/CategoryModal";
import type { AdminCategory } from "@/types/admin";

type ConfirmAction =
  | { type: "delete"; category: any }
  | { type: "toggle"; category: any }
  | null;

export default function MainCategoriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const { data: mainCategoriesData, isLoading, error } = useAdminMainCategories();
  const createMutation = useCreateMainCategory();
  const updateMutation = useUpdateMainCategory();
  const deleteMutation = useDeleteMainCategory();
  const createSubMutation = useCreateAdminCategory();

  const handleSave = async (data: any) => {
    try {
      if (selectedCategory) {
        await updateMutation.mutateAsync({
          id: selectedCategory._id,
          data,
        });
        toast.success("Main category updated");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Main category created");
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to save main category");
    }
  };

  const handleSaveSub = async (data: any) => {
    try {
      await createSubMutation.mutateAsync(data);
      toast.success("Sub-category created successfully");
      setIsSubModalOpen(false);
    } catch {
      toast.error("Failed to create sub-category");
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === "delete") {
        await deleteMutation.mutateAsync(confirmAction.category._id);
        toast.success("Main category deleted");
      } else if (confirmAction.type === "toggle") {
        await updateMutation.mutateAsync({
          id: confirmAction.category._id,
          data: { isActive: !confirmAction.category.isActive },
        });
        toast.success(`Category ${confirmAction.category.isActive ? "deactivated" : "activated"}`);
      }
    } catch {
      toast.error("Operation failed");
    } finally {
      setConfirmAction(null);
    }
  };

  const categories = mainCategoriesData?.mainCategories || [];
  
  // Use the reusable search hook
  const searchedCategories = useSearch(categories, searchTerm, ["name", "displayName", "description"]);

  const filtered = searchedCategories.filter((cat: any) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Active" && cat.isActive) ||
      (filter === "Inactive" && !cat.isActive);
    return matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B46C1]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Main Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage top-level task groupings</p>
        </div>
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          className="bg-[#6B46C1] hover:bg-[#5A3AA3] text-white rounded-xl h-11 px-6 shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Add Main Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Total Categories</p>
            <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Active</p>
            <p className="text-3xl font-bold text-green-600">{categories.filter((c:any) => c.isActive).length}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Inactive</p>
            <p className="text-3xl font-bold text-red-600">{categories.filter((c:any) => !c.isActive).length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-100 shadow-sm rounded-2xl p-6">
        <AdminSearchFilter
          searchPlaceholder='Search main categories...'
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          filterOptions={["All", "Active", "Inactive"]}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cat: any) => (
          <Card key={cat._id} className="group relative border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Layers size={24} />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl border-gray-100">
                    <DropdownMenuItem onClick={() => { setSelectedCategory(cat); setIsModalOpen(true); }} className="rounded-lg py-2.5">
                      <Pencil className="mr-3 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSelectedCategory(cat); setIsSubModalOpen(true); }} className="rounded-lg py-2.5">
                      <Plus className="mr-3 h-4 w-4" /> Add Sub
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setConfirmAction({ type: "toggle", category: cat })} className="rounded-lg py-2.5">
                      {cat.isActive ? <Ban className="mr-3 h-4 w-4" /> : <Unlock className="mr-3 h-4 w-4" />}
                      {cat.isActive ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setConfirmAction({ type: "delete", category: cat })} className="rounded-lg py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50">
                      <Trash2 className="mr-3 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{cat.displayName}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">{cat.description}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${cat.isActive ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {cat.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md uppercase tracking-wider">
                  {cat.subcategories || 0} Subcategories
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Folder size={64} className="mx-auto text-gray-100 mb-6" />
          <h3 className="text-xl font-bold text-gray-900">No main categories found</h3>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or add a new category.</p>
        </div>
      )}

      <MainCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        category={selectedCategory}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      <CategoryModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onSave={handleSaveSub}
        parentCategory={selectedCategory}
        isSaving={createSubMutation.isPending}
      />

      {confirmAction && (
        <ConfirmModal
          isOpen={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
          title={confirmAction.type === "delete" ? "Delete Main Category" : "Change Status"}
          description={confirmAction.type === "delete" 
            ? "Are you sure? This will delete the main category. Subcategories may become orphaned."
            : `Are you sure you want to ${confirmAction.category.isActive ? "deactivate" : "activate"} this category?`}
          isLoading={deleteMutation.isPending || updateMutation.isPending}
          variant={confirmAction.type === "delete" ? "danger" : "warning"}
        />
      )}
    </div>
  );
}
