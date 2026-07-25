import { useQuestoes } from "../hooks/useQuestoes";

export function ListaQuestoes() {
  const { questoes, carregando, erro } = useQuestoes();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-texto">Questões da prova</h2>
        {!carregando && !erro && <span className="text-xs text-texto-fraco">{questoes.length} questões</span>}
      </div>

      {carregando && <p className="text-sm text-texto-fraco">Carregando questões…</p>}

      {erro && !carregando && (
        <div className="rounded-xl border border-status-bloqueado/40 bg-status-bloqueado/10 px-4 py-3 text-sm text-status-bloqueado">
          {erro}
        </div>
      )}

      {!carregando && !erro && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {questoes.map((questao, i) => (
            <div key={questao.questaoId} className="rounded-2xl border border-borda bg-superficie/60 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-texto-fraco">Q{i + 1}</span>
                <span className="rounded-full border border-acento/30 bg-acento/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-acento-forte uppercase">
                  {questao.linguagem}
                </span>
              </div>

              <h3 className="mt-2 text-sm font-semibold text-texto">{questao.titulo}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-texto-fraco">{questao.enunciado}</p>

              <p className="mt-3 text-xs text-texto-fraco">
                {questao.casosPublicos.length} {questao.casosPublicos.length === 1 ? "caso público" : "casos públicos"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
