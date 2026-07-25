import type { QuestaoPublica } from "@naee/shared";

/**
 * GET /api/questoes/:provaId ainda é skeleton (Fase 2) — usada como conteúdo
 * do editor enquanto essa rota não existir de verdade. Ver src/lib/api.ts.
 */
export const QUESTAO_DEMONSTRACAO: QuestaoPublica = {
  questaoId: "questao-demo-01",
  titulo: "Soma de dois números",
  enunciado: "Leia dois números inteiros, um por linha, e imprima a soma deles.",
  linguagem: "python",
  casosPublicos: [
    { entrada: "2\n3", saidaEsperada: "5" },
    { entrada: "10\n-4", saidaEsperada: "6" },
  ],
  templateInicial: "a = int(input())\nb = int(input())\n\n# escreva sua solução abaixo\n",
};
