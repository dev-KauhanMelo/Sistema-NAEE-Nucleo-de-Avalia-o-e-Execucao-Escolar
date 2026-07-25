import { useEffect } from "react";

interface ModalConfirmacaoProps {
  titulo: string;
  descricao: string;
  textoConfirmar: string;
  carregando: boolean;
  erro: string | null;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export function ModalConfirmacao({ titulo, descricao, textoConfirmar, carregando, erro, onCancelar, onConfirmar }: ModalConfirmacaoProps) {
  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape" && !carregando) onCancelar();
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [carregando, onCancelar]);

  return (
    <div
      role="presentation"
      onClick={() => !carregando && onCancelar()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-confirmacao-titulo"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-borda bg-superficie p-6 shadow-2xl"
      >
        <h2 id="modal-confirmacao-titulo" className="text-lg font-semibold text-texto">
          {titulo}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-texto-fraco">{descricao}</p>

        {erro && <p className="mt-4 rounded-lg border border-status-bloqueado/30 bg-status-bloqueado/10 px-3 py-2 text-sm text-status-bloqueado">{erro}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={carregando}
            className="rounded-lg border border-borda px-4 py-2 text-sm font-medium text-texto-fraco transition-colors hover:text-texto disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={carregando}
            className="rounded-lg bg-acento px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-acento-forte disabled:cursor-not-allowed disabled:opacity-50"
          >
            {carregando ? "Enviando…" : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
