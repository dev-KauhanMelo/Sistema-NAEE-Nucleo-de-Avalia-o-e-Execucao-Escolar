import { useEffect, useState } from "react";

/** Relógio que força re-render periódico, para os "há X min" do painel andarem sozinhos. */
export function useAgora(intervaloMs = 15_000): number {
  const [agora, setAgora] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), intervaloMs);
    return () => clearInterval(id);
  }, [intervaloMs]);

  return agora;
}
