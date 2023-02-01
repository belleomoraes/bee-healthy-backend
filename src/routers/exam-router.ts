import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { validateBody } from "@/middlewares/validation-middleware";
import { getExams, createNewExam, updateExam, getExamById, deleteExam } from "@/controllers";
import { createExamSchema } from "@/schemas/exam-schemas";

const examRouter = Router();

examRouter
  .all("/*", authenticateToken)
  .get("/", getExams)
  .get("/:examId", getExamById)
  .post("/", validateBody(createExamSchema), createNewExam)
  .put("/:examId", validateBody(createExamSchema), updateExam)
  .delete("/:examId", deleteExam);

export { examRouter };
