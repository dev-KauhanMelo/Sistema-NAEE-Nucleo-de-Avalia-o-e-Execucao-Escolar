import type { QuestaoPublica } from "@naee/shared";
import { useEffect, useState } from "react";
import type { NivelStrike } from "../hooks/useEstrikes";
import { useProgressoProva } from "../hooks/useProgressoProva";
import { listarQuestoes } from "../lib/api";
import type { SessaoAtiva } from "../tipos/sessao";
import { Cabecalho } from "./Cabecalho";
import { EditorMonaco } from "./EditorMonaco";
import { ModalConfirmacao } from "./ModalConfirmacao";
import { PainelEnunciado } from "./PainelEnunciado";
import { SidebarQuestoes } from "./SidebarQuestoes";

interface TelaEditorProps {
  sessao: SessaoAtiva;
  strikes: NivelStrike;
}

export function TelaEditor({ sessao, strikes }: TelaEditorProps) {
  const [questoes, setQuestoes] = useState<QuestaoPublica[] | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setErroCarregamento(null);
    listarQuestoes(sessao.provaId)
      .then((lista) => {
        if (!cancelado) setQuestoes(lista);
      })
      .catch((e) => {
        if (!cancelado) setErroCarregamento(e instanceof Error ? e.message : "Falha ao carregar questões");
      });
    return () => {
      cancelado = true;
    };
  }, [sessao.provaId, tentativa]);

  const progresso = useProgressoProva(sessao.estacaoId, questoes ?? []);
  const [sidebarRecolhida, setSidebarRecolhida] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [testando, setTestando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const destacarAtencao = strikes === 2;

  if (erroCarregamento) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="max-w-md text-sm text-status-bloqueado">{erroCarregamento}</p>
        <button
          type="button"
          onClick={() => setTentativa((t) => t + 1)}
          className="rounded-lg border border-borda px-4 py-2 text-sm font-medium text-texto transition-colors hover:border-acento/50"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!questoes) {
    return (
      <div className="flex h-screen items-center justify-center gap-2 text-sm text-texto-fraco">
        <span className="h-2 w-2 animate-pulse rounded-full bg-acento" />
        Carregando questões…
      </div>
    );
  }

  const indiceAtivo = Math.max(0, questoes.findIndex((q) => q.questaoId === progresso.questaoAtivaId));
  const questaoAtiva: QuestaoPublica | null = questoes[indiceAtivo] ?? null;
  const estadoAtivo = questaoAtiva ? progresso.estados[questaoAtiva.questaoId] : undefined;
  const questaoFinalizada = estadoAtivo?.status === "resolvida";

  async function aoTestar() {
    if (!questaoAtiva || !estadoAtivo) return;
    setTestando(true);
    try {
      await progresso.testar(questaoAtiva.questaoId, estadoAtivo.codigo);
    } finally {
      setTestando(false);
    }
  }

  async function aoConfirmarEnvio() {
    if (!questaoAtiva || !estadoAtivo) return;
    setEnviando(true);
    setErroEnvio(null);
    try {
      const resultado = await progresso.finalizar(questaoAtiva.questaoId, estadoAtivo.codigo);
      if (resultado.ok) {
        setModalAberto(false);
      } else {
        setErroEnvio(resultado.erro);
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      className={`flex h-screen flex-col transition-shadow duration-300 ${
        destacarAtencao ? "shadow-[inset_0_0_0_4px_var(--color-status-atencao)]" : ""
      }`}
    >
      {destacarAtencao && (
        <div className="shrink-0 border-b border-status-atencao/40 bg-status-atencao/10 px-6 py-2 text-center text-xs font-medium text-status-atencao">
          Atenção — Strike 2 de 3. Mais uma saída de foco e a estação será bloqueada.
        </div>
      )}

      <Cabecalho
        sessao={sessao}
        strikes={strikes}
        testando={testando}
        questaoFinalizada={questaoFinalizada}
        onTestar={aoTestar}
        onEnviarFinal={() => {
          setErroEnvio(null);
          setModalAberto(true);
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        <SidebarQuestoes
          questoes={questoes}
          questaoAtivaId={progresso.questaoAtivaId}
          estados={progresso.estados}
          recolhida={sidebarRecolhida}
          onToggleRecolhida={() => setSidebarRecolhida((r) => !r)}
          onSelecionarQuestao={progresso.selecionarQuestao}
        />

        <main className="min-w-0 flex-1 overflow-hidden">
          {questaoAtiva && estadoAtivo && (
            <EditorMonaco
              key={questaoAtiva.questaoId}
              valorInicial={estadoAtivo.codigo}
              aoMudar={(codigo) => progresso.atualizarCodigo(questaoAtiva.questaoId, codigo)}
              somenteLeitura={questaoFinalizada}
            />
          )}
        </main>

        <PainelEnunciado questao={questaoAtiva} indice={indiceAtivo} total={questoes.length} />
      </div>

      {modalAberto && questaoAtiva && (
        <ModalConfirmacao
          titulo={`Enviar resposta final — Q${indiceAtivo + 1} · ${questaoAtiva.titulo}`}
          descricao="Essa ação roda seu código contra todos os casos de teste desta questão, incluindo os ocultos, e marca a questão como finalizada. Depois de enviada, não é possível editar o código dela de novo."
          textoConfirmar="Confirmar envio"
          carregando={enviando}
          erro={erroEnvio}
          onCancelar={() => setModalAberto(false)}
          onConfirmar={aoConfirmarEnvio}
        />
      )}
    </div>
  );
}
