import { contextBridge } from "electron";

const apiAluno = {
  versaoElectron: process.versions.electron,
};

contextBridge.exposeInMainWorld("alunoDesktop", apiAluno);

export type ApiAluno = typeof apiAluno;
