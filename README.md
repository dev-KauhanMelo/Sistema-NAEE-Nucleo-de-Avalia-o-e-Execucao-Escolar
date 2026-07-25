# Sistema de Avaliação Prática de Programação em Ambiente Controlado

Um "juiz online" escolar com lockdown: alunos resolvem questões de
programação Python numa estação travada em modo kiosk (sem acesso ao resto
do computador durante a prova), enquanto o professor acompanha o laboratório
inteiro — status de cada estação, tentativas de sair da tela, bloqueios —
num painel em tempo real, com um botão para destravar quem foi bloqueado.

Construído para a **ETE Porto Digital (Recife-PE)**, com questões
contextualizadas na própria região.

## O que é

Três peças que conversam entre si:

- **App do aluno** (desktop, Windows): tela de login, editor de código
  Monaco, execução de testes contra a questão — tudo em janela fullscreen
  kiosk. Se o aluno tentar sair da janela (Alt+Tab, minimizar), o sistema
  reage progressivamente: aviso → alerta persistente → bloqueio total da
  tela, até o professor liberar.
- **Painel do professor** (web): grid ao vivo com as estações do
  laboratório — quem está logado, em qual questão, quantos "strikes" levou,
  status colorido visível à distância — mais um feed cronológico de eventos
  e o botão de desbloqueio.
- **Backend**: valida login, guarda o estado de cada estação no Firebase em
  tempo real, serve as questões, e (quando o Judge0 estiver integrado) roda
  o código do aluno contra os casos de teste.

## Stack

| Camada | Tecnologia |
|---|---|
| App do aluno | Electron + React + TypeScript + Vite (`electron-vite`) + Monaco Editor |
| Painel do professor | React + TypeScript + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express + TypeScript |
| Banco em tempo real | Firebase Realtime Database (Emulator Suite em dev, sem custo/rede) |
| Execução de código | Judge0 (self-hosted, Docker — ver `judge0/`) |
| Validação de dados | Zod (esquemas compartilhados entre front e back) |
| Empacotamento do app do aluno | `electron-builder` → `.exe` portátil (sem instalador, sem admin) |

Tema escuro único, tipografia mono para código, paleta de status (verde/
amarelo/vermelho/cinza) compartilhada entre os dois frontends via
`shared/src/design/tokens.css`.

## Como rodar

Pré-requisitos: Node.js ≥20 (o app do aluno usa Electron 43, que pede
Node ≥22.12 para o próprio tooling — ver `apps/aluno-desktop/README.md`),
npm, e opcionalmente Docker + Multipass só se for testar o Judge0 de verdade
(ver `judge0/README.md`).

```bash
# 1. Instala tudo (monorepo com npm workspaces: shared, backend, apps/*)
npm install

# 2. Sobe o Firebase Emulator Suite (Realtime Database) — roda 100% local,
#    sem projeto Firebase real, sem depender de rede
npx firebase-tools emulators:start --only database

# 3. Backend (outro terminal)
cp backend/.env.example backend/.env
npm run dev --workspace=backend          # http://localhost:3000

# 4. Painel do professor (outro terminal)
cp apps/painel-professor/.env.example apps/painel-professor/.env.local
npm run dev --workspace=apps/painel-professor    # http://localhost:5173

# 5. App do aluno (outro terminal) — abre uma janela Electron real, em kiosk
cp apps/aluno-desktop/.env.example apps/aluno-desktop/.env.local
npm run dev --workspace=apps/aluno-desktop
```

Cada pasta tem seu próprio `README.md` com detalhes (variáveis de ambiente,
decisões de design, limitações conhecidas). `npm run typecheck` na raiz
valida os quatro workspaces de uma vez.

Alunos e questões de exemplo já vêm prontos para testar sem precisar
cadastrar nada: `backend/dados/alunos.json` (`aluno-01` … `aluno-05`) e
`backend/dados/questoes.json` (5 questões, IDs `q1` … `q5`).

### Empacotar o app do aluno em `.exe`

```bash
npm run package:win --workspace=apps/aluno-desktop
```

Gera `apps/aluno-desktop/release/aluno-desktop-<versão>-portable.exe` — um
único executável, sem instalador, sem precisar de admin na máquina do
aluno. Empacotar o alvo Windows a partir de Linux exige Wine instalado no
host (ver `apps/aluno-desktop/README.md`).

## Estrutura de pastas

```
.
├── shared/                  tipos + esquemas Zod + tokens de design, usados por todo o resto
├── backend/                 API Express — auth, questões, submissão, desbloqueio
│   └── dados/                alunos.json, questoes.json — listas fixas, sem banco de cadastro ainda
├── apps/
│   ├── painel-professor/    painel web do professor (React + Vite)
│   └── aluno-desktop/       app do aluno (Electron + React), kiosk + Monaco
├── judge0/                  Judge0 self-hosted (docker-compose), motor de execução de código
├── firebase.json, database.rules.json, .firebaserc
│                            config do Firebase Emulator Suite, compartilhada por todo o monorepo
└── tsconfig.base.json       config TypeScript base, estendida por cada workspace
```

## Recursos implementados

**Backend**
- `POST /api/auth` — autentica aluno (lista fixa) + estação, grava a
  estação e um evento `login` no Firebase, devolve a prova ativa.
- `POST /api/desbloquear` — reseta status/strikes da estação, grava evento
  `desbloqueio`. Usado pelo painel do professor.
- `GET /api/questoes` — lista as 5 questões (formato público, sem
  gabarito/casos ocultos).
- `GET /api/questoes/:provaId` — mesma lista por ora (só existe uma prova).
- `GET /api/health` — healthcheck, não depende de Firebase nem Judge0.
- `POST /api/submit` e `POST /api/finalizar` — **skeleton**, respondem
  `501` de propósito até o Judge0 ser integrado (ver Limitações).

**Painel do professor**
- Grid de 12 estações (3×4), cor no card inteiro por status (visível à
  distância, não só um indicador pequeno), nome do aluno, strikes, tempo
  desde a última atividade.
- Escuta o Firebase em tempo real — grid e feed de eventos atualizam sem
  refresh assim que alguém autentica ou é desbloqueado.
- Feed de eventos cronológico (login, perda de foco, bloqueio,
  desbloqueio, submissões).
- Botão "Desbloquear estação", chamando o backend de verdade.
- Seção "Questões da prova" com as 5 questões, buscadas via REST.
- Cai para dados de demonstração quando o Firebase está vazio/desligado,
  para nunca ficar com a tela em branco.

**App do aluno**
- Janela `fullscreen + kiosk`, sem menu, sem frame; em produção bloqueia
  atalhos óbvios de fuga (F11, Esc, F12, Ctrl+W/Q, Alt+F4, Alt+Tab dentro
  da janela) e o próprio fechamento — com uma saída de emergência não
  documentada na UI (ver `apps/aluno-desktop/README.md`).
- Login por ID de aluno + seleção de estação, contra o backend real.
- Editor Monaco (só Python, carregado localmente, sem CDN).
- Botão "Testar Código", chamando `/api/submit` de verdade (hoje `501` —
  mostrado de forma honesta na UI, nunca finge sucesso).
- Detecção de perda de foco com escalonamento: 1º aviso (toast) → 2º alerta
  persistente (faixa amarela) → 3º bloqueio total da tela ("Trava
  Lockdown"), até o professor desbloquear.
- Empacotável em `.exe` portátil (Windows), sem instalador.

**5 questões Python contextualizadas** (`backend/dados/questoes.json`):
eletrificação solar comunitária, ponto turístico mais visitado de Recife,
rota de entrega no Porto Digital, monitoramento de qualidade da água do
Capibaribe, e chamados de iluminação pública por bairro (dados abertos da
Prefeitura do Recife) — nível iniciante a intermediário, gabaritos
conferidos programaticamente contra soluções de referência.

## Limitações do MVP

- **Judge0 não integrado**: `/api/submit` e `/api/finalizar` são skeleton
  (`501` de propósito). Nenhum código de aluno é executado de verdade
  ainda — é o próximo passo mais importante.
- **Strikes não persistem no Firebase**: o app do aluno controla o
  escalonamento (aviso → alerta → bloqueio) só em estado local. O painel do
  professor não enxerga strikes em tempo real nem consegue desbloquear a
  tela do aluno remotamente — falta um endpoint tipo `POST /api/strike` e o
  app do aluno escutar sua própria estação no Firebase.
- **Sem autenticação de professor**: `POST /api/desbloquear` é uma rota
  aberta, qualquer um que saiba a URL do backend pode chamá-la.
- **Uma prova só, fixa**: `provaId` é uma constante (`"prova-001"`) no
  backend, sem cadastro de provas nem vínculo real entre prova e questões.
- **Login por ID exato**: o campo "Aluno" no app do aluno espera o ID
  cadastrado (ex. `aluno-01`), não o nome — não há `GET /api/alunos` nem
  busca/autocomplete ainda.
- **Kiosk não é sandbox de sistema operacional**: o Gerenciador de Tarefas
  do Windows sempre consegue matar o processo, e Alt+Tab é interceptado
  pelo shell do SO antes de chegar em qualquer app comum. O lockdown é
  dissuasão de UX, não uma trava de segurança do SO.
- **Regras do Firebase abertas** (`.read`/`.write: true`): válido só para o
  Emulator Suite local — nunca deployado assim contra um projeto real.
- **Sem testes automatizados**: toda validação até aqui foi manual (curl,
  browser headless, soluções de referência rodadas à mão).
- **App do aluno só para Windows**: o `.exe` portátil é o único alvo de
  build configurado.

## Próximos passos

**v1 — fechar o MVP**
- Integrar o Judge0 de verdade em `/api/submit` e `/api/finalizar`
  (executar contra casos públicos/ocultos, gravar `Submissao` no Firebase).
- Persistir strikes/bloqueio no Firebase e fazer o app do aluno escutar sua
  própria estação, para o desbloqueio do professor destravar a tela de
  verdade — hoje só o painel sabe.
- Autenticação do professor (mínimo: senha compartilhada com sessão; ideal:
  login por usuário).
- Cadastro de provas de verdade (`provas.json` ou Firebase), vinculando
  `questoesIds` a cada uma, substituindo a constante `prova-001`.
- Deploy real: backend numa VPS, Firebase de produção com regras
  restritas, Judge0 na VM de produção (o `judge0/README.md` já documenta o
  caminho de VM dedicada por causa do cgroup v2).

**v2 — evolução**
- Múltiplas provas simultâneas / histórico de provas passadas.
- Mais linguagens além de Python (o editor e o Judge0 já suportam isso
  estruturalmente, falta expandir `LinguagemSuportada` e os templates).
- Dashboard de resultados e notas para o professor, não só monitoramento
  ao vivo.
- `GET /api/alunos` + autocomplete por nome na tela de login.
- App do aluno para outros sistemas operacionais (hoje só Windows).
- Testes automatizados (unitários no backend, E2E nos dois frontends).
