"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

interface VerificationPendingCardProps {
  onRefresh?: () => void;
}

export function VerificationPendingCard({ onRefresh }: VerificationPendingCardProps) {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["verificationStatus"] });
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    if (onRefresh) onRefresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <Card className="border-purple-100 bg-purple-50/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Clock size={120} className="text-[#6B46C1]" />
        </div>
        
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 relative">
            <Clock className="text-[#6B46C1] w-8 h-8" />
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-[#6B46C1] border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <CardTitle className="text-purple-900 text-2xl font-bold">Verification Under Review</CardTitle>
          <CardDescription className="text-purple-700 font-medium">
            Your identity details are currently being reviewed.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-6 pt-4">
          <p className="text-sm text-purple-800/80 max-w-sm mx-auto leading-relaxed">
            Our team is verifying your submission. This typically takes 24-48 hours. 
            You will be notified once your verification status is updated.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-purple-200 text-[#6B46C1] hover:bg-purple-100 h-12 px-6 rounded-xl font-bold flex items-center gap-2"
            >
              <RefreshCcw size={18} />
              Check Status
            </Button>
            
            <Link href="/home" className="w-full sm:w-auto">
              <Button className="bg-[#6B46C1] hover:bg-[#553C9A] text-white h-12 px-8 rounded-xl font-bold flex items-center gap-2 w-full">
                <Home size={18} />
                Go to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
