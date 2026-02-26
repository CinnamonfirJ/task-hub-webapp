"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useAdminCategoryDetails,
  useUpdateAdminCategory,
  useDeleteAdminCategory,
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
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [taskFilter, setTaskFilter] = useState("All");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskerFilter, setTaskerFilter] = useState("All");
  const [taskerSearch, setTaskerSearch] = useState("");

  const { data, isLoading, error } = useAdminCategoryDetails(categoryId);
  const updateCategory = useUpdateAdminCategory();
  const deleteCategory = useDeleteAdminCategory();

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

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(taskSearch.toLowerCase());
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
        setConfirmAction(null);
      } else if (confirmAction.type === "suspend-tasker") {
        // Wire up to your suspend API when available
        toast.success(
          `${confirmAction.tasker.fullName} suspended successfully`,
        );
        setConfirmAction(null);
      }
    } catch {
      toast.error("Something went wrong");
      setConfirmAction(null);
    }
  };

  const isConfirmLoading =
    (confirmAction?.type === "delete-category" && deleteCategory.isPending) ||
    (confirmAction?.type === "toggle-category" && updateCategory.isPending);

  // Derive modal copy from the pending action
  const confirmTitle =
    confirmAction?.type === "delete-category"
      ? `Delete "${category.name}"?`
      : confirmAction?.type === "toggle-category"
        ? category.isActive
          ? `Close "${category.name}"?`
          : `Activate "${category.name}"?`
        : confirmAction?.type === "suspend-tasker"
          ? `Suspend ${confirmAction.tasker.fullName}?`
          : "";

  const confirmDescription =
    confirmAction?.type === "delete-category"
      ? "This action cannot be undone. All services linked to this category may be affected."
      : confirmAction?.type === "toggle-category"
        ? category.isActive
          ? "Closing this category will hide it from the platform. You can reactivate it later."
          : "Activating this category will make it visible on the platform again."
        : confirmAction?.type === "suspend-tasker"
          ? `${confirmAction.tasker.fullName} will lose access to new tasks while suspended.`
          : "";

  const confirmLabel =
    confirmAction?.type === "delete-category"
      ? "Delete"
      : confirmAction?.type === "toggle-category"
        ? category.isActive
          ? "Close category"
          : "Activate"
        : confirmAction?.type === "suspend-tasker"
          ? "Suspend"
          : "Confirm";

  const confirmVariant =
    confirmAction?.type === "delete-category" ||
    confirmAction?.type === "suspend-tasker"
      ? "danger"
      : "warning";

  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-start justify-between gap-4'>
        <div className='flex items-start gap-4'>
          <Button
            variant='outline'
            size='icon'
            className='h-10 w-10 shrink-0 rounded-xl border-gray-200'
            onClick={() => router.push("/admin/categories")}
          >
            <ArrowLeft size={20} className='text-gray-600' />
          </Button>
          <div>
            <h1 className='text-xl md:text-2xl font-bold text-gray-900'>
              {category.name}
            </h1>
            <p className='text-sm text-gray-500 mt-1 max-w-xl'>
              {category.description}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3 shrink-0'>
          <Button
            variant='outline'
            className='rounded-xl h-10 px-4 group'
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil
              size={16}
              className='mr-2 text-gray-500 group-hover:text-gray-900'
            />
            Edit
          </Button>
          <Button
            variant='outline'
            className='rounded-xl h-10 px-4 group'
            onClick={() => setConfirmAction({ type: "toggle-category" })}
          >
            {category.isActive ? (
              <Lock
                size={16}
                className='mr-2 text-gray-500 group-hover:text-gray-900'
              />
            ) : (
              <Unlock
                size={16}
                className='mr-2 text-gray-500 group-hover:text-gray-900'
              />
            )}
            {category.isActive ? "Close" : "Activate"}
          </Button>
          <Button
            variant='default'
            className='bg-red-500 hover:bg-red-600 text-white rounded-xl h-10 px-4 shadow-none'
            onClick={() => setConfirmAction({ type: "delete-category" })}
          >
            <Trash2 size={16} className='mr-2' />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {[
          { label: "Total services", value: stats.totalServices },
          { label: "Active taskers", value: stats.activeTaskers },
          { label: "Total taskers", value: stats.totalTaskers },
          { label: "Revenue", value: formatCurrency(stats.revenue) },
        ].map((stat, idx) => (
          <Card key={idx} className='border-gray-100 shadow-sm rounded-2xl'>
            <CardContent className='p-6'>
              <div className='text-xs text-gray-500 font-medium mb-1'>
                {stat.label}
              </div>
              <div className='text-2xl md:text-3xl font-bold text-gray-900'>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tasks Table */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl overflow-hidden'>
        <div className='p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='relative w-full md:max-w-xs'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              size={18}
            />
            <Input
              placeholder='Search tasks...'
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              className='pl-10 h-10 bg-gray-50/50 border-gray-100 rounded-xl w-full text-sm'
            />
          </div>
          <div className='flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto'>
            {[
              "All",
              "In-progress",
              "Open",
              "Completed",
              "Cancelled",
              "Assigned",
            ].map((f) => (
              <button
                key={f}
                onClick={() => setTaskFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  taskFilter === f
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className='p-6'>
          <h3 className='text-base font-bold text-gray-900 mb-4'>
            Tasks in this category
          </h3>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-100'>
                  <th className='py-3 px-4 text-left font-bold text-gray-900 uppercase tracking-wider text-[11px] w-[25%]'>
                    TASK
                  </th>
                  <th className='py-3 px-4 text-left font-bold text-gray-900 uppercase tracking-wider text-[11px]'>
                    POSTED BY
                  </th>
                  <th className='py-3 px-4 text-left font-bold text-gray-900 uppercase tracking-wider text-[11px]'>
                    CATEGORY
                  </th>
                  <th className='py-3 px-4 text-left font-bold text-gray-900 uppercase tracking-wider text-[11px]'>
                    BUDGET
                  </th>
                  <th className='py-3 px-4 text-left font-bold text-gray-900 uppercase tracking-wider text-[11px]'>
                    STATUS
                  </th>
                  <th className='py-3 px-4 text-left font-bold text-gray-900 uppercase tracking-wider text-[11px]'>
                    DATE
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='py-8 text-center text-gray-500'>
                      No tasks found.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task._id}
                      className='hover:bg-gray-50/50 transition-colors'
                    >
                      <td className='py-4 px-4 font-semibold text-gray-900'>
                        {task.title}
                      </td>
                      <td className='py-4 px-4 text-gray-500'>
                        {task.postedBy}
                      </td>
                      <td className='py-4 px-4 text-gray-500'>
                        {task.category}
                      </td>
                      <td className='py-4 px-4 text-gray-900'>
                        {formatCurrency(task.budget)}
                      </td>
                      <td className='py-4 px-4'>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                            task.status === "Completed"
                              ? "bg-green-50 text-green-600"
                              : task.status === "In progress"
                                ? "bg-blue-50 text-blue-600"
                                : task.status === "Assigned"
                                  ? "bg-yellow-50 text-yellow-600"
                                  : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className='py-4 px-4 text-gray-500'>
                        {task.date ??
                          (task.createdAt
                            ? new Date(task.createdAt).toLocaleDateString()
                            : "—")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Taskers Table */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl overflow-hidden mt-8'>
        <div className='p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='relative w-full md:max-w-xs'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              size={18}
            />
            <Input
              placeholder='Search name or email...'
              value={taskerSearch}
              onChange={(e) => setTaskerSearch(e.target.value)}
              className='pl-10 h-10 bg-gray-50/50 border-gray-100 rounded-xl w-full text-sm'
            />
          </div>
          <div className='flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto'>
            {["All", "Active", "Suspended", "Verified"].map((f) => (
              <button
                key={f}
                onClick={() => setTaskerFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  taskerFilter === f
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className='p-6'>
          <h3 className='text-base font-bold text-gray-900 mb-4'>
            Taskers offering services in this category
          </h3>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-100'>
                  <th className='py-3 px-4 text-left font-bold text-gray-900 uppercase tracking-wider text-[11px] w-[30%]'>
                    TASKERS
                  </th>
                  <th className='py-3 px-4 text-left font-bold text-gray-900 uppercase tracking-wider text-[11px]'>
                    CATEGORY
                  </th>
                  <th className='py-3 px-4 text-left font-bold text-gray-900 uppercase tracking-wider text-[11px]'>
                    STATUS
                  </th>
                  <th className='py-3 px-4 text-left font-bold text-gray-900 uppercase tracking-wider text-[11px]'>
                    VERIFICATION
                  </th>
                  <th className='py-3 px-4 text-left font-bold text-gray-900 uppercase tracking-wider text-[11px]'>
                    LAST ACTIVE
                  </th>
                  <th className='py-3 px-4 text-right font-bold text-gray-900 uppercase tracking-wider text-[11px]'>
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {filteredTaskers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='py-8 text-center text-gray-500'>
                      No taskers found.
                    </td>
                  </tr>
                ) : (
                  filteredTaskers.map((tasker) => {
                    const email = tasker.email ?? tasker.emailAddress ?? "";
                    return (
                      <tr
                        key={tasker._id}
                        className='hover:bg-gray-50/50 transition-colors group'
                      >
                        <td className='py-4 px-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0'>
                              {tasker.profilePicture && (
                                <img
                                  src={tasker.profilePicture}
                                  alt={tasker.fullName}
                                  className='w-full h-full object-cover'
                                />
                              )}
                            </div>
                            <div>
                              <div className='font-semibold text-gray-900'>
                                {tasker.fullName}
                              </div>
                              <div className='text-xs text-gray-500 mt-0.5'>
                                {email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='py-4 px-4 text-gray-500'>
                          {tasker.category}
                        </td>
                        <td className='py-4 px-4'>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                              tasker.status === "Active"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {tasker.status}
                          </span>
                        </td>
                        <td className='py-4 px-4'>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                              tasker.verification === "Verified"
                                ? "bg-blue-50 text-blue-600"
                                : tasker.verification === "Not verified"
                                  ? "bg-purple-50 text-purple-600"
                                  : "bg-yellow-50 text-yellow-600"
                            }`}
                          >
                            {tasker.verification}
                          </span>
                        </td>
                        <td className='py-4 px-4 text-gray-500'>
                          {tasker.lastActive ?? "—"}
                        </td>
                        <td className='py-4 px-4 text-right'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100'
                              >
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align='end'
                              className='w-44 rounded-xl shadow-lg border-gray-100'
                            >
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/admin/taskers/${tasker._id}`)
                                }
                                className='cursor-pointer py-2.5 text-gray-700'
                              >
                                <Eye className='mr-2 h-4 w-4' /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className='cursor-pointer py-2.5 text-red-600 focus:text-red-700 focus:bg-red-50'
                                onClick={() =>
                                  setConfirmAction({
                                    type: "suspend-tasker",
                                    tasker,
                                  })
                                }
                              >
                                <Ban className='mr-2 h-4 w-4' /> Suspend User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <CategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
        category={category as AdminCategory}
        isSaving={updateCategory.isPending}
      />

      {/* Single confirm modal handles all destructive actions on this page */}
      <ConfirmModal
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={confirmLabel}
        variant={confirmVariant}
        isLoading={isConfirmLoading}
      />
    </div>
  );
}
