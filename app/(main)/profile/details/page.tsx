"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  Camera,
  Loader2,
  Upload,
  Link as LinkIcon,
  X,
  Plus,
  Calendar,
  Image as ImageIcon,
  Trash2,
  Mail,
  Phone,
  Flag,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CloudinaryUpload from "@/components/CloudinaryUpload";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  country: z.string().min(1, "Country is required"),
  residentState: z.string().min(1, "State is required"),
  address: z.string().min(5, "Full address is required"),
  websiteLink: z.string().url().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileDetailsPage() {
  const { user, isLoadingUser } = useAuth();
  const role = user?.role || (typeof window !== "undefined" ? localStorage.getItem("userType") : "user");
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPortfolioUploading, setIsPortfolioUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isTasker = role === "tasker";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      phoneNumber: user?.phoneNumber || "",
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
      country: user?.country || "Nigeria",
      residentState: user?.residentState || "",
      address: user?.address || "",
      websiteLink: user?.websiteLink || "",
    },
  });

  // Sync form with user data when it loads
  useEffect(() => {
    if (user) {
      setValue("fullName", user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim());
      setValue("phoneNumber", user.phoneNumber || "");
      if (user.dateOfBirth) {
        setValue("dateOfBirth", new Date(user.dateOfBirth).toISOString().split("T")[0]);
      }
      setValue("country", user.country || "Nigeria");
      setValue("residentState", user.residentState || "");
      setValue("address", user.address || "");
      setValue("websiteLink", user.websiteLink || "");
    }
  }, [user, setValue]);

  const handleProfilePictureUploadSuccess = async (url: string) => {
    setIsUploading(true);
    try {
      await authApi.updateProfilePicture(url);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error("Failed to update profile picture record");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePortfolioUploadSuccess = async (url: string, publicId: string) => {
    setIsPortfolioUploading(true);
    try {
      // Note: If the backend currently only accepts FormData with files, 
      // you might need an endpoint that accepts Cloudinary result objects.
      // For now, we'll follow the existing pattern if possible or inform the user.
      const formData = new FormData();
      // We can't easily create a File object from a URL for FormData without fetching it,
      // so we suggest updating the backend to accept URLs or using a different endpoint.
      await authApi.uploadPreviousWork(formData); 
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Work image added successfully");
    } catch (err: any) {
      toast.error("Cloudinary upload successful, but failed to save to server.");
    } finally {
      setIsPortfolioUploading(false);
    }
  };

  const handleDeleteWork = async (publicId: string) => {
    try {
      await authApi.deletePreviousWork(publicId);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Image removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove image");
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      await authApi.updateProfile(data);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePicture = async () => {
    setIsUploading(true);
    try {
      await authApi.updateProfilePicture("");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Profile picture removed");
    } catch (err) {
      toast.error("Failed to remove profile picture");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const userInitials = watch("fullName")
    ? watch("fullName")
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "EE";

  if (isLoadingUser) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='animate-spin text-[#6B46C1]' size={48} />
      </div>
    );
  }

  // Helper for rendering editable items in User UI style
  const EditableListItem = ({ icon, label, id, type = "text", placeholder, options }: { 
    icon: React.ReactNode, 
    label: string, 
    id: keyof ProfileFormValues, 
    type?: string,
    placeholder?: string,
    options?: string[]
  }) => (
    <div className='flex items-center gap-4 bg-gray-100/50 p-4 rounded-2xl transition-all hover:bg-gray-100 group'>
      <div className='bg-white p-3 rounded-xl shadow-sm text-[#6B46C1]'>
        {icon}
      </div>
      <div className='flex flex-col flex-1'>
        <span className='font-medium text-gray-400 text-xs'>
          {label}
        </span>
        {options ? (
          <Select 
            defaultValue={watch(id)} 
            onValueChange={(val) => setValue(id, val)}
          >
            <SelectTrigger className="bg-transparent border-0 h-auto p-0 font-bold text-gray-900 text-sm shadow-none focus:ring-0">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="max-h-60 rounded-xl">
              {options.map((opt) => (
                <SelectItem key={opt} value={opt} className="rounded-lg">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id={id}
            type={type}
            {...register(id)}
            disabled={id === "country"}
            className={`bg-transparent border-0 h-auto p-0 font-bold text-gray-900 text-sm shadow-none focus-visible:ring-0 ${id === "country" ? "cursor-not-allowed opacity-70" : ""}`}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className='flex flex-col mx-auto p-4 w-full max-w-2xl min-h-screen pb-24 bg-white'>
      {/* Header */}
      <div className='flex items-center gap-4 mb-8'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => router.back()}
          className='hover:bg-gray-50 rounded-full w-10 h-10 text-gray-700'
        >
          <ChevronLeft size={24} />
        </Button>
        {!isTasker && <h1 className='font-bold text-gray-900 text-2xl'>Profile Details</h1>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
        {/* Profile Avatar Center */}
        <div className='flex flex-col items-center justify-center py-4 space-y-4'>
          <div className='relative group'>
            <div 
              className='flex justify-center items-center bg-[#6B46C1] shadow-lg border-4 border-white rounded-full w-24 h-24 font-bold text-white text-3xl overflow-hidden relative transition-all cursor-pointer hover:brightness-95'
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className='absolute inset-0 bg-black/40 flex items-center justify-center z-10'>
                  <Loader2 className='animate-spin text-white' size={24} />
                </div>
              ) : null}
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt='Profile'
                  className='w-full h-full object-cover'
                />
              ) : (
                userInitials
              )}
            </div>
            </div>
            <CloudinaryUpload
              onSuccess={handleProfilePictureUploadSuccess}
              folder="profile-pictures"
              variant="avatar"
              buttonText="Upload profile image"
            />
          </div>
          {!isTasker && (
            <h2 className='font-bold text-gray-900 text-xl mt-2'>
              {watch("fullName")}
            </h2>
          )}
        </div>

        {isTasker ? (
          // TASKER VIEW (Form-based)
          <>
            <div className='space-y-6'>
              <h3 className='font-bold text-gray-700 text-lg'>Basic Information</h3>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor="fullName" className="text-gray-600 font-medium">Full name</Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    className={`bg-gray-100/80 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] ${errors.fullName ? "ring-1 ring-red-500" : ""}`}
                    placeholder="Elliot Eniola"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor="phoneNumber" className="text-gray-600 font-medium">Phone number</Label>
                  <Input
                    id="phoneNumber"
                    {...register("phoneNumber")}
                    className={`bg-gray-100/80 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] ${errors.phoneNumber ? "ring-1 ring-red-500" : ""}`}
                    placeholder="Enter phone number"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
                </div>
                <div className='space-y-2 relative'>
                  <Label htmlFor="dateOfBirth" className="text-gray-600 font-medium">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                    className={`bg-gray-100/80 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] ${errors.dateOfBirth ? "ring-1 ring-red-500" : ""}`}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
                </div>
              </div>
            </div>

            <div className='space-y-6'>
              <h3 className='font-bold text-gray-700 text-lg'>Location</h3>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor="country" className="text-gray-600 font-medium">Country</Label>
                  <Input
                    id="country"
                    {...register("country")}
                    disabled
                    className="bg-gray-100/80 border-0 h-12 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div className='space-y-2'>
                  <Label className="text-gray-600 font-medium">State of residence</Label>
                  <Select 
                    defaultValue={user?.residentState} 
                    onValueChange={(val) => setValue("residentState", val)}
                  >
                    <SelectTrigger className="bg-gray-100/80 border-0 h-12 rounded-xl focus:ring-1 focus:ring-[#6B46C1]">
                      <SelectValue placeholder="Select your state of residence" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 rounded-xl">
                      {NIGERIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state} className="rounded-lg">
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.residentState && <p className="text-red-500 text-xs mt-1">{errors.residentState.message}</p>}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor="address" className="text-gray-600 font-medium">Home Address</Label>
                  <Textarea
                    id="address"
                    {...register("address")}
                    className={`bg-gray-100/80 border-0 min-h-[120px] rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] resize-none p-4 ${errors.address ? "ring-1 ring-red-500" : ""}`}
                    placeholder="Enter your full address"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>
              </div>
            </div>

            <div className='space-y-6' id='service-info'>
              <h3 className='font-bold text-gray-700 text-lg'>Service Information</h3>
              <div className='space-y-6'>
                <div className='space-y-3'>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">Previous work</span>
                    <span className="text-xs text-gray-400">Upload images showcasing previous work</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {user?.previousWork?.map((work) => (
                      <div key={work.publicId} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100">
                        <img src={work.url} alt="Previous work" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleDeleteWork(work.publicId)}
                          className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {(user?.previousWork?.length || 0) < 10 && (
                      <CloudinaryUpload
                        onSuccess={handlePortfolioUploadSuccess}
                        folder="portfolio"
                        variant="box"
                        buttonText="Upload Image"
                        multiple={true}
                        maxFiles={5}
                      />
                    )}
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor="websiteLink" className="text-gray-600 font-medium">Website or portfolio Link (Optional)</Label>
                  <div className="relative">
                    <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="websiteLink"
                      {...register("websiteLink")}
                      className={`bg-gray-100/80 border-0 h-12 rounded-xl pl-11 focus-visible:ring-1 focus-visible:ring-[#6B46C1] ${errors.websiteLink ? "ring-1 ring-red-500" : ""}`}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  {errors.websiteLink && <p className="text-red-500 text-xs mt-1">{errors.websiteLink.message}</p>}
                </div>
              </div>
            </div>
          </>
        ) : (
          // USER VIEW (List-based style)
          <div className='space-y-10'>
            <div className='space-y-4'>
              <h3 className='font-bold text-gray-400 text-xs tracking-[0.2em] uppercase px-1'>
                BASIC INFORMATION
              </h3>
              <div className='space-y-3'>
                <EditableListItem 
                  icon={<UserIcon size={20} />} 
                  label="Full Name" 
                  id="fullName" 
                  placeholder="Full name" 
                />
                <div className='flex items-center gap-4 bg-gray-100/50 p-4 rounded-2xl transition-all hover:bg-gray-100 opacity-80'>
                  <div className='bg-white p-3 rounded-xl shadow-sm text-gray-400'>
                    <Mail size={20} />
                  </div>
                  <div className='flex flex-col flex-1'>
                    <span className='font-medium text-gray-400 text-xs'>
                      Email Address
                    </span>
                    <span className='font-bold text-gray-400 text-sm'>
                      {user?.emailAddress}
                    </span>
                  </div>
                </div>
                <EditableListItem 
                  icon={<Phone size={20} />} 
                  label="Phone" 
                  id="phoneNumber" 
                  placeholder="Phone number" 
                />
                <EditableListItem 
                  icon={<Calendar size={20} />} 
                  label="Date of Birth" 
                  id="dateOfBirth" 
                  type="date"
                />
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='font-bold text-gray-400 text-xs tracking-[0.2em] uppercase px-1'>
                NATIONALITY
              </h3>
              <div className='space-y-3'>
                <EditableListItem 
                  icon={<Flag size={20} />} 
                  label="Country" 
                  id="country" 
                  placeholder="Country" 
                />
                <EditableListItem 
                  icon={<MapPin size={20} />} 
                  label="State" 
                  id="residentState" 
                  options={NIGERIAN_STATES}
                  placeholder="Select state"
                />
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='font-bold text-gray-400 text-xs tracking-[0.2em] uppercase px-1'>
                RESIDENCE
              </h3>
              <div className='space-y-3'>
                <div className='flex items-start gap-4 bg-gray-100/50 p-4 rounded-2xl transition-all hover:bg-gray-100'>
                  <div className='bg-white p-3 rounded-xl shadow-sm text-[#6B46C1]'>
                    <MapPin size={20} />
                  </div>
                  <div className='flex flex-col flex-1'>
                    <span className='font-medium text-gray-400 text-xs'>
                      Address
                    </span>
                    <Textarea
                      id="address"
                      {...register("address")}
                      className="bg-transparent border-0 h-auto p-0 font-bold text-gray-900 text-sm shadow-none focus-visible:ring-0 resize-none min-h-[60px]"
                      placeholder="Full address"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className='space-y-4'>
          <Button
            type="submit"
            disabled={isSaving}
            className='w-full bg-[#6B46C1] hover:bg-[#5a3ba3] text-white py-7 rounded-2xl font-bold text-lg shadow-md transition-all active:scale-[0.98]'
          >
            {isSaving ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : null}
            Save Changes
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full border-red-100 hover:bg-red-50 text-red-500 py-7 rounded-2xl font-bold text-lg transition-all border-2"
          >
            Delete Account
          </Button>
        </div>
      </form>
    </div>
  );
}
