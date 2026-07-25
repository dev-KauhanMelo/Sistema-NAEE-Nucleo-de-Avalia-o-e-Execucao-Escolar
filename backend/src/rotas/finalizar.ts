import { Router } from "express";
import { finalizarRequisicaoEsquema, type FinalizarRequisicao } from "@sistema-provas/shared";
import { validarCorpo } from "../middlewares/validarCorpo";

export const rotaFinalizar = Router();

/** Roda o código contra TODOS os casos (públicos + ocultos) e marca a questão/estação como finalizada. */
rotaFinalizar.post("/", validarCorpo(finalizarRequisicaoEsquema), async (req, res, next) => {
  const { estacaoId, questaoId, codigo } = req.body as FinalizarRequisicao;
  void estacaoId;
  void questaoId;
  void codigo;

  try {
    // TODO: buscar a questão completa (casosPublicos + casosOcultos) no Firebase.
    // TODO: chamar executarCodigo() em servicos/judge0.ts com todos os casos.
    // TODO: gravar Submissao (tipo: "final") e emitir evento "submissao_final".
    // TODO: atualizar estação (questaoAtual / próxima questão, ou encerrar se era a última).
    res.status(501).json({ ok: false, erro: "Rota ainda não implementada" });
  } catch (erro) {
    next(erro);
  }
});
