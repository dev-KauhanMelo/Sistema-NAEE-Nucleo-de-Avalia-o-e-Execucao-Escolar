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
}

export function EditorMonaco({ valorInicial, aoMudar }: EditorMonacoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const aoMudarRef = useRef(aoMudar);
  aoMudarRef.current = aoMudar;

  useEffect(() => {
    if (!containerRef.current) return;
    registrarTema();

    const editor = monaco.editor.create(containerRef.current, {
      value: valorInicial,
      language: "python",
      theme: "naee-dark",
      fontFamily: '"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace',
      fontSize: 14,
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      padding: { top: 16 },
    });

    const subscricao = editor.onDidChangeModelContent(() => {
      aoMudarRef.current(editor.getValue());
    });

    return () => {
      subscricao.dispose();
      editor.dispose();
    };
  }, [valorInicial]);

  return <div ref={containerRef} className="h-full w-full" />;
}
