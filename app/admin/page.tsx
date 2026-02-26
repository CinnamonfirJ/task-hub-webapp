"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center space-y-4 bg-[#F8F9FC]'>
      <Loader2 className='h-10 w-10 animate-spin text-[#6B46C1]' />
      <p className='text-sm font-medium text-gray-500 text-center px-4'>
        Redirecting to dashboard...
      </p>
    </div>
  );
}
