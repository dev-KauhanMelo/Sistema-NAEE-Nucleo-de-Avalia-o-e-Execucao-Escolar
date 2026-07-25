import { useState } from "react";
import { QUESTAO_DEMONSTRACAO } from "../dados/questaoMock";
import { testarCodigo } from "../lib/api";
import type { SessaoAtiva } from "../tipos/sessao";
import { EditorMonaco } from "./EditorMonaco";

interface TelaEditorProps {
  sessao: SessaoAtiva;
  destacarAtencao: boolean;
}

interface ResultadoTeste {
  carregando: boolean;
  mensagem: string;
}

export function TelaEditor({ sessao, destacarAtencao }: TelaEditorProps) {
  const questao = QUESTAO_DEMONSTRACAO;
  const [codigo, setCodigo] = useState(questao.templateInicial ?? "");
  const [resultado, setResultado] = useState<ResultadoTeste | null>(null);

  async function aoTestar() {
    setResultado({ carregando: true, mensagem: "" });
    try {
      const mensagem = await testarCodigo(sessao.estacaoId, questao.questaoId, codigo);
      setResultado({ carregando: false, mensagem });
    } catch (e) {
      setResultado({ carregando: false, mensagem: e instanceof Error ? e.message : "Falha ao testar código" });
    }
  }

  return (
    <div
      className={`flex h-screen flex-col transition-shadow duration-300 ${
        destacarAtencao ? "shadow-[inset_0_0_0_4px_var(--color-status-atencao)]" : ""
      }`}
    >
      {destacarAtencao && (
        <div className="border-b border-status-atencao/40 bg-status-atencao/10 px-6 py-2 text-center text-xs font-medium text-status-atencao">
          Atenção — Strike 2 de 3. Mais uma saída de foco e a estação será bloqueada.
        </div>
      )}

      <header className="flex items-center justify-between border-b border-borda bg-fundo/80 px-6 py-3">
        <div>
          <p className="text-xs text-texto-fraco">
            {sessao.estacaoId} · {sessao.alunoId}
          </p>
          <h1 className="text-sm font-semibold text-texto">{questao.titulo}</h1>
        </div>
        <span className="rounded-full border border-acento/30 bg-acento/10 px-3 py-1 text-xs font-medium text-acento-forte">
          Prova {sessao.provaId}
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 shrink-0 overflow-y-auto border-r border-borda bg-superficie/40 p-6">
          <h2 className="text-sm font-semibold text-texto">Enunciado</h2>
          <p className="mt-2 text-sm leading-relaxed text-texto-fraco">{questao.enunciado}</p>

          <h2 className="mt-6 text-sm font-semibold text-texto">Casos de teste</h2>
          <div className="mt-2 flex flex-col gap-2">
            {questao.casosPublicos.map((caso, i) => (
              <div key={i} className="rounded-lg border border-borda bg-superficie-alta p-3 font-mono text-xs">
                <p className="text-texto-fraco">entrada</p>
                <pre className="whitespace-pre-wrap text-texto">{caso.entrada}</pre>
                <p className="mt-2 text-texto-fraco">saída esperada</p>
                <pre className="whitespace-pre-wrap text-texto">{caso.saidaEsperada}</pre>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <EditorMonaco valorInicial={codigo} aoMudar={setCodigo} />
          </div>

          <div className="flex flex-col gap-3 border-t border-borda bg-superficie/40 p-4">
            {resultado &&
              (resultado.carregando ? (
                <div className="flex items-center gap-2 rounded-xl border border-borda bg-superficie px-4 py-3 text-sm text-texto-fraco">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-acento" />
                  Executando…
                </div>
              ) : (
                <div className="rounded-xl border border-acento/40 bg-acento/10 px-4 py-3 text-sm text-texto">
                  <p className="font-medium text-acento-forte">Execução ainda não disponível</p>
                  <p className="mt-1 text-texto-fraco">{resultado.mensagem}</p>
                </div>
              ))}

            <button
              type="button"
              onClick={aoTestar}
              disabled={resultado?.carregando}
              className="self-start rounded-lg bg-acento px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-acento-forte disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resultado?.carregando ? "Testando…" : "Testar Código"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
