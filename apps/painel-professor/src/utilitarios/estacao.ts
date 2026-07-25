/** Deriva um rótulo curto ("Estação 03") a partir do sufixo numérico do estacaoId. */
export function rotuloEstacao(estacaoId: string): string {
  const numero = estacaoId.match(/(\d+)$/)?.[1];
  return numero ? `Estação ${numero.padStart(2, "0")}` : estacaoId;
}
