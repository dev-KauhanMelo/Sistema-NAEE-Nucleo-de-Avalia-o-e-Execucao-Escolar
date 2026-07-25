import { authRequisicaoEsquema, type AuthRequisicao } from "@sistema-provas/shared";
import { Router } from "express";
import { validarCorpo } from "../middlewares/validarCorpo";
import { buscarAluno } from "../servicos/alunos";
import { autenticarEstacao } from "../servicos/estacoes";
import { registrarEvento } from "../servicos/eventos";

export const rotaAuth = Router();

// Só existe uma prova por enquanto — quando houver mais de uma, isso vira uma
// consulta (prova "em_andamento" no Firebase) em vez de constante fixa.
const PROVA_ATIVA_ID = "prova-001";

/** Valida aluno (lista pré-cadastrada) + estação e abre a sessão da estação. */
rotaAuth.post("/", validarCorpo(authRequisicaoEsquema), async (req, res, next) => {
  const { estacaoId, alunoId } = req.body as AuthRequisicao;

  try {
    const aluno = buscarAluno(alunoId);
    if (!aluno) {
      res.status(401).json({ ok: false, erro: "Aluno não cadastrado" });
      return;
    }

    await autenticarEstacao(estacaoId, aluno.nome);
    await registrarEvento(estacaoId, "login", `${aluno.nome} entrou`);

    res.json({ ok: true, provaId: PROVA_ATIVA_ID });
  } catch (erro) {
    next(erro);
  }
});
