import type { CasoTesteVisivel, LinguagemSuportada, QuestaoPublica } from "@naee/shared";

export interface CasoTesteOculto {
  entrada: string;
  saidaEsperada: string;
}

/**
 * Versão completa da questão, com casos ocultos — só existe no backend.
 * Nunca deve ser serializada diretamente numa resposta HTTP; ver `paraQuestaoPublica`.
 */
export interface Questao {
  questaoId: string;
  titulo: string;
  enunciado: string;
  linguagem: LinguagemSuportada;
  casosPublicos: CasoTesteVisivel[];
  casosOcultos: CasoTesteOculto[];
  templateInicial?: string;
}

export function paraQuestaoPublica(questao: Questao): QuestaoPublica {
  const { questaoId, titulo, enunciado, linguagem, casosPublicos, templateInicial } = questao;
  return { questaoId, titulo, enunciado, linguagem, casosPublicos, templateInicial };
}
