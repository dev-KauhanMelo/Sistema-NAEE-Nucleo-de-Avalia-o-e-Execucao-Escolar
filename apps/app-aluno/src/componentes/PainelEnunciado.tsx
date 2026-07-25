import type { QuestaoPublica } from "@naee/shared";

const LARGURA_PAINEL = 360;

interface PainelEnunciadoProps {
  questao: QuestaoPublica | null;
  indice: number;
  total: number;
}

export function PainelEnunciado({ questao, indice, total }: PainelEnunciadoProps) {
  return (
    <aside
      style={{ width: LARGURA_PAINEL }}
      className="hidden h-full shrink-0 overflow-y-auto border-l border-borda bg-superficie/40 p-6 lg:block"
    >
      {questao ? (
        <div
          key={questao.questaoId}
          className="opacity-100 transition-all duration-200 ease-out starting:translate-y-1 starting:opacity-0"
        >
          <p className="text-xs font-semibold tracking-widest text-texto-fraco uppercase">
            Questão {indice + 1} de {total}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-texto">{questao.titulo}</h2>
          <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-texto-fraco">{questao.enunciado}</p>
        </div>
      ) : (
        <p className="text-sm text-texto-fraco">Selecione uma questão para ver o enunciado.</p>
      )}
    </aside>
  );
}
