import type { Estacao } from "@sistema-provas/shared";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { ESTACOES_MOCK } from "../dados/mock";
import { db } from "../lib/firebase";

interface UseEstacoesResultado {
  estacoes: Record<string, Estacao>;
  conectado: boolean;
}

/** Escuta /estacoes em tempo real; enquanto o Firebase não tiver dados (ou estiver
 *  fora do ar), mantém a grade de demonstração para a UI nunca ficar vazia. */
export function useEstacoes(): UseEstacoesResultado {
  const [estacoes, setEstacoes] = useState<Record<string, Estacao>>(ESTACOES_MOCK);
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    const refEstacoes = ref(db, "estacoes");
    return onValue(
      refEstacoes,
      (snapshot) => {
        const valor = snapshot.val() as Record<string, Estacao> | null;
        setConectado(true);
        if (valor) setEstacoes(valor);
      },
      (erro) => {
        console.error("[useEstacoes] escuta de /estacoes falhou, mantendo dados de demonstração", erro);
      },
    );
  }, []);

  return { estacoes, conectado };
}
