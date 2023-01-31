import { prisma } from "@/config";
import { Exam } from "@prisma/client";

async function findManyExams(userId: number) {
  return prisma.exam.findMany({
    where: {
      userId: userId,
    },
  });
}

async function createExam(exam: ExamBody) {
  return prisma.exam.create({
    data: exam,
  });
}

export type ExamBody = Omit<Exam, "createdAt" | "updatedAt" | "id">;

const examRepository = {
  findManyExams,
  createExam,
};

export default examRepository;
