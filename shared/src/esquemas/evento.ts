import { z } from "zod";

export const tipoEventoEsquema = z.enum([
  "login",
  "logout",
  "perda_foco",
  "retorno_foco",
  "bloqueio",
  "desbloqueio",
  "submissao_teste",
  "submissao_final",
  "conexao_perdida",
  "conexao_restaurada",
]);

export const eventoEsquema = z.object({
  eventoId: z.string().min(1),
  estacaoId: z.string().min(1),
  tipo: tipoEventoEsquema,
  timestamp: z.number(),
  detalhe: z.string().optional(),
});
