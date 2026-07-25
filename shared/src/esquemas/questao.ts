import { z } from "zod";

export const linguagemSuportadaEsquema = z.enum(["python"]);

export const casoTesteVisivelEsquema = z.object({
  entrada: z.string(),
  saidaEsperada: z.string(),
});

export const questaoPublicaEsquema = z.object({
  questaoId: z.string().min(1),
  titulo: z.string().min(1),
  enunciado: z.string().min(1),
  linguagem: linguagemSuportadaEsquema,
  casosPublicos: z.array(casoTesteVisivelEsquema),
  templateInicial: z.string().optional(),
});
