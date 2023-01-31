import examRepository from "@/repositories/exam-repository";
import { Exam } from "@prisma/client";
import { notFoundError } from "@/errors";
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

export type ExamPromise = Omit<Exam, "createdAt" | "updatedAt" | "userId">;
export type ExamBody = Omit<Exam, "createdAt" | "updatedAt" | "id">;

const examService = {
  getExams,
  createNewExam,
};

export default examService;
