"use client";

import { useState, useEffect } from "react";
import { X, GraduationCap, MapPin, Building, Image as ImageIcon, Unlock, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface UniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  university?: any;
  isSaving: boolean;
}

export function UniversityModal({
  isOpen,
  onClose,
  onSave,
  university,
  isSaving,
}: UniversityModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    state: "",
    location: "",
    logo: "",
    isActive: true,
  });

  useEffect(() => {
    if (university) {
      setFormData({
        name: university.name || "",
        abbreviation: university.abbreviation || "",
        state: university.state || "",
        location: university.location || "",
        logo: university.logo || "",
        isActive: university.isActive !== false,
      });
    } else {
      setFormData({
        name: "",
        abbreviation: "",
        state: "",
        location: "",
        logo: "",
        isActive: true,
      });
    }
  }, [university, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-purple-50/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
              <GraduationCap size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">{university ? "Update" : "Add"} University</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Campus Management</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10 hover:bg-white">
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">University Name</label>
              <Input
                placeholder="e.g. University of Lagos"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus-visible:ring-black font-bold px-5"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Abbr.</label>
              <Input
                placeholder="UNILAG"
                value={formData.abbreviation}
                onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus-visible:ring-black font-bold text-center px-2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">State</label>
              <Input
                placeholder="e.g. Lagos"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus-visible:ring-black font-bold px-5"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Location / Campus</label>
              <Input
                placeholder="e.g. Akoka"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus-visible:ring-black font-bold px-5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Logo URL (Optional)</label>
            <div className="relative">
              <Input
                placeholder="https://example.com/logo.png"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus-visible:ring-black pl-12 pr-5 font-medium text-sm"
              />
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div className="flex items-center justify-between p-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem]">
            <div className="flex items-center gap-4">
               {formData.isActive ? (
                 <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Unlock size={18} />
                 </div>
               ) : (
                 <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <Ban size={18} />
                 </div>
               )}
               <div>
                <p className="text-sm font-black text-gray-900">Academic Status</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{formData.isActive ? "Institution Active" : "Institution Locked"}</p>
              </div>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              className="data-[state=checked]:bg-black"
            />
          </div>

          <div className="pt-6 flex items-center justify-end gap-4">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-2xl h-12 px-8 font-bold text-gray-500 hover:text-gray-900">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !formData.name || !formData.abbreviation || !formData.state}
              className="rounded-2xl h-12 px-10 bg-black hover:bg-gray-800 text-white font-black transition-all shadow-xl shadow-black/10 min-w-[160px]"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                   Saving...
                </div>
              ) : university ? "Update Changes" : "Save Institution"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
