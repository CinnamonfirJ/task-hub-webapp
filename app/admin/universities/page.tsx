"use client";

import { useState } from "react";
import {
  Search,
  Loader2,
  MoreVertical,
  Plus,
  GraduationCap,
  MapPin,
  Pencil,
  Trash2,
  Unlock,
  Ban,
  Building,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import { ApiError } from "@/lib/api";
import { useSearch } from "@/hooks/useSearch";
import {
  useAdminUniversities,
  useCreateUniversity,
  useUpdateUniversity,
  useDeleteUniversity,
} from "@/hooks/useAdmin";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/admin/categories/ConfirmModal";
import { UniversityModal } from "@/components/admin/categories/UniversityModal";

type ConfirmAction =
  | { type: "delete"; university: any }
  | { type: "toggle"; university: any }
  | null;

export default function UniversitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<any>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const { data: universities, isLoading, error } = useAdminUniversities();
  const createMutation = useCreateUniversity();
  const updateMutation = useUpdateUniversity();
  const deleteMutation = useDeleteUniversity();

  const handleSave = async (data: any) => {
    try {
      if (selectedUniversity) {
        await updateMutation.mutateAsync({
          id: selectedUniversity._id,
          data,
        });
        toast.success("University updated");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("University added");
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to save university");
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === "delete") {
        await deleteMutation.mutateAsync(confirmAction.university._id);
        toast.success("University deleted");
      } else if (confirmAction.type === "toggle") {
        await updateMutation.mutateAsync({
          id: confirmAction.university._id,
          data: { isActive: !confirmAction.university.isActive },
        });
        toast.success(`University ${confirmAction.university.isActive ? "deactivated" : "activated"}`);
      }
    } catch {
      toast.error("Operation failed");
    } finally {
      setConfirmAction(null);
    }
  };

  const list = universities || [];
  
  const [page, setPage] = useState(1);
  const limit = 20;

  const searchedList = useSearch(list, searchTerm, ["name", "abbreviation", "state", "location"]);

  const filtered = searchedList.filter((u: any) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Active" && u.isActive) ||
      (filter === "Inactive" && !u.isActive);
    return matchesFilter;
  });

  const totalRecords = filtered.length;
  const totalPages = Math.ceil(totalRecords / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Universities</h1>
          <p className="text-sm text-gray-500 mt-1">Manage higher institutions for campus tasks</p>
        </div>
        <Button
          onClick={() => {
            setSelectedUniversity(null);
            setIsModalOpen(true);
          }}
          className="bg-[#6B46C1] hover:bg-[#5A3AA3] text-white rounded-xl h-11 px-6 shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Add University
        </Button>
      </div>

      <Card className="border border-gray-100 shadow-sm rounded-2xl p-6">
        <AdminSearchFilter
          searchPlaceholder='Search university or abbreviation...'
          searchTerm={searchTerm}
          onSearch={(v) => { setSearchTerm(v); setPage(1); }}
          filterOptions={["All", "Active", "Inactive"]}
          activeFilter={filter}
          onFilterChange={(f) => { setFilter(f); setPage(1); }}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative min-h-[400px]">
        {(isLoading || error) && (
          <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
            {isLoading ? (
              <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
            ) : (
              <div className='text-center p-6 bg-white rounded-xl shadow-lg border border-red-50 max-w-sm mx-auto'>
                <div className='w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <div className='w-6 h-6 text-red-500 font-bold'>!</div>
                </div>
                <p className='text-gray-900 font-bold mb-1'>{(error as any)?.message || "Request failed"}</p>
                <p className='text-gray-500 text-xs mb-4'>Please check your connection or try again later.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                  className="border-red-100 text-red-600 hover:bg-red-50"
                >
                  Try again
                </Button>
              </div>
            )}
          </div>
        )}
        {paginated.map((u: any, index: number) => (
          <Card key={u._id} className="group relative border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden p-6">
            <div className="absolute top-0 left-0 w-8 h-8 bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 rounded-br-lg z-10">
              {(page - 1) * limit + index + 1}
            </div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                {u.logo ? (
                   <img src={u.logo} alt={u.abbreviation} className="w-10 h-10 object-contain" />
                ) : (
                  <Building size={28} />
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl">
                  <DropdownMenuItem onClick={() => { setSelectedUniversity(u); setIsModalOpen(true); }} className="rounded-lg py-2.5">
                    <Pencil className="mr-3 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setConfirmAction({ type: "toggle", university: u })} className="rounded-lg py-2.5">
                    {u.isActive ? <Ban className="mr-3 h-4 w-4" /> : <Unlock className="mr-3 h-4 w-4" />}
                    {u.isActive ? "Deactivate" : "Activate"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setConfirmAction({ type: "delete", university: u })} className="rounded-lg py-2.5 text-red-600 focus:bg-red-50">
                    <Trash2 className="mr-3 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black text-purple-600 bg-purple-100 px-2 py-0.5 rounded uppercase tracking-widest">{u.abbreviation}</span>
                {!u.isActive && <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded">Inactive</span>}
              </div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1">{u.name}</h3>
            </div>

            <div className="space-y-2 mt-auto">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <MapPin size={14} className="text-gray-400" />
                <span>{u.state} State</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <GraduationCap size={14} className="text-gray-400" />
                <span className="truncate">{u.location || "Main Campus"}</span>
              </div>
            </div>
          </Card>
          ))}
        </div>

      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalRecords={totalRecords}
        label="universities"
        className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
      />

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <GraduationCap size={64} className="mx-auto text-gray-100 mb-6" />
          <h3 className="text-xl font-bold text-gray-900">No universities found</h3>
          <p className="text-sm text-gray-500 mt-2">Add a new institution to enable campus tasks for that region.</p>
        </div>
      )}

      <UniversityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        university={selectedUniversity}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      {confirmAction && (
        <ConfirmModal
          isOpen={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
          title={confirmAction.type === "delete" ? "Delete University" : "Update Status"}
          description={confirmAction.type === "delete" 
            ? "Are you sure? This will remove the university from the list of available campus locations."
            : `Are you sure you want to ${confirmAction.university.isActive ? "deactivate" : "activate"} this institution?`}
          isLoading={deleteMutation.isPending || updateMutation.isPending}
          variant={confirmAction.type === "delete" ? "danger" : "warning"}
        />
      )}
    </div>
  );
}
