import { useEffect, useRef } from "react";

/**
 * Chama onPerdaFoco() a cada perda de foco real da janela. blur e
 * visibilitychange costumam disparar juntos para o mesmo evento — um debounce
 * curto evita contar a mesma saída de foco duas vezes.
 */
export function useDeteccaoFoco(ativo: boolean, onPerdaFoco: () => void): void {
  const ultimoRegistroRef = useRef(0);
  const onPerdaFocoRef = useRef(onPerdaFoco);
  onPerdaFocoRef.current = onPerdaFoco;

  useEffect(() => {
    if (!ativo) return;

    function registrar() {
      const agora = Date.now();
      if (agora - ultimoRegistroRef.current < 500) return;
      ultimoRegistroRef.current = agora;
      onPerdaFocoRef.current();
    }

    function aoMudarVisibilidade() {
      if (document.hidden) registrar();
    }

    window.addEventListener("blur", registrar);
    document.addEventListener("visibilitychange", aoMudarVisibilidade);

    return () => {
      window.removeEventListener("blur", registrar);
      document.removeEventListener("visibilitychange", aoMudarVisibilidade);
    };
  }, [ativo]);
}
