import { prisma } from "@/config";
import { Exam } from "@prisma/client";

async function findManyExams(userId: number) {
  return prisma.exam.findMany({
    where: {
      userId: userId,
    },
  });
}

async function findManyFilteredExams(search: string, userId: number) {
  return prisma.exam.findMany({
    where: {
      userId: userId,
      AND: [
        {
          OR: [
            {
              name: {
                startsWith: search,
              },
            },
            {
              description: {
                startsWith: search,
              },
            },
            {
              local: {
                startsWith: search,
              },
            },
          ],
        },
      ],
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
    data: exam,
  });
}

async function deleteExam(examId: number) {
  return prisma.exam.delete({
    where: {
      id: examId,
    },
  });
}

export type ExamBody = Omit<Exam, "createdAt" | "updatedAt" | "id">;
export type ExamBodyUpdate = Omit<Exam, "createdAt" | "updatedAt" | "id" | "userId">;

const examRepository = {
  findManyExams,
  createExam,
  updateExam,
  findExamById,
  deleteExam,
  findManyFilteredExams,
};

export default examRepository;
