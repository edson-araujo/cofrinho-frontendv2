import { useLoading } from "@/context/LoadingContext";

export function useApiRequest() {
  const { setLoading } = useLoading();

  return async function apiRequest<T = unknown>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
    data?: T
  ): Promise<Response | null> {
    const API_URL = "http://localhost:8080";
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
        mode: "cors",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro na requisição");
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return response;
      }

      return null;
    } catch (error) {
      console.error(`Erro na requisição ${method} ${endpoint}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
}
