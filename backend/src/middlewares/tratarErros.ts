import type { NextFunction, Request, Response } from "express";

export function tratarErros(erro: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error(erro);
  const mensagem = erro instanceof Error ? erro.message : "Erro interno do servidor";
  res.status(500).json({ ok: false, erro: mensagem });
}
