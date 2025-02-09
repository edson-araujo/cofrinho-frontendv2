"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return <h1>Bem-vindo ao Dashboard!</h1>;
}
