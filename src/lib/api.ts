import { useLoading } from "@/context/LoadingContext";

export function useApiRequest() {
  const { setLoading } = useLoading();
  const API_URL = "http://localhost:8080"; // Pode ser extraído de variáveis de ambiente

  return async function apiRequest<T = unknown, R = unknown>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
    data?: T
  ): Promise<{ data?: R; error?: string; status?: number; fieldErrors?: Record<string, string> }> {
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

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorData = contentType?.includes("application/json") ? await response.json() : null;
        return {
          error: errorData?.message || "Erro desconhecido",
          status: response.status,
          fieldErrors: errorData?.fieldErrors || null,
        };
      }

      const responseData = contentType?.includes("application/json") ? await response.json() : null;
      return { data: responseData, status: response.status };
    } catch {
      return { error: "Erro de conexão com o servidor" };
    } finally {
      setLoading(false);
    }
  };
}