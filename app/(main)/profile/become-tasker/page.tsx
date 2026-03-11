"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCategories } from "@/hooks/useCategories";
import { tasksApi } from "@/lib/api/tasks";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function BecomeTaskerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: categories, isLoading } = useCategories();

  // Initialize selected categories from user profile
  useEffect(() => {
    if (user?.categories && !isInitialized) {
      const categoryIds = user.categories.map((cat: any) => 
        typeof cat === 'string' ? cat : cat._id
      );
      setSelectedIds(categoryIds);
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  const updateCategoriesMutation = useMutation({
    mutationFn: (ids: string[]) => authApi.updateCategories(ids),
    onSuccess: () => {
      // Invalidate queries to refresh UI and tasker feed
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["taskerFeed"] });
      router.push("/home");
    },
  });

  const filteredCategories = categories?.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const toggleCategory = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedIds.length > 0) {
      updateCategoriesMutation.mutate(selectedIds);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B46C1]" />
      </div>
    );
  }

  const isAlreadyTasker = user?.role === "tasker";

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-10 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          {isAlreadyTasker ? "Update Categories" : "Select Categories"}
        </h1>
        <p className="text-gray-500 font-medium">
          {isAlreadyTasker 
            ? "Modify the categories you work in to adjust your task feed" 
            : "Choose the categories you want to work in"}
        </p>
        <p className="text-gray-400 text-xs mt-2">Select at least one category to begin</p>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6B46C1] transition-colors" size={20} />
        <Input
          placeholder="Search categories..."
          className="pl-12 h-14 bg-gray-100/50 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredCategories.map((category) => {
          const isSelected = selectedIds.includes(category._id);
          return (
            <div
              key={category._id}
              onClick={() => toggleCategory(category._id)}
              className={`flex items-center gap-5 p-6 bg-white border rounded-3xl transition-all cursor-pointer shadow-sm ${
                isSelected 
                  ? "border-[#6B46C1] bg-[#F5EEFF]/30" 
                  : "border-gray-100 hover:border-purple-200"
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected ? "border-[#6B46C1] bg-[#6B46C1]" : "border-gray-200"
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-lg">{category.name}</h4>
                <p className="text-gray-400 text-sm font-medium">{category.description || `Professional ${category.name} services`}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4">
        <Button
          disabled={selectedIds.length === 0 || updateCategoriesMutation.isPending}
          onClick={handleContinue}
          className="w-full bg-[#6B46C1] hover:bg-[#553C9A] disabled:bg-purple-100/50 text-white h-16 rounded-[1.25rem] font-black text-lg shadow-sm transition-all"
        >
          {updateCategoriesMutation.isPending ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : isAlreadyTasker 
            ? `Update Categories (${selectedIds.length})` 
            : `Continue (${selectedIds.length} selected)`}
        </Button>
      </div>
    </div>
  );
}
