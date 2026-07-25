import { z } from "zod";

export const statusProvaEsquema = z.enum(["aguardando", "em_andamento", "encerrada"]);

export const provaEsquema = z.object({
  provaId: z.string().min(1),
  status: statusProvaEsquema,
  questoesIds: z.array(z.string().min(1)),
  inicioEm: z.number().optional(),
  duracaoMin: z.number().positive().optional(),
});
