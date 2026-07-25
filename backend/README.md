# Backend (Node.js + Express + TypeScript)

API do sistema, rodando 100% local — sem Docker, sem depender de rede.

## Rotas

| Rota | Descrição | Estado |
|---|---|---|
| `POST /api/auth` | Autentica aluno (lista fixa em `dados/alunos.json`) + estação, grava `/estacoes` e evento `login` no Firebase | ✅ implementada |
| `POST /api/desbloquear` | Reseta `status`/`strikes` da estação no Firebase e grava evento `desbloqueio` | ✅ implementada |
| `GET /api/questoes` | Lista todas as questões públicas (lista fixa em `dados/questoes.json`) | ✅ implementada |
| `GET /api/questoes/:provaId` | Mesma lista de cima — só existe uma prova por ora, ver nota abaixo | ✅ implementada |
| `POST /api/submit` | Roda o código contra os casos públicos (submissão "teste") | skeleton (`501`) |
| `POST /api/finalizar` | Roda contra todos os casos e finaliza a questão (submissão "final") | skeleton (`501`) |
| `GET /api/health` | Healthcheck — não toca em Firebase nem Judge0 | ✅ |

As rotas ainda em skeleton validam o corpo com os esquemas Zod de
`@sistema-provas/shared` e respondem `501` — a lógica real fica marcada com
`// TODO:` no arquivo da rota.

## Rodando

```bash
npm install
cp backend/.env.example backend/.env   # ajuste se necessário
npm run dev --workspace=backend
```

Sobe em `http://localhost:3000`. O healthcheck funciona sem nenhuma
dependência externa de pé:

```bash
curl http://localhost:3000/api/health
```

## Firebase Realtime Database

Local, sem depender de rede: use o **Firebase Emulator Suite**. Config
(`firebase.json`, `database.rules.json`, `.firebaserc`) vive na raiz do
monorepo — é compartilhada com o painel do professor e os próximos apps.

```bash
npx firebase-tools emulators:start --only database   # roda na raiz do repo
```

O Admin SDK (`src/config/firebase.ts`) detecta a variável
`FIREBASE_DATABASE_EMULATOR_HOST` (já definida em `.env.example`) e conecta
automaticamente no emulador em vez do Firebase real. A inicialização é
preguiçosa — só acontece quando uma rota efetivamente lê/escreve no banco —
então o servidor sobe normalmente mesmo com o emulador desligado (as rotas
que dependem dele é que vão falhar, com erro 500 explícito).

As regras (`database.rules.json`, `.read`/`.write` abertos) valem só para o
emulador local — não são deployadas em lugar nenhum ainda.

## Alunos pré-cadastrados

`dados/alunos.json` é a lista fixa usada por `/api/auth` (`src/servicos/alunos.ts`).
5 alunos de exemplo (`aluno-01` … `aluno-05`) — trocar/expandir esse arquivo
é o bastante, não precisa mexer em código.

## Questões

`dados/questoes.json` (Fase 5) — 5 questões de programação em Python,
contextualizadas em Recife/Porto Digital (eletrificação solar comunitária,
turismo, logística, saneamento, dados abertos), servidas por
`src/servicos/questoes.ts` via `paraQuestaoPublica()` — os `casosOcultos`
nunca saem do backend, `GET /api/questoes` só devolve o formato público. Os
30 gabaritos (3 casos públicos + 3 ocultos por questão) foram conferidos
programaticamente contra soluções de referência antes de entrar no arquivo.

`GET /api/questoes/:provaId` ainda devolve a lista inteira independente do
`provaId` — só existe uma prova (`prova-001`, ver `rotas/auth.ts`) e ainda
não há um registro de provas no Firebase vinculando `questoesIds` a cada
uma. Passa a filtrar de verdade quando isso existir.

## Judge0

A integração real (`src/servicos/judge0.ts`) está adiada — ver
`judge0/README.md`. Por ora a função lança erro de propósito, para que
`/api/submit` e `/api/finalizar` retornem `501` de forma explícita até a
VM do Judge0 estar disponível para o smoke test.
