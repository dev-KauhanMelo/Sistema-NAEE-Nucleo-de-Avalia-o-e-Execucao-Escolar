import { Router } from "express";
import { submitRequisicaoEsquema, type SubmitRequisicao } from "@naee/shared";
import { validarCorpo } from "../middlewares/validarCorpo";

export const rotaSubmit = Router();

/** Roda o código do aluno contra os casos de teste PÚBLICOS da questão (submissão tipo "teste"). */
rotaSubmit.post("/", validarCorpo(submitRequisicaoEsquema), async (req, res, next) => {
  const { estacaoId, questaoId, codigo } = req.body as SubmitRequisicao;
  void estacaoId;
  void questaoId;
  void codigo;

  try {
    // TODO: buscar a questão no Firebase e pegar os casosPublicos.
    // TODO: chamar executarCodigo() em servicos/judge0.ts com esses casos.
    // TODO: gravar Submissao (tipo: "teste") no Firebase e emitir evento "submissao_teste".
    res.status(501).json({ ok: false, erro: "Rota ainda não implementada" });
  } catch (erro) {
    next(erro);
  }
});
