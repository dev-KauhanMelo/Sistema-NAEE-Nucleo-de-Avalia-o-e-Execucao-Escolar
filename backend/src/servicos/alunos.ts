import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface Aluno {
  alunoId: string;
  nome: string;
}

// Lido via fs (não import JSON de módulo) para não depender de o build copiar
// dados/ para dentro de dist/ — o path relativo aponta pra fora de src/dist,
// e vale igual em dev (tsx) e produção (node dist/index.js).
const caminhoAlunos = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../dados/alunos.json");
const alunos: Aluno[] = JSON.parse(readFileSync(caminhoAlunos, "utf-8"));

export function buscarAluno(alunoId: string): Aluno | undefined {
  return alunos.find((aluno) => aluno.alunoId === alunoId);
}
