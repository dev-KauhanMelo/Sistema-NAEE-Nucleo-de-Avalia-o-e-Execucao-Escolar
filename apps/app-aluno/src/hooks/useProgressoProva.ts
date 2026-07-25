import type { QuestaoPublica } from "@naee/shared";
import { useCallback, useEffect, useState } from "react";
import { finalizarQuestao, testarCodigo, type ResultadoExecucao } from "../lib/api";
import type { EstadoQuestao } from "../tipos/resultado";

interface ProgressoSalvo {
  codigo: string;
  finalizada: boolean;
}

function chaveStorage(estacaoId: string): string {
  return `naee-app-aluno:progresso:${estacaoId}`;
}

function carregarSalvo(estacaoId: string): Record<string, ProgressoSalvo> {
  try {
    const bruto = localStorage.getItem(chaveStorage(estacaoId));
    return bruto ? (JSON.parse(bruto) as Record<string, ProgressoSalvo>) : {};
  } catch {
    return {};
  }
}

// localStorage indisponível (ex.: modo privado) só perde a persistência entre
// reloads — não deve travar a prova, por isso o catch silencioso.
function salvar(estacaoId: string, progresso: Record<string, ProgressoSalvo>): void {
  try {
    localStorage.setItem(chaveStorage(estacaoId), JSON.stringify(progresso));
  } catch {
    /* ver comentário acima */
  }
}

interface UseProgressoProvaResultado {
  questaoAtivaId: string | null;
  selecionarQuestao: (questaoId: string) => void;
  estados: Record<string, EstadoQuestao>;
  atualizarCodigo: (questaoId: string, codigo: string) => void;
  testar: (questaoId: string, codigo: string) => Promise<ResultadoExecucao>;
  finalizar: (questaoId: string, codigo: string) => Promise<ResultadoExecucao>;
}

export function useProgressoProva(estacaoId: string, questoes: QuestaoPublica[]): UseProgressoProvaResultado {
  const [questaoAtivaId, setQuestaoAtivaId] = useState<string | null>(null);
  const [estados, setEstados] = useState<Record<string, EstadoQuestao>>({});

  // Só roda quando a lista de questões chega (fetch assíncrono) — reidrata do
  // localStorage o código e o estado de finalização de cada uma.
  useEffect(() => {
    if (questoes.length === 0) return;
    const salvo = carregarSalvo(estacaoId);
    setEstados((atual) => {
      const proximo = { ...atual };
      for (const questao of questoes) {
        if (proximo[questao.questaoId]) continue;
        const registro = salvo[questao.questaoId];
        proximo[questao.questaoId] = {
          codigo: registro?.codigo ?? questao.templateInicial ?? "",
          status: registro?.finalizada ? "resolvida" : "nao-iniciada",
          ultimoResultado: null,
          ultimoErro: null,
        };
      }
      return proximo;
    });
    setQuestaoAtivaId((atual) => atual ?? questoes[0]?.questaoId ?? null);
  }, [estacaoId, questoes]);

  const atualizarCodigo = useCallback(
    (questaoId: string, codigo: string) => {
      setEstados((atual) => {
        const anterior = atual[questaoId];
        if (!anterior || anterior.status === "resolvida") return atual;
        const proximo = {
          ...atual,
          [questaoId]: { ...anterior, codigo, status: "em-andamento" as const },
        };
        salvar(
          estacaoId,
          Object.fromEntries(Object.entries(proximo).map(([id, e]) => [id, { codigo: e.codigo, finalizada: e.status === "resolvida" }])),
        );
        return proximo;
      });
    },
    [estacaoId],
  );

  const testar = useCallback(async (questaoId: string, codigo: string) => {
    const resultado = await testarCodigo(estacaoId, questaoId, codigo);
    setEstados((atual) => {
      const anterior = atual[questaoId];
      if (!anterior) return atual;
      return {
        ...atual,
        [questaoId]: {
          ...anterior,
          ultimoResultado: resultado.ok ? resultado.resultados : null,
          ultimoErro: resultado.ok ? null : resultado.erro,
        },
      };
    });
    return resultado;
  }, [estacaoId]);

  const finalizar = useCallback(
    async (questaoId: string, codigo: string) => {
      const resultado = await finalizarQuestao(estacaoId, questaoId, codigo);
      setEstados((atual) => {
        const anterior = atual[questaoId];
        if (!anterior) return atual;
        // "resolvida" = resposta final entregue com sucesso, trava a edição —
        // não depende de todos os casos terem passado (ver tipos/resultado.ts):
        // uma vez enviada, a questão está encerrada, certa ou errada.
        const proximo = {
          ...atual,
          [questaoId]: {
            ...anterior,
            ultimoResultado: resultado.ok ? resultado.resultados : anterior.ultimoResultado,
            ultimoErro: resultado.ok ? null : resultado.erro,
            status: resultado.ok ? ("resolvida" as const) : anterior.status,
          },
        };
        salvar(
          estacaoId,
          Object.fromEntries(Object.entries(proximo).map(([id, e]) => [id, { codigo: e.codigo, finalizada: e.status === "resolvida" }])),
        );
        return proximo;
      });
      return resultado;
    },
    [estacaoId],
  );

  return { questaoAtivaId, selecionarQuestao: setQuestaoAtivaId, estados, atualizarCodigo, testar, finalizar };
}
