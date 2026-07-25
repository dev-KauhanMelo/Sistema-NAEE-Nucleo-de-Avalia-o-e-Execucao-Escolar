import type { QuestaoPublica } from "@naee/shared";
import type { ResultadoCaso } from "../tipos/resultado";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface RespostaErro {
  ok: false;
  erro: string;
}

export interface AuthResposta {
  ok: true;
  provaId: string;
}

/**
 * Formato de sucesso assumido para `/api/submit` e `/api/finalizar` — as duas
 * rotas ainda respondem 501 (Judge0 não integrado, ver backend/src/rotas/),
 * então este formato nunca foi confirmado por um schema Zod de resposta.
 * Quando o backend implementar de verdade, ajustar aqui caso o formato real
 * divirja deste.
 */
interface ExecucaoResposta {
  ok: true;
  resultados: ResultadoCaso[];
}

export type ResultadoExecucao = { ok: true; resultados: ResultadoCaso[] } | { ok: false; erro: string };

/** POST /api/auth (já implementada de verdade). */
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

/** GET /api/questoes/:provaId — devolve as questões públicas (sem gabarito) da prova. */
export async function listarQuestoes(provaId: string): Promise<QuestaoPublica[]> {
  const resposta = await fetch(`${baseUrl}/api/questoes/${provaId}`);
  const corpo = (await resposta.json().catch(() => null)) as { ok: true; questoes: QuestaoPublica[] } | RespostaErro | null;
  if (!resposta.ok || !corpo?.ok) {
    throw new Error((corpo as RespostaErro | null)?.erro ?? `Falha ao carregar questões (HTTP ${resposta.status})`);
  }
  return corpo.questoes;
}

async function executar(rota: "submit" | "finalizar", estacaoId: string, questaoId: string, codigo: string): Promise<ResultadoExecucao> {
  const resposta = await fetch(`${baseUrl}/api/${rota}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estacaoId, questaoId, codigo }),
  });
  const corpo = (await resposta.json().catch(() => null)) as ExecucaoResposta | RespostaErro | null;
  if (!resposta.ok || !corpo?.ok) {
    return { ok: false, erro: (corpo as RespostaErro | null)?.erro ?? `Execução indisponível (HTTP ${resposta.status})` };
  }
  return { ok: true, resultados: corpo.resultados };
}

/** POST /api/submit — roda só os casos públicos (hoje sempre 501, ver nota acima). */
export function testarCodigo(estacaoId: string, questaoId: string, codigo: string): Promise<ResultadoExecucao> {
  return executar("submit", estacaoId, questaoId, codigo);
}

/** POST /api/finalizar — roda casos públicos + ocultos e marca a questão como finalizada (irreversível, hoje sempre 501). */
export function finalizarQuestao(estacaoId: string, questaoId: string, codigo: string): Promise<ResultadoExecucao> {
  return executar("finalizar", estacaoId, questaoId, codigo);
}
