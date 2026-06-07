"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";

interface VerifyIdentityButtonProps {
  userId?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost";
}

export function VerifyIdentityButton({
  className,
  variant = "default",
}: VerifyIdentityButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleVerify = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to verify your identity.");
        return;
      }

      // 1. Initialize KYC Session from backend
      const res = await authApi.initializeKYCSession();
      console.log("QoreID initial session response:", res);

      // Extract details
      const sessionData = res?.data || res;
      const { clientId, clientReference, flowId: backendFlowId } = sessionData;
      const envFlowId = process.env.QOREID_NIN_FLOW_ID
        ? parseInt(process.env.QOREID_NIN_FLOW_ID)
        : null;
      const flowId = backendFlowId || envFlowId;
      if (!clientId || !clientReference) {
        throw new Error("Invalid response session data from backend");
      }

      if (!flowId) {
        throw new Error("flowId not found in backend response or environment variables");
      }

      // 2. Dynamically import QoreID SDK to avoid SSR issues
      // ts-expect-error - QoreID SDK doesn't provide TypeScript declarations
      const { default: QoreID } = await import("@qore-id/web-sdk");

      // 3. Register SDK listeners
      QoreID.on("success", (data: unknown) => {
        console.log("QoreID verification success:", data);
        toast.success("Identity verification completed successfully!");

        // Store submission signal
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "verificationSubmittedAt",
            Date.now().toString(),
          );
        }

        // Invalidate profile and verification status
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        queryClient.invalidateQueries({ queryKey: ["verificationStatus"] });
      });

      QoreID.on("error", (error: unknown) => {
        console.error("QoreID verification error:", error);
        const err = error as { message?: string } | null | undefined;
        toast.error(err?.message || "Verification failed. Please try again.");
      });

      QoreID.on("close", () => {
        console.log("QoreID SDK overlay closed.");
        setIsLoading(false);
      });

      // 4. Launch QoreID SDK
      QoreID.start({
        clientId: clientId,
        customerReference: clientReference,
        flowId: flowId,
        applicantData: {
          firstname: user?.firstName || user?.firstName || "",
          lastname: user?.lastName || user?.lastName || "",
          email: user?.email || "",
        },
      });
    } catch (error: unknown) {
      console.error("Verification initialization error:", error);
      const errMsg =
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again.";
      toast.error(errMsg);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div id="qoreIdContainer" />
      <Button
        onClick={handleVerify}
        disabled={isLoading}
        className={className}
        variant={variant}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Preparing...
          </>
        ) : (
          <>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Verify Identity
          </>
        )}
      </Button>
    </>
  );
}
