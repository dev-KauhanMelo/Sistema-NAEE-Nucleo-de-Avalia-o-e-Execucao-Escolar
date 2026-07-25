import { Router } from "express";

export const rotaQuestoes = Router();

/** Devolve as questões (formato público, sem gabarito) da prova. */
rotaQuestoes.get("/:provaId", (req, res) => {
  const { provaId } = req.params;
  void provaId;

  // TODO: buscar a prova no Firebase Realtime DB por provaId.
  // TODO: buscar cada questão em questoesIds e mapear com paraQuestaoPublica().
  // TODO: 404 se a prova não existir; 403 se ainda não estiver "em_andamento"?

  res.status(501).json({ ok: false, erro: "Rota ainda não implementada" });
});
