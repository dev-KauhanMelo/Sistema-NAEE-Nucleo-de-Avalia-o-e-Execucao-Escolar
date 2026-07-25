const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/** POST /api/desbloquear — hoje responde 501 (backend ainda em skeleton, ver Fase 2). */
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
