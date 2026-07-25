import { useEffect, useState } from "react";

export function ToastStrike() {
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setVisivel(false), 4000);
    return () => clearTimeout(id);
  }, []);

  if (!visivel) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex items-start gap-3 rounded-xl border border-status-atencao/40 bg-superficie px-4 py-3 shadow-2xl">
      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-status-atencao" />
      <div>
        <p className="text-sm font-medium text-texto">Você saiu da janela da prova</p>
        <p className="text-xs text-texto-fraco">Strike 1 de 3 — evite minimizar ou trocar de janela.</p>
      </div>
    </div>
  );
}
