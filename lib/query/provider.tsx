"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./client";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position='top-center' richColors />
      {children}
    </QueryClientProvider>
  );
}
