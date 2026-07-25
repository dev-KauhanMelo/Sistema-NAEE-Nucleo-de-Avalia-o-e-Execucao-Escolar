/** Lista pré-definida pro seletor da tela de login — mesma convenção de ID usada no painel do professor. */
export const ESTACOES_DISPONIVEIS: string[] = Array.from(
  { length: 12 },
  (_, i) => `estacao-${String(i + 1).padStart(2, "0")}`,
);
