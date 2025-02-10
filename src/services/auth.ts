import { useApiRequest } from "@/lib/api";
import type { LoginFormInputs, ReenviarCodigoResponse, RegisterFormInputs, VerifyRespnse } from "../types/auth";

export function useAuth() {
  const apiRequest = useApiRequest();

  async function registerUser(userData: RegisterFormInputs) {
    return await apiRequest("/auth/signup", "POST", userData);
  }

  async function loginUser(userData: LoginFormInputs) {
    return await apiRequest("auth/login", "POST", { userData });
  }

  async function autenticarConta(data: VerifyRespnse) {
    return await apiRequest("/auth/autenticar", "POST", data);
  }

  async function reenviarCodigoAutenticacao(data: ReenviarCodigoResponse){
    return await apiRequest("/auth/reenviarEmail", "POST", data);
  }

  async function logoutUser() {
    return await apiRequest("auth/logout", "POST");
  }

  return {
    registerUser,
    loginUser,
    autenticarConta,
    logoutUser,
    reenviarCodigoAutenticacao,
  };
}