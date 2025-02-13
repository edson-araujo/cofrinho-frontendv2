import * as z from "zod";

export const alterarSenhaSchema = z.object({
  novaSenha: z.string()
    .min(8, "A senha deve atender os critérios de segurança")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[@$!%*?&]/, "A senha deve conter pelo menos um caractere especial"),
  confirmarNovaSenha: z.string().min(8, "A senha deve atender os critérios de segurança")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número")
  .regex(/[@$!%*?&]/, "A senha deve conter pelo menos um caractere especial"), 
  codigoVerificacao: z.string()
      .length(6, "O código deve ter exatamente 6 dígitos")
      .regex(/^\d+$/, "Apenas números são permitidos"),
}).refine((data) => data.novaSenha === data.confirmarNovaSenha, {
  message: "As senhas precisam ser iguais",
  path: ["confirmPassword"],
});;