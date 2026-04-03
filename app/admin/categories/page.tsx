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
  Lock,
  Trash2,
  Unlock,
  Ban,
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
import { CategoryModal } from "@/components/admin/categories/CategoryModal";
import { ConfirmModal } from "@/components/admin/categories/ConfirmModal";
import {
  useAdminCategories,
  useCreateAdminCategory,
  useUpdateAdminCategory,
  useDeleteAdminCategory,
} from "@/hooks/useAdmin";
import { toast } from "sonner";
import type { AdminCategory } from "@/types/admin";

type ConfirmAction =
  | { type: "delete"; category: AdminCategory }
  | { type: "toggle"; category: AdminCategory }
  | null;

export default function CategoriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<AdminCategory | null>(null);
  const [parentCategoryForSub, setParentCategoryForSub] =
    useState<AdminCategory | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const { data, isLoading, error } = useAdminCategories();
  const createCategory = useCreateAdminCategory();
  const updateCategory = useUpdateAdminCategory();
  const deleteCategory = useDeleteAdminCategory();

  const handleSaveCategory = async (categoryData: any) => {
    try {
      if (selectedCategory) {
        await updateCategory.mutateAsync({
          id: selectedCategory._id,
          data: categoryData,
        });
        toast.success("Category updated successfully");
      } else {
        await createCategory.mutateAsync(categoryData);
        toast.success("Category created successfully");
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to save category");
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === "delete") {
        await deleteCategory.mutateAsync(confirmAction.category._id);
        toast.success("Category deleted");
      } else if (confirmAction.type === "toggle") {
        await updateCategory.mutateAsync({
          id: confirmAction.category._id,
          data: { isActive: !confirmAction.category.isActive },
        });
        const next = confirmAction.category.isActive ? "closed" : "activated";
        toast.success(`Category ${next} successfully`);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setConfirmAction(null);
    }
  };

  const isConfirmLoading =
    (confirmAction?.type === "delete" && deleteCategory.isPending) ||
    (confirmAction?.type === "toggle" && updateCategory.isPending);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B46C1]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">Failed to load categories</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="rounded-xl"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const categories: AdminCategory[] = data?.categories ?? [];

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.displayName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "Active" && cat.isActive) ||
      (filter === "Closed" && !cat.isActive);
    return matchesSearch && matchesFilter;
  });

  const summaryMetrics = [
    {
      label: "Active Categories",
      value: stats?.activeCategories?.toString() ?? "0",
    },
    {
      label: "Closed Categories",
      value: stats?.closedCategories?.toString() ?? "0",
    },
    {
      label: "Total Tasks",
      value: stats?.totalTasks?.toString() ?? stats?.totalServices?.toString() ?? "0",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage task categories and sub categories
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setParentCategoryForSub(null);
            setIsModalOpen(true);
          }}
          className="bg-[#6B46C1] hover:bg-[#5A3AA3] text-white rounded-xl h-11 px-6 whitespace-nowrap shrink-0 transition-all shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Add category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryMetrics.map((metric, idx) => (
          <Card key={idx} className="border border-gray-100 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-500 mb-2">
                {metric.label}
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {metric.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl w-full focus:bg-white transition-colors"
            />
          </div>
          <div className="flex items-center gap-1 p-1 bg-gray-100/50 rounded-xl overflow-x-auto w-full md:w-auto">
            {["All", "Active", "Closed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  filter === f
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-200/50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Desktop Table */}
      <Card className="hidden md:block border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="py-5 px-8 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[25%]">
                  CATEGORY
                </th>
                <th className="py-5 px-8 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[40%]">
                  DESCRIPTION
                </th>
                <th className="py-5 px-8 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  SUB-CATEGORIES
                </th>
                <th className="py-5 px-8 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="py-5 px-8 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCategories.map((cat) => (
                <tr
                  key={cat._id}
                  onClick={() => router.push(`/admin/categories/${cat._id}`)}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-5 px-8">
                    <span className="text-sm font-bold text-gray-900">
                      {cat.displayName || cat.name}
                    </span>
                  </td>
                  <td className="py-5 px-8">
                    <span className="text-sm text-gray-500 line-clamp-1">
                      {cat.description || "Home and office services"}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-sm text-gray-500 font-medium">
                    {cat.subCategoryCount ?? 0}
                  </td>
                  <td className="py-5 px-8">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        cat.isActive
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Closed"}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 group-hover:text-gray-900 group-hover:bg-white shadow-none transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-xl shadow-xl border-gray-100 p-1.5"
                      >
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/categories/${cat._id}`);
                          }}
                          className="cursor-pointer py-2.5 rounded-lg text-gray-700 font-medium"
                        >
                          <Eye className="mr-3 h-4 w-4 text-gray-400" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setParentCategoryForSub(cat);
                            setSelectedCategory(null);
                            setIsModalOpen(true);
                          }}
                          className="cursor-pointer py-2.5 rounded-lg text-gray-700 font-medium"
                        >
                          <Plus className="mr-3 h-4 w-4 text-gray-400" /> Add Sub
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(cat);
                            setIsModalOpen(true);
                          }}
                          className="cursor-pointer py-2.5 rounded-lg text-gray-700 font-medium"
                        >
                          <Pencil className="mr-3 h-4 w-4 text-gray-400" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmAction({ type: "toggle", category: cat });
                          }}
                          className="cursor-pointer py-2.5 rounded-lg text-gray-700 font-medium"
                        >
                          {cat.isActive ? (
                            <Ban className="mr-3 h-4 w-4 text-gray-400" />
                          ) : (
                            <Unlock className="mr-3 h-4 w-4 text-gray-400" />
                          )}
                          {cat.isActive ? "Close" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmAction({ type: "delete", category: cat });
                          }}
                          className="cursor-pointer py-2.5 rounded-lg text-red-600 focus:text-red-700 focus:bg-red-50 font-medium"
                        >
                          <Trash2 className="mr-3 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredCategories.map((cat) => (
          <Card
            key={cat._id}
            className="p-5 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
            onClick={() => router.push(`/admin/categories/${cat._id}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{cat.displayName || cat.name}</h3>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2 ${
                    cat.isActive
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {cat.isActive ? "Active" : "Closed"}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-xl shadow-xl border-gray-100"
                >
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admin/categories/${cat._id}`);
                    }}
                    className="cursor-pointer py-2.5"
                  >
                    <Eye className="mr-2 h-4 w-4" /> View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setParentCategoryForSub(cat);
                      setSelectedCategory(null);
                      setIsModalOpen(true);
                    }}
                    className="cursor-pointer py-2.5"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Sub
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(cat);
                      setIsModalOpen(true);
                    }}
                    className="cursor-pointer py-2.5"
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmAction({ type: "toggle", category: cat });
                    }}
                    className="cursor-pointer py-2.5"
                  >
                    {cat.isActive ? (
                      <Ban className="mr-2 h-4 w-4" />
                    ) : (
                      <Unlock className="mr-2 h-4 w-4" />
                    )}
                    {cat.isActive ? "Close" : "Activate"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmAction({ type: "delete", category: cat });
                    }}
                    className="cursor-pointer py-2.5 text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{cat.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-wider">
              <span>Sub-categories: {cat.subCategoryCount ?? 0}</span>
              <span>Services: {cat.services ?? 0}</span>
            </div>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Folder size={64} className="mx-auto text-gray-100 mb-6" />
          <h3 className="text-xl font-bold text-gray-900">
            No categories found
          </h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button 
            variant="outline" 
            className="mt-6 rounded-xl"
            onClick={() => {
              setSearchTerm("");
              setFilter("All");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setParentCategoryForSub(null);
        }}
        onSave={handleSaveCategory}
        category={selectedCategory}
        parentCategory={parentCategoryForSub}
        isSaving={createCategory.isPending || updateCategory.isPending}
      />

      {confirmAction && (
        <ConfirmModal
          isOpen={confirmAction !== null}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
          title={
            confirmAction.type === "delete"
              ? `Delete "${confirmAction.category.name}"?`
              : confirmAction.category.isActive
                ? `Close "${confirmAction.category.name}"?`
                : `Activate "${confirmAction.category.name}"?`
          }
          description={
            confirmAction.type === "delete"
              ? "This action cannot be undone. All services linked to this category may be affected."
              : confirmAction.category.isActive
                ? "Closing this category will hide it from the platform. You can reactivate it later."
                : "Activating this category will make it visible on the platform again."
          }
          confirmLabel={
            confirmAction.type === "delete"
              ? "Delete"
              : confirmAction.category.isActive
                ? "Close category"
                : "Activate"
          }
          variant={confirmAction.type === "delete" ? "danger" : "warning"}
          isLoading={isConfirmLoading}
        />
      )}
    </div>
  );
}

