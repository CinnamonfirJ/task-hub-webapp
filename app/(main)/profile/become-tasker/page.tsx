"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMainCategories, useCategories, useUniversities } from "@/hooks/useCategories";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { MainCategory, Subcategory, University } from "@/types/category";

export default function BecomeTaskerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for selections
  const [selectedSubcatIds, setSelectedSubcatIds] = useState<string[]>([]);
  const [expandedMainId, setExpandedMainId] = useState<string | null>(null);
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: mainCategories, isLoading: isLoadingMain } = useMainCategories();
  const { data: allSubcategories, isLoading: isLoadingSub } = useCategories();
  const { data: universities, isLoading: isLoadingUni } = useUniversities();

  // Initialize selected categories from user profile
  useEffect(() => {
    if (user && !isInitialized && allSubcategories) {
      const userCats = (user as any).subCategories || user.categories || [];
      
      if (userCats && userCats.length > 0) {
        const categoryIds = userCats.map((cat: any) => {
          if (typeof cat === 'string') return cat;
          return cat._id || cat.id || (cat as any).subCategory || (cat as any).category;
        }).filter(Boolean);
        
        setSelectedSubcatIds(categoryIds);
      }
      
      if (user.university) {
        setSelectedUniversityId(typeof user.university === 'string' ? user.university : user.university._id);
      }
      setIsInitialized(true);
    }
  }, [user, allSubcategories, isInitialized]);

  const updateCategoriesMutation = useMutation({
    mutationFn: (data: { mainCategories: string[]; subCategories: string[]; university?: string | null }) => authApi.updateCategories(data),
    onSuccess: () => {
      // Invalidate queries to refresh UI and tasker feed
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["taskerFeed"] });
      router.push("/home");
    },
  });

  // Filter subcategories globally by search
  const filteredNavigatableCategories: MainCategory[] = useMemo(() => {
    if (!mainCategories) return [];
    if (!searchQuery) return mainCategories;
    
    return mainCategories.filter((main) => {
      // Check if main category matches
      if (main.name.toLowerCase().includes(searchQuery.toLowerCase()) || main.displayName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }
      // Check if any subcategory inside it matches
      const hasSubMatch = allSubcategories?.some(sub => {
        const parentId = sub.mainCategory?._id || (typeof sub.parentCategory === 'object' ? sub.parentCategory?._id : sub.parentCategory);
        return parentId === main._id && 
        (sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || sub.displayName.toLowerCase().includes(searchQuery.toLowerCase()));
      });
      return hasSubMatch;
    });
  }, [mainCategories, allSubcategories, searchQuery]);

  // Derived state to know if "campus" related categories are selected
  const requiresUniversity = useMemo(() => {
    if (!allSubcategories || selectedSubcatIds.length === 0) return false;
    const selectedSubs = allSubcategories.filter(sub => selectedSubcatIds.includes(sub._id));
    return selectedSubs.some(sub => {
      const parentName = sub.mainCategory?.name || (typeof sub.parentCategory === 'object' ? sub.parentCategory?.name : null);
      return parentName?.toLowerCase().includes("campus");
    });
  }, [selectedSubcatIds, allSubcategories]);

  const toggleSubcategory = (id: string) => {
    setSelectedSubcatIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleMainExpanded = (id: string) => {
    setExpandedMainId(prev => prev === id ? null : id);
  };

  // Calculate total main categories that have at least one subcategory selected
  const activeMainCatSet = useMemo(() => {
    const set = new Set<string>();
    if (allSubcategories) {
      allSubcategories.forEach(sub => {
        if (selectedSubcatIds.includes(sub._id)) {
          const parentId = sub.mainCategory?._id || (typeof sub.parentCategory === 'object' ? sub.parentCategory?._id : sub.parentCategory);
          if (parentId) {
            set.add(parentId);
          }
        }
      });
    }
    return set;
  }, [allSubcategories, selectedSubcatIds]);

  const handleContinue = () => {
    if (selectedSubcatIds.length > 0) {
      updateCategoriesMutation.mutate({
        mainCategories: Array.from(activeMainCatSet),
        subCategories: selectedSubcatIds,
        university: requiresUniversity ? selectedUniversityId : null
      });
    }
  };

  if (isLoadingMain || isLoadingSub || isLoadingUni) {
    return (
      <div className="flex flex-col gap-4 h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B46C1]" />
        <p className="text-gray-500 font-medium">Loading categories...</p>
      </div>
    );
  }

  const isAlreadyTasker = user?.role === "tasker";

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-10 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Select Categories
        </h1>
        <p className="text-gray-500 font-medium">
          Choose the categories you want to work in
        </p>
        <p className="text-gray-400 text-xs mt-2">Select at least one category to begin</p>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6B46C1] transition-colors" size={20} />
        <Input
          placeholder="Search categories..."
          className="pl-12 h-14 bg-gray-100/50 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] text-lg"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value && filteredNavigatableCategories.length > 0) {
              setExpandedMainId(filteredNavigatableCategories[0]._id);
            }
          }}
        />
      </div>

      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-6">
        <h2 className="font-bold text-lg text-gray-900 px-2">Your Skills and Services</h2>
        
        {/* Success Banner if selections exist */}
        {selectedSubcatIds.length > 0 && (
          <div className="flex items-center gap-2 bg-green-100/50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
            <Check size={16} />
            {selectedSubcatIds.length} services selected across {activeMainCatSet.size} categories
          </div>
        )}

        <div className="space-y-4">
          {filteredNavigatableCategories.map((mainCat) => {
            const isExpanded = expandedMainId === mainCat._id;
            
            // Subcategories belonging to this main category
            const subcats = allSubcategories?.filter(s => {
              const parentId = s.mainCategory?._id || (typeof s.parentCategory === 'object' ? s.parentCategory?._id : s.parentCategory);
              return parentId === mainCat._id;
            }) || [];            
            // Filter further if search query exists
            const displaySubcats = searchQuery 
              ? subcats.filter(s => s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase()))
              : subcats;
              
            const selectedForThisMain = subcats.filter(s => selectedSubcatIds.includes(s._id)).length;
            // The circle represents expanded state primarily based on instructions, or maybe if it has selections? Let's use expanded state for the ring color, and the dot if it's expanded or selected.
            // Based on mockup image 2: the entire box is purple bordered when expanded, the radio is purple with dot. 
            // In image 3, it is not expanded, meaning it's just a card. Wait, no, in image 3 it is still expanded (purple border, radio dot)

            const isActive = isExpanded || selectedForThisMain > 0;

            return (
              <div
                key={mainCat._id}
                className={`transition-all overflow-hidden ${
                  isActive 
                    ? "border-[#6B46C1] bg-[#F5EEFF]/30 border-2 rounded-[2rem]" 
                    : "border-gray-200 border rounded-[2rem] hover:border-purple-200"
                }`}
              >
                {/* Header (Clickable) */}
                <div 
                  className={`flex items-center gap-4 p-5 cursor-pointer ${isActive ? "pb-2" : ""}`}
                  onClick={() => toggleMainExpanded(mainCat._id)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? "bg-[#E9D8FF] text-[#6B46C1]" : "bg-gray-100 text-gray-400"
                  }`}>
                    {/* Placeholder icon, replace with dynamic icon if available */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-[17px]">{mainCat.displayName}</h4>
                    {isActive && (
                      <p className={`text-xs font-semibold mt-0.5 ${selectedForThisMain > 0 ? "text-green-600" : "text-gray-400"}`}>
                        {selectedForThisMain} selected
                      </p>
                    )}
                  </div>

                  {/* Circular radio indicator */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isExpanded ? "border-[#6B46C1]" : "border-gray-300"
                  }`}>
                    {isExpanded && <div className="w-3 h-3 rounded-full bg-[#6B46C1]" />}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-5 pt-2">
                    <p className="text-gray-500 font-medium text-sm mb-4">Select the Specific Services you offer</p>
                    <div className="flex flex-wrap gap-2.5">
                      {displaySubcats.map(sub => {
                        const isSelected = selectedSubcatIds.includes(sub._id);
                        return (
                          <button
                            key={sub._id}
                            type="button"
                            onClick={() => toggleSubcategory(sub._id)}
                            className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                              isSelected 
                                ? "bg-[#6B46C1] text-white shadow-md shadow-purple-200" 
                                : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                            }`}
                          >
                            {sub.displayName}
                          </button>
                        );
                      })}
                      {displaySubcats.length === 0 && (
                        <p className="text-sm text-gray-400">No matching services found.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* University Selector (Only if campus category is selected) */}
        {requiresUniversity && (
          <div className="mt-8 p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem] space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">University</h3>
            <p className="text-sm text-gray-500">You selected a campus-related service. Please select your university to receive tasks from students there.</p>
            
            <select
              className="w-full h-14 bg-white border border-gray-200 rounded-xl px-4 text-gray-900 font-medium outline-none focus:ring-2 focus:ring-purple-400"
              value={selectedUniversityId}
              onChange={(e) => setSelectedUniversityId(e.target.value)}
            >
              <option value="" disabled>Select your University</option>
              {universities?.map(uni => (
                <option key={uni._id} value={uni._id}>{uni.name} ({uni.abbreviation})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="pt-2">
        <Button
          disabled={selectedSubcatIds.length === 0 || updateCategoriesMutation.isPending || (requiresUniversity && !selectedUniversityId)}
          onClick={handleContinue}
          className="w-full bg-[#6B46C1] hover:bg-[#553C9A] disabled:bg-purple-200 disabled:text-purple-400 disabled:cursor-not-allowed text-white h-[60px] rounded-2xl font-bold text-lg shadow-sm transition-all"
        >
          {updateCategoriesMutation.isPending ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : `Continue (${selectedSubcatIds.length} selected)`}
        </Button>
      </div>
    </div>
  );
}
