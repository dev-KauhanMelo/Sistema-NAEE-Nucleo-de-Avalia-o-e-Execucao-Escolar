const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface RespostaErro {
  ok: false;
  erro: string;
}

export interface AuthResposta {
  ok: true;
  provaId: string;
}

/** POST /api/auth (Fase 2.5, já implementada de verdade). */
export async function autenticar(estacaoId: string, alunoId: string): Promise<AuthResposta> {
  const resposta = await fetch(`${baseUrl}/api/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estacaoId, alunoId }),
  });
  const corpo = (await resposta.json()) as AuthResposta | RespostaErro;
  if (!resposta.ok || !corpo.ok) {
    throw new Error((corpo as RespostaErro).erro ?? `Falha ao entrar (HTTP ${resposta.status})`);
  }
  return corpo;
}

/** POST /api/submit — hoje responde 501 (backend ainda em skeleton, ver Fase 2). */
export async function testarCodigo(estacaoId: string, questaoId: string, codigo: string): Promise<string> {
  const resposta = await fetch(`${baseUrl}/api/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estacaoId, questaoId, codigo }),
  });
  const corpo = (await resposta.json().catch(() => null)) as RespostaErro | null;
  return corpo?.erro ?? `Execução indisponível (HTTP ${resposta.status})`;
}
