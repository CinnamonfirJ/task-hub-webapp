"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Fingerprint, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QoreIDVerifyButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost";
}

export function QoreIDVerifyButton({
  className,
  variant = "default",
}: QoreIDVerifyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Pre-fill states when user is loaded
  useEffect(() => {
    if (user) {
      const names = (user.fullName || "").split(" ");
      setFirstName(names[0] || "");
      setLastName(names.slice(1).join(" ") || "User");
      setEmail(user.emailAddress || "");

      let formattedPhone = user.phoneNumber || "";
      const cleanedPhone = formattedPhone.replace(/\D/g, "");
      if (cleanedPhone.startsWith("234")) {
        formattedPhone = "0" + cleanedPhone.substring(3);
      } else if (!formattedPhone.startsWith("0") && cleanedPhone.length === 10) {
        formattedPhone = "0" + cleanedPhone;
      } else {
        formattedPhone = cleanedPhone;
      }
      setPhone(formattedPhone);
    }
  }, [user]);

  const handleOpenDialog = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to verify your identity.");
      return;
    }
    setIsDialogOpen(true);
  };

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      setIsDialogOpen(false); // Close dialog when starting

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

      // 4. Launch QoreID SDK — use the state values that the user confirmed/edited
      QoreID.start({
        clientId: clientId,
        customerReference: clientReference,
        flowId: flowId,
        applicantData: {
          firstname: firstName,
          lastname: lastName,
          email: email,
          phone: phone,
        },
      });
    } catch (error: unknown) {
      console.error("QoreID verification initialization error:", error);
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
        onClick={handleOpenDialog}
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
            <Fingerprint className="mr-2 h-4 w-4" />
            Verify with NIN
          </>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Your Details</DialogTitle>
            <DialogDescription>
              We&apos;ve pre-filled your details. You can edit them if needed before starting the verification.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="flex items-start gap-2 mt-2 p-3 bg-amber-50 text-amber-800 rounded-md text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>
                <strong>Important:</strong> Please ensure that these details match the ones on your NIN exactly, otherwise the verification will fail.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerify} className="bg-[#6B46C1] hover:bg-[#553C9A]">
              Proceed to Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
