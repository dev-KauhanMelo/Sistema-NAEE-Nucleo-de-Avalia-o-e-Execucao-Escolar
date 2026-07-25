import { Router } from "express";
import { listarQuestoesPublicas } from "../servicos/questoes";

export const rotaQuestoes = Router();

/** Lista todas as questões (formato público, sem gabarito) — Fase 5. */
rotaQuestoes.get("/", (_req, res) => {
  res.json({ ok: true, questoes: listarQuestoesPublicas() });
});

/**
 * Mesma lista por enquanto: só existe uma prova ("prova-001", ver
 * rotas/auth.ts) e ainda não há registro de provas no Firebase vinculando
 * questoesIds a cada uma. Quando isso existir, passa a filtrar de verdade
 * por provaId em vez de devolver tudo.
 */
rotaQuestoes.get("/:provaId", (_req, res) => {
  res.json({ ok: true, questoes: listarQuestoesPublicas() });
});
