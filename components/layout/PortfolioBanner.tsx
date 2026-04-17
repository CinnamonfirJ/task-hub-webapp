"use client";

import Link from "next/link";
import { X, TrendingUp, ImagePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const DISMISS_KEY = "portfolio_banner_dismissed";

export function PortfolioBanner() {
  const { user, isLoadingUser } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoadingUser) return;

    const isTasker = user?.role === "tasker";
    const hasNoWork = !user?.previousWork || user.previousWork.length === 0;
    const dismissed = sessionStorage.getItem(DISMISS_KEY) === "true";

    setVisible(isTasker && hasNoWork && !dismissed);
  }, [user, isLoadingUser]);

  const dismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:left-64">
      <Link
        href="/profile/details#service-info"
        className="group flex items-center gap-3 md:gap-4 w-full bg-linear-to-r from-[#6B46C1] to-[#7C3AED] px-4 md:px-6 py-3.5 shadow-[0_-4px_24px_rgba(107,70,193,0.25)] hover:from-[#5a3ba3] hover:to-[#6d28d9] transition-all"
      >
        {/* Animated icon */}
        <div className="shrink-0 bg-white/15 p-2 rounded-xl group-hover:scale-110 transition-transform">
          <ImagePlus size={18} className="text-white" />
        </div>

        {/* Copy */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-tight truncate">
            Boost your chances of getting hired by adding your portfolio!
          </p>
          <p className="text-white/70 text-xs mt-0.5 hidden sm:block">
            Taskers with previous work samples get{" "}
            <span className="text-white font-semibold">3× more job offers</span>
            . Upload yours now.
          </p>
        </div>

        {/* CTA */}
        <div className="shrink-0 flex items-center gap-2 bg-white text-[#6B46C1] font-bold text-xs px-3 py-1.5 rounded-lg group-hover:bg-purple-50 transition-colors sm:flex">
          <TrendingUp size={13} />
          Add Portfolio
        </div>

        {/* Dismiss */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss banner"
          className="shrink-0 ml-1 w-7 h-7 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/20 transition-all"
        >
          <X size={15} />
        </button>
      </Link>
    </div>
  );
}
