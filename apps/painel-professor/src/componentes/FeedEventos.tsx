import type { Evento, TipoEvento } from "@naee/shared";
import { rotuloEstacao } from "../utilitarios/estacao";
import { formatarTempoRelativo } from "../utilitarios/tempo";

const rotuloEvento: Record<TipoEvento, string> = {
  login: "entrou na estação",
  logout: "saiu da estação",
  perda_foco: "perdeu o foco da janela",
  retorno_foco: "voltou o foco",
  bloqueio: "foi bloqueado",
  desbloqueio: "foi desbloqueado",
  submissao_teste: "testou o código",
  submissao_final: "enviou a solução final",
  conexao_perdida: "perdeu conexão",
  conexao_restaurada: "reconectou",
};

const corEvento: Record<TipoEvento, string> = {
  login: "bg-status-ativo",
  logout: "bg-status-offline",
  perda_foco: "bg-status-atencao",
  retorno_foco: "bg-status-ativo",
  bloqueio: "bg-status-bloqueado",
  desbloqueio: "bg-status-ativo",
  submissao_teste: "bg-acento",
  submissao_final: "bg-acento-forte",
  conexao_perdida: "bg-status-bloqueado",
  conexao_restaurada: "bg-status-ativo",
};

interface FeedEventosProps {
  eventos: Evento[];
  agora: number;
}

export function FeedEventos({ eventos, agora }: FeedEventosProps) {
  return (
    <div className="rounded-2xl border border-borda bg-superficie/60 p-5">
      <h2 className="mb-4 text-sm font-semibold text-texto">Feed de eventos</h2>

      {eventos.length === 0 ? (
        <p className="text-sm text-texto-fraco">Nenhum evento ainda.</p>
      ) : (
        <ol className="flex flex-col gap-4">
          {eventos.map((evento) => (
            <li key={evento.eventoId} className="flex items-start gap-3 text-sm">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${corEvento[evento.tipo]}`} />
              <div className="min-w-0 flex-1">
                <p className="text-texto">
                  <span className="font-medium">{rotuloEstacao(evento.estacaoId)}</span>{" "}
                  <span className="text-texto-fraco">{rotuloEvento[evento.tipo]}</span>
                </p>
                {evento.detalhe && <p className="mt-0.5 truncate text-xs text-texto-fraco">{evento.detalhe}</p>}
              </div>
              <span className="shrink-0 text-xs text-texto-fraco">{formatarTempoRelativo(evento.timestamp, agora)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
