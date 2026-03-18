"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Flag,
  MapPin,
  Trash2,
  ChevronLeft,
  Camera,
  Loader2,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileDetailsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  const userInitials = fullName
    ? fullName
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "EE";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        await authApi.updateProfilePicture(base64String);
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        toast.success("Profile picture updated");
      } catch (err) {
        toast.error("Failed to upload profile picture");
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
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

  const details = [
    {
      section: "BASIC INFORMATION",
      items: [
        {
          icon: <Mail size={20} className='text-[#6B46C1]' />,
          label: "Email",
          value: user?.emailAddress || "-",
        },
        {
          icon: <Phone size={20} className='text-[#6B46C1]' />,
          label: "Phone",
          value: user?.phoneNumber || "-",
        },
        {
          icon: <Calendar size={20} className='text-[#6B46C1]' />,
          label: "Date of Birth",
          value: (user as any)?.dateOfBirth || "-",
        },
      ],
    },
    {
      section: "NATIONALITY",
      items: [
        {
          icon: <Flag size={20} className='text-[#6B46C1]' />,
          label: "Country",
          value: user?.country || "-",
        },
        {
          icon: <MapPin size={20} className='text-[#6B46C1]' />,
          label: "Resident State",
          value: user?.residentState || "Lagos",
        },
      ],
    },
    {
      section: "RESIDENCE",
      items: [
        {
          icon: <Flag size={20} className='text-[#6B46C1]' />,
          label: "State",
          value: user?.residentState || "-",
        },
        {
          icon: <MapPin size={20} className='text-[#6B46C1]' />,
          label: "Address",
          value: (user as any)?.address || "-",
        },
      ],
    },
  ];

  return (
    <div className='flex flex-col space-y-8 mx-auto p-8 w-full max-w-4xl min-h-screen pb-20'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => router.back()}
          className='hover:bg-purple-50 rounded-full w-12 h-12 text-gray-700'
        >
          <ChevronLeft size={28} />
        </Button>
        <h1 className='font-bold text-gray-900 text-3xl'>Profile Details</h1>
      </div>

      {/* Profile Avatar Center */}
      <div className='flex flex-col items-center justify-center py-6 space-y-3'>
        <div className='relative group'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='flex justify-center items-center bg-[#6B46C1] shadow-md border-4 border-white rounded-full w-28 h-28 font-bold text-white text-4xl overflow-hidden cursor-pointer relative transition-transform hover:scale-105 active:scale-95'>
                {isUploading ? (
                  <div className='absolute inset-0 bg-black/40 flex items-center justify-center z-10 transition-all'>
                    <Loader2 className='animate-spin text-white' size={32} />
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
                {/* Camera Overlay */}
                <div className='absolute bottom-0 right-0 bg-[#6B46C1] p-2 rounded-full border-2 border-white shadow-sm text-white transition-all transform hover:scale-110'>
                  <Camera size={16} />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='center'
              className='w-48 rounded-2xl p-2 shadow-xl border-gray-100 bg-white'
            >
              <DropdownMenuItem
                onClick={() => fileInputRef.current?.click()}
                className='flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-purple-50 transition-colors'
                disabled={isUploading}
              >
                <div className='bg-purple-100 p-2 rounded-lg text-[#6B46C1]'>
                  <Upload size={16} />
                </div>
                <span className='font-bold text-gray-700 text-sm'>
                  Upload Photo
                </span>
              </DropdownMenuItem>
              {user?.profilePicture && (
                <DropdownMenuItem
                  onClick={handleRemovePicture}
                  className='flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-red-50 text-red-600 transition-colors'
                  disabled={isUploading}
                >
                  <div className='bg-red-100 p-2 rounded-lg text-red-600'>
                    <Trash2 size={16} />
                  </div>
                  <span className='font-bold text-sm'>Remove Photo</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileChange}
            accept='image/*'
            className='hidden'
          />
        </div>
        <h2 className='font-bold text-gray-900 text-xl'>
          {fullName || "Elliot Eniola"}
        </h2>
      </div>

      {/* Information Sections */}
      <div className='space-y-10'>
        {details.map((group) => (
          <div key={group.section} className='space-y-4'>
            <h3 className='font-bold text-gray-400 text-xs tracking-[0.2em] uppercase px-1'>
              {group.section}
            </h3>
            <div className='space-y-3'>
              {group.items.map((item, idx) => (
                <div
                  key={idx}
                  className='flex items-center gap-4 bg-gray-100/50 p-4 rounded-2xl transition-all hover:bg-gray-100'
                >
                  <div className='bg-white p-3 rounded-xl shadow-sm text-gray-400'>
                    {item.icon}
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-medium text-gray-500 text-xs'>
                      {item.label}
                    </span>
                    <span className='font-bold text-gray-900 text-sm'>
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Account Footer */}
      <div className='pt-10'>
        <Button
          variant='outline'
          className='w-full border-red-200 hover:bg-red-50 text-red-500 py-8 rounded-2xl font-bold text-lg transition-all active:scale-[0.99] border-2 shadow-sm'
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
