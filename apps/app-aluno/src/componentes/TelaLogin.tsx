import { type FormEvent, useState } from "react";
import { ESTACOES_DISPONIVEIS } from "../dados/estacoes";
import { autenticar } from "../lib/api";
import type { SessaoAtiva } from "../tipos/sessao";

interface TelaLoginProps {
  onAutenticado: (sessao: SessaoAtiva) => void;
}

export function TelaLogin({ onAutenticado }: TelaLoginProps) {
  const [alunoId, setAlunoId] = useState("");
  const [estacaoId, setEstacaoId] = useState(ESTACOES_DISPONIVEIS[0]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault();
    const alunoIdLimpo = alunoId.trim();
    if (!alunoIdLimpo || !estacaoId) return;

    setCarregando(true);
    setErro(null);
    try {
      const resposta = await autenticar(estacaoId, alunoIdLimpo);
      onAutenticado({ estacaoId, alunoId: alunoIdLimpo, provaId: resposta.provaId });
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao entrar");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center px-6">
      <form onSubmit={aoEnviar} className="w-full max-w-sm rounded-2xl border border-borda bg-superficie/60 p-8 shadow-2xl">
        <p className="text-xs font-medium tracking-widest text-texto-fraco uppercase">NAEE — Núcleo de Avaliação e Execução Escolar</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-texto">Entrar na prova</h1>

        <label className="mt-8 block text-sm font-medium text-texto-fraco">
          Aluno (ID)
          <input
            type="text"
            value={alunoId}
            onChange={(e) => setAlunoId(e.target.value)}
            placeholder="ex.: aluno-01"
            autoFocus
            className="mt-1.5 w-full rounded-lg border border-borda bg-superficie-alta px-3 py-2.5 text-sm text-texto outline-none placeholder:text-texto-fraco/50 focus:border-acento"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-texto-fraco">
          Estação
          <select
            value={estacaoId}
            onChange={(e) => setEstacaoId(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-borda bg-superficie-alta px-3 py-2.5 text-sm text-texto outline-none focus:border-acento"
          >
            {ESTACOES_DISPONIVEIS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>

        {erro && <p className="mt-4 text-sm text-status-bloqueado">{erro}</p>}

        <button
          type="submit"
          disabled={carregando || !alunoId.trim()}
          className="mt-8 w-full rounded-lg bg-acento px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-acento-forte disabled:cursor-not-allowed disabled:opacity-50"
        >
          {carregando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
