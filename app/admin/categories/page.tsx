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
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryModal } from "@/components/admin/categories/CategoryModal";
import {
  useAdminCategories,
  useCreateAdminCategory,
  useUpdateAdminCategory,
  useDeleteAdminCategory,
} from "@/hooks/useAdmin";
import { toast } from "sonner";
import { AdminCategory } from "@/types/admin";

export default function CategoriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<AdminCategory | null>(null);

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
    } catch (err) {
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory.mutateAsync(id);
        toast.success("Category deleted");
      } catch (err) {
        toast.error("Failed to delete category");
      }
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-[50vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-[50vh] items-center justify-center'>
        <div className='text-center space-y-4'>
          <p className='text-red-500 font-medium'>Failed to load categories</p>
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

  const stats = data?.stats;
  const categories = data?.categories || [];

  const filteredCategories = categories.filter((cat: any) => {
    const matchesSearch = cat.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || cat.status === filter;
    return matchesSearch && matchesFilter;
  });

  const summaryMetrics = [
    {
      label: "Active Categories",
      value: stats?.activeCategories?.toString() || "0",
    },
    {
      label: "Closed Categories",
      value: stats?.closedCategories?.toString() || "0",
      color: "text-green-600",
    },
    {
      label: "Total Services",
      value: stats?.totalServices?.toString() || "0",
    },
  ];

  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
            Categories
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Manage service categories available on Task Hub
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          className='bg-[#6B46C1] hover:bg-[#5A3AA3] text-white rounded-xl h-11 px-6 whitespace-nowrap shrink-0'
        >
          <Plus size={18} className='mr-2' />
          Add category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {summaryMetrics.map((metric, idx) => (
          <Card key={idx} className='border-none shadow-sm'>
            <CardContent className='p-4'>
              <div className='text-[10px] mt-1 font-semibold uppercase tracking-wider text-gray-500'>
                {metric.label}
              </div>
              <div
                className={`text-xl font-bold ${metric.color || "text-gray-900"}`}
              >
                {metric.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className='space-y-6'>
        {/* Controls */}
        <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
          <div className='relative w-full md:max-w-md'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              size={18}
            />
            <Input
              placeholder='Search category'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 h-11 bg-gray-50/50 border-gray-100 rounded-xl w-full'
            />
          </div>

          <div className='flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide'>
            {["All", "Active", "Closed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === f
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <Card className='hidden md:block border border-gray-100 shadow-sm rounded-2xl overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-100 bg-gray-50/50'>
                  <th className='py-4 px-6 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[25%]'>
                    CATEGORY
                  </th>
                  <th className='py-4 px-6 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[40%]'>
                    DESCRIPTION
                  </th>
                  <th className='py-4 px-6 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                    SERVICES
                  </th>
                  <th className='py-4 px-6 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'>
                    STATUS
                  </th>
                  <th className='py-4 px-6 text-right text-xs font-bold text-gray-600 uppercase tracking-wider'>
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {filteredCategories.map((cat: any) => (
                  <tr
                    key={cat._id}
                    onClick={() => router.push(`/admin/categories/${cat._id}`)}
                    className='hover:bg-gray-50/50 transition-colors cursor-pointer group'
                  >
                    <td className='py-4 px-6'>
                      <span className='text-sm font-bold text-gray-900'>
                        {cat.name}
                      </span>
                    </td>
                    <td className='py-4 px-6'>
                      <span className='text-sm text-gray-500'>
                        {cat.description}
                      </span>
                    </td>
                    <td className='py-4 px-6 text-sm text-gray-500'>
                      {cat.serviceCount}
                    </td>
                    <td className='py-4 px-6'>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          cat.status === "Active"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {cat.status}
                      </span>
                    </td>
                    <td className='py-4 px-6 text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align='end'
                          className='w-40 rounded-xl shadow-lg border-gray-100'
                        >
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/categories/${cat._id}`);
                            }}
                            className='cursor-pointer py-2.5 text-gray-700'
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategory(cat);
                              setIsModalOpen(true);
                            }}
                            className='cursor-pointer py-2.5 text-gray-700'
                          >
                            <Pencil className='mr-2 h-4 w-4' />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  `Are you sure you want to change the status of ${cat.name}?`,
                                )
                              ) {
                                updateCategory.mutate({
                                  id: cat._id,
                                  data: {
                                    status:
                                      cat.status === "Active"
                                        ? "Closed"
                                        : "Active",
                                  },
                                });
                              }
                            }}
                            className='cursor-pointer py-2.5 text-gray-700'
                          >
                            {cat.status === "Active" ? (
                              <Lock className='mr-2 h-4 w-4' />
                            ) : (
                              <Unlock className='mr-2 h-4 w-4' />
                            )}
                            {cat.status === "Active" ? "Close" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handleDelete(cat._id, e as any)}
                            className='cursor-pointer py-2.5 text-red-600 focus:text-red-700 focus:bg-red-50'
                          >
                            <Trash2 className='mr-2 h-4 w-4' />
                            Delete
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

        {/* Mobile View */}
        <div className='md:hidden space-y-4'>
          {filteredCategories.map((cat: any) => (
            <Card
              key={cat._id}
              className='p-4 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors'
              onClick={() => router.push(`/admin/categories/${cat._id}`)}
            >
              <div className='flex justify-between items-start mb-3'>
                <div>
                  <h3 className='font-bold text-gray-900'>{cat.name}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2 ${
                      cat.status === "Active"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {cat.status}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-gray-400'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='w-40 rounded-xl shadow-lg border-gray-100'
                  >
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/categories/${cat._id}`);
                      }}
                      className='cursor-pointer py-2.5 text-gray-700'
                    >
                      <Eye className='mr-2 h-4 w-4' />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(cat);
                        setIsModalOpen(true);
                      }}
                      className='cursor-pointer py-2.5 text-gray-700'
                    >
                      <Pencil className='mr-2 h-4 w-4' />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            `Are you sure you want to change the status of ${cat.name}?`,
                          )
                        ) {
                          updateCategory.mutate({
                            id: cat._id,
                            data: {
                              status:
                                cat.status === "Active" ? "Closed" : "Active",
                            },
                          });
                        }
                      }}
                      className='cursor-pointer py-2.5 text-gray-700'
                    >
                      {cat.status === "Active" ? (
                        <Lock className='mr-2 h-4 w-4' />
                      ) : (
                        <Unlock className='mr-2 h-4 w-4' />
                      )}
                      {cat.status === "Active" ? "Close" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => handleDelete(cat._id, e as any)}
                      className='cursor-pointer py-2.5 text-red-600 focus:text-red-700 focus:bg-red-50'
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className='text-sm text-gray-500 mb-3'>{cat.description}</p>
              <div className='text-xs text-gray-500 font-medium'>
                Services: {cat.serviceCount}
              </div>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className='text-center py-12 bg-white rounded-2xl border border-gray-100'>
            <Folder size={48} className='mx-auto text-gray-200 mb-4' />
            <h3 className='text-lg font-bold text-gray-900'>
              No categories found
            </h3>
            <p className='text-sm text-gray-500 mt-1 max-w-sm mx-auto'>
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={selectedCategory}
        isSaving={createCategory.isPending || updateCategory.isPending}
      />
    </div>
  );
}
