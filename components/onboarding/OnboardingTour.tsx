"use client";

import { useNextStep } from "nextstepjs";
import type { Step } from "nextstepjs";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

// --- User Tour Steps ---
export const userSteps: Step[] = [
  {
    icon: "👋",
    title: "Welcome to Task Hub!",
    content: "We're excited to have you! Let's show you how to get your tasks done quickly and safely.",
    side: "top",
    showControls: true,
    showSkip: true,
  },
  {
    icon: "🔍",
    title: "Find Exactly What You Need",
    content: "Use the search bar to find specific services or taskers. Just type what you're looking for!",
    selector: "#search-bar-container",
    side: "bottom",
    showControls: true,
    showSkip: true,
  },
  {
    icon: "📂",
    title: "Browse Categories",
    content: "Not sure what you need? Browse our popular categories to see what our taskers can do for you.",
    selector: "#categories-section",
    side: "top",
    showControls: true,
    showSkip: true,
  },
  {
    icon: "🚀",
    title: "Ready to Post?",
    content: "This is your shortcut! Click here to describe your task, set a budget, and start receiving bids immediately.",
    selector: "#post-task-cta",
    side: "top",
    showControls: true,
    showSkip: true,
  },
  {
    icon: "🌟",
    title: "Top Rated Taskers",
    content: "View highly-rated taskers near your location. You can check their profiles and invite them to your tasks.",
    selector: "#top-workers-section",
    side: "top",
    showControls: true,
    showSkip: true,
  },
  {
    icon: "👤",
    title: "Your Command Center",
    content: "This is the Sidebar. Use it to navigate between your dashboard, messages, and profile.",
    selector: "#sidebar-home",
    side: "right",
    showControls: true,
    showSkip: true,
  },
  {
    icon: "💳",
    title: "Wallet & Verification",
    content: "VERY IMPORTANT: Go to your Profile to fund your wallet and complete KYC. You need a funded wallet to pay taskers and KYC to build trust.",
    selector: "#sidebar-profile",
    side: "right",
    showControls: true,
    showSkip: true,
  },
  {
    icon: "✨",
    title: "You're All Set!",
    content: "Start by posting a task or browsing categories. Welcome to the future of tasks!",
    side: "top",
    showControls: true,
    showSkip: true,
  },
];

// --- Tasker Tour Steps ---
export const taskerSteps: Step[] = [
  {
    icon: "🛠️",
    title: "Welcome, Tasker!",
    content: "Ready to turn your skills into earnings? Let's show you how to find the best jobs.",
    side: "top",
    showControls: true,
    showSkip: true,
  },
  {
    icon: "🛡️",
    title: "Verification is Key",
    content: "See this banner? It's your first priority. Complete your profile and KYC to unlock bidding and get the 'Verified' badge.",
    selector: "#verification-banner-home",
    side: "bottom",
    showControls: true,
    showSkip: true,
  },
  {
    icon: "📋",
    title: "Available Jobs",
    content: "These are tasks waiting for your skills! Review the budget and deadline before placing your bid.",
    selector: "#available-tasks-section",
    side: "top",
    showControls: true,
    showSkip: true,
  },
  {
    icon: "📈",
    title: "Track Your Bids",
    content: "Monitor your active applications and earnings progress right here from your dashboard.",
    selector: "#recent-activities-section",
    side: "top",
    showControls: true,
    showSkip: true,
  },
  {
    icon: "📢",
    title: "The Job Feed",
    content: "This is your main source of income. Visit the Feed frequently to find and bid on new tasks in real-time.",
    selector: "#sidebar-feed",
    side: "right",
    showControls: true,
    showSkip: true,
  },
  {
    icon: "⚙️",
    title: "Set Your Skills",
    content: "CRITICAL: Go to Profile > Service Categories. If you don't select categories, you won't see any jobs!",
    selector: "#sidebar-profile",
    side: "right",
    showControls: true,
    showSkip: true,
  },
  {
    icon: "💰",
    title: "Start Earning!",
    content: "Check the feed, place your first bid, and start building your reputation today!",
    side: "top",
    showControls: true,
    showSkip: true,
  },
];

// --- Custom Card Component ---
export function CustomTourCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
}: any) {
  return (
    <div 
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "20px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        width: "340px",
        border: "1px solid #E2E8F0",
        color: "#1A202C",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        zIndex: 10000,
      }}
    >
      {/* Top Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{ 
          background: "#F5EEFF", 
          padding: "10px", 
          borderRadius: "12px", 
          fontSize: "20px" 
        }}>
          {step.icon}
        </div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#111827" }}>
          {step.title}
        </h3>
      </div>
      
      {/* Content */}
      <div style={{ 
        marginBottom: "24px", 
        fontSize: "14px", 
        lineHeight: "1.6", 
        color: "#4B5563",
        fontWeight: "500" 
      }}>
        {step.content}
      </div>
      
      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
           <span style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Progress
          </span>
          <span style={{ fontSize: "13px", fontWeight: "800", color: "#6B46C1" }}>
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
        
        <div style={{ display: "flex", gap: "10px" }}>
          {currentStep > 0 && (
            <button 
              onClick={prevStep}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                background: "white",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Back
            </button>
          )}
          <button 
            onClick={nextStep}
            style={{
              padding: "8px 20px",
              borderRadius: "10px",
              background: "#6B46C1",
              color: "white",
              border: "none",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 6px -1px rgba(107, 70, 193, 0.3)"
            }}
          >
            {currentStep === totalSteps - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
      
      {/* Skip Button */}
      <button 
        onClick={skipTour}
        style={{
          marginTop: "16px",
          width: "100%",
          padding: "8px",
          background: "transparent",
          border: "none",
          color: "#9CA3AF",
          fontSize: "12px",
          fontWeight: "600",
          cursor: "pointer",
          textAlign: "center",
          borderTop: "1px solid #F3F4F6",
          paddingTop: "12px"
        }}
      >
        Skip Tutorial
      </button>

      {/* Close Icon */}
      <button 
        onClick={skipTour}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "none",
          border: "none",
          color: "#D1D5DB",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        ✕
      </button>
    </div>
  );
}

// --- Animation Config ---
export const tourAnimationConfig = {
  cardTransition: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

export function OnboardingTour() {
  const { startNextStep, isNextStepVisible } = useNextStep();
  const { user } = useAuth();
  const pathname = usePathname();
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  useEffect(() => {
    // Lock navigation while tour is active
    const sidebar = document.querySelector('aside');
    const mobileNav = document.querySelector('nav'); // Adjust selector if needed
    
    if (isNextStepVisible) {
      if (sidebar) sidebar.style.pointerEvents = 'none';
      if (mobileNav) mobileNav.style.pointerEvents = 'none';
      document.body.style.overflow = 'hidden'; // Prevent scrolling away from spotlight
    } else {
      if (sidebar) sidebar.style.pointerEvents = 'auto';
      if (mobileNav) mobileNav.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      if (sidebar) sidebar.style.pointerEvents = 'auto';
      if (mobileNav) mobileNav.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, [isNextStepVisible]);

  useEffect(() => {
    // Check if tour was already completed or skipped
    const completed = localStorage.getItem("taskhub_tour_completed");
    if (completed === "true") {
      setHasCompletedTour(true);
    }
  }, [isNextStepVisible]);

  const isHome = pathname === "/home" || pathname === "/";

  const handleStartTour = () => {
    const tourName = user?.role === "tasker" ? "taskerTour" : "userTour";
    console.log("Button clicked, starting tour:", tourName);
    startNextStep(tourName);
  };

  return (
    <AnimatePresence>
      {isHome && !isNextStepVisible && !hasCompletedTour && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-24 right-6 z-100"
        >
          {/* Radiating Background Effect */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-[#6B46C1] rounded-full blur-xl pointer-events-none"
          />
          
          <button
            onClick={handleStartTour}
            className="relative flex items-center gap-2 bg-[#6B46C1] hover:bg-[#553C9A] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-purple-200 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="bg-white/20 p-1.5 rounded-full group-hover:rotate-12 transition-transform">
              <Play size={16} fill="currentColor" />
            </div>
            <span>Take a Tour</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
