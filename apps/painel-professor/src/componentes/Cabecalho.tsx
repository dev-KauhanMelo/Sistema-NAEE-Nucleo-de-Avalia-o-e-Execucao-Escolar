interface CabecalhoProps {
  conectado: boolean;
  totalEstacoes: number;
  totalBloqueadas: number;
}

export function Cabecalho({ conectado, totalEstacoes, totalBloqueadas }: CabecalhoProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-borda/60 bg-fundo/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div>
          <p className="text-xs font-medium tracking-widest text-texto-fraco uppercase">NAEE — Núcleo de Avaliação e Execução Escolar</p>
          <h1 className="text-xl font-semibold tracking-tight text-texto">Painel do Professor</h1>
        </div>

        <div className="flex items-center gap-5">
          {totalBloqueadas > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-status-bloqueado/40 bg-status-bloqueado/10 px-3 py-1.5 text-sm font-medium text-status-bloqueado">
              <span className="h-1.5 w-1.5 rounded-full bg-status-bloqueado" />
              {totalBloqueadas === 1 ? "1 estação bloqueada" : `${totalBloqueadas} estações bloqueadas`}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-texto-fraco">
            <span className={`h-1.5 w-1.5 rounded-full ${conectado ? "bg-status-ativo" : "bg-status-offline"}`} />
            {conectado ? "Conectado ao Firebase" : "Dados de demonstração"}
          </div>

          <div className="text-sm text-texto-fraco">{totalEstacoes} estações</div>
        </div>
      </div>
    </header>
  );
}
