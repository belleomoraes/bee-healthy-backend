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

export type ExamParams = Omit<Exam, "createdAt" | "updatedAt" | "userId">;

const examService = {
  getExams,
};

export default examService;
