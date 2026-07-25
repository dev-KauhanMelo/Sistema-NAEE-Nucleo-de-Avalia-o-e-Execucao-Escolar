import type { Estacao } from "@naee/shared";
import { CardEstacao } from "./CardEstacao";

interface GradeEstacoesProps {
  estacoes: Record<string, Estacao>;
  agora: number;
}

export function GradeEstacoes({ estacoes, agora }: GradeEstacoesProps) {
  const lista = Object.values(estacoes).sort((a, b) => a.estacaoId.localeCompare(b.estacaoId, "pt-BR", { numeric: true }));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lista.map((estacao) => (
        <CardEstacao key={estacao.estacaoId} estacao={estacao} agora={agora} />
      ))}
    </div>
  );
}
