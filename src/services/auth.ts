import { setAuthCookie } from "@/lib/cookies";

export async function login({ email, password }: { email: string; password: string }) {
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Credenciais inválidas");

    const { token } = await response.json();
    setAuthCookie(token);

    return { success: true };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
