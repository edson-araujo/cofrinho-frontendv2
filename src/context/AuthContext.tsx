"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthCookie } from "@/lib/cookies";

interface AuthContextType {
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthCookie();
    if (!token) {
      router.push("/login"); // Se não estiver logado, redireciona para o login
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {isAuthenticated ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
