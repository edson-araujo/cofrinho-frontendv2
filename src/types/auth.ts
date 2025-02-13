export interface RegisterFormInputs {
    nome: string;
    sobrenome: string;
    email: string;
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
    [key: string]: unknown;
  }
  
  export interface ReenviarEmailResponse {
    email: string;
  }

  export interface ReenviarCodigoResponse {
    email: string;
    [key: string]: unknown;
  }

  export interface alterarSenhaResponse {
    novaSenha: string;
    confirmarNovaSenha: string;
    codigoVerificacao: string;
    [key: string]: unknown;
  }