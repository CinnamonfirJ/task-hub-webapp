"use client";

import { GoogleOnboardingForm } from "@/components/auth/GoogleOnboardingForm";
import { googleStore } from "@/lib/google-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/layout/Logo";

export default function GoogleCompletePage() {
  const router = useRouter();
  const { idToken, role } = googleStore.getState();

  useEffect(() => {
    if (!idToken || !role) {
      router.replace("/login");
    }
  }, [idToken, role, router]);

  if (!idToken || !role) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center mb-8">
        <Logo />
      </div>

      <div className="max-w-2xl mx-auto w-full bg-white rounded-2xl shadow-sm border p-8">
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete your profile</h1>
          <p className="text-muted-foreground">
            Just a few more details to get you started as a {role === 'tasker' ? 'Tasker' : 'User'}.
          </p>
        </div>

        <GoogleOnboardingForm />
      </div>
    </div>
  );
}
