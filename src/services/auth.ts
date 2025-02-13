import { useApiRequest } from "@/lib/api";
import type { alterarSenhaResponse, LoginFormInputs, ReenviarCodigoResponse, RegisterFormInputs, VerifyRespnse } from "../types/auth";

export function useAuth() {
  const apiRequest = useApiRequest();

  async function registerUser(userData: RegisterFormInputs) {
    return await apiRequest("/auth/signup", "POST", userData);
  }

  async function loginUser(userData: LoginFormInputs) {
    return await apiRequest("/auth/login", "POST", userData);
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

  async function esqueciSenha(data: ReenviarCodigoResponse) {
    return await apiRequest("/auth/esqueciSenha", "POST", data );
  }

  async function alterarSenha(data: alterarSenhaResponse) {
    return await apiRequest("/auth/alterarSenha", "POST", data);
  }

  
  return {
    registerUser,
    loginUser,
    autenticarConta,
    logoutUser,
    reenviarCodigoAutenticacao,
    esqueciSenha,
    alterarSenha
  };
}