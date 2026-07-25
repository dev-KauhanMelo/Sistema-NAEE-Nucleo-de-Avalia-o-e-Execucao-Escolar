import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { QuestaoPublica } from "@sistema-provas/shared";
import { paraQuestaoPublica, type Questao } from "../tipos/questao";

// Mesmo padrão de servicos/alunos.ts: lido via fs, não import de módulo JSON,
// pra não depender do build copiar dados/ pra dentro de dist/.
const caminhoQuestoes = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../dados/questoes.json");
const questoes: Questao[] = JSON.parse(readFileSync(caminhoQuestoes, "utf-8"));

export function listarQuestoesPublicas(): QuestaoPublica[] {
  return questoes.map(paraQuestaoPublica);
}

export function buscarQuestao(questaoId: string): Questao | undefined {
  return questoes.find((questao) => questao.questaoId === questaoId);
}
