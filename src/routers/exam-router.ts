import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { validateBody } from "@/middlewares/validation-middleware";
import { getExams, createNewExam } from "@/controllers";
import { createExamSchema } from "@/schemas/exam-schemas";

const examRouter = Router();

examRouter.all("/*", authenticateToken).get("/", getExams).post("/", validateBody(createExamSchema), createNewExam);

export { examRouter };
