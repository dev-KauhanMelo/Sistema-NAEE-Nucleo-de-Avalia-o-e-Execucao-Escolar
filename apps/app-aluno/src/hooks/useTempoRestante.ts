import { useEffect, useState } from "react";

interface TempoRestante {
  formatado: string;
  esgotado: boolean;
  critico: boolean;
}

function formatar(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;
  return `${String(minutos).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
}

/**
 * Contagem regressiva local a partir da montagem — não existe hoje nenhuma
 * fonte de verdade de prazo de prova (backend/Firebase não gravam início nem
 * duração). `duracaoMinutos` é um valor assumido; quando existir um prazo
 * real vindo do backend, trocar a fonte aqui (o formato de saída não muda).
 */
export function useTempoRestante(duracaoMinutos: number): TempoRestante {
  const [inicio] = useState(() => Date.now());
  const [segundosRestantes, setSegundosRestantes] = useState(duracaoMinutos * 60);

  useEffect(() => {
    const totalSegundos = duracaoMinutos * 60;
    const id = setInterval(() => {
      const decorridos = Math.floor((Date.now() - inicio) / 1000);
      setSegundosRestantes(Math.max(0, totalSegundos - decorridos));
    }, 1000);
    return () => clearInterval(id);
  }, [inicio, duracaoMinutos]);

  return {
    formatado: formatar(segundosRestantes),
    esgotado: segundosRestantes === 0,
    critico: segundosRestantes > 0 && segundosRestantes <= 5 * 60,
  };
}
