"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import Spinner from "@/components/ui/spinner";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner size="xl" />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading deve ser usado dentro de um LoadingProvider");
  }
  return context;
}
