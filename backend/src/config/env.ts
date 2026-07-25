import "dotenv/config";
import { z } from "zod";

const envEsquema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  FIREBASE_PROJECT_ID: z.string().min(1).default("naee-dev"),
  FIREBASE_DATABASE_URL: z.string().min(1).default("http://127.0.0.1:9000/?ns=naee-dev"),
  /** Setada => Admin SDK usa o Realtime DB Emulator local em vez do Firebase real. */
  FIREBASE_DATABASE_EMULATOR_HOST: z.string().optional(),
});

export const env = envEsquema.parse(process.env);
