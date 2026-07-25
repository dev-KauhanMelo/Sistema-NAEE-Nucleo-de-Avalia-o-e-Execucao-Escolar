import { useCallback, useState } from "react";

export type NivelStrike = 0 | 1 | 2 | 3;

interface UseEstrikesResultado {
  strikes: NivelStrike;
  /** timestamp da última perda de foco — usado como `key` pro toast reanimar mesmo se o nível não mudar. */
  ultimoAviso: number;
  registrarStrike: () => void;
  resetarDev: () => void;
}

export function useEstrikes(): UseEstrikesResultado {
  const [strikes, setStrikes] = useState<NivelStrike>(0);
  const [ultimoAviso, setUltimoAviso] = useState(0);

  const registrarStrike = useCallback(() => {
    setStrikes((atual) => (atual >= 3 ? 3 : ((atual + 1) as NivelStrike)));
    setUltimoAviso(Date.now());
  }, []);

  const resetarDev = useCallback(() => setStrikes(0), []);

  return { strikes, ultimoAviso, registrarStrike, resetarDev };
}
