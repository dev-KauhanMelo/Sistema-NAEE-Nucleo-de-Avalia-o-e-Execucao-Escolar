export type StatusProva = "aguardando" | "em_andamento" | "encerrada";

export interface Prova {
  provaId: string;
  status: StatusProva;
  questoesIds: string[];
  /** epoch ms, definido pelo relógio do servidor (.info/serverTimeOffset) — nunca confiar no relógio local do aluno */
  inicioEm?: number;
  duracaoMin?: number;
}
