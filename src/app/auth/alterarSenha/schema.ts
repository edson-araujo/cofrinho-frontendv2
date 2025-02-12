import * as z from "zod";

export const alterarSenhaSchema = z.object({
  password: z.string()
    .min(8, "A senha deve atender os critérios de segurança")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[@$!%*?&]/, "A senha deve conter pelo menos um caractere especial"),
  confirmPassword: z.string().min(8, "A senha deve atender os critérios de segurança")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número")
  .regex(/[@$!%*?&]/, "A senha deve conter pelo menos um caractere especial"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas precisam ser iguais",
  path: ["confirmPassword"],
});;