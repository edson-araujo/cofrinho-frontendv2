export async function apiRequest(endpoint: string, method = "POST", data?: Record<string, unknown>) {
    const API_URL = "http://localhost:8080";
    
    try {
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

      return null; // Caso a API retorne um status 204 No Content
    } catch (error) {
      console.error(`Erro na requisição ${method} ${endpoint}:`, error);
      throw error;
    }
}
