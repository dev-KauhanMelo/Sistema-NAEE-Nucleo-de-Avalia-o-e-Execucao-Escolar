import { desbloquearRequisicaoEsquema, type DesbloquearRequisicao } from "@sistema-provas/shared";
import { Router } from "express";
import { validarCorpo } from "../middlewares/validarCorpo";
import { desbloquearEstacao, estacaoExiste } from "../servicos/estacoes";
import { registrarEvento } from "../servicos/eventos";

export const rotaDesbloquear = Router();

/** Ação do professor: destrava uma estação bloqueada (ex.: excesso de strikes). */
rotaDesbloquear.post("/", validarCorpo(desbloquearRequisicaoEsquema), async (req, res, next) => {
  const { estacaoId } = req.body as DesbloquearRequisicao;

  // TODO: autenticação do professor (mecanismo ainda a definir).

  try {
    if (!(await estacaoExiste(estacaoId))) {
      res.status(404).json({ ok: false, erro: "Estação não encontrada" });
      return;
    }

    await desbloquearEstacao(estacaoId);
    await registrarEvento(estacaoId, "desbloqueio");

    res.json({ ok: true });
  } catch (erro) {
    next(erro);
  }
});
