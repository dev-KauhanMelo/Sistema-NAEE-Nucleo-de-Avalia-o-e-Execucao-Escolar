import type { QuestaoPublica } from "@sistema-provas/shared";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/** POST /api/desbloquear — já implementada de verdade (Fase 2.5). */
export async function desbloquearEstacao(estacaoId: string): Promise<void> {
  const resposta = await fetch(`${baseUrl}/api/desbloquear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estacaoId }),
  });

  if (!resposta.ok) {
    const corpo = (await resposta.json().catch(() => null)) as { erro?: string } | null;
    throw new Error(corpo?.erro ?? `Falha ao desbloquear (HTTP ${resposta.status})`);
  }
}

/** GET /api/questoes — lista todas as questões (formato público, sem gabarito). */
export async function listarQuestoes(): Promise<QuestaoPublica[]> {
  const resposta = await fetch(`${baseUrl}/api/questoes`);
  const corpo = (await resposta.json().catch(() => null)) as { ok: boolean; questoes?: QuestaoPublica[]; erro?: string } | null;

  if (!resposta.ok || !corpo?.ok) {
    throw new Error(corpo?.erro ?? `Falha ao buscar questões (HTTP ${resposta.status})`);
  }
  return corpo.questoes ?? [];
}
