import { Router } from "express";
import { rotaAuth } from "./auth";
import { rotaDesbloquear } from "./desbloquear";
import { rotaFinalizar } from "./finalizar";
import { rotaHealth } from "./health";
import { rotaQuestoes } from "./questoes";
import { rotaSubmit } from "./submit";

export const rotasApi = Router();

rotasApi.use("/health", rotaHealth);
rotasApi.use("/auth", rotaAuth);
rotasApi.use("/questoes", rotaQuestoes);
rotasApi.use("/submit", rotaSubmit);
rotasApi.use("/finalizar", rotaFinalizar);
rotasApi.use("/desbloquear", rotaDesbloquear);
