import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { validateBody } from "@/middlewares/validation-middleware";
import { getPersonalInformation, createPersonalInformation } from "@/controllers";
import { createProfileSchema } from "@/schemas/profile-schemas";

const profileRouter = Router();

profileRouter
  .all("/*", authenticateToken)
  .get("/", getPersonalInformation)
  .post("/", validateBody(createProfileSchema), createPersonalInformation);

export { profileRouter };
