import admin from "firebase-admin";
import { env } from "./env";

let app: admin.app.App | undefined;

/**
 * Inicialização preguiçosa: nada aqui é chamado no boot do servidor, só quando
 * uma rota efetivamente precisar do banco. Isso deixa o skeleton subir e responder
 * mesmo sem o Firebase Emulator rodando — só falha quando alguém tentar ler/escrever.
 */
function obterApp(): admin.app.App {
  if (!app) {
    if (env.FIREBASE_DATABASE_EMULATOR_HOST) {
      console.log(`[firebase] usando Realtime DB Emulator em ${env.FIREBASE_DATABASE_EMULATOR_HOST}`);
    }
    app = admin.initializeApp({
      projectId: env.FIREBASE_PROJECT_ID,
      databaseURL: env.FIREBASE_DATABASE_URL,
    });
  }
  return app;
}

export function obterDb(): admin.database.Database {
  return obterApp().database();
}
