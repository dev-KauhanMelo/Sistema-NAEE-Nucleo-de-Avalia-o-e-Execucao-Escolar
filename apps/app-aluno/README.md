# App do Aluno (Electron + React + TypeScript)

Estação do aluno: login, editor Monaco (Python) e lockdown anti-distração.
Kiosk fullscreen forçado — feito pra rodar travado na tela da prova.

## Rodando em dev

```bash
npm install
cp apps/app-aluno/.env.example apps/app-aluno/.env.local   # ajuste se necessário
npm run dev --workspace=apps/app-aluno
```

Abre uma janela Electron real (kiosk + fullscreen mesmo em dev, pra dar pra
testar o lockdown de verdade) com DevTools destacado automaticamente. Só o
renderer (React) também sobe num dev server Vite comum — é ele que muda a
cada save.

**Electron 33 (fixado em `33.4.11`), não a última major**: `electron@43`
(usado originalmente) declara exigir Node ≥22.12 só pra instalar/rodar o
tooling — o binário empacotado roda seu próprio Node interno independente
da máquina host, mas isso já impedia `npm install`/`npm run dev` limpos com
Node <22. Fixado em `33.4.11` (`engines.node: >=12.20.55`) especificamente
pra rodar bem com Node 20.20.2. `@electron/rebuild`/`node-abi` (dependências
internas do `electron-builder`, não deste pacote) ainda avisam pedir
Node ≥22 no `npm install` — inofensivo aqui, só entram em jogo se houvesse
módulo nativo pra recompilar, o que não é o caso.

## Login

Tela pede **Aluno (ID)** (texto livre, enviado como `alunoId` pro
`POST /api/auth`) + **Estação** (select com `estacao-01`…`estacao-12`, mesma
convenção do grid do painel do professor). Não há resolução de nome → ID
ainda — `backend/dados/alunos.json` só sabe comparar por ID exato (ex.:
`aluno-01`). Um `GET /api/alunos` + autocomplete por nome é a melhoria óbvia
quando isso for pra sala de aula de verdade.

## Editor

Monaco Editor, só Python (`src/componentes/EditorMonaco.tsx`), 100% local —
sem CDN, sem telemetria. Importa `monaco-editor/editor/editor.api.js` +
`monaco-editor/languages/definitions/python/register.js` em vez do pacote
inteiro, que registraria as ~60 linguagens suportadas à toa.

`GET /api/questoes/:provaId` ainda é skeleton (Fase 2) — o editor usa
`src/dados/questaoMock.ts` como placeholder. **Testar Código** chama
`POST /api/submit` de verdade; hoje retorna `501` (Judge0 não integrado
ainda), e a UI mostra esse estado de forma honesta — nunca finge sucesso.

## Lockdown (perda de foco)

`useDeteccaoFoco` escuta `blur`/`visibilitychange` da janela. Escalonamento:

| Strike | UI |
|---|---|
| 1 | Toast no canto, auto-some em 4s |
| 2 | Faixa amarela persistente + borda na tela inteira |
| 3 | Tela vermelha "Trava Lockdown" cobrindo tudo, sem forma de interagir |

**Limitação conhecida, de propósito não resolvida aqui**: os strikes são
estado local do renderer, não gravados no Firebase — não existe ainda um
endpoint tipo `POST /api/strike` para o painel do professor enxergar isso ou
para `/api/desbloquear` de fato destravar esta tela remotamente. Pra fechar
esse ciclo falta: (1) backend gravar o strike/bloqueio em `/estacoes`, (2)
este app escutar essa mesma estação no Firebase e sair do lockdown quando o
professor desbloquear. Por ora, em dev (`import.meta.env.DEV`), a própria
tela de lockdown tem um botão "[dev] resetar strikes" só pra testar — some
sozinho em build de produção.

## Kiosk / segurança — o que dá e o que não dá pra garantir

`electron/main/index.ts` abre a janela com `fullscreen: true, kiosk: true,
frame: false`, sem menu (`Menu.setApplicationMenu(null)` — precisa rodar
dentro de `app.whenReady()`, chamado no nível do módulo lança
`Cannot read properties of undefined (reading 'setApplicationMenu')`, já
que a API de UI do Electron não existe antes do app estar pronto), e em
produção (`app.isPackaged`) bloqueia
F11/Esc/F12/Ctrl+W/Ctrl+Q/Alt+F4/Ctrl+Shift+I/Alt+Tab dentro da própria janela,
além de interceptar o evento de fechar (não fecha via clique/Alt+F4).

Isso **não** é lockdown a nível de sistema operacional — nenhum app comum
consegue ser: o **Gerenciador de Tarefas** (Ctrl+Shift+Esc → Finalizar
tarefa) sempre mata o processo, e **Alt+Tab** no Windows é interceptado pelo
shell do SO antes de chegar em qualquer aplicação, não tem como um
BrowserWindow bloquear isso de verdade sem hooks nativos de baixo nível
(fora de escopo aqui). Trate isso como dissuasão de UX, não como sandbox de
segurança.

Existe uma saída de emergência não documentada na UI: **Ctrl+Shift+Alt+Q**
fecha o app mesmo em produção — sem ela, um bug deixaria a máquina sem
nenhuma forma de sair fora de matar o processo no Gerenciador de Tarefas.

## Empacotando o `.exe` portável

```bash
npm run package:win --workspace=apps/app-aluno
# ou, dentro de apps/app-aluno:
npm run build && npx electron-builder --win portable
```

Gera `release/app-aluno-<versão>-portable.exe` — um único executável
NSIS self-extracting, sem instalador, sem exigir admin. Empacotar (não só
rodar) o target Windows a partir de Linux precisa de **Wine** instalado no
host (`electron-builder` invoca `signtool`/NSIS via Wine); sem ele o passo
`electron-builder --win portable` falha antes de gerar o `.exe`.

Sem ícone customizado ainda (`build.buildResources` aponta pra `build/`,
vazia por ora) — o electron-builder usa o ícone padrão dele.
