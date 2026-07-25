import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

/** Valida req.body contra um esquema Zod (os mesmos de @sistema-provas/shared) antes do handler rodar. */
export function validarCorpo<T>(esquema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resultado = esquema.safeParse(req.body);
    if (!resultado.success) {
      res.status(400).json({
        ok: false,
        erro: "Corpo da requisição inválido",
        detalhes: resultado.error.flatten(),
      });
      return;
    }
    req.body = resultado.data;
    next();
  };
}
