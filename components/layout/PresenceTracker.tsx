"use client";

import { useEffect } from "react";
import { useUpdatePresence } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";

export function PresenceTracker() {
  const { user } = useAuth();
  const { mutate: updatePresence } = useUpdatePresence();

  useEffect(() => {
    const isAdmin = 
      user?.role === "admin" || 
      (typeof window !== "undefined" && localStorage.getItem("userType") === "admin") ||
      (typeof window !== "undefined" && window.location.pathname.startsWith("/admin"));

    if (!user || isAdmin) {
      if (process.env.NODE_ENV === "development" && isAdmin) {
        console.log("[PresenceTracker] Skipping presence update for admin user");
      }
      return;
    }

    // Initial online status
    updatePresence(true);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updatePresence(true);
      } else {
        updatePresence(false);
      }
    };

    const handleBeforeUnload = () => {
      updatePresence(false);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Mark offline on component unmount
      updatePresence(false);
    };
  }, [user, updatePresence]);

  return null;
}
