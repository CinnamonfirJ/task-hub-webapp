"use client";

import { useAuth } from "@/hooks/useAuth";
import { UserPaymentHistory } from "@/components/wallet/UserPaymentHistory";
import { TaskerEarnings } from "@/components/wallet/TaskerEarnings";
import { Loader2 } from "lucide-react";

export default function PaymentHistoryPage() {
  const { user, isLoadingUser } = useAuth();
  
  if (isLoadingUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#6B46C1]" />
      </div>
    );
  }

  const isTasker = user?.role === "tasker";

  return (
    <div className="p-4 md:p-8 w-full min-h-screen">
      {isTasker ? <TaskerEarnings /> : <UserPaymentHistory />}
    </div>
  );
}
