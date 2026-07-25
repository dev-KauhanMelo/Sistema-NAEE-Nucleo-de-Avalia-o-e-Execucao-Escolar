import { contextBridge } from "electron";

const apiAluno = {
  versaoElectron: process.versions.electron,
};

contextBridge.exposeInMainWorld("appAluno", apiAluno);

export type ApiAluno = typeof apiAluno;
