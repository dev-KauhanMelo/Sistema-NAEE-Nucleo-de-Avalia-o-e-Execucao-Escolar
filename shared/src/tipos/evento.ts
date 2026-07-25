export type TipoEvento =
  | "login"
  | "logout"
  | "perda_foco"
  | "retorno_foco"
  | "bloqueio"
  | "desbloqueio"
  | "submissao_teste"
  | "submissao_final"
  | "conexao_perdida"
  | "conexao_restaurada";

export interface Evento {
  eventoId: string;
  estacaoId: string;
  tipo: TipoEvento;
  timestamp: number;
  detalhe?: string;
}
