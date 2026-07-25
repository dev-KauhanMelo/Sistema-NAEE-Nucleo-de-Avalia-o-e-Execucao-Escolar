export type LinguagemSuportada = "python";

export interface CasoTesteVisivel {
  entrada: string;
  saidaEsperada: string;
}

/**
 * Subconjunto seguro de uma questão — é o único formato de questão que este
 * pacote conhece. Casos de teste ocultos e gabarito NUNCA entram aqui: esse
 * tipo é importado pelo app do aluno e pelo painel do professor, e o que não
 * existe no tipo não pode vazar acidentalmente pro bundle do navegador.
 * A versão completa (com casos ocultos) vive só em `backend/src/tipos`.
 */
export interface QuestaoPublica {
  questaoId: string;
  titulo: string;
  enunciado: string;
  linguagem: LinguagemSuportada;
  casosPublicos: CasoTesteVisivel[];
  templateInicial?: string;
}
