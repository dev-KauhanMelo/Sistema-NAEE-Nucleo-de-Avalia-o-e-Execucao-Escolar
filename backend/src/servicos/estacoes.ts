import type { Estacao } from "@naee/shared";
import { obterDb } from "../config/firebase";

function refEstacao(estacaoId: string) {
  return obterDb().ref(`estacoes/${estacaoId}`);
}

export async function estacaoExiste(estacaoId: string): Promise<boolean> {
  const snapshot = await refEstacao(estacaoId).get();
  return snapshot.exists();
}

/** POST /api/auth: abre a sessão da estação (sobrescreve o registro por completo). */
export async function autenticarEstacao(estacaoId: string, nomeAluno: string): Promise<void> {
  const estacao: Estacao = {
    estacaoId,
    aluno: nomeAluno,
    status: "ativo",
    strikes: 0,
    ultimaAtividade: Date.now(),
    questaoAtual: null,
  };
  await refEstacao(estacaoId).set(estacao);
}

/** POST /api/desbloquear: só toca status/strikes, preserva aluno/questaoAtual. */
export async function desbloquearEstacao(estacaoId: string): Promise<void> {
  await refEstacao(estacaoId).update({ status: "ativo", strikes: 0 });
}
