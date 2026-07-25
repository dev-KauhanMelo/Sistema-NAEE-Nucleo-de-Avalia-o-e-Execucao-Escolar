/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Espelha electron/preload/index.ts — não importa de lá direto pra não puxar
// tipos de Node (process.versions) pro projeto do renderer (lib DOM only).
declare global {
  interface Window {
    appAluno: {
      versaoElectron: string;
    };
  }
}

export {};
