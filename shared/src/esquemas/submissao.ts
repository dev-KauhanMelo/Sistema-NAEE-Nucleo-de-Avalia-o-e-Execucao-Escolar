import { z } from "zod";

export const tipoSubmissaoEsquema = z.enum(["teste", "final"]);

export const resultadoCasoEsquema = z.object({
  passou: z.boolean(),
  tempoMs: z.number().optional(),
  memoriaKb: z.number().optional(),
  saidaObtida: z.string().optional(),
  erro: z.string().optional(),
});

export const submissaoEsquema = z.object({
  estacaoId: z.string().min(1),
  questaoId: z.string().min(1),
  provaId: z.string().min(1),
  codigo: z.string(),
  timestamp: z.number(),
  tipo: tipoSubmissaoEsquema,
  resultados: z.array(resultadoCasoEsquema),
});
