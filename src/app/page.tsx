"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { getAuthCookie } from "@/lib/cookies";

export default function HomePage() {
  const router = useRouter();
  const { setLoading } = useLoading(); // Usa o contexto de loading

  useEffect(() => {
    setLoading(true);

    const token = getAuthCookie();
    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
    setLoading(false);

  }, [router, setLoading]);

  return null;
}
