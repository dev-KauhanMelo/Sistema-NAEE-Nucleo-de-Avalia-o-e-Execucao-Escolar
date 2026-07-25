/** Resultado de um caso de teste depois de rodar (`/api/submit` ou `/api/finalizar`). */
export interface ResultadoCaso {
  entrada: string;
  saidaEsperada: string;
  saidaObtida: string;
  passou: boolean;
  descricao?: string;
}

/**
 * "resolvida" = resposta final entregue (POST /api/finalizar concluído) —
 * significa "encerrada", não "100% correta": passar nos 3 casos públicos via
 * "Testar Código" nunca marca como resolvida sozinho, pois ainda faltam os
 * casos ocultos (só "finalizar" roda contra todos). Uma vez resolvida, a
 * edição do código daquela questão fica bloqueada (ação irreversível).
 */
export type StatusQuestao = "nao-iniciada" | "em-andamento" | "resolvida";

export interface EstadoQuestao {
  codigo: string;
  status: StatusQuestao;
  ultimoResultado: ResultadoCaso[] | null;
  ultimoErro: string | null;
}
