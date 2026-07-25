export type StatusEstacao = "offline" | "ativo" | "atencao" | "bloqueado";

export interface Estacao {
  estacaoId: string;
  aluno: string | null;
  status: StatusEstacao;
  strikes: number;
  ultimaAtividade: number;
  questaoAtual: string | null;
}
