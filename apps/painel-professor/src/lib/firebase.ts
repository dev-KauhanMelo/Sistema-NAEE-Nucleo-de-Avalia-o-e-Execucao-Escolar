import { initializeApp } from "firebase/app";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";

// Defaults apontam para o Firebase Emulator local (ver backend/README.md) — o
// app funciona (com dados de demonstração) mesmo sem .env.local configurado.
const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sistema-provas-dev",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "http://127.0.0.1:9000/?ns=sistema-provas-dev",
});

export const db = getDatabase(app);

const emulatorHost = import.meta.env.VITE_FIREBASE_DATABASE_EMULATOR_HOST;
const emulatorPort = import.meta.env.VITE_FIREBASE_DATABASE_EMULATOR_PORT;

if (emulatorHost && emulatorPort) {
  connectDatabaseEmulator(db, emulatorHost, Number(emulatorPort));
}
