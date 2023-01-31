import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { validateBody } from "@/middlewares/validation-middleware";
import { getExams } from "@/controllers";
import { createProfileSchema } from "@/schemas/profile-schemas";

const examRouter = Router();

examRouter.all("/*", authenticateToken).get("/", getExams);

export { examRouter };
