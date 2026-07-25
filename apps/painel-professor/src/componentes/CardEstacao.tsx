import { rotuloStatus, type Estacao, type StatusEstacao } from "@naee/shared";
import { useState } from "react";
import { desbloquearEstacao } from "../lib/api";
import { rotuloEstacao } from "../utilitarios/estacao";
import { formatarTempoRelativo } from "../utilitarios/tempo";

// Cor de status no card inteiro (borda + fundo), nunca só num indicador pequeno —
// precisa ser lido de longe (ver shared/src/design/tokens.css).
const estiloCartao: Record<StatusEstacao, string> = {
  ativo: "border-status-ativo/50 bg-status-ativo/[0.07] hover:border-status-ativo",
  atencao: "border-status-atencao/50 bg-status-atencao/[0.07] hover:border-status-atencao",
  bloqueado: "border-status-bloqueado/60 bg-status-bloqueado/[0.09] hover:border-status-bloqueado",
  offline: "border-borda bg-superficie/40",
};

const corPonto: Record<StatusEstacao, string> = {
  ativo: "bg-status-ativo",
  atencao: "bg-status-atencao",
  bloqueado: "bg-status-bloqueado",
  offline: "bg-status-offline",
};

interface CardEstacaoProps {
  estacao: Estacao;
  agora: number;
}

export function CardEstacao({ estacao, agora }: CardEstacaoProps) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function aoClicarDesbloquear() {
    setCarregando(true);
    setErro(null);
    try {
      await desbloquearEstacao(estacao.estacaoId);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao desbloquear estação");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-4 transition-colors duration-200 ${estiloCartao[estacao.status]}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-medium text-texto-fraco">{rotuloEstacao(estacao.estacaoId).toUpperCase()}</span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-texto-fraco">
          <span className={`h-1.5 w-1.5 rounded-full ${corPonto[estacao.status]}`} />
          {rotuloStatus[estacao.status]}
        </span>
      </div>

      <div className="min-h-10">
        {estacao.aluno ? (
          <p className="truncate text-sm font-semibold text-texto">{estacao.aluno}</p>
        ) : (
          <p className="text-sm text-texto-fraco/70 italic">aguardando aluno</p>
        )}
        {estacao.questaoAtual && <p className="mt-0.5 truncate text-xs text-texto-fraco">questão {estacao.questaoAtual}</p>}
      </div>

      <div className="flex items-center justify-between text-xs text-texto-fraco">
        <div className="flex items-center gap-1" aria-label={`${estacao.strikes} de 3 strikes`}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < estacao.strikes ? "bg-status-bloqueado" : "bg-borda"}`} />
          ))}
        </div>
        <span>{formatarTempoRelativo(estacao.ultimaAtividade, agora)}</span>
      </div>

      {estacao.status === "bloqueado" && (
        <button
          type="button"
          onClick={aoClicarDesbloquear}
          disabled={carregando}
          className="mt-1 w-full cursor-pointer rounded-lg bg-status-bloqueado/15 px-3 py-2 text-xs font-semibold text-status-bloqueado transition-colors hover:bg-status-bloqueado/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {carregando ? "Desbloqueando…" : "Desbloquear estação"}
        </button>
      )}

      {erro && <p className="text-xs text-status-bloqueado">{erro}</p>}
    </div>
  );
}
