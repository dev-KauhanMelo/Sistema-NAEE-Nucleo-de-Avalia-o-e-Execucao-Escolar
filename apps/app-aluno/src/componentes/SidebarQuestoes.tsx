import type { CasoTesteVisivel, QuestaoPublica } from "@naee/shared";
import { useState } from "react";
import type { EstadoQuestao, StatusQuestao } from "../tipos/resultado";

const LARGURA_SIDEBAR = 320;

interface SidebarQuestoesProps {
  questoes: QuestaoPublica[];
  questaoAtivaId: string | null;
  estados: Record<string, EstadoQuestao>;
  recolhida: boolean;
  onToggleRecolhida: () => void;
  onSelecionarQuestao: (questaoId: string) => void;
}

function IconeStatusQuestao({ status }: { status: StatusQuestao }) {
  if (status === "resolvida") {
    return (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-status-ativo/20 text-[10px] font-bold text-status-ativo">
        ✓
      </span>
    );
  }
  if (status === "em-andamento") {
    return (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-acento" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-acento" />
      </span>
    );
  }
  return <span className="h-4 w-4 shrink-0 rounded-full border-2 border-borda" aria-hidden="true" />;
}

function rotuloStatusQuestao(status: StatusQuestao): string {
  if (status === "resolvida") return "enviada";
  if (status === "em-andamento") return "em andamento";
  return "não iniciada";
}

function IconeResultadoCaso({ passou }: { passou: boolean | undefined }) {
  if (passou === undefined) {
    return <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-borda" aria-hidden="true" />;
  }
  return (
    <span
      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
        passou ? "bg-status-ativo/20 text-status-ativo" : "bg-status-bloqueado/20 text-status-bloqueado"
      }`}
    >
      {passou ? "✓" : "✗"}
    </span>
  );
}

interface CasoTesteItemProps {
  indice: number;
  caso: CasoTesteVisivel;
  resultado: { passou: boolean; saidaObtida: string } | null;
  expandido: boolean;
  onToggle: () => void;
}

function CasoTesteItem({ indice, caso, resultado, expandido, onToggle }: CasoTesteItemProps) {
  return (
    <div className="rounded-lg border border-borda bg-superficie-alta">
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-2 px-3 py-2 text-left">
        <IconeResultadoCaso passou={resultado?.passou} />
        <span className="flex-1 truncate text-xs text-texto-fraco">{caso.descricao ?? `Caso ${indice + 1}`}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`h-3 w-3 shrink-0 text-texto-fraco transition-transform duration-200 ${expandido ? "rotate-90" : ""}`}
          aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {expandido && (
        <div className="flex flex-col gap-2 border-t border-borda px-3 py-2.5 font-mono text-[11px]">
          <div>
            <p className="mb-0.5 text-texto-fraco">entrada</p>
            <pre className="whitespace-pre-wrap text-texto">{caso.entrada}</pre>
          </div>
          <div>
            <p className="mb-0.5 text-texto-fraco">saída esperada</p>
            <pre className="whitespace-pre-wrap text-status-ativo">{caso.saidaEsperada}</pre>
          </div>
          {resultado && !resultado.passou && (
            <div>
              <p className="mb-0.5 text-texto-fraco">saída obtida</p>
              <pre className="whitespace-pre-wrap text-status-bloqueado">{resultado.saidaObtida}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SidebarQuestoes({
  questoes,
  questaoAtivaId,
  estados,
  recolhida,
  onToggleRecolhida,
  onSelecionarQuestao,
}: SidebarQuestoesProps) {
  const [expandidos, setExpandidos] = useState<Set<number>>(new Set());
  const questaoAtiva = questoes.find((q) => q.questaoId === questaoAtivaId) ?? null;
  const estadoAtivo = questaoAtivaId ? estados[questaoAtivaId] : undefined;

  function alternarExpandido(indice: number) {
    setExpandidos((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(indice)) proximo.delete(indice);
      else proximo.add(indice);
      return proximo;
    });
  }

  const totalPassou = estadoAtivo?.ultimoResultado?.filter((r) => r.passou).length;
  const contagemTestes = questaoAtiva ? (totalPassou !== undefined ? `${totalPassou}/${questaoAtiva.casosPublicos.length}` : "—") : "—";

  return (
    <div className="relative flex h-full shrink-0">
      <aside
        className="h-full overflow-hidden border-r border-borda bg-superficie/40 transition-[width] duration-300 ease-in-out"
        style={{ width: recolhida ? 0 : LARGURA_SIDEBAR }}
      >
        <div style={{ width: LARGURA_SIDEBAR }} className="flex h-full flex-col overflow-y-auto p-5">
          <h2 className="text-xs font-semibold tracking-widest text-texto-fraco uppercase">Questões</h2>
          <div className="mt-3 flex flex-col gap-1.5">
            {questoes.map((questao, indice) => {
              const estado = estados[questao.questaoId];
              const ativa = questao.questaoId === questaoAtivaId;
              return (
                <button
                  key={questao.questaoId}
                  type="button"
                  onClick={() => onSelecionarQuestao(questao.questaoId)}
                  aria-current={ativa}
                  aria-label={`Q${indice + 1} · ${questao.titulo} · ${rotuloStatusQuestao(estado?.status ?? "nao-iniciada")}`}
                  className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                    ativa
                      ? "border-acento/50 bg-acento/10 text-texto"
                      : "border-transparent text-texto-fraco hover:bg-superficie-alta hover:text-texto"
                  }`}
                >
                  <IconeStatusQuestao status={estado?.status ?? "nao-iniciada"} />
                  <span className="truncate">
                    Q{indice + 1} · {questao.titulo}
                  </span>
                </button>
              );
            })}
          </div>

          {questaoAtiva && (
            <>
              <div className="mt-6 flex items-center justify-between">
                <h2 className="text-xs font-semibold tracking-widest text-texto-fraco uppercase">Testes</h2>
                <span className="font-mono text-xs text-texto-fraco">{contagemTestes}</span>
              </div>

              {estadoAtivo?.ultimoErro && (
                <p className="mt-2 rounded-lg border border-acento/30 bg-acento/10 px-3 py-2 text-xs text-texto-fraco">
                  Execução ainda não disponível — {estadoAtivo.ultimoErro}
                </p>
              )}

              <div className="mt-2 flex flex-col gap-2">
                {questaoAtiva.casosPublicos.map((caso, indice) => (
                  <CasoTesteItem
                    key={indice}
                    indice={indice}
                    caso={caso}
                    resultado={estadoAtivo?.ultimoResultado?.[indice] ?? null}
                    expandido={expandidos.has(indice)}
                    onToggle={() => alternarExpandido(indice)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </aside>

      <button
        type="button"
        onClick={onToggleRecolhida}
        aria-label={recolhida ? "Expandir lista de questões" : "Recolher lista de questões"}
        className="absolute top-1/2 z-10 flex h-16 w-5 -translate-y-1/2 items-center justify-center rounded-full border border-borda bg-superficie-alta text-texto-fraco shadow-lg transition-[left] duration-300 ease-in-out hover:border-acento/50 hover:text-texto"
        style={{ left: recolhida ? 4 : LARGURA_SIDEBAR - 10 }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`h-3.5 w-3.5 transition-transform duration-300 ${recolhida ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
