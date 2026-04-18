"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { UserType } from "@/types/auth";
import { toast } from "sonner";

interface GoogleSignInButtonProps {
  role: UserType;
  className?: string;
}

export function GoogleSignInButton({ role, className }: GoogleSignInButtonProps) {
  const { handleGoogleSignIn } = useGoogleAuth();

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            handleGoogleSignIn(credentialResponse.credential, role);
          } else {
            toast.error("Failed to get Google credentials");
          }
        }}
        onError={() => {
          console.error("Login Failed");
          toast.error("Google login failed. Please try again.");
        }}
        useOneTap={false}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="384"
      />
    </div>
  );
}
