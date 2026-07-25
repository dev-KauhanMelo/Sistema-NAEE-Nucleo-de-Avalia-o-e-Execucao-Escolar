import type { NivelStrike } from "../hooks/useEstrikes";
import { useTempoRestante } from "../hooks/useTempoRestante";
import type { SessaoAtiva } from "../tipos/sessao";
import { IconePython } from "./IconePython";

interface CabecalhoProps {
  sessao: SessaoAtiva;
  strikes: NivelStrike;
  testando: boolean;
  questaoFinalizada: boolean;
  onTestar: () => void;
  onEnviarFinal: () => void;
}

/** Duração assumida da prova — ver comentário em hooks/useTempoRestante.ts. */
const DURACAO_PROVA_MINUTOS = 60;

function IndicadorAvisos({ strikes }: { strikes: NivelStrike }) {
  const semAvisos = strikes === 0;
  return (
    <span
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
        semAvisos
          ? "border-status-ativo/30 bg-status-ativo/10 text-status-ativo"
          : "border-status-atencao/30 bg-status-atencao/10 text-status-atencao"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${semAvisos ? "bg-status-ativo" : "bg-status-atencao"}`} />
      {semAvisos ? "Sem avisos" : `${strikes} de 3 avisos`}
    </span>
  );
}

export function Cabecalho({ sessao, strikes, testando, questaoFinalizada, onTestar, onEnviarFinal }: CabecalhoProps) {
  const { formatado, critico } = useTempoRestante(DURACAO_PROVA_MINUTOS);

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-borda bg-fundo/80 px-6 py-3 backdrop-blur-md">
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-widest text-texto-fraco uppercase">Prova Técnica</p>
        <h1 className="truncate text-sm font-semibold text-texto">
          {sessao.alunoId} · {sessao.estacaoId}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <IndicadorAvisos strikes={strikes} />

        <span
          className={`flex items-center gap-1.5 text-xs font-medium tabular-nums ${critico ? "text-status-bloqueado" : "text-texto-fraco"}`}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="9" strokeLinecap="round" />
            <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {formatado} restantes
        </span>

        <span className="flex items-center gap-2 rounded-lg border border-borda bg-superficie-alta px-3 py-1.5 text-sm font-medium text-texto">
          <IconePython className="h-4 w-4" />
          Python
        </span>

        <button
          type="button"
          onClick={onEnviarFinal}
          disabled={questaoFinalizada}
          className="rounded-lg border border-borda px-4 py-2 text-sm font-medium text-texto-fraco transition-colors hover:border-acento/50 hover:text-texto disabled:cursor-not-allowed disabled:opacity-50"
        >
          {questaoFinalizada ? "Questão enviada" : "Enviar Resposta Final"}
        </button>

        <button
          type="button"
          onClick={onTestar}
          disabled={testando || questaoFinalizada}
          className="flex items-center gap-2 rounded-lg bg-acento px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-acento-forte disabled:cursor-not-allowed disabled:opacity-50"
        >
          {testando && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />}
          {testando ? "Rodando…" : "Testar Código"}
        </button>
      </div>
    </header>
  );
}
