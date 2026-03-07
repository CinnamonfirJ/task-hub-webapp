"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used based on typical shadcn patterns

interface VerifyIdentityButtonProps {
  userId?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost";
}

const VERIFICATION_URL = process.env.NEXT_PUBLIC_DIDIT_VERIFICATION_URL;

export function VerifyIdentityButton({
  userId,
  className,
  variant = "default",
}: VerifyIdentityButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    console.log(VERIFICATION_URL);
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to verify your identity.");
        return;
      }

      const response = await fetch("/api/didit/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vendor_data: userId || "6999aad74d2e3e3c3910abb0",
          vendorData: userId || "6999aad74d2e3e3c3910abb0",
          external_id: userId || "6999aad74d2e3e3c3910abb0",
          userId: userId,
        }),
      });

      const data = await response.json();
      console.log("Session creation response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to create verification session");
      }

      const redirectUrl = data.url || data.verification_url;

      if (redirectUrl) {
        console.log("Redirecting to:", redirectUrl);
        // Redirect to Didit's hosted verification page
        window.location.href = redirectUrl;
      } else if (VERIFICATION_URL) {
        console.warn("No session URL received, falling back to static URL");
        // Fallback to static URL if provided (not recommended for session tracking)
        window.location.href = VERIFICATION_URL;
      } else {
        throw new Error("No verification URL received from Didit session");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleVerify}
      disabled={isLoading}
      className={className}
      variant={variant}
    >
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Preparing...
        </>
      ) : (
        <>
          <ShieldCheck className='mr-2 h-4 w-4' />
          Verify Identity
        </>
      )}
    </Button>
  );
}
