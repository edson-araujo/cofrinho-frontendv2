import * as z from "zod";

export const reenviarSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
});
