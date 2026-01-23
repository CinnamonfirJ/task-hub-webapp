"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      router.push("/home"); // Redirect to (main)/home (mapped as /home)
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className='flex justify-center items-center bg-gray-50 min-h-screen'>
      <div className='border-4 border-purple-600 border-t-transparent rounded-full w-8 h-8 animate-spin' />
    </div>
  );
}
