import type { Estacao, Evento } from "@naee/shared";

/**
 * Demonstra a grade enquanto o Firebase real ainda não tem dados em /estacoes
 * (backend, Fase 2, ainda não grava lá). 4 estações com dados fictícios variados
 * + 8 vazias, totalizando as 12 da sala. Ver hooks/useEstacoes.ts.
 */
const agora = Date.now();

export const ESTACOES_MOCK: Record<string, Estacao> = {
  "estacao-01": {
    estacaoId: "estacao-01",
    aluno: "Ana Beatriz Souza",
    status: "ativo",
    strikes: 0,
    ultimaAtividade: agora - 15_000,
    questaoAtual: "questao-02",
  },
  "estacao-02": {
    estacaoId: "estacao-02",
    aluno: "Carlos Eduardo Lima",
    status: "atencao",
    strikes: 1,
    ultimaAtividade: agora - 2 * 60_000,
    questaoAtual: "questao-01",
  },
  "estacao-03": {
    estacaoId: "estacao-03",
    aluno: "Fernanda Ribeiro",
    status: "bloqueado",
    strikes: 3,
    ultimaAtividade: agora - 40_000,
    questaoAtual: "questao-03",
  },
  "estacao-04": {
    estacaoId: "estacao-04",
    aluno: "Gustavo Andrade",
    status: "ativo",
    strikes: 0,
    ultimaAtividade: agora - 5_000,
    questaoAtual: "questao-01",
  },
  "estacao-05": { estacaoId: "estacao-05", aluno: null, status: "offline", strikes: 0, ultimaAtividade: agora - 2_700_000, questaoAtual: null },
  "estacao-06": { estacaoId: "estacao-06", aluno: null, status: "offline", strikes: 0, ultimaAtividade: agora - 2_700_000, questaoAtual: null },
  "estacao-07": { estacaoId: "estacao-07", aluno: null, status: "offline", strikes: 0, ultimaAtividade: agora - 2_700_000, questaoAtual: null },
  "estacao-08": { estacaoId: "estacao-08", aluno: null, status: "offline", strikes: 0, ultimaAtividade: agora - 2_700_000, questaoAtual: null },
  "estacao-09": { estacaoId: "estacao-09", aluno: null, status: "offline", strikes: 0, ultimaAtividade: agora - 2_700_000, questaoAtual: null },
  "estacao-10": { estacaoId: "estacao-10", aluno: null, status: "offline", strikes: 0, ultimaAtividade: agora - 2_700_000, questaoAtual: null },
  "estacao-11": { estacaoId: "estacao-11", aluno: null, status: "offline", strikes: 0, ultimaAtividade: agora - 2_700_000, questaoAtual: null },
  "estacao-12": { estacaoId: "estacao-12", aluno: null, status: "offline", strikes: 0, ultimaAtividade: agora - 2_700_000, questaoAtual: null },
};

const eventosBrutos: Evento[] = [
  { eventoId: "ev-1", estacaoId: "estacao-03", tipo: "bloqueio", timestamp: agora - 40_000, detalhe: "3 strikes: perda de foco repetida" },
  { eventoId: "ev-2", estacaoId: "estacao-01", tipo: "submissao_teste", timestamp: agora - 90_000, detalhe: "2/3 casos passaram" },
  { eventoId: "ev-3", estacaoId: "estacao-02", tipo: "perda_foco", timestamp: agora - 2 * 60_000 },
  { eventoId: "ev-4", estacaoId: "estacao-04", tipo: "login", timestamp: agora - 6 * 60_000 },
  { eventoId: "ev-5", estacaoId: "estacao-02", tipo: "retorno_foco", timestamp: agora - 7 * 60_000 },
  { eventoId: "ev-6", estacaoId: "estacao-01", tipo: "login", timestamp: agora - 12 * 60_000 },
];

export const EVENTOS_MOCK: Evento[] = [...eventosBrutos].sort((a, b) => b.timestamp - a.timestamp);
