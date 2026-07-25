import { Router } from "express";

export const rotaHealth = Router();

/** Sobe e responde sem tocar em Firebase/Judge0 — serve para confirmar que o backend está de pé. */
rotaHealth.get("/", (_req, res) => {
  res.json({ ok: true, timestamp: Date.now() });
});
