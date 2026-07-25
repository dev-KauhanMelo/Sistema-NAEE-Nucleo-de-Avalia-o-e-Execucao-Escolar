import type { Evento } from "@naee/shared";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { EVENTOS_MOCK } from "../dados/mock";
import { db } from "../lib/firebase";

/** Escuta /eventos em tempo real, mais recente primeiro; cai para dados de demonstração
 *  enquanto o Firebase não tiver nada gravado. */
export function useEventos(): Evento[] {
  const [eventos, setEventos] = useState<Evento[]>(EVENTOS_MOCK);

  useEffect(() => {
    const refEventos = ref(db, "eventos");
    return onValue(
      refEventos,
      (snapshot) => {
        const valor = snapshot.val() as Record<string, Evento> | null;
        if (valor) {
          setEventos(Object.values(valor).sort((a, b) => b.timestamp - a.timestamp));
        }
      },
      (erro) => {
        console.error("[useEventos] escuta de /eventos falhou, mantendo dados de demonstração", erro);
      },
    );
  }, []);

  return eventos;
}
