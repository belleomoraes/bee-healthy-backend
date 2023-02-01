import "reflect-metadata";
import "express-async-errors";
import express, { Express } from "express";
import { signInRouter, signUpRouter, profileRouter, examRouter, vaccinationRouter } from "./routers";
import cors from "cors";
import { loadEnv, connectDb, disconnectDB } from "@/config";

loadEnv();

const app = express();
app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => res.send("OK!"))
  .use("/sign-in", signInRouter)
  .use("/sign-up", signUpRouter)
  .use("/profile", profileRouter)
  .use("/exam", examRouter)
  .use("/vaccination", vaccinationRouter);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
