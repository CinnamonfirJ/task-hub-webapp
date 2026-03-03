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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create verification session");
      }

      if (VERIFICATION_URL) {
        // Redirect to Didit's hosted verification page
        window.location.href = VERIFICATION_URL;
      } else {
        throw new Error("No verification URL received");
      }
      // if (data.verification_url) {
      //   // Redirect to Didit's hosted verification page
      //   window.location.href = data.verification_url;
      // } else {
      //   throw new Error("No verification URL received");
      // }
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
