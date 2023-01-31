import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getPersonalInformation, createPersonalInformation } from "@/controllers";

const profileRouter = Router();

profileRouter
  .all("/*", authenticateToken)
  .get("/", getPersonalInformation)
  .post("/", createPersonalInformation);

export { profileRouter };
