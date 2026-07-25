// monaco-editor@0.56 só expõe subpaths via "exports": "./*.js" -> "./esm/vs/*.js" —
// por isso aqui NÃO tem o prefixo "esm/vs/" (já embutido no mapeamento) e tem
// a extensão ".js" explícita (pra casar com o padrão "./*.js" do package.json).
//
// Importa só a API core (editor.api.js), não o pacote inteiro ("monaco-editor")
// — o índice completo importa estaticamente as ~60 linguagens suportadas via
// basic-languages/monaco.contribution.js, o que incha o bundle à toa quando só
// Python é usado aqui. languages/definitions/python/register.js registra só
// essa linguagem (com o tokenizer em si carregado lazy, via import() interno).
import * as monaco from "monaco-editor/editor/editor.api.js";
import "monaco-editor/languages/definitions/python/register.js";
import EditorWorker from "monaco-editor/editor/editor.worker.js?worker";
import { useEffect, useRef } from "react";

// Python é uma linguagem "básica" do Monaco (tokenizer Monarch, sem LSP) —
// só precisa do worker genérico do editor, nada de json/css/html/ts workers.
self.MonacoEnvironment = {
  getWorker() {
    return new EditorWorker();
  },
};

let temaRegistrado = false;
function registrarTema() {
  if (temaRegistrado) return;
  monaco.editor.defineTheme("naee-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#131316",
      "editor.foreground": "#e4e4e7",
      "editorLineNumber.foreground": "#52525b",
      "editorLineNumber.activeForeground": "#9a9aa2",
      "editor.selectionBackground": "#6366f140",
      "editorCursor.foreground": "#818cf8",
      "editor.lineHighlightBackground": "#1c1c2160",
    },
  });
  temaRegistrado = true;
}

interface EditorMonacoProps {
  valorInicial: string;
  aoMudar: (valor: string) => void;
  /** Questão já finalizada via /api/finalizar — trava o editor sem remontá-lo. */
  somenteLeitura?: boolean;
}

export function EditorMonaco({ valorInicial, aoMudar, somenteLeitura = false }: EditorMonacoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const aoMudarRef = useRef(aoMudar);
  aoMudarRef.current = aoMudar;
  // Só o valor da montagem importa aqui (não reage a mudanças) — ver comentário no useEffect abaixo.
  const valorInicialRef = useRef(valorInicial);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    registrarTema();

    const editor = monaco.editor.create(containerRef.current, {
      value: valorInicialRef.current,
      language: "python",
      theme: "naee-dark",
      fontFamily: '"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace',
      fontSize: 14,
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      padding: { top: 16 },
      readOnly: somenteLeitura,
    });
    editorRef.current = editor;

    const subscricao = editor.onDidChangeModelContent(() => {
      aoMudarRef.current(editor.getValue());
    });

    return () => {
      subscricao.dispose();
      editor.dispose();
      editorRef.current = null;
    };
    // Deliberadamente [] — valorInicial é só o snapshot da montagem (é o próprio
    // editor.onDidChangeModelContent acima que atualiza o estado do pai a cada
    // tecla). Recriar o editor a cada mudança de valorInicial destruía e
    // remontava o DOM do editor a cada letra digitada, perdendo o foco: usuário
    // digitava 1 caractere, o editor sumia e precisava clicar de novo pra focar.
  }, []);

  // Precisa reagir sem remontar — travar o editor no meio de uma sessão
  // (finalizar a questão ativa) não pode reiniciar o DOM do Monaco.
  useEffect(() => {
    editorRef.current?.updateOptions({ readOnly: somenteLeitura });
  }, [somenteLeitura]);

  return <div ref={containerRef} className="h-full w-full" />;
}
