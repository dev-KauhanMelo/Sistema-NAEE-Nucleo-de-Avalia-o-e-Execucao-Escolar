# Painel do Professor (React + Vite + TypeScript)

Monitoramento em tempo real das estações do laboratório: grid de status,
strikes, feed de eventos e ação de desbloqueio.

## Rodando

```bash
npm install
cp apps/painel-professor/.env.example apps/painel-professor/.env.local   # ajuste se necessário
npm run dev --workspace=apps/painel-professor
```

Sobe em `http://localhost:5173`.

## Estado atual

- **Grid de 12 estações (3×4)** e **feed de eventos** caem para dados de
  demonstração (`src/dados/mock.ts`) só se o Firebase Realtime DB não tiver
  nada gravado em `/estacoes` / `/eventos` (emulador desligado, por exemplo).
  Com `/api/auth` e `/api/desbloquear` já implementadas (Fase 2.5), assim que
  alguém autentica numa estação o painel troca sozinho para os dados reais —
  sem mudança de código (ver `src/hooks/useEstacoes.ts` e `useEventos.ts`).
  Importante: o grid real só mostra as estações que já existem no Firebase
  (uma por `/api/auth` chamado), não as 12 fixas do mock — ainda não há
  provisionamento antecipado das 12 estações.
- O cabeçalho indica "Dados de demonstração" vs. "Conectado ao Firebase"
  conforme a escuta recebe (ou não) alguma leitura real.
- O botão **Desbloquear estação** chama `POST /api/desbloquear` de verdade
  (`src/lib/api.ts`) — já implementada no backend, atualiza o Firebase e o
  card muda de cor em tempo real, sem reload.
- **Questões da prova**: seção abaixo do grid (`src/componentes/ListaQuestoes.tsx`)
  busca `GET /api/questoes` uma vez ao montar (não é Firebase/tempo real, é o
  catálogo estático do backend) e lista as 5 questões — título, linguagem,
  enunciado truncado e contagem de casos públicos. Nunca recebe `casosOcultos`,
  o backend já filtra isso antes de responder.

## Design

Tema escuro é o único suportado (sem alternância) — segue os tokens definidos
em `shared/src/design/tokens.css` (Tailwind v4, bloco `@theme`), importados
via `@import "@naee/shared/tokens.css";` em `src/index.css`. Cor de
status sempre no card inteiro (borda + fundo), nunca só num indicador
pequeno — precisa ser lido de longe, do outro lado da sala.

## Firebase

Mesma configuração do backend: aponta para o **Firebase Emulator Suite**
local por padrão (ver `backend/README.md`). `VITE_FIREBASE_API_KEY` pode ser
qualquer valor não vazio — o emulador não valida credenciais.
