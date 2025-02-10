export interface RegisterFormInputs {
    nome: string;
    sobrenome: string;
    email: string;
    password: string;
    [key: string]: unknown;
  }
  
  export interface LoginFormInputs {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message?: string;
    token?: string;
  }

  export interface VerifyRespnse {
    email: string;
    codigoVerificacao: string;
  }
  
  export interface ReenviarEmailResponse {
    email: string;
  }