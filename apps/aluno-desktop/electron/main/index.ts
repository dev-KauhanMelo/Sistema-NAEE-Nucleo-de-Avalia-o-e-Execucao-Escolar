import { join } from "node:path";
import { app, BrowserWindow, Menu, shell } from "electron";

function criarJanela(): void {
  const janela = new BrowserWindow({
    fullscreen: true,
    kiosk: true,
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: "#0a0a0c",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  janela.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  janela.webContents.on("before-input-event", (evento, input) => {
    // Saída de emergência do professor — não fica documentada em nenhuma tela
    // visível ao aluno, só aqui e no README. Sem ela o app fica sem nenhuma
    // forma de fechar em produção (fora do Gerenciador de Tarefas do SO).
    const saidaEmergencia = input.control && input.shift && input.alt && input.key.toLowerCase() === "q";
    if (saidaEmergencia) {
      app.exit(0);
      return;
    }

    if (!app.isPackaged) return;

    // Bloqueia os atalhos óbvios de fuga do modo prova. "Alt+Tab" aqui é
    // best-effort: no Windows esse atalho é interceptado pelo shell do SO
    // antes de chegar em qualquer app comum — nenhuma BrowserWindow consegue
    // bloqueá-lo de verdade sem hooks nativos de baixo nível (fora de escopo
    // desta fase). O Gerenciador de Tarefas (Ctrl+Shift+Esc → Finalizar
    // tarefa) também segue funcionando; é o SO, não dá pra evitar em app comum.
    const tentativaDeFuga =
      input.key === "F11" ||
      input.key === "Escape" ||
      input.key === "F12" ||
      (input.key.toLowerCase() === "w" && (input.control || input.meta)) ||
      (input.key.toLowerCase() === "q" && (input.control || input.meta)) ||
      (input.key === "F4" && input.alt) ||
      (input.key.toLowerCase() === "i" && input.control && input.shift) ||
      (input.key.toLowerCase() === "tab" && input.alt);

    if (tentativaDeFuga) {
      evento.preventDefault();
    }
  });

  if (app.isPackaged) {
    janela.on("close", (evento) => evento.preventDefault());
  } else {
    janela.webContents.openDevTools({ mode: "detach" });
  }

  const urlDev = process.env["ELECTRON_RENDERER_URL"];
  if (urlDev) {
    janela.loadURL(urlDev);
  } else {
    janela.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  criarJanela();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) criarJanela();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
