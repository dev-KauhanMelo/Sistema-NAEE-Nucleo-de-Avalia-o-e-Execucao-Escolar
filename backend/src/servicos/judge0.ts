import type { ResultadoCaso } from "@sistema-provas/shared";
import type { CasoTesteOculto } from "../tipos/questao";

export interface ExecutarCodigoParams {
  codigo: string;
  linguagem: "python";
  casos: (CasoTesteOculto | { entrada: string; saidaEsperada: string })[];
}

/**
 * Integração real com o Judge0 self-hosted (ver judge0/README.md) — ainda pendente,
 * smoke test adiado por instabilidade de rede. Por ora só lança, para as rotas
 * que dependem de execução de código responderem 501 de forma explícita.
 */
export async function executarCodigo(_params: ExecutarCodigoParams): Promise<ResultadoCaso[]> {
  throw new Error("Integração com Judge0 ainda não implementada (ver judge0/README.md)");
}
