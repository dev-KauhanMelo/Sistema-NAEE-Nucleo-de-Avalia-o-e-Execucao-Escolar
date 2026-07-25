import type { StatusEstacao } from "../tipos/estacao";

/** Rótulo em pt-BR exibido no painel do professor e em telas de estado. */
export const rotuloStatus: Record<StatusEstacao, string> = {
  offline: "Offline",
  ativo: "Ativo",
  atencao: "Atenção",
  bloqueado: "Bloqueado",
};

/** Referencia as variáveis CSS de shared/src/design/tokens.css — cor nunca é a única
 *  forma de comunicar status (o rótulo acima sempre acompanha, para acessibilidade). */
export const corVarStatus: Record<StatusEstacao, string> = {
  offline: "var(--color-status-offline)",
  ativo: "var(--color-status-ativo)",
  atencao: "var(--color-status-atencao)",
  bloqueado: "var(--color-status-bloqueado)",
};
