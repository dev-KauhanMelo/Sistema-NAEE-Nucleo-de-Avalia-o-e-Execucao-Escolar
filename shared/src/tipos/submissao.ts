export type TipoSubmissao = "teste" | "final";

export interface ResultadoCaso {
  passou: boolean;
  tempoMs?: number;
  memoriaKb?: number;
  saidaObtida?: string;
  erro?: string;
}

export interface Submissao {
  estacaoId: string;
  questaoId: string;
  provaId: string;
  codigo: string;
  timestamp: number;
  tipo: TipoSubmissao;
  resultados: ResultadoCaso[];
}
