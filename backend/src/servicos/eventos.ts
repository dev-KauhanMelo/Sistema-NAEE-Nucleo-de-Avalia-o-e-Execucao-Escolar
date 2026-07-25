import type { Evento, TipoEvento } from "@naee/shared";
import { obterDb } from "../config/firebase";

/**
 * Grava em /eventos via push() (chave gerada, não estacaoId) — é uma lista
 * append-only de histórico; se a chave fosse estacaoId, cada evento novo
 * sobrescreveria o anterior da mesma estação e o feed perderia o histórico.
 */
export async function registrarEvento(estacaoId: string, tipo: TipoEvento, detalhe?: string): Promise<void> {
  const novaRef = obterDb().ref("eventos").push();
  const evento: Evento = {
    eventoId: novaRef.key as string,
    estacaoId,
    tipo,
    timestamp: Date.now(),
    ...(detalhe ? { detalhe } : {}),
  };
  await novaRef.set(evento);
}
