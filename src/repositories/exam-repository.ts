import { prisma } from "@/config";
import { Exam } from "@prisma/client";

async function findManyExams(userId: number) {
  return prisma.exam.findMany({
    where: {
      userId: userId,
    },
  });
}

async function findExamById(examId: number) {
  return prisma.exam.findFirst({
    where: {
      id: examId,
    },
  });
}

async function createExam(exam: ExamBody) {
  return prisma.exam.create({
    data: exam,
  });
}

async function updateExam(examId: number, exam: ExamBodyUpdate) {
  return prisma.exam.update({
    where: {
      id: examId,
    },
    data: { name: exam.name, examType: exam.examType, description: exam.description, local: exam.local },
  });
}

export type ExamBody = Omit<Exam, "createdAt" | "updatedAt" | "id">;
export type ExamBodyUpdate = Omit<Exam, "createdAt" | "updatedAt" | "id" | "userId">;

const examRepository = {
  findManyExams,
  createExam,
  updateExam,
  findExamById,
};

export default examRepository;
