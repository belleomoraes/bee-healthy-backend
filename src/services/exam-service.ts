import examRepository from "@/repositories/exam-repository";
import { Exam } from "@prisma/client";
import { notFoundError, unauthorizedError } from "@/errors";
import { exclude } from "@/utils/prisma-utils";

async function getExams(userId: number): Promise<Exam[]> {
  const exam = await examRepository.findManyExams(userId);

  if (exam.length === 0) {
    throw notFoundError;
  }
  return exam;
}

async function createNewExam(params: ExamBody): Promise<ExamPromise> {
  return await examRepository.createExam(params);
}

async function updateExam(params: ExamBodyUpdate): Promise<ExamPromise> {
  await getOrcheckExamId(params.id, params.userId);

  return await examRepository.updateExam(params.id, exclude(params, "id", "userId"));
}

async function getOrcheckExamId(examId: number, userId: number): Promise<Exam> {
  const isExamExists = await examRepository.findExamById(examId);

  if (!isExamExists) {
    throw notFoundError();
  }

  if (isExamExists.userId !== userId) {
    throw unauthorizedError();
  }
  return isExamExists;
}

export type ExamPromise = Omit<Exam, "createdAt" | "updatedAt" | "userId">;
export type ExamBody = Omit<Exam, "createdAt" | "updatedAt" | "id">;
export type ExamBodyUpdate = Omit<Exam, "createdAt" | "updatedAt">;

const examService = {
  getExams,
  createNewExam,
  updateExam,
  getOrcheckExamId,
};

export default examService;
