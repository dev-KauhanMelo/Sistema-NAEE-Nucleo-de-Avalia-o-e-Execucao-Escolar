import { z } from "zod";

/** Corpo de POST /api/auth — valida aluno (lista pré-cadastrada) + estação */
export const authRequisicaoEsquema = z.object({
  estacaoId: z.string().min(1),
  alunoId: z.string().min(1),
});

/** Corpo de POST /api/submit — roda contra casos de teste públicos */
export const submitRequisicaoEsquema = z.object({
  estacaoId: z.string().min(1),
  questaoId: z.string().min(1),
  codigo: z.string(),
});

/** Corpo de POST /api/finalizar — roda contra todos os casos, marca estação como finalizada */
export const finalizarRequisicaoEsquema = z.object({
  estacaoId: z.string().min(1),
  questaoId: z.string().min(1),
  codigo: z.string(),
});

/** Corpo de POST /api/desbloquear — ação autenticada do professor */
export const desbloquearRequisicaoEsquema = z.object({
  estacaoId: z.string().min(1),
});

export type AuthRequisicao = z.infer<typeof authRequisicaoEsquema>;
export type SubmitRequisicao = z.infer<typeof submitRequisicaoEsquema>;
export type FinalizarRequisicao = z.infer<typeof finalizarRequisicaoEsquema>;
export type DesbloquearRequisicao = z.infer<typeof desbloquearRequisicaoEsquema>;
