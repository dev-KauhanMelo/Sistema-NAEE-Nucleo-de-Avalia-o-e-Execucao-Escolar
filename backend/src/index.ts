import { criarApp } from "./app";
import { env } from "./config/env";

const app = criarApp();

app.listen(env.PORT, () => {
  console.log(`[backend] rodando em http://localhost:${env.PORT} (${env.NODE_ENV})`);
});
