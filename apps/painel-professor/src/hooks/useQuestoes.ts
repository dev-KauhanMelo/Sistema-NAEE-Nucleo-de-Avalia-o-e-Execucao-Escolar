import type { QuestaoPublica } from "@sistema-provas/shared";
import { useEffect, useState } from "react";
import { listarQuestoes } from "../lib/api";

interface UseQuestoesResultado {
  questoes: QuestaoPublica[];
  carregando: boolean;
  erro: string | null;
}

/** GET /api/questoes uma vez ao montar — não é tempo real (não é Firebase), é o catálogo estático do backend. */
export function useQuestoes(): UseQuestoesResultado {
  const [questoes, setQuestoes] = useState<QuestaoPublica[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    listarQuestoes()
      .then((lista) => {
        if (!cancelado) setQuestoes(lista);
      })
      .catch((e: unknown) => {
        if (!cancelado) setErro(e instanceof Error ? e.message : "Falha ao buscar questões");
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  return { questoes, carregando, erro };
}
