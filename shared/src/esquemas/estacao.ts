import { z } from "zod";

export const statusEstacaoEsquema = z.enum(["offline", "ativo", "atencao", "bloqueado"]);

export const estacaoEsquema = z.object({
  estacaoId: z.string().min(1),
  aluno: z.string().min(1).nullable(),
  status: statusEstacaoEsquema,
  strikes: z.number().int().min(0).max(3),
  ultimaAtividade: z.number(),
  questaoAtual: z.string().nullable(),
});
