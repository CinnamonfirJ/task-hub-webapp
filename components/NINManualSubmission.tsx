"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { taskersApi } from "@/lib/api/taskers";

const ninSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  nin: z
    .string()
    .length(11, "NIN must be exactly 11 digits")
    .regex(/^\d+$/, "NIN must contain only digits"),
});

type NINFormValues = z.infer<typeof ninSchema>;

interface NINManualSubmissionProps {
  onSuccess?: (kycId?: string) => void;
  onCancel?: () => void;
}

export function NINManualSubmission({ onSuccess, onCancel }: NINManualSubmissionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NINFormValues>({
    resolver: zodResolver(ninSchema),
    defaultValues: {
      fullName: "",
      nin: "",
    },
  });

  const onSubmit = async (values: NINFormValues) => {
    try {
      setIsLoading(true);
      const response = await taskersApi.submitNIN(values.nin, values.fullName);

      if (response.status === "success") {
        setIsSuccess(true);
        toast.success(response.message || "NIN submitted successfully");
        if (onSuccess) {
          onSuccess(response.kycId);
        }
      } else {
        throw new Error(response.message || "Submission failed");
      }
    } catch (error: any) {
      console.error("NIN Submission error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Card className="border-green-100 bg-green-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckCircle2 size={120} className="text-green-500" />
          </div>
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="text-green-600 w-8 h-8" />
            </div>
            <CardTitle className="text-green-900 text-2xl font-bold">Submission Received</CardTitle>
            <CardDescription className="text-green-700 font-medium">
              Your NIN has been submitted for manual review.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6 pt-4">
            <p className="text-sm text-green-800/80 max-w-sm mx-auto leading-relaxed">
              An admin will review your details shortly. You will be notified once your verification status is updated.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl px-8"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full"
    >
      <Card className="shadow-xl border-none ring-1 ring-gray-100 rounded-3xl overflow-hidden">
        <CardHeader className="bg-white px-8 pt-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-50 p-2 rounded-lg">
              <ShieldCheck className="text-purple-600 w-5 h-5" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">Manual NIN Submission</CardTitle>
          </div>
          <CardDescription className="text-gray-500">
            Provide your National Identity Number (NIN) for manual verification by our team.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="font-bold text-gray-700 text-sm pl-1">
                Full Legal Name
              </Label>
              <div className="relative">
                <Input
                  id="fullName"
                  {...register("fullName")}
                  placeholder="e.g. Adewale Okonkwo"
                  className={`bg-gray-50 border-none rounded-xl h-14 px-4 font-medium focus-visible:ring-purple-400 transition-all ${
                    errors.fullName ? "ring-2 ring-red-400" : ""
                  }`}
                />
              </div>
              {errors.fullName && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-xs font-medium pl-1 flex items-center gap-1"
                >
                  <AlertCircle size={12} /> {errors.fullName.message}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nin" className="font-bold text-gray-700 text-sm pl-1">
                NIN (11 Digits)
              </Label>
              <div className="relative">
                <Input
                  id="nin"
                  {...register("nin")}
                  placeholder="12345678901"
                  maxLength={11}
                  className={`bg-gray-50 border-none rounded-xl h-14 px-4 font-medium focus-visible:ring-purple-400 transition-all ${
                    errors.nin ? "ring-2 ring-red-400" : ""
                  }`}
                />
              </div>
              <p className="text-[10px] text-gray-400 pl-1 font-medium">
                Your NIN is stored in a masked format for privacy.
              </p>
              {errors.nin && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-xs font-medium pl-1 flex items-center gap-1"
                >
                  <AlertCircle size={12} /> {errors.nin.message}
                </motion.p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#6B46C1] hover:bg-[#553C9A] py-8 rounded-2xl w-full font-bold text-lg shadow-lg shadow-purple-200 transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit for Review"
                )}
              </Button>
              
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  className="text-gray-400 hover:text-gray-600 font-medium"
                >
                  Back to SDK Verification
                </Button>
              )}
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <p className="text-[11px] text-blue-600/70 font-medium text-center leading-relaxed">
              Manual review typically takes 24-48 hours. By submitting, you agree to our verification terms.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
