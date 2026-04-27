"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./client";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { NextStep, NextStepProvider } from "nextstepjs";
import { userSteps, taskerSteps, tourAnimationConfig, CustomTourCard } from "@/components/onboarding/OnboardingTour";

export function Providers({ children }: { children: ReactNode }) {
  const steps = [
    {
      tour: "userTour",
      steps: userSteps,
    },
    {
      tour: "taskerTour",
      steps: taskerSteps,
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <NextStepProvider>
        <NextStep
          steps={steps}
          showNextStep={true}
          overlayZIndex={9999}
          shadowOpacity="0.7"
          shadowRgb="0,0,0"
          cardComponent={CustomTourCard}
          onStepChange={(step, tourName) => console.log(`Step changed to ${step} in ${tourName}`)}
          onComplete={(tourName) => {
            console.log(`Tour completed: ${tourName}`);
            localStorage.setItem("taskhub_tour_completed", "true");
          }}
          onSkip={(step, tourName) => {
            console.log(`Tour skipped at step ${step} in ${tourName}`);
            localStorage.setItem("taskhub_tour_completed", "true");
          }}
        >
          <Toaster position='top-center' richColors />
          {children}
        </NextStep>
      </NextStepProvider>
    </QueryClientProvider>
  );
}
