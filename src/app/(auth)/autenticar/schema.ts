import * as z from "zod";

export const verifySchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  codigoVerificacao: z.string()
    .length(6, "O código deve ter exatamente 6 dígitos")
    .regex(/^\d+$/, "Apenas números são permitidos"),
});
