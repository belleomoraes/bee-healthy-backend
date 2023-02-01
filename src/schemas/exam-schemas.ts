import Joi from "joi";
import { Exam } from "@prisma/client";

export const createExamSchema = Joi.object<ExamBody>({
  name: Joi.string().required(),
  description: Joi.string().required(),
  local: Joi.string().required(),
});

export type ExamBody = Omit<Exam, "createdAt" | "updatedAt" | "id" | "userId">;
