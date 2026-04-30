"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import Script from "next/script";

interface CloudinaryUploadProps {
  onSuccess: (url: string, publicId: string) => void;
  folder?: string;
  buttonText?: string;
  className?: string;
  multiple?: boolean;
  maxFiles?: number;
  variant?: "button" | "avatar" | "box";
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

/**
 * Reusable Cloudinary Upload Widget Component
 * 
 * To use this, you must set these environment variables:
 * NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_name
 * NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
 */
export default function CloudinaryUpload({
  onSuccess,
  folder = "task-hub",
  buttonText = "Upload Image",
  className = "",
  multiple = false,
  maxFiles = 1,
  variant = "button",
}: CloudinaryUploadProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const widgetRef = useRef<any>(null);

  // Use environment variables or placeholders
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    // Re-initialize widget if dependencies change or when script loads
    if (isLoaded && cloudName && uploadPreset) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          folder,
          multiple,
          maxFiles,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
          maxFileSize: 5000000, // 5MB
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#6B46C1",
              menuIcons: "#5A616A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#6B46C1",
              action: "#6B46C1",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#6B46C1",
              complete: "#20B832",
              sourceBg: "#E4EBF1"
            },
            fonts: {
              default: null,
              "'Inter', sans-serif": "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
            }
          }
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            onSuccess(result.info.secure_url, result.info.public_id);
          }
        }
      );
    }
  }, [isLoaded, cloudName, uploadPreset, folder, multiple, maxFiles, onSuccess]);

  const handleUpload = () => {
    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary credentials missing. Please check your .env file.");
      return;
    }
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  const renderTrigger = () => {
    if (variant === "avatar") {
      return (
        <button
          type="button"
          onClick={handleUpload}
          className={`text-[#6B46C1] text-sm font-semibold hover:underline ${className}`}
          disabled={!isLoaded}
        >
          {buttonText}
        </button>
      );
    }

    if (variant === "box") {
      return (
        <div
          onClick={handleUpload}
          className={`aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors ${className}`}
        >
          {!isLoaded ? (
            <Loader2 className="animate-spin text-[#6B46C1]" size={24} />
          ) : (
            <>
              <div className="bg-gray-50 p-2 rounded-full">
                <Upload className="text-gray-400" size={20} />
              </div>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{buttonText}</span>
            </>
          )}
        </div>
      );
    }

    return (
      <Button
        type="button"
        onClick={handleUpload}
        className={`gap-2 h-10 px-4 rounded-xl border-gray-200 font-semibold transition-all active:scale-[0.98] ${className}`}
        variant="outline"
        disabled={!isLoaded}
      >
        {!isLoaded ? (
          <Loader2 className="animate-spin text-gray-400" size={16} />
        ) : (
          <ImageIcon size={16} className="text-[#6B46C1]" />
        )}
        {buttonText}
      </Button>
    );
  };

  return (
    <>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        onLoad={() => setIsLoaded(true)}
      />
      {renderTrigger()}
      {!cloudName && isLoaded && (
        <p className="text-[10px] text-red-500 mt-1">Cloudinary Cloud Name missing</p>
      )}
    </>
  );
}
