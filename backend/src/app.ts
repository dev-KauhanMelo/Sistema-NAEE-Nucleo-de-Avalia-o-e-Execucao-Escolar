import cors from "cors";
import express, { type Express } from "express";
import { tratarErros } from "./middlewares/tratarErros";
import { rotasApi } from "./rotas";

export function criarApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/api", rotasApi);
  app.use(tratarErros);

  return app;
}
