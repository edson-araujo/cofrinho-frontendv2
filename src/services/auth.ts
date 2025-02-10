import { apiRequest } from "@/lib/api";
import type { LoginFormInputs, RegisterFormInputs, VerifyRespnse } from "../types/auth";

export async function registerUser(userData: RegisterFormInputs) {
	return await apiRequest("/auth/signup", "POST", userData);
}

export async function loginUser(userData: LoginFormInputs) {
	return await apiRequest("auth/login", "POST", { userData });
}

export async function verifyEmail(data: VerifyRespnse) {
	return await apiRequest("/auth/autenticar", "POST", { data });
}

export async function logoutUser() {
	return await apiRequest("auth/logout", "POST");
}
